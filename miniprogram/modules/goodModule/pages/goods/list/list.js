import { reqGoodsList } from '../../../api/goods'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		goodsList: [], // 商品列表数据
		isFinish: false, // 判断数据是否加载完毕
		total: 0, // 数据总条数
		isLoading: false,// 判断数据是否加载完毕

		requestData: {
			page: 1, // 页码
			limit: 10, // 每页请求的条数
			category1Id: '', // 一级分类id
			category2Id: '' // 二级分类id
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		Object.assign(this.data.requestData, options)
		this.getGoodsList()
	},
	async getGoodsList() {
		this.data.isLoading = true
		const { data } = await reqGoodsList(this.data.requestData)
		console.log("data", data);
		this.data.isLoading = false
		this.setData({
			goodsList: [...this.data.goodsList, ...data.records],
			total: data.total
		})
	},

	//监听页面上拉操作
	onReachBottom() {
		const { goodsList, total, requestData, isLoading } = this.data;
		let { page } = requestData
		if (isLoading) return;
		//通过goodslist 长度 和 total 进行对比
		if (goodsList.length === total) {
			this.setData({ isFinish: true })
			return;
		}
		this.setData({
			requestData: { ...this.data.requestData, page: page + 1 }
		})
		//重新获取商品列表数据
		this.getGoodsList()
	},

	onPullDownRefresh() {
		this.setData({
			goodsList: [],
			isFinish: false,
			total: 0,
			requestData: { ...this.data.requestData, page: 1 }
		})
		//使用最新的参数发送请求
		this.getGoodsList()
		//手动关闭下拉刷新的效果
		wx.stopPullDownRefresh()
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})