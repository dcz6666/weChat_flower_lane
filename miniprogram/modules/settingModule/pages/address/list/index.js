import { toast, modal } from '@/utils/extendApi'
import { reqAddressList, reqDelAddress } from '../../../api/address'
import { swipeCellBehavior } from '@/behaviors/swipeCell'
let app = getApp()
Page({
	behaviors: [swipeCellBehavior],
	// 页面的初始数据
	data: {
		addressList: [],

	},
	onShow() {
		this.getAddressList()
	},

	// 去编辑页面
	toEdit(event) {
		//获取需要更新的收获地址 id
		const { id } = event.currentTarget.dataset;
		wx.navigateTo({
			url: '/modules/settingModule/pages/address/add/index?id=' + id
		})
	},
	// 获取收获地址列表数据
	async getAddressList() {
		const res = await reqAddressList()
		if (res.code === 200) {
			this.setData({ addressList: res.data })
		}
	},
	async delAddress(event) {
		const { id } = event.currentTarget.dataset;
		const modalRes = await modal({
			content: "您确认删除该收获地址吗？"
		})
		if (modalRes) {
			const res = await reqDelAddress(id)
			toast({ title: '收货地址删除成功' })
			this.getAddressList()
		}
	},

	changeAddress(event) {
		// 需要判断是否是从结算支付页面进入的收货地址列表页面
		// 如果是，才能够获取点击的收货地址，否则，不执行后续的逻辑，不执行切换收货地址的逻辑
		if (this.flag !== '1') return
		// 如果是从结算支付页面进入的收货地址列表页面，需要获取点击的收货地址详细信息
		const addressId = event.currentTarget.dataset.id
		// console.log(addressId);
		// 需要从收货地址列表中根据 收货地址 ID 查找到点击的收货地址详情、详细信息
		const selectAddress = this.data.addressList.find((item) => item.id === addressId)
		// bug------------地址未 全局共享
		if (selectAddress) {
			// 如果获取收货地址成功以后，需要赋值给全局共享的数据
			app.globalData.address = selectAddress
			wx.navigateBack()
		}
	},

	onLoad(options) {
		this.flag = options.flag
	}


})
