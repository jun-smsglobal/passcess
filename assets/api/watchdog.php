<?php
/**
 * a simple script to check all service watchdog data
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

  if($proc == 'read'){
    $sql = $conn->query("SELECT * FROM 2GoDB.service_watchdog");
    $appservicedata = array();
    while($row = $sql->fetch_assoc()){
      array_push($appservicedata, $row);
    }
    $result['appservice'] = $appservicedata;
  }

  if($proc == 'search'){
    if (isset($_GET['searchid'])) {
      $inServiceID = $_GET['searchid'];
    }else{
      $inServiceID = $_POST['searchid'];
    }
    log_msg("SELECT * FROM 2GoDB.service_watchdog WHERE servicedesc like '%" . $inServiceID . "%'");
    $sqluser = $conn->query("SELECT * FROM 2GoDB.service_watchdog WHERE servicedesc like '%" . $inServiceID . "%'");
    $appservicedata = array();
    while($row = $sqluser->fetch_assoc()){
      array_push($appservicedata, $row);
    }
    $result['appservice'] = $appservicedata;
  }

  if($proc == 'allservice'){
    log_msg("SELECT servicedesc, servicevalue FROM 2GoDB.service_watchdog");
    $sqluser = $conn->query("SELECT servicedesc, servicevalue FROM 2GoDB.service_watchdog");
    $appservicedata = array();
    while($row = $sqluser->fetch_assoc()){
        $appservicedata += array($row['servicedesc']=>$row['servicevalue']);
    }
    $result['appservice'] = $appservicedata;
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
      $result = array('error'=>false, 'message'=>'Service ID :' . $inID);
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
    file_put_contents ("./log/service_watchdog_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
  }

?>
