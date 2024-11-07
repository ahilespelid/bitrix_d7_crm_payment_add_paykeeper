<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/sign-settings.bundle.css',
	'js' => 'dist/sign-settings.bundle.js',
	'rel' => [
		'main.core',
		'sign.v2.api',
		'sign.v2.b2e.company-selector',
		'sign.v2.b2e.document-send',
		'sign.v2.b2e.document-setup',
		'sign.v2.b2e.parties',
		'sign.v2.b2e.user-party',
		'sign.v2.editor',
		'sign.v2.sign-settings',
	],
	'skip_core' => false,
];