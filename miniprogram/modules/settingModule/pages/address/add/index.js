//引入QQMapWX 核心类
import QQMapWX from '../../../libs/qqmap-wx-jssdk.min'
// https://lbs.qq.com/webApi/component/componentGuide/componentGeolocation
import { toast } from '../../../../../utils/extendApi'
import { reqAddAddress, reqAddressInfo, reqUpdateAddress } from '../../../api/address'
//导入async-validator
import Schema from 'async-validator'
Page({
	// 页面的初始数据
	data: {
		"name": "",//收货人
		"phone": "",//手机号码
		"provinceName": "",//省
		"provinceCode": "",//省编码
		"cityName": "",//市
		"cityCode": "",//市编码
		"districtName": "",//区
		"districtCode": "",//市编码
		"address": "",//详细地址
		"fullAddress": "",//完整地址
		"isDefault": false // 是否设置为默认地址，0不默认，1默认
	},

	// 保存收货地址
	async saveAddrssForm(event) {
		let { provinceName, cityName, districtName, isDefault } = this.data;
		const params = {
			...this.data,
			fullAddress: provinceName + cityName + districtName,
			isDefault: isDefault ? 1 : 0
		}
		//对组织后的参数进行验证 验证通过以后 需要调用新增的接口实现新增收获地址功能
		const { valid } = await this.validatorAddress(params)
		console.log("valid", valid);
		//如果valid等于false 说明验证失败 
		if (!valid) return
		//如果valid等于true 说明验证成功调用新增的接口实现新增收货地址功能
		const res = this.addressId ? await reqUpdateAddress(params) : await reqAddAddress(params);
		console.log("res", res);
		if (res.code === 200) {
			// 返回收获地址列表页面
			wx.navigateBack({
				success: () => {
					//需要给用户进行提示
					toast({ title: `${this.addressId ? '更新' : '新增'}收获地址成功` })
				}
			})
		}

	},
	//对新增收获地址请求参数进行验证
	validatorAddress(params) {
		// 验证收货人，是否只包含大小写字母、数字和中文字符
		const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

		// 验证手机号，是否符合中国大陆手机号码的格式
		const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

		//创建验证规则
		const rules = {
			name: [
				{ required: true, message: '请输入收货人姓名' },
				{ pattern: nameRegExp, message: '收货人姓名不合法' }
			],
			phone: [
				{ required: true, message: '请输入收货人手机号' },
				{ pattern: phoneReg, message: '收货人手机号不合法' }
			],
			provinceName: { required: true, message: '请选择收货人所在地区' },
			address: { required: true, message: '请选择收货人详细地址' },
		}
		//传入验证规则进行实例化 
		const validator = new Schema(rules)

		//调用实话方法对参数进行验证
		//注意：我们希望将验证结果通过promise 的形式返回给函数的调用者
		return new Promise((resolve) => {
			validator.validate(params, (errors) => {
				if (errors) {
					//如果验证失败 需要给用户进行提示
					toast({ title: errors[0].message })
					//如果属性值是false 说明验证失败
					resolve({ valid: false })
				} else {
					//如果属性值是true 说明验证成功
					resolve({ valid: true })
				}
			})
		})


	},

	// 省市区选择
	onAddressChange(event) {
		const [provinceCode, cityCode, districtCode] = event.detail.code;
		const [provinceName, cityName, districtName] = event.detail.value
		this.setData({ provinceName, cityName, districtName, provinceCode, cityCode, districtCode })
	},

	//获取用户地理位置信息
	async onLocation() {
		//获取当前的地理位置（精度 纬度 高度等）
		const { latitude, longitude, name } = await wx.chooseLocation()
		this.qqmapwx.reverseGeocoder({
			location: {
				longitude,
				latitude
			},
			success: (res) => {
				console.log("res", res);
				//获取省市区 省市区编码
				const { adcode, province, city, district } = res.result.ad_info;
				//获取街道 门牌 （街道 门牌 可能为空）
				const { street, street_number } = res.result.address_component;
				//获取标准地址
				const { standard_address } = res.result.formatted_addresses

				this.setData({
					"provinceName": province,//省
					// 如果是省 前两位有值 后面4位是0
					"provinceCode": adcode.replace(adcode.substring(2, 6), '0000'),//省编码

					"cityName": city,//市
					// 如果是省 前4位有值 后面2位是0
					"cityCode": adcode.replace(adcode.substring(4, 6), '00'),//市编码

					"districtName": district,//区
					"districtCode": district && adcode,//市编码
					"address": street + street_number + name,//详细地址
					"fullAddress": standard_address,//完整地址
				})
			}
		})
	},
	async onLoad(options) {
		this.qqmapwx = new QQMapWX({
			key: "NYMBZ-O4QLC-O7S2R-A3YPP-ERALS-N6BTY"
		})
		if (options && options.id) {
			this.addressId = options.id
			//动态设置页面的标题
			wx.setNavigationBarTitle({ title: "更新收货地址" })

			//调用接口 来获取需要更新的收获地址详情
			const { data } = await reqAddressInfo(options.id)
			//将详情数据进行赋值 赋值以后页面就会回显要更新的地址信息
			this.setData(data)
		}
	}

})
