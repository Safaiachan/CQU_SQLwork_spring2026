import axios from 'axios';

const request = axios.create({
	baseURL: 'http://localhost:8000/api',
	timeout: 10000,
});

request.interceptors.response.use(
	(response) => {
		const result = response.data;
		if (result && typeof result.code === 'number') {
			if (result.code >= 200 && result.code < 300) {
				return result;
			}
			return Promise.reject(new Error(result.message || '请求失败'));
		}
		return result;
	},
	(error) => {
		const message = error?.response?.data?.message || error.message || '网络错误';
		return Promise.reject(new Error(message));
	}
);

export default request;