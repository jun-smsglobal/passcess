<?php
/**
 * a simple script to check all partner data
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
    $sql = $conn->query("SELECT * FROM 2GoDB.vessel_partner");
    $partnerdata = array();
    while($row = $sql->fetch_assoc()){
      array_push($partnerdata, $row);
    }
    $result['partner'] = $partnerdata;
  }

  if($proc == 'search'){
    if (isset($_GET['searchid'])) {
      $inPartID = $_GET['searchid'];
    }else{
      $inPartID = $_POST['searchid'];
    }
    log_msg("SELECT * FROM 2GoDB.vessel_partner WHERE partnername like '%" . $inPartID . "%'");
    $sqluser = $conn->query("SELECT * FROM 2GoDB.vessel_partner WHERE partnername like '%" . $inPartID . "%'");
    $partnerdata = array();
    while($row = $sqluser->fetch_assoc()){
      array_push($partnerdata, $row);
    }
    $result['partner'] = $partnerdata;
  }

  if ($proc == 'create'){
    $inPartnername = $_POST['partnername'];
    $inEmailadd = $_POST['emailadd'];
    $inContactno = $_POST['contactno'];

    log_msg("INSERT INTO 2GoDB.vessel_partner(partnername, emailadd, contactno) VALUES('$inPartnername','$inEmailadd','$inContactno')");
    $sql = $conn->query("INSERT INTO 2GoDB.vessel_partner(partnername, emailadd, contactno) VALUES('$inPartnername','$inEmailadd','$inContactno')");
    if ($sql){
        $result = array('error'=>false, 'message'=>'Partner name : ' . $inPartnername);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to add partner.');
    }
  }

  if ($proc == 'update'){
    $inID = $_POST['partnerid'];
    $inPartnername = $_POST['partnername'];
    $inEmailadd = $_POST['emailadd'];
    $inContactno = $_POST['contactno'];
    log_msg("UPDATE 2GoDB.vessel_partner SET partnername='$inPartnername', emailadd='$inEmailadd', contactno='$inContactno' WHERE partnerid = '$inID'");
    $sql = $conn->query("UPDATE 2GoDB.vessel_partner SET partnername='$inPartnername', emailadd='$inEmailadd', contactno='$inContactno' WHERE partnerid = '$inID'");

    if ($sql){
      $result = array('error'=>false, 'message'=>'Partner name : ' . $inPartnername);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to update partner.');
    }
  }

  if ($proc == 'delete'){
    $inID = $_POST['partnerid'];
    log_msg("DELETE FROM 2GoDB.vessel_partner WHERE partnerid = '$inID'");
    $sql = $conn->query("DELETE FROM 2GoDB.vessel_partner WHERE partnerid = '$inID'");

    if ($sql){
      $result = array('error'=>false, 'message'=>'Partner id : ' . $inID);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to delete partner data.');
    }
  }

  $conn->close();
  echo json_encode($result);


  function log_msg($msg_content)
  {
    chdir(dirname(__FILE__));

    $tmp_data = date("g:i a") . " : ";
    $tmp_data .= $msg_content . "\r\n";
    file_put_contents ("./log/partnermngt_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
  }

?>
