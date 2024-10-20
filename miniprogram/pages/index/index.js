import { reqIndexData } from '@/api/index'
Page({
	data: {
		bannerList: [],  //轮播图数据
		categoryList: [], //商品导航数据
		activeLive: [], //活动渲染区域
		hotList: [], //人气推荐
		guessList: [], //猜你喜欢
		loading: true //是否显示骨架屏
	},
	onLoad() {
		this.getIndexData()
	},
	async getIndexData() {
		const res = await reqIndexData()
		console.log("res", res);
		this.setData({
			bannerList: res[0].data,
			categoryList: res[1].data,
			activeLive: res[2].data,
			hotList: res[3].data,
			guessList: res[4].data,
			loading: false
		})
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


