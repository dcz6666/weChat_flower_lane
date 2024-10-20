import { reqCategoryData } from '../../api/category'
Page({
	data: {
		categoryList: [],
		activeIndex: 0
	},
	onLoad() {
		this.getCategoryData();
	},
	async getCategoryData() {
		let res = await reqCategoryData();
		if (res.code == 200) {
			this.setData({
				categoryList: res.data
			})
		}
		console.log("res", res);
	},
	updataActive(event) {
		let { id } = event.mark;
		this.setData({ activeIndex: id })
	}
})
