// 存储数据
export const setStorage = (key, value) => {
	try {
		wx.setStorageSync(key, value)
	} catch (error) {
		console.error(`存储指定${key} 数据发生异常`, error)
	}
}

//读取数据
export const getStorage = (key) => {
	try {
		const value = wx.getStorageSync(key)
		if (value) { return value; }
	} catch (error) {
		console.error(`读取指定${key} 数据发生异常`, error)
	}
}
//移除数据
export const removeStorage = (key) => {
	try {
		wx.getStorageSync(key)
	} catch (error) {
		console.error(`移除指定${key} 数据发生异常`, error)
	}
}
//清空
export const clearStorage = () => {
	try {
		wx.clearStorageSync()
	} catch (error) {
		console.error(`移除指定${key} 数据发生异常`, error)
	}
}
// 异步将数组存储
export const asyncSetStorage = (key, data) => {
	return new Promise((resolve) => {
		wx.setStorage({
			key,
			data,
			complete(res) {
				resolve(res)
			}
		})
	})
}

// 异步本地读取数据
export const asyncGetStorage = (key) => {
	return new Promise((resolve) => {
		wx.getStorage({
			key,
			complete(res) {
				resolve(res)
			}
		})
	})
}

// 异步本地移除数据
export const asyncRemoveStorage = (key) => {
	return new Promise((resolve) => {
		wx.removeStorage({
			key,
			complete(res) {
				resolve(res)
			}
		})
	})
}

export const asyncClearStorage = () => {
	return new Promise((resolve) => {
		wx.clearStorage({
			complete(res) {
				resolve(res)
			}
		})
	})
}

