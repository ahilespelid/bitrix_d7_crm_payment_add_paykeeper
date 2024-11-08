<?php

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}


return [
	'css' => [
		'dist/terminal.bundle.css',
		'/bitrix/components/bitrix/ui.button.panel/templates/.default/style.css',
	],
	'js' => 'dist/terminal.bundle.js',
	'rel' => [
		'ui.vue3',
		'ui.switcher',
		'main.popup',
		'rest.client',
		'bitrix24.phoneverify',
		'ui.dialogs.messagebox',
		'ui.label',
		'main.core',
		'landing.backend',
		'landing.pageobject',
		'ui.vue3.vuex',
		'ui.notification',
	],
	'skip_core' => false,
];
