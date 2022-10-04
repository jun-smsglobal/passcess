<?php 
	ob_start();
	set_time_limit(0);
	
	if (isset($_POST["varFile"])) {
		$txt_file = urldecode($_POST["varFile"]);
	} else if (isset($_GET["varFile"])) {
		$txt_file = urldecode($_GET["varFile"]);
	}

	if (isset($_POST["strLabel"])) {
		$txt_label = urldecode($_POST["strLabel"]);
	} else if (isset($_GET["strLabel"])) {
		$txt_label = urldecode($_GET["strLabel"]);
	}

	if (isset($_POST["strSource"])) {
		$txt_source = urldecode($_POST["strSource"]);
	} else if (isset($_GET["strSource"])) {
		$txt_source = urldecode($_GET["strSource"]);
	}
	
	// $arrOptions=array(
    //   "ssl"=>array(
    //         "verify_peer"=>false,
    //         "verify_peer_name"=>false,
    //     ),
    // );  
	
	$serverurl = "https://api.passcess.net/api/";
	$data = file_get_contents($serverurl . $txt_file);
	// $data = file_get_contents($serverurl . $txt_file, false, stream_context_create($arrOptions));
	$result = json_decode($data, true);
	$total_time = 0;
	$total_data = 0;
	$total_basic = 0;
	$total_premium = 0;
	
	foreach ($result as $key => $value)
	{
		$total_time += $value['vTimeUsage'];
		$total_data += $value['DataUsage'];
		$total_basic += $value['totalVoucher'] ;		
		$total_premium += $value['totalPremium'];
	}

	if($txt_source == "premium") {
		$total_time = 0;
		$total_data = 0;
		$total_basic = 0;
	} elseif($txt_source == "basic") {
		$total_premium = 0;
	}

	$vessID = explode("/", $txt_file);
	$vessIDs = explode("_", $vessID[1]);
	$resData = file_get_contents("https://passcess.net/assets/api/report.php?action=getvesselinfo&id=" . $vessIDs[0]);
	// $resData = file_get_contents("https://passcess.net/assets/api/report.php?action=getvesselinfo&id=" . $vessIDs[0], false, stream_context_create($arrOptions));
	// $resData = file_get_contents("http://localhost/passcess/assets/api/report.php?action=getvesselinfo&id=" . $vessIDs[0]);
	$vessData = json_decode($resData, true);
	//var_dump($vessData);
?>

	<table class="noBorder" style="width:100%">
		<tr>
			<td style="text-align:left; color:#337ab7"><b><?php echo $txt_label; ?></b></td>
		</tr>
		<tr>
			<td style="text-align:left; font-size:10px;">For the period <?php echo $vessID[2]; ?> to <?php echo $vessID[3]; ?></td>
		</tr>
	</table>
	<hr>
	<table class="noBorder" style="width:100%">
		<tr>
			<td>Vessel Name : <?php echo $vessData[0]["vesselname"]; ?></td>
			<td>Premium Connections : <?php echo $total_premium; ?></td>
		</tr>
		<tr>
			<td>Vessel ID : <?php echo $vessData[0]["vesselid"]; ?></td>
			<td>Basic Vouchers Used: <?php echo $total_basic; ?></td>
		</tr>
		<tr>
			<td>Mac Address : <?php echo $vessData[0]["mac_address"]; ?></td>
			<td>Total Data Consumption : <?php echo number_format(round($total_data, 2), 2); ?> MB</td>
		</tr>
		<tr>
			<td>Fleet : <?php echo $vessData[0]["fleetname"]; ?></td>
			<td>Total Time Usage : <?php echo number_format(round($total_time, 2)); ?> hrs</td>
		</tr>
	</table>
	<hr>

<?php 
	$template = ob_get_contents();
	ob_end_clean();
	echo $template;
?>