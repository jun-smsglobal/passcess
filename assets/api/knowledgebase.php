<?php
/**
 * a simple script to for knowledge base
 * @author HONESTO GO JR
 **/

 //error_reporting(E_ALL);
 error_reporting(0);

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
    $proc = $_GET['action'];
  }else{
    $proc = $_POST['action'];
  }

  if (isset($_GET['proc'])) {
    $txt_proc = $_GET['proc'];
  }else{
    $txt_proc = $_POST['proc'];
  }

  if (isset($_GET['id'])) {
    $txt_id = $_GET['id'];
  }else{
    $txt_id = $_POST['id'];
  }

  if($proc == 'search'){
    log_msg("CALL 2GoDB.search_knowledgebase('" . $txt_proc . "','". $txt_id . "');");
    $sqluser = $conn->query("CALL 2GoDB.search_knowledgebase('" . $txt_proc . "','". $txt_id . "');");
    $kbdata = array();
    while($row = $sqluser->fetch_assoc()){
      // if($txt_proc >= '3') {
        array_push($kbdata, $row);
      // } else {
        // array_push($kbdata, $row['rootid'], array($row['catid']=>$row['catdesc']) );
        // array_push($kbdata, $row['rootdesc'], array($row['catdesc'], array($row['catid'], $row['cattype']) ) );
      // }
    }
    $result['knowledgebasedata'] = $kbdata;
  }

  if ($proc == 'create'){
    $inServiceDesc = $_POST['servicedesc'];
    $inSericeValue = $_POST['servicevalue'];

    log_msg("INSERT INTO 2GoDB.service_watchdog(servicedesc, servicevalue) VALUES('$inServiceDesc','$inSericeValue')");
    $sql = $conn->query("INSERT INTO 2GoDB.service_watchdog(servicedesc, servicevalue) VALUES('$inServiceDesc','$inSericeValue')");
    if ($sql){
        $result = array('error'=>false, 'message'=>'Service name : ' . $inServiceDesc);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to add service.');
    }
  }

  if ($proc == 'update'){
    $inID = $_POST['serviceid'];
    $inServiceDesc = $_POST['servicedesc'];
    $inSericeValue = $_POST['servicevalue'];
    log_msg("UPDATE 2GoDB.service_watchdog SET servicedesc='$inServiceDesc', servicevalue='$inSericeValue' WHERE serviceid = '$inID'");
    $sql = $conn->query("UPDATE 2GoDB.service_watchdog SET servicedesc='$inServiceDesc', servicevalue='$inSericeValue' WHERE serviceid = '$inID'");

    if ($sql){
      $result = array('error'=>false, 'message'=>'Service name : ' . $inServiceDesc);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to update service.');
    }
  }

  if ($proc == 'delete'){
    $inID = $_POST['serviceid'];
    log_msg("DELETE FROM 2GoDB.service_watchdog WHERE serviceid = '$inID'");
    $sql = $conn->query("DELETE FROM 2GoDB.service_watchdog WHERE serviceid = '$inID'");

    if ($sql){
      $result = array('error'=>false, 'message'=>'Fleet id :' . $inID);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to delete service.');
    }
  }

  $conn->close();
  echo json_encode($result);


  function log_msg($msg_content)
  {
    chdir(dirname(__FILE__));

    $tmp_data = date("g:i a") . " : ";
    $tmp_data .= $msg_content . "\r\n";
    file_put_contents ("./log/kb_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
  }

?>
