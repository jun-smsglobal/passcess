<?php
/**
 * a simple script to check all fleet data
 * @author HONESTO GO JR
 **/

 //error_reporting(E_ALL);
 error_reporting(0);
 set_time_limit(0);

 header("Access-Control-Allow-Origin: *");
 header("Content-type:application/json;charset=utf-8");

 log_msg( (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );


  $conn = new mysqli("127.0.0.1", "root", "root", "radius", "3306");
  // $conn = new mysqli("passcess-aws-db.c151ulpsxq5f.ap-southeast-1.rds.amazonaws.com", "tutorial_user", "SmsGlobalCovid19", "radius", "3306");
  if ($conn->connect_error){
    $result = array('error'=>true, 'message'=>"Connection Failed!" . $conn->connect_error);
    echo json_encode($result);
    die("Connection Failed!" . $conn->connect_error);
  }

  $result = array('error'=>false);
  $proc = '';

  if (isset($_GET['action'])) {
    $txt_action = $_GET['action'];
  }else{
    $txt_action = $_POST['action'];
  }
  if (isset($_GET['proc'])) {
    $txt_proc = $_GET['proc'];
  }else{
    $txt_proc = $_POST['proc'];
  }

  if($txt_action == 'alldate'){
    $sql = $conn->query("CALL radius.sp_search_date('" . $txt_proc .  "') ;");
    $alldata = array();
    while($row = $sql->fetch_assoc()){
      array_push($alldata, $row);
    }
    $result['alldate'] = $alldata;
  }

  $conn->close();
  echo json_encode($result);

  function log_msg($msg_content)
  {
    chdir(dirname(__FILE__));

    $tmp_data = date("g:i a") . " : ";
    $tmp_data .= $msg_content . "\r\n";
    file_put_contents ("./log/alldate_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
  }

?>
