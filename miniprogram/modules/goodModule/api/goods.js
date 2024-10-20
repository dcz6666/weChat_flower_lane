import { observable } from 'mobx-miniprogram';
import http from '../../../utils/http'
/**
 * @description  获取商品列表数据
 * @param {*} param0 
 */
export const reqGoodsList = ({ page, limit, ...data }) => {
	return http.get(`/goods/list/${page}/${limit}`, data)
}

/**
 * @description 获取商品的详情
 * @param {*} goodsId 
 */
export const reqGoodsInfo = (goodsId) => {
	return http.get(`/goods/${goodsId}`)
}