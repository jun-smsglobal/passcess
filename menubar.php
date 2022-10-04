<?php

session_start();

echo '<ul class="sidebar-nav preactmenu">';
echo '<li class="sidebar-brand">';
echo '<a href="#">PassCess Control Panel</a>';
echo '</li>';
echo '</ul>';

echo '<nav class="sidebar-nav">';
echo '<ul class="LeftSidebarMenu" id="menuDynamic">';

echo '<li id="vouchermngt">';
echo '<a class="has-arrow" href="javascript:void(0)">Voucher Management</a>';
echo '<ul>';
echo '<li id="mnVoucherList"><a href="voucherhist.html" onclick="checkPrivilage(6)">Voucher List</a></li>';
echo '<li id="mnAllocateVoucher"><a href="allocvoucher.html" onclick="checkPrivilage(7)">Allocate Voucher</a></li>';
echo '<li id="mnEditVoucher"><a href="editvoucher.html" onclick="checkPrivilage(8)">Edit Voucher</a></li>';
echo '</ul>';
echo '</li>';

echo '<li id="vesselmngt">';
echo '<a class="has-arrow" href="javascript:void(0)">Vessel Management</a>';
echo '<ul>';
echo '<li id="mnVesselList"><a href="dashboard.html" onclick="checkPrivilage(99)">Vessel List</a></li>';
echo '<li id="mnNetwork"><a href="network.html" onclick="checkPrivilage(1)">Network Settings</a></li>';
echo '<li id="mnFirewall"><a href="firewall.html" onclick="checkPrivilage(2)">Firewall Settings</a></li>';
echo '<li id="mnVoyageSked"><a href="voyage.html" onclick="checkPrivilage(3)">Voyage Scheduling</a></li>';
echo '<li id="mnOnboardUser"><a href="onboarduser.html" onclick="checkPrivilage(21)">Onboard Portal User</a></li>';
echo '<li id="mnNews"><a href="news.html" onclick="checkPrivilage(23)">News / Announcements</a></li>';
echo '<li id="mnsupport"><a href="pcpsupport.html" onclick="checkPrivilage(32)">Support Logs</a></li>';
echo '<li id="mnSurvey"><a href="survey.html" onclick="checkPrivilage(31)">Survey</a></li>';

echo '</ul>';
echo '</li>';

echo '<li id="reportmngt">';
echo '<a class="has-arrow" href="javascript:void(0)">Reports</a>';
echo '<ul>';
echo '<li id="mnVoyageRep"><a href="voyagerep.html" onclick="checkPrivilage(13)">Voyage Report</a></li>';

echo '<li id="vessrepmngt" aria-expanded="false">';
echo '<a class="has-arrow" href="javascript:void(0)">Vessel Reports</a>';
echo '<ul>';
echo '<li id="mnVesselRep"><a href="vesselrep.html" onclick="checkPrivilage(12)">Vouchers</a></li>';
echo '<li id="mnPurchase"><a href="purchasehist.html" onclick="checkPrivilage(34)">Purchase History</a></li>';
echo '<li id="mnVessGPS"><a href="vessgps.html" onclick="checkPrivilage(35)">Positioning</a></li>';
echo '<li id="mnTrackRep"><a href="trackrep.html" onclick="checkPrivilage(36)">Network Availability</a></li>';
echo '</ul>';
echo '</li>';
// echo '<li><a href="javascript:void(0)" onclick="checkPrivilage(11)">Fleet Report</a></li>';
// echo '<li><a href="javascript:void(0)" onclick="checkPrivilage(10)">Partner Report</a></li>';
echo '<li id="usagemngt" aria-expanded="false">';
echo '<a class="has-arrow" href="javascript:void(0)">App Usage Report</a>';
echo '<ul>';
echo '<li id="mnVoucherRepApp"><a href="userappusage.html" onclick="checkPrivilage(28)">Voucher</a></li>';
echo '<li id="mnVoyageReppApp"><a href="voyageapprep.html" onclick="checkPrivilage(25)">Voyage</a></li>';
echo '<li id="mnVesselRepApp"><a href="datarep.html" onclick="checkPrivilage(19)">Vessel</a></li>';
echo '</ul>';
echo '</li>';

echo '</ul>';
echo '</li>';

echo '<li id="mnfleetmngt"><a href="fleetmngt.html" onclick="checkPrivilage(17)">Fleet Management</a></li>';
echo '<li id="mnpartnermngt"><a href="partnermngt.html" onclick="checkPrivilage(16)">Partner Management</a></li>';

echo '<li id="systemmngt">';
echo '<a class="has-arrow" href="javascript:void(0)">System Settings</a>';
echo '<ul>';
echo '<li id="mnportlist"><a href="philport.html" onclick="checkPrivilage(30)">Port Code List</a></li>';
echo '<li id="mnappsetting"><a href="domaintools.html" onclick="checkPrivilage(26)">App Settings</a></li>';
echo '<li id="mnGenerateVoucher"><a href="genvoucher.html" onclick="checkPrivilage(5)">Voucher Settings</a></li>';
echo '<li id="mnGlobalSett"><a href="globalsetting.html" onclick="checkPrivilage(33)">Global Settings</a></li>';
echo '<li id="mncontrolpanel"><a href="usermngt.html" onclick="checkPrivilage(14)">Control Panel User</a></li>';
// echo '<li id="mnwatchdog"><a href="srvcwatchdog.html" onclick="checkPrivilage(29)">Service Watchdog</a></li>';
echo '<li id="mnsystemlog"><a href="systemlog.html" onclick="checkPrivilage(24)">System Logs</a></li>';
echo '<li id="mnCPUser"><a href="pcpuser.html" onclick="checkPrivilage(9)">User Management</a></li>';
// echo '<li id="mnpanellog"><a href="#" onclick="checkPrivilage(15)">Control Panel Logs</a></li>';
echo '</ul>';
echo '</li>';

echo '<li id="mnhelpcenter"><a href="helpcenter.html" onclick="checkPrivilage(22)">Help</a></li>';

// echo '<li id="helpmngt">';
// echo '<a class="has-arrow" href="javascript:void(0)">Help</a>';
// echo '<ul>';
// echo '<li id="mnhelpcenter"><a href="#" onclick="checkPrivilage(22)">Help Center</a></li>';
// echo '<li id="mnknowledge"><a href="#" onclick="checkPrivilage(27)">Knowledgebase</a></li>';
// echo '</ul>';
// echo '</li>';

echo '</ul>';

echo '</nav>';

echo '<ul class="sidebar-nav logout">';
echo '<li>';
echo '<a href="javascript:void(0)" onclick="checkPrivilage(18)" id="webusername">Log Out - ' . $_SESSION['webuser'] . '</a>';
echo '</li>';
echo '</ul>';

?>
