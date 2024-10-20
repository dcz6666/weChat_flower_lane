import { reqBuyNowGoods, reqOrderAddress, reqOrderInfo, reqSubmitOrder, reqPrePayInfo, reqPayStatus } from "../../../api/orderpay"
import { formatTime } from '../../../utils/formatTime'
import { toast } from '@/utils/extendApi'
// 导入 async-validator 对参数进行验证
import Schema from 'async-validator'
import { debounce } from 'miniprogram-licia' // 防抖函数
let app = getApp()
Page({
	data: {
		buyName: '', // 订购人姓名
		buyPhone: '', // 订购人手机号
		deliveryDate: '选择送达日期', // 期望送达日期
		blessing: '', // 祝福语
		show: false, // 期望送达日期弹框
		orderAddress: {}, //收获地址
		orderInfo: {}, //订单详情
		minDate: new Date().getTime(),
		currentDate: new Date().getTime()
	},

	// 选择期望送达日期
	onShowDateTimerPopUp() {
		this.setData({
			show: true
		})
	},

	// 期望送达日期确定按钮
	onConfirmTimerPicker(event) {
		// formatTime 方法接收 JS 的日期对象作为参数
		// 因此需要将时间戳转换成 JS 的日期对象
		const timeRes = formatTime(new Date(event.detail))
		// console.log(timeRes);
		this.setData({
			show: false,
			deliveryDate: timeRes
		})
	},

	// 期望送达日期取消按钮 以及 关闭弹框时触发
	onCancelTimePicker() {
		this.setData({
			show: false,
			minDate: new Date().getTime(),
			currentDate: new Date().getTime()
		})
	},

	// 跳转到收货地址
	toAddress() {
		wx.navigateTo({
			url: '/modules/settingModule/modules/settingModule/pages/address/list/index'
		})
	},
	//获取订单页面的收获地址
	async getAddress() {
		// 判断全局共享的 address 是否有数据：
		// 如果有：就需要从全局共享的 address 中去到数据进行赋值
		const addressId = app.globalData.address.id // 取出id

		if (addressId) {
			this.setData({
				orderAddress: app.globalData.address
			})
			return
		}
		const { data: orderAddress } = await reqOrderAddress();
		this.setData({ orderAddress })
	},


	//获取订单详情数据
	async getOrderInfo() {
		const { goodsId, blessing } = this.data;
		const { data: orderInfo } = goodsId ? await reqBuyNowGoods({ goodsId, blessing }) : await reqOrderInfo();
		console.log("orderInfo", orderInfo)
		const orderGoods = orderInfo.cartVoList.find((item) => item.blessing !== '')
		this.setData({
			orderInfo,
			blessing: !orderGoods ? '' : orderGoods.blessing
		})
	},

	submitOrder: debounce(async function () {
		const {
			buyName,
			buyPhone,
			deliveryDate,
			blessing,
			orderAddress,
			orderInfo,
		} = this.data;
		// 需要根据接口要求组织 请求参数:
		const params = {
			buyName,
			buyPhone,
			cartList: orderInfo.cartVoList,
			deliveryDate,
			remarks: blessing,
			userAddressId: orderAddress.id
		}
		// 验证：
		const { valid } = await this.validatorPerson(params)
		// console.log( valid );
		// 如果请求参数验证失败，不执行后续的逻辑
		if (!valid) return
		// 调用接口，创建平台订单
		const res = await reqSubmitOrder(params)
		console.log("res", res);
		//  在平台订单创建成功:
		if (res.code === 200) {
			//将服务器、后端返回的订单编号 挂载到页面实例上
			this.orderNo = res.data
			// 获取预付单信息、支付参数:
			this.advancePay()
		}
	}, 500),
	// 获取预付单信息、支付参数:
	async advancePay() {
		try {
			const payParams = await reqPrePayInfo(this.orderNo)
			if (payParams.code === 200) {
				// payParams.data : 获取的支付参数
				// console.log(payParams.data);
				// 调用  wx.requestPayment 发起微信支付
				const payInfo = await wx.requestPayment(payParams.data)
				// console.log(payInfo);
				// 15688238300
				if (payInfo.errMsg === 'requestPayment:ok') {
					const payStatus = reqPayStatus(this.orderNo)
					if (payStatus.code === 200) {
						wx.redirectTo({
							url: '/modules/orderPayModule/pages/order/list/list',
							success: () => {
								toast({
									title: '支付成功',
									icon: 'success'
								})
							}
						})
					}
				}
			}
		} catch (error) {
			toast({
				title: '支付失败',
				icon: 'error'
			})
		}
	},

	// 对收货人、订购人信息进行验证
	validatorPerson(params) {
		// 验证订购人，是否只包含大小写字母、数字和中文字符
		const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

		// 验证订购人手机号，是否符合中国大陆手机号码的格式
		const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

		// 创建验证规则
		const rules = {
			userAddressId: {
				required: true,
				message: '请选择收货地址'
			},
			buyName: [
				{ required: true, message: '请输入订购人姓名' },
				{ pattern: nameRegExp, message: '订购人姓名不合法' }
			],
			buyPhone: [
				{ required: true, message: '请输入订购人手机号' },
				{ pattern: phoneReg, message: '订购人手机号不合法' }
			],
			deliveryDate: { required: true, message: '请选择送达日期' }
		}

		// 传入验证规则进行实例化
		const validator = new Schema(rules)

		// 调用实例方法对请求参数进行验证
		// 注意：我们希望将验证结果通过 Promise 的形式返回给函数的调用者
		return new Promise((resolve) => {
			validator.validate(params, (errors) => {
				if (errors) {
					// 如果验证失败，需要给用户进行提示
					toast({ title: errors[0].message })
					// 如果属性值是 false，说明验证失败
					resolve({ valid: false })
				} else {
					// 如果属性值是 true，说明验证成功
					resolve({ valid: true })
				}
			})
		})
	},
	onLoad(options) {
		console.log("options", options)
		this.setData({
			...options
		})
	},
	onShow() {
		this.getAddress()
		this.getOrderInfo()
	},
	onUnload() {
		// 在页面销毁以后，需要将全局共享的 address 也进行重置
		// 如果用户再次进入结算支付页面，需要从接口地址获取默认的收货地址进行渲染
		// 需要和产品多沟通
		app.globalData.address = {}
	}
})
