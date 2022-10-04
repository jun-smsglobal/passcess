<?php
/**
 * a simple script to log all portal users
 * @author HONESTO GO JR
 **/

	// error_reporting(E_ALL);
	error_reporting(0);
	set_time_limit(0);

	$result = array();

	if (isset($_POST["action"])) {
		$txt_action = urldecode($_POST["action"]);
	} else if (isset($_GET["action"])) {
		$txt_action = urldecode($_GET["action"]);
	}

	if (isset($_POST["id"])) {
		$txt_id = urldecode($_POST["id"]);
	} else if (isset($_GET["id"])) {
		$txt_id = urldecode($_GET["id"]);
	}

  if (isset($_POST["msg"])) {
		$txt_msg = urldecode($_POST["msg"]);
	} else if (isset($_GET["msg"])) {
		$txt_msg = urldecode($_GET["msg"]);
	}

  if (isset($_POST["newmsg"])) {
		$txt_newmsg = urldecode($_POST["newmsg"]);
	} else if (isset($_GET["newmsg"])) {
		$txt_newmsg = urldecode($_GET["newmsg"]);
	}

  //localhost/passcess/api/log.php?action=logpage&proc=1&id=" + strName + "&msg=" + strPage )

	header("Access-Control-Allow-Origin: *");
	header("Content-type: application/json;charset=utf-8");
	header("Access-Control-Allow-Headers: *");
	// header("Status: 200");
	// header("HTTP/1.1 200: OK");

	log_msg( (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );

	if ($txt_action == "") {
    $result = array("error"=>true, "code"=>"500");
		log_msg(json_encode($result));
		echo json_encode($result);
	} else {
		//connect to database
		$conn = dbConnection("127.0.0.1", "root", "root", "radius", "3306");
		// $conn = dbConnection("passcess-aws-db.c151ulpsxq5f.ap-southeast-1.rds.amazonaws.com", "tutorial_user", "SmsGlobalCovid19", "radius", "3306");

	  // $result = array("error"=>false);
	  if($txt_action == 'logpage'){
	    $vesseldata = array();
	    $myQ = "CALL sp_log_page('" . $txt_id . "','". $txt_msg ."');" ;
		  log_msg( $myQ );
		  $res = mysqli_query($conn, $myQ) ;
		  if ($res == true) {
	      $result = array("error"=>false, "code"=>"200");
		  } else {
	      $result = array("error"=>true, "code"=>"500");
	    }
	  }

	  if($txt_action == 'logupdate'){
	    $vesseldata = array();
	    $myQ = "CALL sp_log_update('" . $txt_id . "','". $txt_msg . "','". $txt_newmsg ."');" ;
		  log_msg( $myQ );
		  $res = mysqli_query($conn, $myQ) ;
		  if ($res == true) {
	      $result = array("error"=>false, "code"=>"200");
		  } else {
	      $result = array("error"=>true, "code"=>"500");
	    }
	  }
	}

	if (($result == "") || ($result == null)) {
		$result =  array("error"=>true, "code"=>500) ;
		log_msg( json_encode($result));
	}

	// http_response_code(200);
	echo json_encode($result);

	mysqli_close($conn);

	unset($myQ);
	unset($result);

	unset($txt_action);
  unset($txt_id);
	unset($txt_msg);
	// exit;

	//connect to database
	function dbConnection($dbconn, $dbuser, $dbpass, $dbname, $dbport)
	{
		$myconn = mysqli_connect($dbconn, $dbuser, $dbpass, $dbname,  $dbport);
		// Check connection
		if (!$myconn) {
      $result = array("error"=>true, "code"=>"500");
      log_msg("Connection failed. " . mysqli_connect_error() );
      echo json_encode($result);
			die(mysqli_connect_error());
		}

		return $myconn;
	}

	// log transaction
	function log_msg($msg_content)
	{
		chdir(dirname(__FILE__));

    $tmp_data = date("g:i a") . " : ";
    $tmp_data .= $msg_content . "\r\n";
		file_put_contents ("./log/logdata_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
	}

?>
