function createTime(e){
    let _t = document.getElementsByClassName(e);
    let ck = document.cookie.split(";");
    let a_ = new Array();
    let z = 0;

    function rN(){
        return parseInt(Math.random() * 30000000);
    }

    function tF(_n_){
        if(_n_.toString().length != 13){
            return '';
        }
        _n_ = parseInt(_n_);
        let d_ = new Date(_n_);
        if(!z){
            z = 1;
            return d_.toLocaleDateString().replace(/\//g,'-');
        }
        let y = d_.getFullYear();
        let m = d_.getMonth();
        let d = d_.getDate();
        let ti = d_.toLocaleTimeString();
        ti = ti.substring(0, ti.lastIndexOf(":"));
        return y + "年" + m + "月" + d + "日 " + ti;
    }

    // 判断cookie是否存在
    for(let i in ck){
        let key = ck[i].split("=");
        if(key[0].trim() == "a_vis"){
            a_ = key[1].split(",");
            break;
        }
    }
    
    // 不存在则生成
    if(!a_.length){
        let d = new Date().getTime() - 36000000;

        for(let i of _t){
            d -= rN();
            a_.unshift(d);
        }

        document.cookie = "a_vis=" + a_.toString() + ";max-age=172800";
    }

    for(let a = 0; a < _t.length; a++){
        let w = tF(a_[a]);
        _t[a].innerText = w;
    }
}