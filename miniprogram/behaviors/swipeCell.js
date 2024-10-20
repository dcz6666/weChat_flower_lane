export const swipeCellBehavior = Behavior({
	data: {
		swiperCellQueue: [], //用来存储滑动单元格实例
	},
	methods: {
		//当用户打开滑块时触发
		swipeCellOpen(event) {
			//获取单元格实例
			const instance = this.selectComponent(`#${event.target.id}`);
			this.data.swiperCellQueue.push(instance)
			console.log("instance", instance);
		},
		//结果页面绑定点击事件
		onSwipeCellPage() {
			this.onSwipeCellCommonClick()
		},

		//点击滑动单元格时触发的事件
		onSwipeCellClick() {
			this.onSwipeCellCommonClick()
		},

		// 关掉滑块统一逻辑
		onSwipeCellCommonClick() {
			this.data.swiperCellQueue.forEach((instance) => {
				instance.close()
			})
		},
	}
})