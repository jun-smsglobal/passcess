<?php
/**
 * a simple script to get all partner, fleet and vessels
 * @author HONESTO GO JR
 **/

	// error_reporting(E_ALL);
	error_reporting(0);
	set_time_limit(0);

  $txt_action = "";
  $txt_proc = "";

	if (isset($_POST["action"])) {
		$txt_action = urldecode($_POST["action"]);
	} else if (isset($_GET["action"])) {
		$txt_action = urldecode($_GET["action"]);
	}

	if (isset($_POST["proc"])) {
		$txt_proc = urldecode($_POST["proc"]);
	} else if (isset($_GET["proc"])) {
		$txt_proc = urldecode($_GET["proc"]);
	}

	if (isset($_POST["id"])) {
		$txt_id = urldecode($_POST["id"]);
	} else if (isset($_GET["id"])) {
		$txt_id = urldecode($_GET["id"]);
	}

	//http://localhost/passcess/assets/api/vessel.php?action=getvessel&qry=1

	log_msg( (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );

	header("Access-Control-Allow-Origin: *");
	header("Content-type:application/json;charset=utf-8");

	if ($txt_action == "") {
    $result = array('error'=>true, 'message'=>"Permission denied");
		log_msg(json_encode($result));
		echo json_encode($result);
		exit;
	}

	//connect to database
	$conn = dbConnection("127.0.0.1", "root", "root", "radius", "3306");
	//$conn = dbConnection("passcess-aws-db.c151ulpsxq5f.ap-southeast-1.rds.amazonaws.com", "tutorial_user", "SmsGlobalCovid19", "radius", "3306");

  $result = array('error'=>false);

  if($txt_action == 'getvessel'){
    $vesseldata = array();
    $myQ = "CALL sp_search_vessel('" . $txt_proc . "','". $txt_id ."');" ;
	  log_msg( $myQ );
	  $res = mysqli_query($conn, $myQ) ;
	  if ($res == true) {
      while ($row = mysqli_fetch_assoc($res)) {
        array_push($vesseldata, $row);
      }
      $result['vessel'] = $vesseldata;
	  } else {
      $result = array('error'=>true, 'message'=>"No data");
    }
  } elseif ($txt_action == 'validate'){
    $vesseldata = array();
    $myQ = "CALL sp_search_voyage('" . $txt_proc . "','". $txt_id ."');" ;
	  log_msg( $myQ );
	  $res = mysqli_query($conn, $myQ) ;
	  if ($res == true) {
      while ($row = mysqli_fetch_assoc($res)) {
        array_push($vesseldata, $row);
      }
      $result['vessel'] = $vesseldata;
	  } else {
      $result = array('error'=>true, 'message'=>"No data");
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
		file_put_contents ("./log/vessel_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
	}

?>
