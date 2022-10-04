<?php 
	ob_start();
	
	if (isset($_POST["vessid"])) {
		$txt_vessid = urldecode($_POST["vessid"]);
	} else if (isset($_GET["vessid"])) {
		$txt_vessid = urldecode($_GET["vessid"]);
	}

	if (isset($_POST["datefrom"])) {
		$txt_from = urldecode($_POST["datefrom"]);
	} else if (isset($_GET["datefrom"])) {
		$txt_from = urldecode($_GET["datefrom"]);
	}

	if (isset($_POST["dateto"])) {
		$txt_to = urldecode($_POST["dateto"]);
	} else if (isset($_GET["dateto"])) {
		$txt_to = urldecode($_GET["dateto"]);
	}
	if (isset($_POST["strLabel"])) {
		$txt_title = urldecode($_POST["strLabel"]);
	} else if (isset($_GET["strLabel"])) {
		$txt_title = urldecode($_GET["strLabel"]);
	}
	// $arrOptions=array(
    //   "ssl"=>array(
    //         "verify_peer"=>false,
    //         "verify_peer_name"=>false,
    //     ),
    // );  

	$resData = file_get_contents("https://passcess.net/assets/api/report.php?action=getvesselinfo&id=" . $txt_vessid);
	// $resData = file_get_contents("https://passcess.net/assets/api/report.php?action=getvesselinfo&id=" . $txt_vessid, false, stream_context_create($arrOptions));
	// $resData = file_get_contents("http://localhost/passcess/assets/api/report.php?action=getvesselinfo&id=" . $txt_vessid);
	$vessData = json_decode($resData, true);
?>
	<table class="noBorder" style="width:100%">
		<tr>
			<td style="text-align:left; color:#337ab7"><b><?php echo $txt_title; ?></b></td>
		</tr>
		<tr>
			<td style="text-align:left; font-size:10px;">For the period <?php echo $txt_from . " to " . $txt_to ; ?></td>
		</tr>
	</table>
	<hr>
	<table class="noBorder" style="width:100%">
		<tr>
			<td>Vessel Name : <?php echo $vessData[0]["vesselname"]; ?></td>
		</tr>
		<tr>
			<td>Vessel ID : <?php echo $vessData[0]["vesselid"]; ?></td>
		</tr>
		<tr>
			<td>Mac Address : <?php echo $vessData[0]["mac_address"]; ?></td>
		</tr>
		<tr>
			<td>Fleet : <?php echo $vessData[0]["fleetname"]; ?></td>
		</tr>
	</table>
	<hr>

<?php 
	$template = ob_get_contents();
	ob_end_clean();
	echo $template;
?>