<?php
/**
 * a simple script to get all info from voucher
 * @author HONESTO GO JR
 **/

	error_reporting(E_ALL);
	// error_reporting(0);


	if (isset($_POST["from"])) {
		$txt_from = urldecode($_POST["from"]);
	} else if (isset($_GET["from"])) {
		$txt_from = urldecode($_GET["from"]);
	}
	if (isset($_POST["to"])) {
		$txt_to = urldecode($_POST["to"]);
	} else if (isset($_GET["to"])) {
		$txt_to = urldecode($_GET["to"]);
	}
	if (isset($_POST["vouchers"])) {
		$txt_vouchers = urldecode($_POST["vouchers"]);
	} else if (isset($_GET["vouchers"])) {
		$txt_vouchers = urldecode($_GET["vouchers"]);
	}
	if (isset($_POST["vouchdata"])) {
		$txt_vouchdata = urldecode($_POST["vouchdata"]);
	} else if (isset($_GET["vouchdata"])) {
		$txt_vouchdata = urldecode($_GET["vouchdata"]);
	}
	if (isset($_POST["vouchtime"])) {
		$txt_vouchtime = urldecode($_POST["vouchtime"]);
	} else if (isset($_GET["vouchtime"])) {
		$txt_vouchtime = urldecode($_GET["vouchtime"]);
	}
	if (isset($_POST["partner"])) {
		$txt_partner = urldecode($_POST["partner"]);
	} else if (isset($_GET["partner"])) {
		$txt_partner = urldecode($_GET["partner"]);
	}

	//localhost/passcess/api/voucherupdate.php?from=0&to=0&vouchers=''&vouchdata=1024&vouchtime=3600&partner=1

	log_msg( (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );

	header("Access-Control-Allow-Origin: *");
	header("Content-type:application/json;charset=utf-8");

	if ($txt_partner == "") {
    $result = array('error'=>true, 'message'=>"Permission denied");
		log_msg(json_encode($result));
		echo json_encode($result);
		exit;
	}

	//connect to database
	$conn = dbConnection("127.0.0.1", "root", "root", "radius", "3306");
	//$conn = dbConnection("passcess-aws-db.c151ulpsxq5f.ap-southeast-1.rds.amazonaws.com", "tutorial_user", "SmsGlobalCovid19", "radius", "3306");

  $result = array('error'=>false);
	if ($txt_from == "") {
		$txt_from = 0;
	}
	if ($txt_to == "") {
		$txt_to = 0;
	}

    $voucherdata = array();
		$myQ = "CALL 2GoDB.update_voucher(" . $txt_from . "," . $txt_to . ",'" . $txt_vouchers . "','" . $txt_vouchdata . "','" . $txt_vouchtime . "','" . $txt_partner . "');" ;
	  log_msg( $myQ );
	  $res = mysqli_query($conn, $myQ) ;
	  if ($res == true) {
      while ($row = mysqli_fetch_assoc($res)) {
        array_push($voucherdata, $row);
      }
      $result['voucher'] = $voucherdata;
	  } else {
      $result = array('error'=>true, 'message'=>"Unable to update data.");
    }

	echo json_encode($result);

	mysqli_close($conn);

	unset($myQ);
	unset($result);

	unset($txt_from);
	unset($txt_to);
	unset($txt_vouchers);
	unset($txt_vouchdata);
	unset($txt_vouchtime);
	unset($txt_partner);
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
		file_put_contents ("./log/voucherupdate_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
	}

?>
