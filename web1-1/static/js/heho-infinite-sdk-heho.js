(function ($) {

    "use strict";

    $(document).ready(function () {
        let page_current = hehomktox.page_current;
        let heho_uip = hehomktox.heho_uip;
        let heho_infinte_app = hehomktox.heho_app;

        let heho_recm_ox_ml = "https://ml.oxra.com.tw";
        let slHost = 'https://sl.heho.com.tw/';
        
        let heho_pid = location.pathname.replace('/archives/','');
        let heho_pids = heho_pid.split('?');    
        heho_pid = parseInt(heho_pids[0]);
        if(isNaN(heho_pid)) {
            heho_pid = 0;
            let heho_mkt_json = []; 
            let heho_ml_mkt = document.getElementsByClassName('post-item');
            // console.log(heho_ml_mkt.length);
            for (let i = 0; i < heho_ml_mkt.length; i++) {
                if(heho_ml_mkt[i].getElementsByTagName('a')!=undefined) {
                    let heho_ml_mkt_href = heho_ml_mkt[i].getElementsByTagName('a')[0].getAttribute('href').trim();
                    if(heho_ml_mkt_href.indexOf(slHost) >=0 ) {
                        heho_ml_mkt[i].addEventListener("click", function(event){
                            // console.log(event.currentTarget);
                            let target = event.currentTarget;
                            let targetinfo = {
                                url: heho_ml_mkt_href,
                                title: target.innerText.trim(),
                                pageX: event.pageX,
                                pageY: event.pageY,
                                clientX: event.clientX,
                                clientY: event.clientY,
                                dt : new Date().toISOString()
                            };
                            targetinfo.mkt = 'ad';
                            hehomktox.heho_mkt_log({
                                url : [heho_ml_mkt_href],
                                api : 'json',
                                top : heho_ml_mkt[i].getBoundingClientRect().top
                            },{action:'click',target:targetinfo});
                        });
                        heho_mkt_json.push({
                            ele : heho_ml_mkt[i],
                            href : heho_ml_mkt_href
                        });
                        hehomktox.heho_mkt_log({
                            url : [heho_ml_mkt_href],
                            api : 'json',
                            top : heho_ml_mkt[i].getBoundingClientRect().top
                        },{action:'imp'});
                    }  
                }
            }
            // console.log(heho_mkt_json);
            window.addEventListener('scroll', function(e) {
                setTimeout(heho_wp_doImp, 100);
            });
            let h_win = window.innerHeight;
            let mkt_view_json = {};             
            function heho_wp_doImp() {//for api type json                
                for (let i = 0; i < heho_mkt_json.length; i++) {
                    let mkt_ele = heho_mkt_json[i].ele;
                    let line_height = mkt_ele.offsetHeight ;
                    if (h_win > (mkt_ele.getBoundingClientRect().top + (line_height/2) ) ) {
                        let heho_ml_mkt_href = heho_mkt_json[i].href;
                        if(mkt_view_json[heho_ml_mkt_href] == undefined  ) {
                            mkt_view_json[heho_ml_mkt_href] = true;                            
                            // console.log(heho_ml_mkt_href + ' => 可視');
                            hehomktox.heho_mkt_log({
                                url : [heho_ml_mkt_href],
                                api : 'json',
                                top : heho_ml_mkt[i].getBoundingClientRect().top + (line_height/2)
                            },{action:'vimp'});
                        }                                    
                    }
                }
            }
            return;
        }
        
        let heho_infinte_posts = [];        
        let heho_hid = document.cookie.match(new RegExp("(^| )heho_cid=([^;]*)(;|$)"));
        heho_hid = (heho_hid != null)? unescape(heho_hid[2]):'xx123456789';
        let heho_recm_url = heho_recm_ox_ml + '/ra/mkt/infinite'
            + '/' + heho_pid + '-' + location.hostname
            + '/5';
        // console.log(heho_recm_url);
        $.ajax({
            method: "GET",
            url: heho_recm_url,
            dataType: "json",
            async : false
        }).done(function (postdata) {
            if(postdata.message == 'ok') {
                heho_infinte_posts = postdata.data;
                // console.log(heho_infinte_posts);
            }
        });
        let heho_alert_18 = false;
        if( $('meta[name="keywords"]').attr('content') ) {
            let k_18 = $('meta[name="keywords"]').attr('content');            
            if(k_18.indexOf('限制級') >=0 || k_18.indexOf('規範內容') >=0) {
                heho_alert_18 = true;
            }
        }
        
        //first post
        $('article').append('<div id="heho-ml-infinte-'+heho_pid+'"></div>');
        heho_infinte_popIn({
            heho_content_id : 'heho-ml-infinte-'+heho_pid,
            page_url : location.href,
        });
        // if(heho_alert_18) {
        //     heho_infinte_dable({
        //         pid : heho_pid,
        //         heho_content_id : 'heho-ml-infinte-'+heho_pid,
        //         dable_id : ''
        //     });
        //     heho_dable_id_count ++;
        // }else{
        //     heho_infinte_ga_post({
        //         heho_content_id : 'heho-ml-infinte-'+heho_pid
        //     });
        // }

        if(heho_infinte_posts.length <= 0) {
            hehomktox.heho_ml({
                heho_ml_api_id : 'ml_no_infinte_h',
                heho_content_id : 'heho-ml-infinte-'+heho_pid,
                pid : heho_pid,
                mlname : location.hostname,
                infinte_num : 0
            });            
        }       

        /*URL on ajax call for infinite scroll */
        if (heho_infinte_posts.length >0) {
            $('#content').find('.row-large').attr('id','heho-infinte-0');
            //first sidebar
            if($(window).width() < 800) {
                $('#heho-infinte-0').find('.post-sidebar').remove();
            }else{
                $('#heho-infinte-0').find('.post-sidebar #secondary').stick_in_parent({
                    parent: $('#heho-infinte-0'),
                    bottoming: !0,
                    spacer: !1,
                    offset_top: $('#header').height() + 10
                });
            }
            let heho_url_pushes = [];
            let heho_pushes_up = 0;
            let heho_pushes_down = 0;

            let push_obj = {
                prev: window.location.href,
                next: '',
                offset: $(window).scrollTop(),
                prev_title: window.document.title,
                next_title: window.document.title
            };

            heho_url_pushes.push(push_obj);
            let last_up, last_down = 0;
            let page_count = 1;
            $(window).scroll(function () {
                if (heho_url_pushes[heho_pushes_up].offset != last_up && $(window).scrollTop() < heho_url_pushes[heho_pushes_up].offset) {
                    last_up = heho_url_pushes[heho_pushes_up].offset;
                    last_down = 0;
                    window.document.title = heho_url_pushes[heho_pushes_up].prev_title;
                    window.history.replaceState(heho_url_pushes, '', heho_url_pushes[heho_pushes_up].prev);
                    if(heho_url_pushes[heho_pushes_up].pv_log!=undefined) {
                        heho_infinte_meta(heho_url_pushes[heho_pushes_up].pv_log.prev);
                    }                    
                    heho_pushes_down = heho_pushes_up;
                    if (heho_pushes_up != 0) {
                        heho_pushes_up--;
                    }
                }
                if (heho_url_pushes[heho_pushes_down].offset != last_down && $(window).scrollTop() > heho_url_pushes[heho_pushes_down].offset) {

                    last_down = heho_url_pushes[heho_pushes_down].offset;
                    last_up = 0;

                    window.document.title = heho_url_pushes[heho_pushes_down].next_title;
                    window.history.replaceState(heho_url_pushes, '', heho_url_pushes[heho_pushes_down].next);
                    heho_infinte_meta(heho_url_pushes[heho_pushes_down].pv_log.next);
                    //send log
                    if(!heho_url_pushes[heho_pushes_down].ga_cust.send) {
                        heho_infinte_ga_send(heho_url_pushes[heho_pushes_down].ga_cust , page_count);
                        heho_url_pushes[heho_pushes_down].pv_log.next.dt = new Date().toISOString();
                        hehomktox.heho_pv_log(heho_url_pushes[heho_pushes_down].pv_log.next);
                        heho_url_pushes[heho_pushes_down].ga_cust.send = true;
                        page_count ++;
                    }

                    heho_pushes_up = heho_pushes_down;
                    if (heho_pushes_down < heho_url_pushes.length - 1) {
                        heho_pushes_down++;
                    }
                }
            });

            let heho_infinite_single_allow = true;
            let heho_load_ajax_single_new_count = 0;
            let heho_window_history_initial = true;
            let h_offset = $('#header').height();
            let heho_dable_id_count = 1;
            $(window).scroll(function () {
                //page load
                // console.log('2::' +$(this).scrollTop() + ' > ' + (($('.fusion-footer').offset().top) - $('#heho-infinte-' + heho_load_ajax_single_new_count ).height()) );
                if (heho_infinite_single_allow && ($(this).scrollTop() > ($('#footer').offset().top) - $('#heho-infinte-' + heho_load_ajax_single_new_count ).height() )) {
                // if (heho_infinite_single_allow && ($(this).scrollTop() >  $("body").height()-$(window).height() - $('.fusion-footer').height() - 250)) {
                    let heho_infinite_pid = heho_infinte_posts[heho_load_ajax_single_new_count];
                    let page_url = location.origin + '/archives/' + heho_infinite_pid;
                    let start_url = window.location.href;
                    let prev_title = window.document.title;
                    if (heho_infinite_pid != 'undefined') {
                        heho_infinite_single_allow = false;
                        // console.log(page_url);
                        $("<div>").load(page_url, function () {
                            let $this_div = $(this);
                            let $wrap = $('#content').find('.row-large').last();
                            let $new = $this_div.find('#content > .row-large').last().attr('id','heho-infinte-'+ (heho_load_ajax_single_new_count+1) );
                            $new.find('.post-sidebar #secondary').html('');

                            //post
                            $new.find('.large-9').append('<div id="heho-ml-infinte-'+heho_infinite_pid+'"></div>');
                            $new.insertAfter($wrap);
                            //lazy load image
                            let watcher = new IntersectionObserver(heho_onEnterView);
                            let lazyImages = document.querySelectorAll('#heho-infinte-'+ (heho_load_ajax_single_new_count+1)+' img.lazy-load');
                            for (let image of lazyImages) {
                                watcher.observe(image);
                            }

                            if (heho_infinte_posts.length > heho_load_ajax_single_new_count + 1) {
                                heho_infinite_single_allow = true;
                            }else{
                                heho_infinite_single_allow = false;
                                //google adsense                                
                                heho_infinte_ga_mkts({
                                    page_url : page_url
                                });                                
                            }

                            //post
                            switch(heho_load_ajax_single_new_count%3) {
                                case 0 :
                                    // if(heho_alert_18) {
                                    //     heho_infinte_dable({
                                    //         pid : heho_infinite_pid,
                                    //         heho_content_id : 'heho-ml-infinte-'+heho_infinite_pid,
                                    //         dable_id : '_' + heho_dable_id_count
                                    //     });
                                    //     heho_dable_id_count ++;
                                    // }else{
                                        heho_infinte_ga_post({
                                            heho_content_id : 'heho-ml-infinte-'+heho_infinite_pid
                                        });
                                    // }
                                break;
                                case 1 :
                                    // heho_infinte_dable({
                                    //     pid : heho_infinite_pid,
                                    //     heho_content_id : 'heho-ml-infinte-'+heho_infinite_pid,
                                    //     dable_id : '_' + heho_dable_id_count
                                    // });
                                    // heho_dable_id_count ++;
                                    heho_infinte_popIn({
                                        heho_content_id : 'heho-ml-infinte-'+heho_infinite_pid,
                                        page_url : page_url
                                    });
                                break;
                                case 2 :
                                    hehomktox.heho_ml({
                                        heho_ml_api_id : 'ml_infinte_h',
                                        heho_content_id : 'heho-ml-infinte-'+heho_infinite_pid,
                                        pid : heho_infinite_pid,
                                        mlname : location.hostname,
                                        infinte_num : heho_load_ajax_single_new_count + 1
                                    });                                    
                                    // heho_infinte_popIn({
                                    //     heho_content_id : 'heho-ml-infinte-'+heho_infinite_pid,
                                    //     page_url : page_url
                                    // });
                                break;
                            }                            
                            //sidebar
                            if($(window).width()>=800) {
                                //sidebar
                                $new.find('.post-sidebar #secondary').append('<div id="heho-ml-infinte-sidebar-0-'+heho_infinite_pid+'"></div>');
                                $new.find('.post-sidebar #secondary').append('<div id="heho-ml-infinte-sidebar-1-'+heho_infinite_pid+'"></div>');
                                hehomktox.heho_ml({
                                    heho_ml_api_id : 'ml_infinte_v',
                                    heho_content_id : 'heho-ml-infinte-sidebar-0-'+heho_infinite_pid,
                                    pid : heho_infinite_pid,
                                    mlname : location.hostname,
                                    infinte_num : heho_load_ajax_single_new_count + 1
                                });
                                heho_infinte_mkts({
                                    heho_content_id : 'heho-ml-infinte-sidebar-1-'+heho_infinite_pid,
                                    type : 'google'
                                });
                                // heho_infinte_mkts({
                                //     heho_content_id : 'heho-ml-infinte-sidebar-2-'+heho_infinite_pid,
                                //     type : 'google'
                                // });
                                // console.log('#heho-infinte-' + (heho_load_ajax_single_new_count+1));
                                // $new.find('.post-sidebar').stickySidebar({
                                //     containerSelector: '#heho-infinte-' + (heho_load_ajax_single_new_count+1),
                                //     topSpacing: 20,
                                //     bottomSpacing: 20
                                // });
                                $new.find('.post-sidebar #secondary').stick_in_parent({
                                    parent: $('#heho-infinte-' + (heho_load_ajax_single_new_count+1) ),
                                    bottoming: !0,
                                    spacer: !1,
                                    offset_top: $('#header').height() + 10
                                });
                            }else{
                                $new.find('.post-sidebar').remove();
                            }

                            let push_obj = {};
                            if (heho_window_history_initial) {
                                push_obj = {
                                    prev: window.location.href,
                                    next: '',
                                    offset: 0,
                                    prev_title: window.document.title,
                                    next_title: window.document.title
                                };
                                window.history.pushState(push_obj, '', window.location.href);
                                heho_window_history_initial = false;
                            }
                            if (page_url != window.location) {
                                heho_pushes_up++;
                                heho_pushes_down++;
                                let next_title = $this_div.find('title').text();                                
                                
                                //ga customer
                                let published_time = $this_div.find('time.entry-date.published').text();
                                let ga_cust = {
                                    author : $this_div.find('.meta-author > a').text(),                            
                                    pym : published_time.substring(0,7),
                                    pymd : published_time,
                                    send : false
                                };
                                
                                h_offset = h_offset + $('#heho-infinte-' + heho_load_ajax_single_new_count ).height();
                                push_obj = {
                                    prev: start_url,
                                    next: page_url,
                                    // h_offset: $(window).scrollTop() + tmp_hight,
                                    offset: h_offset - $(window).height()/2 -$('#header').height(),
                                    prev_title: prev_title,
                                    next_title: next_title,
                                    ga_cust : ga_cust,
                                    pv_log : {
                                        prev :{                                            
                                            title: ($('meta[property="og:title"]').attr('content')==undefined)? document.title:$('meta[property="og:title"]').attr('content'),
                                            url: ($('meta[property="og:url"]').attr('content')==undefined)? document.URL:$('meta[property="og:url"]').attr('content'),
                                            desc: ($('meta[property="og:description"]').attr('content')==undefined)? '':$('meta[property="og:description"]').attr('content'),
                                            app : heho_infinte_app
                                        },
                                        next : {
                                            title: ($this_div.find('meta[property="og:title"]').attr('content')==undefined)? $this_div.find('title').text():$this_div.find('meta[property="og:title"]').attr('content'),
                                            url: ($this_div.find('meta[property="og:url"]').attr('content')==undefined)? page_url:$this_div.find('meta[property="og:url"]').attr('content'),
                                            desc: ($this_div.find('meta[property="og:description"]').attr('content')==undefined)? '':$this_div.find('meta[property="og:description"]').attr('content'),
                                            app : heho_infinte_app
                                        }
                                    }
                                };

                                heho_url_pushes.push(push_obj);
                                window.document.title = next_title;
                                window.history.pushState(push_obj, '', page_url);                                
                            }
                            heho_load_ajax_single_new_count++;                            
                        });
                    }
                }
            });
        }
        
        function heho_infinte_ga_send(ga_cust ,infinte_num) {
            // console.log(ga_cust);
            window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;            
            ga('set', 'dimension1', ga_cust.author);
            ga('set', 'dimension2', ga_cust.pym); 
            ga('set', 'dimension3', ga_cust.pymd);
            ga('set', 'dimension5', 'infinte-'+infinte_num);
            ga('send', 'pageview'); 
        }
        
        function heho_infinte_ga_mkts(ads_obj) {
            if(heho_alert_18) {       
                return;
            }
            // console.log('heho_infinte_ga_mkts');
            let section = '<div class="large-9 col">';
            let google_ad = '<ins class="adsbygoogle" style="display:block" data-ad-format="autorelaxed" data-ad-client="ca-pub-5693807149055825" data-matched-content-rows-num="4,2" data-matched-content-columns-num="2,4"	 data-matched-content-ui-type="image_stacked,image_stacked" data-ad-slot="1301406986"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>';
            // let google_ad = '<ins class="adsbygoogle" style="display:block" data-ad-format="autorelaxed"  data-ad-client="ca-pub-5693807149055825" data-matched-content-rows-num="2,1" data-matched-content-columns-num="2,4" data-matched-content-ui-type="image_stacked,image_stacked"  data-ad-slot="1301406986"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>';
            // let dable_ad = "<div id='dablewidget_zlvQzM78' data-widget_id='zlvQzM78'><script>(function(d,a,b,l,e,_) {if(d[b]&&d[b].q)return;d[b]=function(){(d[b].q=d[b].q||[]).push(arguments)};e=a.createElement(l);e.async=1;e.charset='utf-8';e.src='//static.dable.io/dist/plugin.min.js';_=a.getElementsByTagName(l)[0];_.parentNode.insertBefore(e,_);})(window,document,'dable','script');dable('renderWidget', 'dablewidget_zlvQzM78');</script></div>";
            // dable_ad = '';
            let popin_ad = "<div class='_popIn_recommend' data-url='"+ads_obj.page_url+"'></div>"
                + "<script>(function() {var pa = document.createElement('script'); pa.type = 'text/javascript'; pa.charset = 'utf-8'; pa.async = true;pa.src = window.location.protocol + '//api.popin.cc/searchbox/heho_tw.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(pa, s);})(); </script>";
            
            section = section + popin_ad + google_ad + '</div>';

            let sidebar = '<div class="post-sidebar large-3 col"><div id="secondary" class="widget-area" role="complementary" style="">'
            let google_ad_2 ='<ins class="adsbygoogle" style="display: block;" data-ad-client="ca-pub-5693807149055825" data-ad-slot="7581808135" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>';
            sidebar = sidebar + google_ad_2 + '</div></div>';

            $('#content').append('<div class="row row-large heho_infinte_ga_mkts">' + section + sidebar +'</div');            
        }
        function heho_infinte_meta(pv_current) {
            page_current.title = pv_current.title;
            page_current.url = pv_current.url;
            page_current.desc = pv_current.desc;
            $('meta[property="og:title"]').attr('content',pv_current.title);
            $('meta[property="og:url"]').attr('content',pv_current.url);
            $('meta[property="og:description"]').attr('content',pv_current.desc);
        }
        
        //sidebar
        function heho_infinte_mkts(ads_obj) {
            if(heho_alert_18) {       
                return;
            }
            let str ='';
            switch (ads_obj.type) {
                case 'google' :
                    // str = '<ins class="adsbygoogle" style="display: block;" data-ad-format="fluid" data-ad-layout-key="-6t+ed+2i-1n-4w" data-ad-client="ca-pub-5693807149055825" data-ad-slot="6935522134"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>';
                    str = '<ins class="adsbygoogle" style="display:block" data-ad-format="autorelaxed" data-ad-client="ca-pub-5693807149055825" data-matched-content-rows-num="2,2" data-matched-content-columns-num="1,1"	 data-matched-content-ui-type="image_stacked,image_stacked" data-ad-slot="1301406986"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>';
                break;
                case 'dabel' :
                    str = "<div id='dablewidget_3709wylx' data-widget_id='3709wylx'><script>(function(d,a,b,l,e,_) {if(d[b]&&d[b].q)return;d[b]=function(){(d[b].q=d[b].q||[]).push(arguments)};e=a.createElement(l);e.async=1;e.charset='utf-8';e.src='//static.dable.io/dist/plugin.min.js';_=a.getElementsByTagName(l)[0];_.parentNode.insertBefore(e,_);})(window,document,'dable','script');dable('renderWidget', 'dablewidget_3709wylx');</script></div>";
                break;
            }
            $('#'+ads_obj.heho_content_id).append(str);
        }
        function heho_infinte_ga_post(ads_obj) {
            if(heho_alert_18) {       
                return;
            }
            let str = '<ins class="adsbygoogle" style="display:block" data-ad-format="autorelaxed" data-ad-client="ca-pub-5693807149055825" data-matched-content-rows-num="2,1" data-matched-content-columns-num="2,4" data-matched-content-ui-type="image_stacked,image_stacked" data-ad-slot="1301406986"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>';     
            $('#'+ads_obj.heho_content_id).append(str);
        }
        function heho_infinte_dable(ads_obj) {
            let str = "<div id='dablewidget_zlvQzM78"+ads_obj.dable_id+"' data-widget_id='zlvQzM78'><script>"
                + "dable('sendLog', 'view', '"+ads_obj.pid+"');"
                + "(function(d,a,b,l,e,_) {if(d[b]&&d[b].q)return;d[b]=function(){(d[b].q=d[b].q||[]).push(arguments)};e=a.createElement(l);e.async=1;e.charset='utf-8';e.src='//static.dable.io/dist/plugin.min.js';_=a.getElementsByTagName(l)[0];_.parentNode.insertBefore(e,_);})(window,document,'dable','script');dable('renderWidget', 'dablewidget_zlvQzM78"+ads_obj.dable_id+"');</script></div>";
            $('#'+ads_obj.heho_content_id).append(str);
        }
        function heho_infinte_popIn(ads_obj) {
            let str = "<div class='_popIn_recommend' data-url='"+ads_obj.page_url+"'></div>"
                + "<script>(function() {var pa = document.createElement('script'); pa.type = 'text/javascript'; pa.charset = 'utf-8'; pa.async = true;pa.src = window.location.protocol + '//api.popin.cc/searchbox/heho_tw.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(pa, s);})(); </script>";
            $('#'+ads_obj.heho_content_id).append(str);
        }

        //lazy load image
        function heho_onEnterView(entries, observer) {
            for (let entry of entries) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if(typeof img.dataset.src !='undefined' && img.dataset.src!='') {
                        img.setAttribute('src', img.dataset.src);
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            }
        }
    }); 
})(jQuery);