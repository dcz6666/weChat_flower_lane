//observable  用于创建一个被检测的对象 对象的属性时应用对应的状态 状态会被自动转换为响应式数据
//action 函数是用来显示的定义action 方法 action 方法是用来修改 更新状态
import { observable, action } from 'mobx-miniprogram'

//开始创建store
export const numStore = observable({
	numA: 1,
	numB: 2,

	// 定义action 方法用来修改状态
	update: action(function () {
		//在方法中如果需要获取状态 可以使用this 进行获取
		this.numA += 1
		this.numB += 2
	}),

	//计算属性computed 
	//是根据已有的状态产生的新状态
	//计算属性前面需要使用get 修饰符进行修饰
	get sum() {
		//计算属性内部必须要有返回值
		return this.numA + this.numB
	}
})