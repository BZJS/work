<?php
     
    if(isset($_COOKIE["gzhd_wx"])){
        $wx = $_COOKIE["gzhd_wx"];
        $js_url = $_COOKIE["js_url"];
    
    }
    else{
        $data = file_get_contents("data.dat");
        $data = json_decode($data);
        $data_online_arr = array();
        $data_online_display_arr = array();
        foreach($data as $k=>$v){
            if($v->status==1){
             // array_push($data_online_arr,$v);
             // array_push($data_online_display_arr,$v->display);
                $data_online_arr[] = $v;
                $data_online_display_arr[] = $v->display;

            }
        }
       $min_val_key = array_search(min($data_online_display_arr),$data_online_display_arr);
       if (false !== $min_val_key ) {
            $kf = $data_online_arr[$min_val_key];
            $wx =  $kf->wx;
            $js_url = $kf->line;
            $kf->visit =  $kf->visit + 1;
            $kf->display =  $kf->display + 1;        
            $data = json_encode($data);
            $file = fopen('log.txt','w');
            if (flock($file, LOCK_EX)){
                file_put_contents("data.dat",$data);
                flock($file, LOCK_UN);
                fclose($file);
            }            
        }
        setcookie("gzhd_wx" ,$wx, time()+3600*12);
        setcookie("js_url" ,$js_url, time()+3600*12);
    }
    echo "var js_url = '{$js_url}';var wx = '{$wx}';document.querySelectorAll(\"[name='notweixin']\").forEach((el)=>{ el.innerHTML = '{$wx}'; })"
 

?>

