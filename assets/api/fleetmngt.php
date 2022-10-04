<?php
/**
 * a simple script to check all fleet data
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
    $sql = $conn->query("SELECT *, radius.fn_get_info('8', partnerid) AS partnername FROM 2GoDB.vessel_fleet ;");
    $fleetdata = array();
    while($row = $sql->fetch_assoc()){
      array_push($fleetdata, $row);
    }
    $result['fleet'] = $fleetdata;
  }

  if($proc == 'readall'){
    $sql = $conn->query("SELECT * FROM 2GoDB.vessel_fleet");
    $fleetdata = array();
    while($row = $sql->fetch_assoc()){
      array_push($fleetdata, array($row));
    }
    $result = $fleetdata;
  }

  if($proc == 'readpartner'){
    $sql = $conn->query("SELECT partnerid, partnername FROM 2GoDB.vessel_partner");
    $fleetdata = array();
    while($row = $sql->fetch_assoc()){
      array_push($fleetdata, $row);
    }
    $result['partner'] = $fleetdata;
  }

  if($proc == 'search'){
    if (isset($_GET['searchid'])) {
      $inFleetID = $_GET['searchid'];
    }else{
      $inFleetID = $_POST['searchid'];
    }
    log_msg("SELECT * FROM 2GoDB.vessel_fleet WHERE fleetname like '%" . $inFleetID . "%'");
    $sqluser = $conn->query("SELECT * FROM 2GoDB.vessel_fleet WHERE fleetname like '%" . $inFleetID . "%'");
    $fleetdata = array();
    while($row = $sqluser->fetch_assoc()){
      array_push($fleetdata, $row);
    }
    $result['fleet'] = $fleetdata;
  }

  if ($proc == 'create'){
    $inFleetname = $_POST['fleetname'];
    $inPartnerid = $_POST['partnerid'];

    log_msg("INSERT INTO 2GoDB.vessel_fleet(fleetname, partnerid) VALUES('$inFleetname','$inPartnerid')");
    $sql = $conn->query("INSERT INTO 2GoDB.vessel_fleet(fleetname, partnerid) VALUES('$inFleetname','$inPartnerid')");
    if ($sql){
        $result = array('error'=>false, 'message'=>'Fleet name : ' . $inFleetname);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to add fleet.');
    }
  }

  if ($proc == 'update'){
    $inID = $_POST['fleetid'];
    $inFleetname = $_POST['fleetname'];
    $inPartnerid = $_POST['partnerid'];
    log_msg("UPDATE 2GoDB.vessel_fleet SET fleetname='$inFleetname', partnerid='$inPartnerid' WHERE fleetid = '$inID'");
    $sql = $conn->query("UPDATE 2GoDB.vessel_fleet SET fleetname='$inFleetname', partnerid='$inPartnerid' WHERE fleetid = '$inID'");

    if ($sql){
      $result = array('error'=>false, 'message'=>'Fleet name : ' . $inFleetname);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to update fleet.');
    }
  }

  if ($proc == 'delete'){
    $inID = $_POST['fleetid'];
    log_msg("DELETE FROM 2GoDB.vessel_fleet WHERE fleetid = '$inID'");
    $sql = $conn->query("DELETE FROM 2GoDB.vessel_fleet WHERE fleetid = '$inID'");

    if ($sql){
      $result = array('error'=>false, 'message'=>'Fleet id :' . $inID);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to delete fleet account.');
    }
  }

  $conn->close();
  echo json_encode($result);


  function log_msg($msg_content)
  {
    chdir(dirname(__FILE__));

    $tmp_data = date("g:i a") . " : ";
    $tmp_data .= $msg_content . "\r\n";
    file_put_contents ("./log/fleetmngt_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
  }

?>
