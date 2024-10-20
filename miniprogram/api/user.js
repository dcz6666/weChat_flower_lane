import http from '../utils/http'
/**
 * 
 * @param {*} code 临时登陆凭证
 */
export const reqLogin = (code) => {
	return http.get(`/weixin/wxLogin/${code}`)
}
/**
 * @description 获取用户信息
 * @returns Promist
 */
export const reqUserInfo = () => {
	return http.get('/weixin/getuserInfo')
}

/**
 * @description 实现本地资源上传
 * @param 要上传的文件资源路径
 * @param name 文件对应的key
 */

export const reqUploadFile = (filePath, name) => {
	return http.upload('/fileUpload', filePath, name)
}

/**
 * @description 更新用户信息
 * @param {*} userInfo 
 */
export const reqUpdataUserInfo = (userInfo) => {
	return http.post('/weixin/updateUser', userInfo)
}