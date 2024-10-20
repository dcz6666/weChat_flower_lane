import http from '@/utils/http'
/**
 * @description 新增收获地址功能
 * @param data
 */
export const reqAddAddress = (data) => {
	return http.post('/userAddress/save', data)
}
/**
 * @description 获取收获地址列表
 */
export const reqAddressList = () => {
	return http.get('/userAddress/findUserAddress')
}

/**
 * @description 获取收获地址详情
 * @param {*} id 
 */
export const reqAddressInfo = (id) => {
	return http.get(`/userAddress/${id}`)
}

/**
 * @description 更新收货地址
 * @param {*} data 
 */
export const reqUpdateAddress = (data) => {
	return http.post('/userAddress/update', data);
}
/**
 * @description 收获地址详情
 * @param {*} id 
 */

export const reqDelAddress = (id) => {
	return http.get(`/userAddress/delete/${id}`)
}