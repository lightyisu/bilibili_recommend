export default function infinityScroll(node,callback){
        let observer=new IntersectionObserver((entry)=>{
            //不可见 ratio<=0
            if(entry[0].intersectionRatio<=0) return;
            callback()
        })
        observer.observe(document.querySelector(node))
}