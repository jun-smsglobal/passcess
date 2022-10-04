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

  if (isset($_POST["action"])) {
		$proc = ($_POST["action"]);
	} else if (isset($_GET["action"])) {
		$proc = ($_GET["action"]);
	}

  if($proc == 'read'){
    $sql = $conn->query("SELECT * FROM 2GoDB.port_list");
    $appareadata = array();
    while($row = $sql->fetch_assoc()){
      array_push($appareadata, $row);
    }
    $result['apparea'] = $appareadata;
  }

  if($proc == 'search'){
    if (isset($_GET['searchid'])) {
      $inAreaID = $_GET['searchid'];
    }else{
      $inAreaID = $_POST['searchid'];
    }
    log_msg("SELECT * FROM 2GoDB.port_list WHERE portcity like '%" . $inAreaID . "%';");
    $sqluser = $conn->query("SELECT * FROM 2GoDB.port_list WHERE portcity like '%" . $inAreaID . "%';");
    $appareadata = array();
    while($row = $sqluser->fetch_assoc()){
      array_push($appareadata, $row);
    }
    $result['apparea'] = $appareadata;
  }

  if ($proc == 'create'){
    $inAreaCountry = $_POST['portcountry'];
    $inAreaDesc = $_POST['portcity'];
    $inAreaAbbr = $_POST['portcode'];

    log_msg("INSERT INTO 2GoDB.port_list(portcountry, portcity, portcode) VALUES('$inAreaCountry','$inAreaDesc','$inAreaAbbr');");
    $sql = $conn->query("INSERT INTO 2GoDB.port_list(portcountry, portcity, portcode) VALUES('$inAreaCountry','$inAreaDesc','$inAreaAbbr');");
    if ($sql){
        $result = array('error'=>false, 'message'=>'Port Area : ' . $inAreaDesc);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to add port.');
    }
  }

  if ($proc == 'update'){
    $inID = $_POST['portid'];
    $inAreaCountry = $_POST['portcountry'];
    $inAreaDesc = $_POST['portcity'];
    $inAreaAbbr = $_POST['portcode'];
    log_msg("UPDATE 2GoDB.port_list SET portcountry='$inAreaCountry', portcity='$inAreaDesc', portcode='$inAreaAbbr' WHERE portid = '$inID';");
    $sql = $conn->query("UPDATE 2GoDB.port_list SET portcountry='$inAreaCountry', portcity='$inAreaDesc', portcode='$inAreaAbbr' WHERE portid = '$inID';");

    if ($sql){
      $result = array('error'=>false, 'message'=>'Port City : ' . $inAreaDesc);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to update port.');
    }
  }

  if ($proc == 'delete'){
    $inID = $_POST['portid'];
    log_msg("DELETE FROM 2GoDB.port_list WHERE areaid = '$inID'");
    $sql = $conn->query("DELETE FROM 2GoDB.port_list WHERE areaid = '$inID'");

    if ($sql){
      $result = array('error'=>false, 'message'=>'Port ID :' . $inID);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to delete port.');
    }
  }

  $conn->close();
  echo json_encode($result);

  function log_msg($msg_content)
  {
    chdir(dirname(__FILE__));

    $tmp_data = date("g:i a") . " : ";
    $tmp_data .= $msg_content . "\r\n";
    file_put_contents ("./log/phil_port_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
  }

?>
