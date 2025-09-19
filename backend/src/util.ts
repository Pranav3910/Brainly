const random = (len:number)=>{
    const str = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let ans = "";
    for(let i = 0; i<len; i++){
        ans+=str.charAt(Math.floor(Math.random()*str.length));
    }
    return ans;
}

export default random;