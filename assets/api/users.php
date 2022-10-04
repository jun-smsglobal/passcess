<?php
/**
 * a simple script to check user and password
 * @author HONESTO GO JR
 **/

	//error_reporting(E_ALL);
	error_reporting(0);
	set_time_limit(0);
	session_start();

	$json_output = array();

	if (isset($_POST["webuser"])) {
		$txt_user = urldecode($_POST["webuser"]);
	} else if (isset($_GET["webuser"])) {
		$txt_user = urldecode($_GET["webuser"]);
	}
	if (isset($_POST["webpass"])) {
		$txt_pass = urldecode($_POST["webpass"]);
	} else if (isset($_GET["webpass"])) {
		$txt_pass = urldecode($_GET["webpass"]);
	}

	//localhost/passcess_new/users.php?webuser=jun&webpass=jun

	header("Access-Control-Allow-Origin: *");
	header("Content-type:application/json;charset=utf-8");

	log_msg( (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );

	if (($txt_pass == "") or ($txt_pass == "")){
		$json_output = array("code"=>500, "message"=>"Invalid username or password.", "rights"=>100, "access"=>"0001", "partner"=>"") ;
		log_msg( json_encode($json_output));
	} else {
		//connect to database
		$conn = dbConnection("127.0.0.1", "root", "root", "radius", "3306");
		// $conn = dbConnection("passcess-aws-db.c151ulpsxq5f.ap-southeast-1.rds.amazonaws.com", "tutorial_user", "SmsGlobalCovid19", "radius", "3306");
		$myQ = "SELECT * FROM user_account WHERE username = '" . $txt_user . "' and userpass = '" . $txt_pass . "' and active = 1" ;
		log_msg( $myQ );
		$result = mysqli_query($conn, $myQ) ;
		$res = mysqli_affected_rows($conn) ;
		if ($result == true) {
			$_SESSION['webuser'] = $txt_user;
			while ($row = mysqli_fetch_assoc($result)) {
				$json_output = array("code"=>200, "message"=>"Success", "rights"=>$row["rights"], "access"=>$row["access"], "partner"=>$row["vessel_partner"]) ;
				log_msg( json_encode($json_output));
			}
		}
		else {
			$json_output = array("code"=>500, "message"=>"Invalid username or password.", "rights"=>100, "access"=>"0001", "partner"=>"") ;
			log_msg( json_encode($json_output));
		}
	}


	if (($json_output == "") || ($json_output == null)) {
		$json_output =  array("code"=>500, "message"=>"Invalid username or password.", "rights"=>100, "access"=>"0001", "partner"=>"") ;
		log_msg( json_encode($json_output));
	}


	echo json_encode($json_output);

	mysqli_close($conn);

	// unset($txt_user);
	unset($txt_pass);

	unset($myQ);
	unset($result);
	unset($json_output);


	//connect to database
	function dbConnection($dbconn, $dbuser, $dbpass, $dbname, $dbport)
	{
		$json_out = array();

		$myconn = mysqli_connect($dbconn, $dbuser, $dbpass, $dbname,  $dbport);
		// Check connection
		if (!$myconn) {
			$json_out =  array("code"=>500, "message"=>"Connection failed. " . mysqli_connect_error(), "rights"=>100, "access"=>"0001") ;
			log_msg(json_encode($json_out));
			echo json_encode($json_out);
			die();
		}

		return $myconn;
	}

	// log transaction
	function log_msg($msg_content)
	{
		chdir(dirname(__FILE__));

		$tmp_data = date("g:i a") . " : ";
		$tmp_data .= $msg_content . "\r\n";
		file_put_contents ("./log/login_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
	}

?>
