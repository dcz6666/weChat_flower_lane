//导入封装 网络请求模块实例
import http from '../utils/http'
export const reqIndexData = () => {
	return http.all(
		http.get('/index/findBanner'),
		http.get('/index/findCategory1'),
		http.get('/index/advertisement'),
		http.get('/index/findListGoods'),
		http.get('/index/findRecommendGoods')
	)
}