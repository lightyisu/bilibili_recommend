//节流函数 防止无限滑动多次触发
export default function throttle(func,seconds){
    let previos=0;
    return function(){
        let now=Date.now();
        let context=this;
        let args=arguments;
        if(now-previos>seconds){
            func.apply(context,args);
            previos=now;
        }
    }
}