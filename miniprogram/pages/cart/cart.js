import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/stores/userstore'
import { reqCartList, reqUpdateChecked, reqCheckAllStatus, reqAddCart, reqDelCartGoods } from '@/api/cart'
import { debounce } from 'miniprogram-licia'
import { swipeCellBehavior } from '@/behaviors/swipeCell'
import { modal } from '@/utils/extendApi'
//导入miniprogram-computed 提供的hebavior
const computedBehavior = require('miniprogram-computed').behavior
ComponentWithStore({
	behaviors: [swipeCellBehavior, computedBehavior],
	//让页面和store 对象建立联系
	storeBindings: {
		store: userStore,
		fields: ['token'],
	},
	//定义计算属性
	computed: {
		//判断是否是全选，控制全选按钮的选中效果
		//计算属性会被挂载到 data 对象中去
		selectAllStatus(data) {
			//computed 函数不能使用this 来访问data中的数据
			// 如果想访问 data中的数据 需要使用形参
			return (
				data.cartList.length !== 0 && data.cartList.every((item) => item.isChecked === 1)
			)
		},
		//计算订单总金额
		totalPrice(data) {
			//用来对订单总金额进行累加
			let totalPrice = 0;
			data.cartList.forEach(item => {
				//  判断商品是否选中： isChecked = 1
				if (item.isChecked === 1) {
					totalPrice += item.price * item.count
				}
			})
			return totalPrice
		}
	},
	// 组件的初始数据
	data: {
		cartList: [1, 2, 3, 4],
		emptyDes: '还没有添加商品，快去添加吧～'
	},

	// 组件的方法列表
	methods: {
		onShow() {
			console.log("onshow")
			this.showTipGetList()
		},
		//  onHide ：页面隐藏时
		onHide() {
			this.onSwipeCellCommonClick()   // 关掉滑块
		},
		async showTipGetList() {
			console.log("123465798")
			if (!this.data.token) {
				console.log("9876544")
				this.setData({
					emptyDes: "您尚未登陆，点击登陆获取更多收益",
					cardList: []
				})
				return
			}
			// 如果用户进行了登陆 就需要获取购物车列表数据
			const { code, data: cartList } = await reqCartList()
			console.log("cartList", cartList);
			if (code === 200) {
				this.setData({
					cartList: cartList,
					emptyDes: cartList.length === 0 && '还没有添加商品 块钱添加吧'
				})
			}
		},
		//实现全选和全不选效果
		async selectAllStatus(event) {
			//获取全选按钮的选中状态
			const { detail } = event;
			const isChecked = detail ? 1 : 0
			const res = await reqCheckAllStatus(isChecked)
			if (res.code == 200) {
				// this.showTipGetList()
				const newCartList = JSON.parse(JSON.stringify(this.data.cartList))
				newCartList.forEach((item) => item.isChecked = isChecked);
				this.setData({ cartList: newCartList })
			}
		},
		async updateChecked(event) {
			//获取最新的购买状态
			const { detail } = event
			//获取传递的商品ID 以及索引
			const { id, index } = event.target.dataset;
			//将最新的购买状态转换成后端接口需要使用0 和1
			const isChecked = detail ? 1 : 0
			const res = await reqUpdateChecked(id, isChecked)
			if (res.code === 200) {
				console.log(123465)
				this.showTipGetList()
			}
		},

		//更新购买的数量
		changeBuyNum: debounce(async function (event) {
			//获取最新的购买数量
			// 如果用户输入的购买数量大于200 需要把购买数量设置为200
			const newBuyNum = event.detail > 200 ? 200 : event.detail;

			//获取商品id 索引 之前的购买数量
			const { id, index, oldbuynum } = event.target.dataset;
			const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/  // 1-200 直接的正整数
			const regRes = reg.test(newBuyNum)  // 进行验证:true、fasle
			//  验证不通过：fasle
			if (!regRes) {
				this.setData({
					[`cartList[${index}].count`]: oldbuynum
				})
				return  // 阻止继续运行
			}
			// 验证通过：true
			const disCount = newBuyNum - oldbuynum

			// 判断数量是否发生改变：=0 未改变
			if (disCount === 0) return

			const res = await reqAddCart({ goodsId: id, count: disCount })
			// 更新本地AppData的数量：
			if (res.code === 200) {
				this.setData({
					[`cartList[${index}].count`]: newBuyNum,
					// 如果数量发生变化，单选按钮为选中状态：
					[`cartList[${index}].isChecked`]: 1
				})
			}
		}, 500),

		async delCartGoods(event) {
			//获取需要删除商品的id
			const { id } = event.currentTarget.dataset
			const modalRes = await modal({
				content: '您确认删除该商品吗？'
			})
			if (modalRes) {
				await reqDelCartGoods(id)
				this.showTipGetList() // 重新获取数据
			}
		},
		// 跳转到 结算 页面：
		toOrder() {
			//  判断是否 勾选商品：
			if (this.data.totalPrice === 0) {
				wx.toast({
					title: '请选择需要购买的商品'
				})
				return
			}

			wx.navigateTo({
				url: '/modules/orderPayModule/pages/order/detail/detail',
			})
		},

	}
})
