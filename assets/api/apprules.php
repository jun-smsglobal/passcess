<?php
/**
 * a simple script to add, edit, delete - app group name
 * @author HONESTO GO JR
 **/

	// error_reporting(E_ALL);
	error_reporting(0);

  $txt_action = "";
  $txt_id = "";
	$txt_ruleid = "";
	$txt_ipset = "";
	$txt_domain = "";
	$txt_feature = "";
	$txt_stat = "";

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

	if (isset($_POST["ruleid"])) {
		$txt_ruleid = urldecode($_POST["ruleid"]);
	} else if (isset($_GET["ruleid"])) {
		$txt_ruleid = urldecode($_GET["ruleid"]);
	}

	if (isset($_POST["ipset"])) {
		$txt_ipset = urldecode($_POST["ipset"]);
	} else if (isset($_GET["ipset"])) {
		$txt_ipset = urldecode($_GET["ipset"]);
	}

	if (isset($_POST["domain"])) {
		$txt_domain = urldecode($_POST["domain"]);
	} else if (isset($_GET["domain"])) {
		$txt_domain = urldecode($_GET["domain"]);
	}

	if (isset($_POST["feature"])) {
		$txt_feature = urldecode($_POST["feature"]);
	} else if (isset($_GET["feature"])) {
		$txt_feature = urldecode($_GET["feature"]);
	}

	if (isset($_POST["stat"])) {
		$txt_stat = urldecode($_POST["stat"]);
	} else if (isset($_GET["stat"])) {
		$txt_stat = urldecode($_GET["stat"]);
	}
	//localhost/passcess/api/apprules?action=getapp&data=&id=0
	log_msg( (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );

	header("Access-Control-Allow-Origin: *");
	header("Content-type:application/json;charset=utf-8");

	if ($txt_action == "") {
    $result = array('error'=>true, 'message'=>"Permission denied");
		log_msg(json_encode($result));
		echo json_encode($result);
		exit;
	}
  if ($txt_id == "") {
    $txt_id = 99;
  }
	if ($txt_ruleid == "") {
    $txt_ruleid = 0;
  }
	if ($txt_stat == "") {
    $txt_stat = 0;
  }

	//connect to database
	$conn = dbConnection("127.0.0.1", "root", "root", "radius", "3306");
	//$conn = dbConnection("passcess-aws-db.c151ulpsxq5f.ap-southeast-1.rds.amazonaws.com", "tutorial_user", "SmsGlobalCovid19", "radius", "3306");

  $result = array('error'=>false);

  if($txt_action == 'getapp'){
    $appdata = array();
    $myQ = "CALL sp_app_names('1'," . $txt_id . ",'" . $txt_data . "');" ;
	  log_msg( $myQ );
	  $res = mysqli_query($conn, $myQ) ;
	  if ($res == true) {
      while ($row = mysqli_fetch_assoc($res)) {
        array_push($appdata, $row);
      }
      $result['appname'] = $appdata;
	  } else {
      $result = array('error'=>true, 'message'=>"No data");
    }
  }

  if($txt_action == 'getapprules'){
    $appdata = array();

    if ($txt_id == 0) {
			$myQ = "CALL sp_app_rules('1',". $txt_ruleid . "," . $txt_id . ",'" . $txt_ipset . "','" . $txt_domain . "','" . $txt_feature . "'," . $txt_stat . ");" ;
    } else {
			$myQ = "CALL sp_app_rules('2',". $txt_ruleid . "," . $txt_id . ",'" . $txt_ipset . "','" . $txt_domain . "','" . $txt_feature . "'," . $txt_stat . ");" ;
    }

	  log_msg( $myQ );
	  $res = mysqli_query($conn, $myQ) ;
	  if ($res == true) {
      while ($row = mysqli_fetch_assoc($res)) {
        array_push($appdata, $row);
      }
      $result['apprules'] = $appdata;
	  } else {
      $result = array('error'=>true, 'message'=>"No data");
    }
  }

	if($txt_action == 'addapprules'){
    $appdata = array();
    $myQ = "CALL sp_app_rules('11',". $txt_ruleid . "," . $txt_id . ",'" . $txt_ipset . "','" . $txt_domain . "','" . $txt_feature . "'," . $txt_stat . ");" ;
	  log_msg( $myQ );
	  $res = mysqli_query($conn, $myQ) ;
	  if ($res == true) {
      $result = array('error'=>false, 'message'=>'App ID : ' . $txt_id);
	  } else {
			$result = array('error'=>true, 'message'=>'Failed to add app rules.');
    }
  }

	if($txt_action == 'updateapprules'){
    $appdata = array();
    $myQ = "CALL sp_app_rules('12',". $txt_ruleid . "," . $txt_id . ",'" . $txt_ipset . "','" . $txt_domain . "','" . $txt_feature . "'," . $txt_stat . ");" ;
	  log_msg( $myQ );
	  $res = mysqli_query($conn, $myQ) ;
	  if ($res == true) {
      $result = array('error'=>false, 'message'=>'App ID : ' . $txt_id);
	  } else {
			$result = array('error'=>true, 'message'=>'Failed to update app rules.');
    }
  }

	if($txt_action == 'delapprules'){
    $appdata = array();
		$myQ = "CALL sp_app_rules('13',". $txt_ruleid . "," . $txt_id . ",'" . $txt_ipset . "','" . $txt_domain . "','" . $txt_feature . "'," . $txt_stat . ");" ;
	  log_msg( $myQ );
	  $res = mysqli_query($conn, $myQ) ;
	  if ($res == true) {
      $result = array('error'=>false, 'message'=>'App ID : ' . $txt_id);
	  } else {
			$result = array('error'=>true, 'message'=>'Failed to delete app rules.');
    }
  }

	echo json_encode($result);

	mysqli_close($conn);

	unset($myQ);
	unset($result);

	unset($txt_action);
	unset($txt_proc);
	exit;

	//connect to database
	function dbConnection($dbconn, $dbuser, $dbpass, $dbname, $dbport)
	{
		$myconn = mysqli_connect($dbconn, $dbuser, $dbpass, $dbname,  $dbport);
		// Check connection
		if (!$myconn) {
      $result = array('error'=>true, 'message'=>"Connection Failed!" . mysqli_connect_error());
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
		file_put_contents ("./log/appruless_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
	}

?>
