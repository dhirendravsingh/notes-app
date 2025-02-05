import axios from "axios"
import { BACKEND_URL } from "./config"

const axiosInstance = axios.create({
    baseURL : BACKEND_URL,
    timeout: 10000,
    headers: { 
        "Content-type" : "application/json"
    }
})

axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token")
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    }, 
    (error)=>{
        return Promise.reject(error)
    }
)

export default axiosInstance