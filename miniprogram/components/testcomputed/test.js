import { ComponentWithComputed } from 'miniprogram-computed'

//如果想和store  对象建立关联 进行绑定
//mobx 需要使用旧版API
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'

//导入当前组件需要的store对象
import { numStore } from '../../stores/numstore'

ComponentWithComputed({
	// 计算属性： 基于已有的数据产生新的数据
	// 在使用ComponentWithComputed 方法构建组件以后
	// 这时候 就可以新增两个配置项 computed 以及watch 配置项

	behaviors: [storeBindingsBehavior],
	storeBindings: {
		store: numStore,
		fields: ['numA', 'numB', 'sum'],
		actions: ['update']
	},
	computed: {
		total(data) {
			// 计算属性方法内部有返回值
			// 在计算属性内部 不能使用this 来获得data 中的数据
			// 如果想获取data中的数据 需要使用形参

			//计算属性具有缓存特性
			//计算属性只执行一次 后续在使用的时候 返回的是第一次执行结果
			//只要依赖的数据 没有发生改变 返回的始终只第一次执行的结果
			//只要计算属性依赖的数据发生了变化 计算属性就会重新执行
			return data.a + data.b
		}
	},
	watch: {
		// key:需要监听的数据
		// value:回调函数 回调函数有一个形参 形参是最新的 改变以后得数据
		a: function (a) { },
		b: function (b) { },
		//同时监听多个数据 数据与数据之间需要使用, 并分隔
		'a,b': function (a, b) {
			// 在watch 内部监听导数据变化后 就可以执行响应的逻辑
		}
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		a: 1,
		b: 2
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	}
})
