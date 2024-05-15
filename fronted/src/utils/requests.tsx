import axios, { AxiosInstance } from "axios";


const request:AxiosInstance = axios.create({
    baseURL: "/",
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
    (config) =>
    {
        return config
    }, error =>
    {
        console.log(error);
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) =>
    {
        
        return response.data
    }, 
    error =>
    {
        if (error.response.status === 401)
        {
            // router.navigate('/login');
            window.location.reload();
        }
        return Promise.reject(error)
    }
)

export {
    request
}