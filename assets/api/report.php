<?php
/**
 * a simple script to get all partner, fleet and vessels
 * @author HONESTO GO JR
 **/

	// error_reporting(E_ALL);
	error_reporting(0);


  $txt_action = "";
  $txt_id = "";

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

	//http://localhost/passcess/assets/api/report.php?action=getvesselinfo&id=1593751199565255

	log_msg( (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );

	header("Access-Control-Allow-Origin: *");
	header("Content-type:application/json;charset=utf-8");

  $result = array();
	if ($txt_action == "") {
		log_msg("Invalid Parameter.");
		exit;
	}

	//connect to database
	$conn = dbConnection("127.0.0.1", "root", "root", "radius", "3306");
	//$conn = dbConnection("passcess-aws-db.c151ulpsxq5f.ap-southeast-1.rds.amazonaws.com", "tutorial_user", "SmsGlobalCovid19", "radius", "3306");

  if($txt_action == 'getvesselinfo'){
    $myQ = "CALL sp_report_vessel('" . $txt_id ."');" ;
	  log_msg( $myQ );
	  $res = mysqli_query($conn, $myQ) ;
	  if ($res == true) {
      while ($row = mysqli_fetch_assoc($res)) {
        array_push($result, $row);
      }
    }
  }

	echo json_encode($result);

	mysqli_close($conn);

	unset($myQ);
	unset($result);

	unset($txt_action);
	unset($txt_id);
	exit;

	//connect to database
	function dbConnection($dbconn, $dbuser, $dbpass, $dbname, $dbport)
	{
		$myconn = mysqli_connect($dbconn, $dbuser, $dbpass, $dbname,  $dbport);
		// Check connection
		if (!$myconn) {
      log_msg("Connection failed. " . mysqli_connect_error() );
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
		file_put_contents ("./log/report_vessel_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
	}

?>
