<?php

//define("NOT_CHECK_PERMISSIONS", true);
//define("STOP_STATISTICS", true);
//define("NO_KEEP_STATISTIC", "Y");
//define("NO_AGENT_STATISTIC","Y");
//define("DisableEventsCheck", true);

use Bitrix\Sign\Service\Container;
use Bitrix\Sign\Type\Document\EntityType;

$siteId = '';
if (isset($_REQUEST['site_id']) && is_string($_REQUEST['site_id']))
{
	$siteId = mb_substr(preg_replace('/[^a-z0-9_]/i', '', $_REQUEST['site_id']), 0, 2);
}

if ($siteId)
{
	define('SITE_ID', $siteId);
}

require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');

\Bitrix\Main\Loader::includeModule('sign');
// \Bitrix\Main\Loader::includeModule('crm');
$request = \Bitrix\Main\Application::getInstance()->getContext()->getRequest();
$APPLICATION->IncludeComponent(
	'bitrix:ui.sidepanel.wrapper',
	'',
	[
		'POPUP_COMPONENT_NAME' => 'bitrix:sign.legal.form',
		'POPUP_COMPONENT_PARAMS' => [
			'PROFILE_ID' => (int)$request->get('profileId'),
		],
		'USE_PADDING' => false,
		'USE_UI_TOOLBAR' => 'N',
		'USE_BACKGROUND_CONTENT' => false,
	],
);

require_once($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_after.php');