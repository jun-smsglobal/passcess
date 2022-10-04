<?php
/**
 * a simple script to check all users data
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
    $sql = $conn->query("SELECT *, fn_get_info('8', vessel_partner) AS partnername FROM user_account");
    $userdata = array();
    while($row = $sql->fetch_assoc()){
      array_push($userdata, $row);
    }
    $result['users'] = $userdata;
  }

  if($proc == 'search'){
    // $inUserID = $_POST['searchid'];
    if (isset($_GET['searchid'])) {
      $inUserID = $_GET['searchid'];
    }else{
      $inUserID = $_POST['searchid'];
    }
    log_msg("SELECT * FROM user_account WHERE username like '%" . $inUserID . "%'");
    $sqluser = $conn->query("SELECT * FROM user_account WHERE username like '%" . $inUserID . "%'");
    $userdata = array();
    while($row = $sqluser->fetch_assoc()){
      array_push($userdata, $row);
    }
    $result['users'] = $userdata;
  }

  if ($proc == 'create'){
    $inUsername = $_POST['username'];
    $inUserpass = $_POST['userpass'];
    $inRights = $_POST['rights'];
    $inAccess = $_POST['access'];
    $inPartner = $_POST['vessel_partner'];

    log_msg("INSERT INTO user_account(username, userpass, rights, access, active, vessel_partner) VALUES('$inUsername','$inUserpass',$inRights,'$inAccess',1,'$inPartner')");
    $sql = $conn->query("INSERT INTO user_account(username, userpass, rights, access, active, vessel_partner) VALUES('$inUsername','$inUserpass',$inRights,'$inAccess',1,'$inPartner')");
    if ($sql){
        $result = array('error'=>false, 'message'=>'Username : ' . $inUsername);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to add user.');
    }
  }

  if ($proc == 'update'){
    $inID = $_POST['userid'];
    $inUsername = $_POST['username'];
    $inUserpass = $_POST['userpass'];
    $inRights = $_POST['rights'];
    $inAccess = $_POST['access'];
    $inActive = $_POST['active'];
    $inPartner = $_POST['vessel_partner'];
    log_msg("UPDATE user_account SET username='$inUsername', userpass='$inUserpass', rights= $inRights, access='$inAccess', active=$inActive, vessel_partner='$inPartner' WHERE userid = '$inID'");
    $sql = $conn->query("UPDATE user_account SET username='$inUsername', userpass='$inUserpass', rights= $inRights, access='$inAccess', active=$inActive, vessel_partner='$inPartner' WHERE userid = '$inID'");

    if ($sql){
      $result = array('error'=>false, 'message'=>'Username : ' . $inUsername);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to update user.');
    }
  }

  if ($proc == 'delete'){
    $inID = $_POST['userid'];
    log_msg("DELETE FROM user_account WHERE userid = '$inID'");
    $sql = $conn->query("DELETE FROM user_account WHERE userid = '$inID'");

    if ($sql){
      $result = array('error'=>false, 'message'=>'UserID : ' . $inID);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to delete user account.');
    }
  }

  if ($proc == 'deactivate'){
    $inID = $_POST['userid'];
    log_msg("UPDATE user_account SET active=0 WHERE userid = '$inID'");
    $sql = $conn->query("UPDATE user_account SET active=0 WHERE userid = '$inID'");

    if ($sql){
      $result = array('error'=>false, 'message'=>'UserID : ' . $inID);
    } else {
      $result = array('error'=>true, 'message'=>'Failed to deactivate user.');
    }
  }

  $conn->close();
  echo json_encode($result);


  function log_msg($msg_content)
  {
    chdir(dirname(__FILE__));

    $tmp_data = date("g:i a") . " : ";
    $tmp_data .= $msg_content . "\r\n";
    file_put_contents ("./log/usermngt_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
  }

?>
