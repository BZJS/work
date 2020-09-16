<?php
 
    if(isset($_POST['password'])){
        $password = $_POST['password'];
        if($password=="123456"){
            setcookie("hduser" ,"gzhd2019", time()+3600*24);
            $url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
            header("Location: {$url}"); 
        }
        echo ' <script>alert("密码错误") </script><form method="post"> 请输入密码：<input type="password" name="password"><input type="submit"></form>  ';
        exit();
    }
    if(!isset( $_COOKIE["hduser"])){  
        echo '<form method="post"> 请输入密码：<input type="password" name="password"><input type="submit"></form> ';
        exit();
    }

?>

    <table width="1200" border="1" cellspacing="0">
    <style>
        td { width: 14%; text-align: center; }
        a:visited { color: blue;}
        input[type="text"]{
            color:blue;
            text-align:center;
        }
    </style>
    <tbody>
        <tr>
            <th>状态</th><th> 客服名称</th><th>line跳转链接</th><th>微信或Line号</th><th>显示次数</th><th>显示总数</th><th>操作</th>
        </tr>
        <tr>
        <form method="get" name="add-form"> 
            <td></td>
                <td>
                    <input type="text" name="add-name"  required>
                </td>
                <td>
                    <input type="text" name="add-line"  required>
                </td>
                <td>
                    <input type="text" name="add-wx"  required>
                </td>
                <td>
                    <input type="text" name="add-display"  required value="0"  pattern="^0$|^[1-9][0-9]*">
                </td>
                <td>
                    <input type="number" value="0" disabled>
                </td>
                <td>
                    <input type="hidden" value="add" name="action">
                    <input type="submit" value="添加">
                </td>
                </form>
        </tr>
<?php
// 添加客服
   if(isset($_GET["action"]) && $_GET["action"]=="add"){
        $data =  file_get_contents("data.dat");
        $data =  json_decode($data);
        $newkf = array();
        $newkf['name'] =  $_GET["add-name"]? $_GET["add-name"]:'';
        $newkf['line'] =  $_GET["add-line"] ?  $_GET["add-line"]:'';
        $newkf['wx'] =  $_GET["add-wx"] ? $_GET["add-wx"]:'';
        $newkf['display'] =  $_GET["add-display"] ;
        $newkf['status'] =  1;
        $newkf['visit'] =  0;        
        // array_push($data,$newkf);
        $data[] = $newkf;
        $data = json_encode($data);
        file_put_contents("data.dat",$data);
        $url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
        header("Location: {$url}");
}
//删除客服
    if(isset($_GET["action"]) && $_GET["action"]=="del"){
    
        $data =  file_get_contents("data.dat");
        $data =  json_decode($data); 
        if (count($data)>1){
            array_splice($data, $_GET["id"], 1);
            // unset($data[$_GET['id']]); unset后变关联数组，json化成js对象会导致其他操作出错
            $data = json_encode($data);
            file_put_contents("data.dat",$data);
            $url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
            header("Location: {$url}");
        } else{
            echo "<script>alert('至少要有一个客服');location.href = 'http://'+location.hostname+location.pathname; </script>";
        }
    }
 //设置客服上线
    if(isset($_GET["action"]) && $_GET["action"]=="online"){
        $data =  file_get_contents("data.dat");
        $data =  json_decode($data); 
        $data[$_GET["id"]]->status = 1;
        $data = json_encode($data);
        file_put_contents("data.dat",$data);
        $url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
        header("Location: {$url}");
    }

    //设置客服下线
    if(isset($_GET["action"]) && $_GET["action"]=="offline"){
        $data =  file_get_contents("data.dat");
        $data =  json_decode($data); 
        $data[$_GET["id"]]->status = 0;
        $data = json_encode($data);
        file_put_contents("data.dat",$data);
        $url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
        header("Location: {$url}");
    }

    //设置为可编辑状态
    if(isset($_GET["action"]) && $_GET["action"]=="to_edit"){
        $to_edit_id = $_GET["id"];    
        $url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
    }

 //提交编辑更改
    if(isset($_GET["action"]) && $_GET["action"]=="edit"){
        $data =  file_get_contents("data.dat");
        $data =  json_decode($data);
        $data[$_GET["id"]]->name = $_GET["edit-name"];
        $data[$_GET["id"]]->wx = $_GET["edit-wx"];
        $data[$_GET["id"]]->line = $_GET["edit-line"];
        $data[$_GET["id"]]->display = $_GET["edit-display"];
        $data = json_encode($data);
        file_put_contents("data.dat",$data);
        $url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
        header("Location: {$url}");
}

    $data =  file_get_contents("data.dat");
    $data =  json_decode($data);
    
    foreach($data as $k=>$v){
        if($v->status){
            $online =  "<a href='min.php?action=offline&id={$k}' >上线</a>";
        }else{
            $online =  "<a href='min.php?action=online&id={$k}' style='color:red'>下线</a>";
        }
        $del =  "<a href='min.php?action=del&id={$k}'>删除</a>"; 
        $to_edit = "<a href='min.php?action=to_edit&id={$k}'>编辑</a>";

        if(isset($to_edit_id)&& $k == $to_edit_id ){
            echo "<tr>   <form method='get' name='edit-form'> <td></td> <td> <input type='text' name='edit-name' required value='{$v->name}'></td> <td> <input type='text' name='edit-line' required value='{$v->line}'> </td> <td> <input type='text' name='edit-wx' value='{$v->wx}' required> </td> <td> <input type='text' value='{$v->display}' name = 'edit-display' pattern='^0$|^[1-9][0-9]*'></td><td> <input type='number' value='{$v->visit}' disabled> </td> <td> <input type='hidden' value='edit' name='action'> <input type='hidden' value='{$k}' name='id'><input type='submit' value='确定'> </td></form> </tr>";
        }else{
            echo "<tr><td>{$online}</td><td>{$v->name}</td><td>{$v->line}</td><td>{$v->wx}</td><td>{$v->display}</td><td>{$v->visit}</td><td> {$to_edit} </td></tr>";
        }       
    }   
?>

        <tbody>
    </table>
