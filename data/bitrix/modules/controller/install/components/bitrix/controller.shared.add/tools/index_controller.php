<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';
/** @var CMain $APPLICATION */

CControllerClient::JoinToController('http://controller.bsm:6448/', 'admin', 'password', false, false, false, true);

require_once $_SERVER['DOCUMENT_ROOT'] . BX_ROOT . '/modules/main/interface/init_admin.php';
?><html><head><title><?php $APPLICATION->ShowTitle()?></title></head>
<body><table width="100%"><tr><td width="1%"></td><td width="98%" align="center">
<div style="width:600px;">
<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/classes/general/wizard.php';
$wizard = new CWizard('bitrix:controller_site');
$wizard->Install();
?>
</div>
</td><td width="1%"></td>
</table>
</body>
</html>
<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/epilog_after.php';