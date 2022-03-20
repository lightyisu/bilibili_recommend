import axios from "axios";
let instance=axios.create({
    baseURL:'http://localhost:8080',
    timeout:2000
})
instance.interceptors.response.use(res=>{
    return res.data
})
export function getRecommend(){
    return instance({
        url:'/recommend',
        method:'get'
    })
}