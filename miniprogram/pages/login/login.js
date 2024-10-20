import { toast } from "@/utils/extendApi"
import { reqLogin, reqUserInfo } from '@/api/user'
import { setStorage } from '@/utils/storage'
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/stores/userstore'
import { debounce } from 'miniprogram-licia' // 防抖函数
ComponentWithStore({
	//让页面和store 对象建立关联
	storeBindings: {
		store: userStore,
		fields: ['token', 'userInfo'],
		actions: ['setToken', 'setUserInfo']
	},
	methods: {
		login: debounce(async function () {
			wx.login({
				success: async ({ code }) => {
					if (code) {
						let res = await reqLogin(code)
						let { data } = res
						//登录成功以后 需要将服务器响应的自定义登陆状态存储到本地
						setStorage('token', data.token)
						//将自定义登录态token 存储到stroe
						this.setToken(data.token)
						this.getUserInfo()
						wx.navigateBack()
					} else {
						toast({ title: "授权失败，清重新登陆" })
					}
				}
			})
		}, 500),
		//获取用户信息
		async getUserInfo() {
			const { data } = await reqUserInfo()
			setStorage('userInfo', data)
			this.setUserInfo(data)
		}
	}
})
