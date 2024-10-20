// mobx-miniprogram-bindings 里面引入components 方法
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
//导入当前组件需要的store对象
import { numStore } from '../../stores/numstore'

//需要使用ComponentWidthStore 方法构造组件
//计算属性扩展库需要使用旧版API
const computedBehavior = require('miniprogram-computed').behavior
ComponentWithStore({
	//注册behavior
	behaviors: [computedBehavior],
	computed: {
		total(data) {
			return data.a + data.b
		}
	},
	watch: {},
	data: {
		a: 1,
		b: 2
	},
	storeBindings: {
		store: numStore,
		fields: ['numA', 'numB', 'sum'],
		actions: ['update']
	}

})
