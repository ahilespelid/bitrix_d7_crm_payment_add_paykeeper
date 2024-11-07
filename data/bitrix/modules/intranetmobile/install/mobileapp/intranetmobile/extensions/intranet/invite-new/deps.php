<?php

return [
	'extensions' => [
		'alert',
		'asset-manager',
		'tokens',
		'loc',
		'type',
		'toast',
		'ui-system/layout/area',
		'ui-system/layout/card',
		'ui-system/layout/box',
		'ui-system/layout/dialog-footer',
		'ui-system/typography/text',
		'ui-system/typography/heading',
		'ui-system/form/buttons/button',
		'ui-system/form/inputs/input',
		'ui-system/blocks/icon',
		'ui-system/blocks/link',
		'ui-system/blocks/chips/chip-button',
		'utils/phone',
		'utils/function',
		'utils/object',
		'layout/pure-component',
		'layout/ui/safe-image',
		'layout/ui/menu',
		'layout/ui/user/empty-avatar',
		'layout/ui/smartphone-contact-selector',
		'selector/widget/entity/intranet/department',
		'intranet/enum',
		'rest/run-action-executor',
		'statemanager/redux/store',
		'statemanager/redux/slices/users',
		'intranet:create-department',
	],
	'bundle' => [
		'./src/department-chooser',
		'./src/name-checker',
		'./src/name-checker-item',
		'./src/name-checker-item-avatar',
		'./src/tab/base',
		'./src/tab/phone',
		'./src/tab/link',
		'./src/analytics',
		'./src/error',
	],
];