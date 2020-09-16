/*! 
    name: heho mkt,
    version: 1.0.0,
    description: 
    fix: 
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.hehomktox = factory()
}(this, (function () { 'use strict';

    let heho_recm_ox_ml = "https://ml.oxra.com.tw"; //oxml
    let heho_oxra = "https://oxra.com.tw";  //oxra

    var hehomktox = {};
    let heho_hid = heho_getCookie('heho_cid');
    if ("" == heho_hid) {
        heho_hid = heho_generateUUID();
    }
    heho_setCookie('heho_cid',heho_hid);    

    let heho_uip = {};
    let heho_device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) ? 'mobile' : 'desktop';
    let heho_app = heho_detect_inapp();

    if (window.addEventListener) {
        window.addEventListener('message', oxra_ReceiveCallback, false);
    } else if (window.attachEvent) {
        window.attachEvent('onmessage', oxra_ReceiveCallback);
    }
    let heho_mkts={};
    function oxra_ReceiveCallback(msg) {
        // console.log(msg);
        if (msg.origin == "https://oxra.com.tw" || msg.origin == "https://ml.oxra.com.tw") {
            if(msg.data.mlid != undefined && msg.data.mlid != '') {
                let mlid = msg.data.mlid;
                document.getElementById(mlid).style.height = msg.data.height + 'px'; 
                if(msg.data.heho_mkt != undefined ) {
                    heho_mkts[mlid] = msg.data.heho_mkt;
                }               
            }
        }
    }
    
    hehomktox.heho_hid = heho_hid;
    hehomktox.heho_app = heho_app;

    let page_current={
        hostname : location.hostname,
        source: document.referrer,
        title: ( heho_getMeta('property' , 'og:title') =='')? document.title:heho_getMeta('property' , 'og:title'),
        url: (heho_getMeta('property' , 'og:url') =='')? document.URL:heho_getMeta('property' , 'og:url'),
        desc: (heho_getMeta('property' , 'og:description') =='')? '':heho_getMeta('property' , 'og:description'),
        app : heho_app
    };
    // console.log(page_current);
    fetch('https://json.geoiplookup.io/', { method: 'get',mode: 'cors' })
    .then((resp) => {
        if(resp.ok) {
            return resp.json();
        }
        throw new Error(resp.statusText)
    })
    .then((json) => {
        // console.log(json);
        heho_uip = json;
        heho_uip.device = heho_device;
    })
    .catch((error) => {
        heho_uip.device = heho_device;
    })
    .then(()=>{
        hehomktox.heho_pv_log(page_current);
        hehomktox.heho_uip = heho_uip;
    });
    hehomktox.page_current = page_current;

    let h_win = window.innerHeight;
    let mkt_view = {};
    window.addEventListener('scroll', function(e) {
        setTimeout(heho_doImp, 100);        
    });
    
    function heho_doImp() {
        let heho_ml_mkt = document.getElementsByClassName('heho-ml-mkt');
        for (let i = 0; i < heho_ml_mkt.length; i++) {
            let line_height = heho_ml_mkt[i].offsetHeight ;
            if (h_win > (heho_ml_mkt[i].getBoundingClientRect().top + (line_height/2) ) ) {
                let heho_ml_mkt_id = heho_ml_mkt[i].id;
                if(mkt_view[heho_ml_mkt_id] == undefined) {
                    mkt_view[heho_ml_mkt_id] = true;
                    if(heho_mkts[heho_ml_mkt_id + '-content'] != undefined && heho_mkts[heho_ml_mkt_id + '-content'].url.length>0) {
                        let heho_mkt = heho_mkts[heho_ml_mkt_id + '-content'];
                        // console.log(heho_ml_mkt[i].id + ' => 可視',heho_mkt.url);
                        heho_mkt.top = heho_ml_mkt[i].getBoundingClientRect().top + (line_height/2);
                        hehomktox.heho_mkt_log(heho_mkt,{action:'vimp'});
                    }
                }                        
            }
        }
    }  
    
    
    hehomktox.heho_ml = function (obj) {
        let _heho_ml_api_id = obj.heho_ml_api_id;
        let _heho_content_id = obj.heho_content_id;
        let pid = obj.pid;
        let mlname = obj.mlname;

        let recm_url = heho_recm_ox_ml + '/ra/mkt'
            + '/' + _heho_ml_api_id
            + '/' + pid + '-' + mlname
            + '/' + heho_hid
            + '/' + location.hostname;        
        // console.log(recm_url);
        let recm_html = '<iframe id="'+_heho_content_id+'-content" height="0px" width="100%" title="推薦文章" frameborder="0" scrolling="no" style="border: 0px;"'
            + ' allowfullscreen="true" vspace="0" hspace="0" allowtransparency="true"'
            + ' src="' + recm_url + '"'
            + ' ></iframe>';

        document.getElementById(_heho_content_id).innerHTML = recm_html;

        document.getElementById(_heho_content_id +"-content").onload = function(){
            let pms = {
                page_current : page_current,
                heho_hid : heho_hid,
                heho_uip : heho_uip,
                mlapi : _heho_ml_api_id,
                mlid : _heho_content_id +"-content",
                infinte_num : obj.infinte_num
            };
            // console.log(pms);
            document.getElementById(_heho_content_id +"-content").contentWindow.postMessage(pms, '*');                
        }
    }

    hehomktox.heho_pv_log =function (current) {
        let rurl = heho_oxra + '/sys/pv/do_add';
        let param1 = {
            site_name : location.hostname,
            hid : heho_hid,
            uip : heho_uip,		
            current : current,
            source: document.referrer,
            _gid: heho_getCookie('_gid'),
            _ga: heho_getCookie('_ga'),
            action : 'pv'
        };            
        // console.log(param1);
        fetch(rurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param1)
        }).then((response) => {            
            // console.log(response);
        }).catch((err) => {
            console.log('錯誤:', err);
        });        
    }
    hehomktox.heho_mkt_log = function (heho_mkt,obj) {
        let current = page_current;
        current.mkt = heho_mkt;
        current.title= ( heho_getMeta('property' , 'og:title') =='')? document.title:heho_getMeta('property' , 'og:title');
        current.url= (heho_getMeta('property' , 'og:url') =='')? document.URL:heho_getMeta('property' , 'og:url');
        current.desc= (heho_getMeta('property' , 'og:description') =='')? '':heho_getMeta('property' , 'og:description');
        let param1 = {
            site_name : location.hostname,
            hid : heho_hid,
            uip : heho_uip,		
            current : current,
            source: document.referrer,
            _gid: heho_getCookie('_gid'),
            _ga: heho_getCookie('_ga'),
            action : obj.action
        }; 
        if (obj.action =='click') {
            param1.target = obj.target;
        }
        // console.log(param1);
        let rurl = heho_oxra + '/sl/pv/do_add';
        fetch(rurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param1)
        }).then((response) => {            
            // console.log(response);
        }).catch((err) => {
            console.log('錯誤:', err);
        });    
    }

    function heho_detect_inapp() {
        let u = navigator.userAgent;
        if (u.match(/\bLine\//i)) {
            return 'line';
        } // Line 內建瀏覽器
        else if (u.match(/\bFB[\w_]+\//)) {
            return 'facebook';
        } // FB1 App 內建瀏覽器
        else if (u.match(/\bMicroMessenger\//i)) {
            return 'wechat';
        } // 微信內建瀏覽器
        else if (u.match(/\bTwitter/i)) {
            return 'twiteer';
        } else if (u.match(/\bFB[\w_]+\/(Messenger|MESSENGER)/)) {
            return 'messenger';
        } else if (u.match(/\bInstagram/i)) {
            return 'instagram';
        } else {
            return '';
        }
    }
    function heho_getCookie(name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]); return '';
    }
    function heho_generateUUID() {
        let d = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
            function (c) {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
        return uuid;
    };
    function heho_setCookie(c_name, value) {
        let exdate = new Date();
        exdate.setDate(exdate.getDate() + 1000);
        document.cookie = c_name + "=" + escape(value) + ";path=/" + ";expires=" + exdate.toGMTString() ;
    };
    function heho_getMeta(attrName , metaName) {
        let metas = document.getElementsByTagName('meta');
        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute(attrName) === metaName) {
                return metas[i].getAttribute('content');
            }
        }
        return '';
    }
    
    // 對Date的擴充套件，將 Date 轉化為指定格式的String
    // 月(M)、日(d)、小時(h)、分(m)、秒(s)、季度(q) 可以用 1-2 個佔位符，
    // 年(y)可以用 1-4 個佔位符，毫秒(S)只能用 1 個佔位符(是 1-3 位的數字)
    // 例子：
    // (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).format("yyyy-M-d h:m:s.S")   ==> 2006-7-2 8:9:4.18
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小時
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    return hehomktox;
})));