import http from '@/utils/http'

// 获取 订单详情：
export const reqOrderInfo = () => {
	return http.get('/order/trade')
}

//  获取 订单地址：
export const reqOrderAddress = () => {
	return http.get('/userAddress/getOrderAddress')
}

// 立即购买 的详细信息:
export const reqBuyNowGoods = ({ goodsId, ...data }) => {
	return http.get(`/order/buy/${goodsId}`, data)
}

// 提交订单 ：
export const reqSubmitOrder = (data) => {
	return http.post(`/order/submitOrder`, data)
}

// 获取 微信预支付信息： orderNo :订单的id
export const reqPrePayInfo = (orderNo) => {
	return http.get(`/webChat/createJsapi/${orderNo}`)
}

// 是否 支付成功： orderNo :订单id
export const reqPayStatus = (orderNo) => {
	return http.get(`/webChat/queryPayStatus/${orderNo}`)
}

// 获取订单列表：
export const reqOrderList = (page, limit) => {
	return http.get(`/order/order/${page}/${limit}`)
}