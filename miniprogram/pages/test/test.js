import instance from '../../utils/http'
import { reqSwiperData } from '../../api/index'
import { toast, modal } from '../../utils/extendApi'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},
	async handler() {
		// let result = await instance.get('/index/findBanner')
		let result = await reqSwiperData()
		console.log("result1", result)
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		// this.handler()
	},

	async onLocation() {
		const { authSetting } = await wx.getSetting();
		console.log("123", authSetting)
		// 判断用户是否拒绝了授权
		if (authSetting['scope.userLocation'] === false) {
			//用户之前拒绝授权获取位置信息 用户再次发起了授权
			//这时需要使用一个弹框询问用户是否进行授权
			const modalRes = await modal({
				title: "授权提示",
				content: '需要获取地理位置信息，请确认授权'
			})
			//如果用户点击了取消 说明用户拒绝了授权 需要给用户进行提示
			if (!modalRes) return toast({ title: "您拒绝授权" })

			//如果用户点击确定 说明用户同意授权 需要打开微信客户端小程序授权页面
			const { authSetting } = await wx.openSetting()
			// 如果用户没有更新授权信息 需要给用户提示授权失败
			if (!authSetting['scope.userLocation'])
				return toast({ title: "授权失败" })
			try {
				const locationRes = await wx.getLocation()
			} catch (err) {
				console.log("err", err);
				toast({ title: "您拒绝授权获取位置信息" })
			}
		} else {
			try {
				const locationRes = await wx.getLocation()
			} catch (err) {
				console.log("err", err);
				toast({ title: "您拒绝授权获取位置信息" })
			}
		}
	},

	onReachBottom() {
		console.log("1234789789")
		// let { page } = this.data.requestData
		// this.setData({
		// 	requestData: { ...this.data.requestData, page: page + 1 }
		// })
		// //重新获取商品列表数据
		// this.getGoodsList()
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})