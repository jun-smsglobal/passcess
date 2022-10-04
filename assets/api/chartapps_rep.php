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

	if (isset($_POST["process"])) {
		$txt_process = urldecode($_POST["process"]);
	} else if (isset($_GET["process"])) {
		$txt_process = urldecode($_GET["process"]);
	}

	//$resHeader = file_get_contents("http://passcess.net/assets/api/header_rep.php?vessid=" . $txt_vessid . "&datefrom=" . $txt_from . "&dateto=" . $txt_to);
	$resHeader = file_get_contents("http://localhost/passcess/assets/api/header_rep.php?vessid=" . $txt_vessid . "&datefrom=" . $txt_from . "&dateto=" . $txt_to);

	switch ($txt_process) {
	case "1":
		$txt_uri = "domainapp/allowed/10/vessel/" . $txt_vessid . "/" . $txt_from  . "/" . $txt_to;
		break;
	case "2":
		$txt_uri = "domainapp/notallowed/10/vessel/" . $txt_vessid . "/" . $txt_from  . "/" . $txt_to;
		break;
	case "3":
		$txt_uri = "domainapp/top/10/vessel/" . $txt_vessid . "/" . $txt_from  . "/" . $txt_to;
		break;
	default:
		$txt_uri = "domainapp/top/0/vessel/" . $txt_vessid . "/" . $txt_from  . "/" . $txt_to;
	};

	$serverurl = "https://api.passcess.net/api/";
	$data = file_get_contents($serverurl . $txt_uri);
	$jsonTable = json_decode($data, true);
	//var_dump($jsonTable);

    $finalData = "";
	foreach ($jsonTable as $key => $value)
	{
		$finalData = $finalData . "['" . $value['app'] . " - " . $value['count'] . "' ," . $value['count'] . "],";
	}
?>
<html>
<head>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<script src="http://localhost/passcess/assets/js/jquery-3.js"></script>
	<script src="http://localhost/passcess/assets/js/jquery-ui.js"></script>
    <script type="text/javascript">

    // Load the Visualization API and the piechart package.
    google.charts.load("current", {packages:["corechart"]});

    // Set a callback to run when the Google Visualization API is loaded.
    google.setOnLoadCallback(drawChart);
		
    function drawChart() {
      // Create our data table out of JSON data loaded from server.
      var data = new google.visualization.DataTable();
        data.addColumn("string", "Allowed");
        data.addColumn("number", "Total Usage");
		data.addRows([ <?php echo $finalData ?>]);

      var options = {
          title: "Frequently Used Apps",
          width: 800,
          height: 600,
          legend: { position: "right", textStyle: { fontSize: 12 }  },
          pieHole: 0
        };
      // Instantiate and draw our chart, passing in some options.
      // Do not forget to check your div ID
      var chart1 = new google.visualization.PieChart(document.getElementById('new_div'));
      chart1.draw(data, options);

      var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
	  
      // Wait for the chart to finish drawing before calling the getImageURI() method.
      google.visualization.events.addListener(chart, 'ready', function () {
        chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
        console.log(chart_div.innerHTML);
		//document.getElementById('graph').innerHTML = chart_div.innerHTML;
		//document.querySelectorAll('[id="image"]')[0].src = chart.getImageURI();		
      });
	  
      chart.draw(data, options);
    }
    </script>
</head>
<body>
	<?php echo $resHeader; ?>
	<hr>	
    <!--this is the div that will hold the pie chart -->
	<div class="container" id="Chart_details">
		<div id="new_div"></div>
		<div id="chart_div"></div>
	<!-- <div id='graph' style="display:none"></div> -->
	<!-- <img id="image"/> -->
	</div>
</body>
</html>
<?php 
	$template = ob_get_contents();
	ob_end_clean();
	echo $template;
?>