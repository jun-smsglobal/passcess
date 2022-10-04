<?php
/**
 * a simple script to get all partner, fleet and vessels
 * @author HONESTO GO JR
 **/

	// error_reporting(E_ALL);
	error_reporting(0);

	$txt_action = "";
	$txt_webuser = "";
	$txt_imgdata = "";

	if (isset($_POST["action"])) {
		$txt_action = urldecode($_POST["action"]);
	} else if (isset($_GET["action"])) {
		$txt_action = urldecode($_GET["action"]);
	}

	if (isset($_POST["webuser"])) {
		$txt_webuser = urldecode($_POST["webuser"]);
	} else if (isset($_GET["webuser"])) {
		$txt_webuser = urldecode($_GET["webuser"]);
	}

	if (isset($_POST["imgdata"])) {
		$txt_imgdata = ($_POST["imgdata"]);
	} else if (isset($_GET["imgdata"])) {
		$txt_imgdata = ($_GET["imgdata"]);
	}

	//http://localhost/passcess/assets/api/graphdata.php?action=insgraphdata1&webuser=jun&imgdata=<img src="data:image/png;base64,HONESTO">

	log_msg( (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );

	header("Access-Control-Allow-Origin: *");
	header("Content-type:text/plain");

	$result = array();
	if ($txt_action == "") {
		log_msg("Invalid Parameter.");
		exit;
	}

	//connect to database
	$conn = dbConnection("127.0.0.1", "root", "root", "radius", "3306");
	// $conn = new mysqli("passcess-aws-db.c151ulpsxq5f.ap-southeast-1.rds.amazonaws.com", "tutorial_user", "SmsGlobalCovid19", "radius", "3306");


  $txt_act = substr($txt_action, 0, -2);
  $txt_proc = substr($txt_action, -2);

	if($txt_act == 'getgraphdata'){

    switch ($txt_proc) {
      case '11':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 1 and report = 'apps' LIMIT 1");
  		    $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 1 and report = 'apps' LIMIT 1");
        break;
      case '12':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 2 and report = 'apps' LIMIT 1");
    		  $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 2 and report = 'apps' LIMIT 1");
        break;
      case '13':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 3 and report = 'apps' LIMIT 1");
    		  $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 3 and report = 'apps' LIMIT 1");
        break;
			case '14':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 1 and report = 'voyage' LIMIT 1");
    		  $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 1 and report = 'voyage' LIMIT 1");
        break;
			case '15':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 2 and report = 'voyage' LIMIT 1");
    		  $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 2 and report = 'voyage' LIMIT 1");
        break;
			case '16':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 3 and report = 'voyage' LIMIT 1");
    		  $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 3 and report = 'voyage' LIMIT 1");
        break;
			case '17':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 4 and report = 'voyage' LIMIT 1");
    		  $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 4 and report = 'voyage' LIMIT 1");
        break;
			case '18':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 1 and report = 'vessel' LIMIT 1");
    		  $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 1 and report = 'vessel' LIMIT 1");
        break;
			case '19':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 2 and report = 'vessel' LIMIT 1");
    		  $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 2 and report = 'vessel' LIMIT 1");
        break;
			case '20':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 3 and report = 'vessel' LIMIT 1");
    		  $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 3 and report = 'vessel' LIMIT 1");
        break;
			case '21':
          log_msg("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 4 and report = 'vessel' LIMIT 1");
    		  $sqluser = $conn->query("SELECT img_data FROM radius.log_graph WHERE webuser = '" . $txt_webuser . "' and tag = 4 and report = 'vessel' LIMIT 1");
        break;
      default:
          log_msg("Invalid procedure.");
          exit;
        break;
    }

		while($row = $sqluser->fetch_assoc()){
			echo $row["img_data"];
		}
	}

  $txt_act1 = substr($txt_action, 0, -2);
  $txt_proc1 = substr($txt_action, -2);

	if($txt_act1 == 'insgraphdata'){
    switch ($txt_proc1) {
      case '11':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',1,'apps','$txt_imgdata')");
  		    $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',1,'apps','$txt_imgdata')");
        break;
      case '12':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',2,'apps','$txt_imgdata')");
          $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',2,'apps','$txt_imgdata')");
        break;
      case '13':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',3,'apps','$txt_imgdata')");
          $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',3,'apps','$txt_imgdata')");
        break;
			case '14':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',1,'voyage','$txt_imgdata')");
          $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',1,'voyage','$txt_imgdata')");
        break;
			case '15':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',2,'voyage','$txt_imgdata')");
          $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',2,'voyage','$txt_imgdata')");
        break;
			case '16':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',3,'voyage','$txt_imgdata')");
          $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',3,'voyage','$txt_imgdata')");
        break;
			case '17':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',4,'voyage','$txt_imgdata')");
          $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',4,'voyage','$txt_imgdata')");
        break;
			case '18':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',1,'vessel','$txt_imgdata')");
          $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',1,'vessel','$txt_imgdata')");
        break;
			case '19':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',2,'vessel','$txt_imgdata')");
          $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',2,'vessel','$txt_imgdata')");
        break;
			case '20':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',3,'vessel','$txt_imgdata')");
          $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',3,'vessel','$txt_imgdata')");
        break;
			case '21':
          log_msg("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',4,'vessel','$txt_imgdata')");
          $sql = $conn->query("REPLACE INTO radius.log_graph(webuser, tag, report, img_data) VALUES('$txt_webuser',4,'vessel','$txt_imgdata')");
        break;
      default:
          log_msg("Unable to insert.");
          exit;
        break;
    }

		if ($sql){
			log_msg("Successfully inserted.");
		} else {
			log_msg("Failed to insert data.");
		}
	}

	mysqli_close($conn);

	unset($sqluser);
	unset($sqluser);

	unset($txt_action);
	unset($txt_webuser);
	unset($txt_imgdata);
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
		file_put_contents ("./log/graph_report_" . date('Ymd') . ".log", $tmp_data, FILE_APPEND);
	}
?>
