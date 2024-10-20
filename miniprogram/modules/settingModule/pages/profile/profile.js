import { userBehavior } from './behavior'
import { getStorage, setStorage } from '../../../../utils/storage'
import { reqUploadFile, reqUpdataUserInfo } from '../../../../api/user'
import { toast } from '../../../../utils/extendApi'
Page({
	//注册behavior
	behaviors: [userBehavior],
	// 页面的初始数据
	data: {
		isShowPopup: false // 控制更新用户昵称的弹框显示与否
	},

	// 显示修改昵称弹框
	onUpdateNickName() {
		this.setData({
			isShowPopup: true,
			"userInfo.nickname": this.data.userInfo.nickname
		})
	},

	// 弹框取消按钮
	cancelForm() {
		this.setData({
			isShowPopup: false
		})
	},

	async chooseAvatar(event) {
		//获取头像临时路径 具有失效时间
		const { avatarUrl } = event.detail;
		let res = await reqUploadFile(avatarUrl, 'file')
		this.setData({ 'userInfo.headimgurl': res.data })
		console.log("res", res);
		// wx.uploadFile({
		// 	url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload',
		// 	filePath: avatarUrl,
		// 	name: 'file',  //要上传的文件资源路径
		// 	header: {
		// 		token: getStorage('token')
		// 	},
		// 	success: (res) => {
		// 		const uploadRes = JSON.parse(res.data);
		// 		console.log("uploadRes", uploadRes)
		// 		this.setData({ 'userInfo.headimgUrl': uploadRes.data })
		// 	},
		// 	fail: (err) => {
		// 		console.log("err", err);
		// 	}
		// })
	},

	async updateUserInfo() {
		let res = await reqUpdataUserInfo(this.data.userInfo);
		console.log("res", res);
		if (res.code === 200) {
			setStorage('userInfo', this.data.userInfo)
			this.setUserInfo(this.data.userInfo)
			toast({ title: "用户信息更新成功" })
		}
	},
	getNickName(event) {
		console.log("event", event)
		const { nickname } = event.detail.value;
		console.log("nickname", nickname)
		this.setData({ 'userInfo.nickname': nickname, isShowPopup: false })
	}
})
