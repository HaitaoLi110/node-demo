import axios from 'axios';
import { Message ,Loading } from 'element-ui';
import Router from './router/index.js'
let loading;
function startLoading(){
	loading=Loading.service({
		lock:true,
		text:'拼命加载中...',
		background:'rgba(0,0,0,.7)'
	});
}

function endLading(){
	loading.close();
}
//请求拦截
axios.interceptors.request.use(
	config => {
	//加载动画
	startLoading()
	if(localStorage.eleToken){
		//配置请求头header
		config.headers.Authorization=localStorage.eleToken;
	}
	return  config;
},error=>{
	endLading()
	return Promise.reject(error)
})

//响应拦截

axios.interceptors.response.use(response=>{
	endLading()
	console.log(response);
	return response
},error=>{
	Message .error(error.response.data)
	
	//获取错误状态码
	const {status}=error.response;
	if(status==401){
		Message .error('token失效，请重新登录')
		localStorage.removeItem('eleToken');
		//跳转登录页面
		Router.push('/login')
	}
	return Promise.reject(error)
})
export default axios;

