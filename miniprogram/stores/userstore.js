//observable 创建被检测的对象 对象中的属性会被转换为响应式数据
//action 函数用来显示的定义 action 方法
import { observable, acticon, action } from 'mobx-miniprogram'
import { getStorage } from '../utils/storage'
export const userStore = observable({
	//定义响应式数据
	token: getStorage('token') || '',
	userInfo: getStorage('userInfo') || '',
	//定义action
	//setToken用来修改 更新token
	setToken: action(function (token) {
		//在调用setToken 方法时传入token 数据进行赋值
		this.token = token
	}),
	setUserInfo: action(function (userInfo) {
		this.userInfo = userInfo
	})
})