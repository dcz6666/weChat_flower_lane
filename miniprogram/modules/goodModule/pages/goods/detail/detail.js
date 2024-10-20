// pages/goods/detail/index.js
import { reqGoodsInfo } from '../../../api/goods'
import { userBehavior } from '../../../behaviors/userBehavior'
import { reqAddCart, reqCartList } from '@/api/cart'
import { toast } from "@/utils/extendApi"

Page({

	behaviors: [userBehavior],

	// 页面的初始数据
	data: {
		goodsInfo: {}, // 商品详情
		show: false, // 控制加入购物车和立即购买弹框的显示
		count: 1, // 商品购买数量，默认是 1
		blessing: '', // 祝福语
		buyNow: 0, // 控制是 加入购物车0 还是 立即购买1
		allCount: '' // 商品购买数量

	},

	// 加入购物车
	handleAddcart() {
		this.setData({
			show: true,
			buyNow: 0
		})
	},

	// 立即购买
	handeGotoBuy() {
		this.setData({
			show: true,
			buyNow: 1
		})
	},
	// 全屏预览图片：
	previewImage() {
		wx.previewImage({
			urls: this.data.goodsInfo.detailList,
		})
	},

	// 点击关闭弹框时触发的回调
	onClose() {
		this.setData({ show: false })
	},

	// 监听是否更改了购买数量
	onChangeGoodsCount(event) {
		this.setData({
			count: Number(event.detail)
		})
	},

	// 弹窗的确定按钮：
	async handlerSubmit() {

		// 解构数据：
		const { token, count, blessing, buyNow } = this.data
		// 获取商品id：
		const goodsId = this.goodsId

		// 判断用户是否登录： 未登录则跳转登录页面
		if (!token) {
			wx.navigateTo({
				url: '/pages/login/login'
			})
			return
		}

		// 判断用户点击的是 加入购物车0 还是 立即购买1：
		if (buyNow === 0) {
			const res = await reqAddCart({ goodsId, count, blessing })
			if (res.code === 200) {
				toast({ title: '加入购物车成功' })

				// 加入购物车以后，重新计算商品购买数量：
				this.getCartCount()

				this.setData({
					show: false
				})
			}
		} else {
			wx.navigateTo({
				url: `/modules/orderPayModule/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing}`,
			})
		}
	},

	// 获取商品详情数据：
	async getGoodsInfo() {
		const { data: goodsInfo } = await reqGoodsInfo(this.goodsId)

		this.setData({
			goodsInfo
		})
	},

	// 获取购物车商品的 数量：
	async getCartCount() {

		// 使用 token 来判断用户是否登录：
		// 没有token，就是未登录：
		if (!this.data.token) return

		// 有token，就是已经登录：
		const res = await reqCartList()

		// 判断 购物车是否存在商品：
		if (res.data.leng != 0) {
			let allCount = 0 //累加购买数量

			res.data.forEach((item) => {
				allCount += item.count
			})

			this.setData({
				// info 属性的属性值要求是 字符串类型
				// 而且如果购买的数量大于 99，页面上需要展示 99+
				allCount: (allCount > 99 ? '99+' : allCount) + ''
			})
		}
	},

	onLoad(options) {
		// 接收传递的商品 ID，并且将 商品 ID 挂载到 this 上面
		this.goodsId = options.goodsId

		// 调用 获取商品详情数据 的方法：
		this.getGoodsInfo()

		// 计算购买的数量：
		this.getCartCount()
	},

	// 转发功能
	onShareAppMessage() {
		return {
			title: '所有的怦然心动，都是你',
			path: '/pages/index/index',
			imageUrl: '../../assets/images/love.jpg'
		}
	},

	// 转发到朋友圈功能
	onShareTimeline() { }
})