<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_admin_before.php';
/** @var CMain $APPLICATION */
/** @var CDatabase $DB */
/** @var CUser $USER */
/** @var CUserTypeManager $USER_FIELD_MANAGER */

if (!$USER->CanDoOperation('controller_group_view') || !CModule::IncludeModule('controller'))
{
	$APPLICATION->AuthForm(GetMessage('ACCESS_DENIED'));
}
require_once $_SERVER['DOCUMENT_ROOT'] . BX_ROOT . '/modules/controller/prolog.php';

IncludeModuleLangFile(__FILE__);

$arTasksModules = [];
$subordinate_id = COperation::GetIDByName('edit_subordinate_users');
$arMainSubordinateTask = [];
$db_task = CTask::GetList(['MODULE_ID' => 'asc', 'LETTER' => 'asc'], ['BINDING' => 'module']);
while ($ar_task = $db_task->GetNext())
{
	if (!isset($arTasksModules[$ar_task['MODULE_ID']]))
	{
		$arTasksModules[$ar_task['MODULE_ID']] = ['reference' => [], 'reference_id' => []];
	}

	$arTasksModules[$ar_task['MODULE_ID']]['reference'][] = '[' . ($ar_task['LETTER'] ?: '..') . '] ' . CTask::GetLangTitle($ar_task['NAME'], $ar_task['MODULE_ID']);
	$arTasksModules[$ar_task['MODULE_ID']]['reference_id'][] = $ar_task['NAME'];
	if ($ar_task['MODULE_ID'] == 'main')
	{
		$arOpInTask = CTask::GetOperations($ar_task['ID']);
		if (in_array($subordinate_id, $arOpInTask))
		{
			$arMainSubordinateTask[] = $ar_task['NAME'];
		}
	}
}

$aTabs = [
	[
		'DIV' => 'edit1',
		'TAB' => GetMessage('CTRLR_GR_ED_TAB1'),
		'ICON' => 'controller_group_edit',
		'TITLE' => '',
	],
	[
		'DIV' => 'edit2',
		'TAB' => GetMessage('CTRLR_GR_ED_TAB2'),
		'ICON' => 'controller_group_edit_2',
		'TITLE' => GetMessage('CTRLR_GR_ED_TAB2_TITLE'),
	],
	[
		'DIV' => 'edit3',
		'TAB' => GetMessage('CTRLR_GR_ED_TAB3'),
		'ICON' => 'controller_group_edit_3',
		'TITLE' => GetMessage('CTRLR_GR_ED_TAB3'),
	],
	[
		'DIV' => 'edit4',
		'TAB' => GetMessage('CTRLR_GR_ED_TAB4'),
		'ICON' => 'controller_group_edit_4',
		'TITLE' => GetMessage('CTRLR_GR_ED_TAB4_TITLE'),
	],
	[
		'DIV' => 'edit5',
		'TAB' => GetMessage('CTRL_GR_ED_TAB5'),
		'ICON' => 'controller_group_edit_5',
		'TITLE' => GetMessage('CTRL_GR_ED_TAB5_TITLE'),
	],
];

$opt_cnt = 6;
$arThirdSettings = CControllerGroupSettings::Get3rdPartyOptions();
foreach ($arThirdSettings as $obOption)
{
	/** @var IControllerGroupOption $obOption */
	$aTabs[] = [
		'DIV' => 'edit' . $opt_cnt,
		'TAB' => $obOption->GetName(),
		'ICON' => $obOption->GetIcon(),
		'TITLE' => $obOption->GetTitle(),
	];
	$opt_cnt++;
}

$strError = '';
$ID = intval($_REQUEST['ID']);
$copy_id = intval($_REQUEST['copy_id']);
$ENTITY_ID = 'CONTROLLER_GROUP';
$message = null;
$bVarsFromForm = false;

$aTabs[] = [
	'DIV' => 'edit0',
	'TAB' => GetMessage('CTRLR_GR_ED_TAB5'),
	'ICON' => 'controller_group_edit_0',
	'TITLE' => GetMessage('CTRLR_GR_ED_TAB5_TITLE'),
];
if (
	(count($USER_FIELD_MANAGER->GetUserFields($ENTITY_ID)) > 0) ||
	($USER_FIELD_MANAGER->GetRights($ENTITY_ID) >= 'W')
)
{
	$aTabs[] = $USER_FIELD_MANAGER->EditFormTab($ENTITY_ID);
}

$tabControl = new CAdminTabControl('tabControl', $aTabs);

if (
	$_SERVER['REQUEST_METHOD'] == 'POST'
	&& (
		$_REQUEST['save'] <> ''
		|| $_REQUEST['apply'] <> ''
	)
	&& check_bitrix_sessid()
	&& $USER->CanDoOperation('controller_group_manage')
)
{
	$arSettings = [];
	$arOptions = $_REQUEST['OPTIONS'];
	$arSettings['default'] = [];
	$arDefaultOptions = $arOptions['default'];

	if (isset($arDefaultOptions['modules']))
	{
		if (!is_array($arDefaultOptions['modules']))
		{
			$arDefaultOptions['modules'] = [$arDefaultOptions['modules']];
		}

		$arSettings['default']['modules'] = [];
		$arModules = CControllerGroupSettings::GetModules();
		foreach ($arModules as $module_id => $name)
		{
			if ($module_id == 'main')
			{
				continue;
			}
			if (in_array($module_id, $arDefaultOptions['modules']))
			{
				$arSettings['default']['modules'][] = $module_id;
			}
		}
	}

	$arSettings['default']['options'] = [];
	$arModuleOptions = CControllerGroupSettings::GetData();
	foreach ($arModuleOptions as $id => $info)
	{
		if (!is_array($info['options']) || empty($info['options']))
		{
			continue;
		}
		$arSettings['default']['options'][$id] = [];
		foreach ($info['options'] as $option_id => $option_ar)
		{
			if (isset($arDefaultOptions[$option_id]))
			{
				$arSettings['default']['options'][$id][$option_id] = $arDefaultOptions[$option_id];
			}
		}
	}

	if (isset($arDefaultOptions['security']))
	{
		if (!is_array($arDefaultOptions['security']))
		{
			$arDefaultOptions['security'] = [$arDefaultOptions['security']];
		}

		$arSettings['default']['security'] = [];
		if ($arDefaultOptions['security']['limit_admin'] == 'Y')
		{
			$arSettings['default']['security']['limit_admin'] = 'Y';
		}
	}

	$arSettings['default']['security']['groups'] = [];
	foreach ($_REQUEST['SECURITY'] as $i => $arSec)
	{
		if ($arSec['GROUP'] <> '')
		{
			$arSettings['default']['security']['groups'][$arSec['GROUP']] = $arSec['RIGHTS'];
			if (isset($_REQUEST['SUB_SECURITY'][$i]) && in_array($arSec['RIGHTS']['main'], $arMainSubordinateTask))
			{
				$arSettings['default']['security']['subord_groups'][$arSec['GROUP']] = $_REQUEST['SUB_SECURITY'][$i];
			}
		}
	}

	foreach ($arThirdSettings as $obOtherOption)
	{
		/** @var IControllerGroupOption $obOtherOption */
		$arSettings[$obOtherOption->id] = [];
		$arOtherOptions = $obOtherOption->GetOptionArray();
		foreach ($arOtherOptions as $option_id => $arOptionParams)
		{
			if (isset($arOptions[$obOtherOption->id][$option_id]))
			{
				$arSettings[$obOtherOption->id][$option_id] = $arOptions[$obOtherOption->id][$option_id];
			}
		}
	}

	$COUNTER_UPDATE_PERIOD = intval($_REQUEST['COUNTER_UPDATE_PERIOD']);
	if (isset($_REQUEST['COUNTER_UPDATE_PERIOD_TYPE']))
	{
		if ($_REQUEST['COUNTER_UPDATE_PERIOD_TYPE'] == 'H')
		{
			$COUNTER_UPDATE_PERIOD *= 60;
		}
		elseif ($_REQUEST['COUNTER_UPDATE_PERIOD_TYPE'] == 'D')
		{
			$COUNTER_UPDATE_PERIOD *= 60 * 24;
		}
		elseif ($_REQUEST['COUNTER_UPDATE_PERIOD_TYPE'] == 'W')
		{
			$COUNTER_UPDATE_PERIOD *= 60 * 24 * 7;
		}
		elseif ($_REQUEST['COUNTER_UPDATE_PERIOD_TYPE'] == 'N')
		{
			$COUNTER_UPDATE_PERIOD *= 60 * 24 * 30;
		}
	}

	$INSTALL_INFO = serialize($arSettings);
	$arFields = [
		'NAME' => $_REQUEST['NAME'],
		'DESCRIPTION' => $_REQUEST['DESCRIPTION'],
		'INSTALL_PHP' => $_REQUEST['INSTALL_PHP'],
		'UPDATE_PERIOD' => $_REQUEST['UPDATE_PERIOD'],
		'TRIAL_PERIOD' => $_REQUEST['TRIAL_PERIOD'],
		'UNINSTALL_PHP' => $_REQUEST['UNINSTALL_PHP'],
		'INSTALL_INFO' => $INSTALL_INFO,
		'CHECK_COUNTER_FREE_SPACE' => $_REQUEST['CHECK_COUNTER_FREE_SPACE'],
		'CHECK_COUNTER_SITES' => $_REQUEST['CHECK_COUNTER_SITES'],
		'CHECK_COUNTER_USERS' => $_REQUEST['CHECK_COUNTER_USERS'],
		'CHECK_COUNTER_LAST_AUTH' => $_REQUEST['CHECK_COUNTER_LAST_AUTH'],
		'COUNTER_UPDATE_PERIOD' => $COUNTER_UPDATE_PERIOD,
	];
	$USER_FIELD_MANAGER->EditFormAddFields($ENTITY_ID, $arFields);

	if ($ID > 0)
	{
		$res = CControllerGroup::Update($ID, $arFields);
		if ($_REQUEST['UPDATE_NOW'] == 'Y')
		{
			CControllerGroup::SetGroupSettings($ID);
		}
	}
	else
	{
		$ID = CControllerGroup::Add($arFields);
		$res = ($ID > 0);
	}

	if (!$res)
	{
		if ($e = $APPLICATION->GetException())
		{
			$message = new CAdminMessage(GetMessage('CTRLR_GR_ED_ER1'), $e);
		}
		$bVarsFromForm = true;
	}
	else
	{
		CControllerCounter::SetGroupCounters($ID, $_POST['CONTROLLER_COUNTER_ID']);

		if (isset($_REQUEST['save']))
		{
			LocalRedirect('controller_group_admin.php?lang=' . LANGUAGE_ID);
		}
		else
		{
			LocalRedirect($APPLICATION->GetCurPage() . '?lang=' . LANGUAGE_ID . '&ID=' . $ID . '&' . $tabControl->ActiveTabParam());
		}
	}
}

if ($bVarsFromForm)
{
	$arGroupFields = false;
}
elseif ($copy_id > 0)
{
	$arGroupFields = CControllerGroup::GetByID($copy_id)->Fetch();
}
elseif ($ID > 0)
{
	$arGroupFields = CControllerGroup::GetByID($ID)->Fetch();
}
else
{
	$arGroupFields = false;
}

if ($bVarsFromForm)
{
	$arGroupFields = [
		'NAME' => $_REQUEST['NAME'],
		'DESCRIPTION' => $_REQUEST['DESCRIPTION'],
		'UPDATE_PERIOD' => $_REQUEST['UPDATE_PERIOD'],
		'COUNTER_UPDATE_PERIOD' => $_REQUEST['COUNTER_UPDATE_PERIOD'],
		'CHECK_COUNTER_FREE_SPACE' => $_REQUEST['CHECK_COUNTER_FREE_SPACE'],
		'CHECK_COUNTER_SITES' => $_REQUEST['CHECK_COUNTER_SITES'],
		'CHECK_COUNTER_USERS' => $_REQUEST['CHECK_COUNTER_USERS'],
		'CHECK_COUNTER_LAST_AUTH' => $_REQUEST['CHECK_COUNTER_LAST_AUTH'],
		'INSTALL_PHP' => $_REQUEST['INSTALL_PHP'],
		'UNINSTALL_PHP' => $_REQUEST['UNINSTALL_PHP'],
	];
	$COUNTER_UPDATE_PERIOD_TYPE = $_REQUEST['COUNTER_UPDATE_PERIOD_TYPE'];
}
elseif (!$arGroupFields)
{
	$arGroupFields = [
		'UPDATE_PERIOD' => 0,
		'COUNTER_UPDATE_PERIOD' => 1440,
	];
}

$sDocTitle = ($ID > 0) ? preg_replace("'#ID#'i", $ID, GetMessage('CTRLR_GR_ED_TITLE_1')) : GetMessage('CTRLR_GR_ED_TITLE_2');
$APPLICATION->SetTitle($sDocTitle);

/***************************************************************************
 * HTML form
 ****************************************************************************/

require $_SERVER['DOCUMENT_ROOT'] . BX_ROOT . '/modules/main/include/prolog_admin_after.php';
$aMenu = [
	[
		'ICON' => 'btn_list',
		'TEXT' => GetMessage('CTRLR_GR_ED_LINK_BACK'),
		'LINK' => 'controller_group_admin.php?lang=' . LANGUAGE_ID,
	],
];

if ($ID > 0 && $USER->CanDoOperation('controller_group_manage'))
{
	$aMenu[] = ['SEPARATOR' => 'Y'];
	$aMenu[] = [
		'ICON' => 'btn_copy',
		'TEXT' => GetMessage('CTRLR_GR_ED_LINK_COPY'),
		'LINK' => 'controller_group_edit.php?lang=' . LANGUAGE_ID . '&copy_id=' . $ID,
	];
	$aMenu[] = [
		'ICON' => 'btn_new',
		'TEXT' => GetMessage('CTRLR_GR_ED_LINK_NEW'),
		'LINK' => 'controller_group_edit.php?lang=' . LANGUAGE_ID,
	];
	$aMenu[] = [
		'TEXT' => GetMessage('CTRLR_GR_ED_LINK_DEL'),
		'ICON' => 'btn_delete',
		'LINK' => "javascript:if(confirm('" . GetMessage('CTRLR_GR_ED_LINK_DEL_CONFIRM') . "'))window.location='controller_group_admin.php?action=delete&ID=" . $ID . '&lang=' . LANGUAGE_ID . '&' . bitrix_sessid_get() . "';",
	];
}

$context = new CAdminContextMenu($aMenu);
$context->Show();

if ($message)
{
	echo $message->Show();
}

echo $USER_FIELD_MANAGER->ShowScript();
?>
<form method="POST" action="<?php echo $APPLICATION->GetCurPage()?>?lang=<?=LANGUAGE_ID?>&ID=<?=$ID?>" name="form1">
	<?=bitrix_sessid_post()?>
	<?php echo GetFilterHiddens('find_'); ?>
	<?php $tabControl->Begin(); ?>
	<?php $tabControl->BeginNextTab(); ?>
	<?php if ($ID > 0): ?>
		<tr>
			<td><?php echo GetMessage('CTRLR_GR_ED_ID') ?></td>
			<td><?php echo $ID ?></td>
		</tr>
	<?php endif ?>
	<?php if (!$copy_id): ?>
		<tr>
			<td><?php echo GetMessage('CTRLR_GR_ED_CREATED') ?></td>
			<td><?php echo htmlspecialcharsEx($arGroupFields['DATE_CREATE']) ?><?php
				if ($arGroupFields['CREATED_BY_LOGIN'] <> '')
				{
					echo htmlspecialcharsEx(' (' . $arGroupFields['CREATED_BY_LOGIN'] . ') ' . $arGroupFields['CREATED_BY_NAME'] . ' ' . $arGroupFields['CREATED_BY_LAST_NAME']);
				}
			?></td>
		</tr>
	<?php endif; ?>
	<?php if (!$copy_id): ?>
		<tr>
			<td><?php echo GetMessage('CTRLR_GR_ED_MODIFIED') ?></td>
			<td><?php echo htmlspecialcharsEx($arGroupFields['TIMESTAMP_X']) ?><?php
				if ($arGroupFields['MODIFIED_BY_LOGIN'] <> '')
				{
					echo htmlspecialcharsEx(' (' . $arGroupFields['MODIFIED_BY_LOGIN'] . ') ' . $arGroupFields['MODIFIED_BY_NAME'] . ' ' . $arGroupFields['MODIFIED_BY_LAST_NAME']);
				}
			?></td>
		</tr>
	<?php endif; ?>
	<tr class="adm-detail-required-field">
		<td width="40%"><label for="NAME"><?php echo GetMessage('CTRLR_GR_ED_NAME') ?></label></td>
		<td width="60%"><input type="text" name="NAME" id="NAME" size="53" maxlength="255" value="<?=htmlspecialcharsbx($arGroupFields['NAME'])?>"></td>
	</tr>
	<tr>
		<td class="adm-detail-valign-top"><label for="DESCRIPTION"><?php echo GetMessage('CTRLR_GR_ED_DESC') ?></label></td>
		<td><textarea name="DESCRIPTION" id="DESCRIPTION" cols="40" rows="5"><?php echo htmlspecialcharsbx($arGroupFields['DESCRIPTION']) ?></textarea></td>
	</tr>
	<tr class="heading">
		<td colspan="2"><?php echo GetMessage('CTRLR_GR_ED_UPD') ?></td>
	</tr>
	<tr>
		<td><label for="UPDATE_PERIOD"><?php echo GetMessage('CTRLR_GR_ED_AUTOUPD') ?></label><br/>
			<?php echo GetMessage('CTRLR_GR_ED_AUTOUPD_HELP') ?></td>
		<td>
			<input type="text" name="UPDATE_PERIOD" id="UPDATE_PERIOD" size="6" maxlength="6" value="<?=($arGroupFields['UPDATE_PERIOD'] < 0 || trim($arGroupFields['UPDATE_PERIOD']) === '' ? '' : htmlspecialcharsbx($arGroupFields['UPDATE_PERIOD']))?>">
		</td>
	</tr>
	<?php if ($ID > 0): ?>
		<tr>
			<td>
				<label for="UPDATE_NOW"><?php echo GetMessage('CTRLR_GR_ED_UPD_NOW') ?></label>
			</td>
			<td>
				<input type="checkbox" name="UPDATE_NOW" id="UPDATE_NOW" value="Y" title="<?php echo GetMessage('CTRLR_GR_ED_TO_TASKS') ?>">
			</td>
		</tr>
	<?php endif ?>

	<?php $tabControl->BeginNextTab(); ?>
	<?php
	if ($bVarsFromForm)
	{
		$arGroupOptions = [];
		if (is_array($_REQUEST['OPTIONS']))
		{
			foreach ($_REQUEST['OPTIONS'] as $ns => $val)
			{
				if ($ns == 'default')
				{
					$arGroupOptions[$ns]['modules'] = $val['modules'];
					$arGroupOptions[$ns]['security'] = $val['security'];
					$arGroupOptions[$ns]['security']['groups'] = [];
					foreach ($_REQUEST['SECURITY'] as $i => $arSec)
					{
						if ($arSec['GROUP'] <> '')
						{
							$arGroupOptions[$ns]['security']['groups'][$arSec['GROUP']] = $arSec['RIGHTS'];
							if (isset($_REQUEST['SUB_SECURITY'][$i]))
							{
								$arGroupOptions[$ns]['security']['subord_groups'][$arSec['GROUP']] = $_REQUEST['SUB_SECURITY'][$i];
							}
						}
					}

					$arModuleOptions = CControllerGroupSettings::GetData();
					foreach ($arModuleOptions as $module_id => $info)
					{
						if (!is_array($info['options']) || empty($info['options']))
						{
							continue;
						}
						$arOptions = $info['options'];
						foreach ($arOptions as $id => $arOptionParams)
						{
							if (isset($val[$id]))
							{
								$arGroupOptions[$ns]['options'][$module_id][$id] = $val[$id];
							}
						}
					}
				}
				else
				{
					$arGroupOptions[$ns] = $val;
				}
			}
		}
	}
	else
	{
		$arGroupOptions = unserialize($arGroupFields['INSTALL_INFO'], ['allowed_classes' => false]);
	}

	$arDefGroupOptions = $arGroupOptions['default'];
	?>
	<tr>
		<td width="40%" class="adm-detail-valign-top"><label for="modules"><?php echo GetMessage('CTRLR_GR_ED_INSTALLED') ?></label></td>
		<td width="60%">
			<input type="checkbox" <?php echo (isset($arDefGroupOptions['modules'])) ? 'checked' : ''?> name="OPTIONS[default][modules]" id="ACT_modules" value="Y" onclick="document.getElementById('modules').disabled=!this.checked;" title="<?php echo GetMessage('CTRLR_GR_ED_CHCKBOX') ?>"><br>
			<?php $arModules = CControllerGroupSettings::GetModules(); ?>
			<select
				name="OPTIONS[default][modules][]"
				size="24"
				multiple="multiple"
				id="modules"
				<?php echo (!isset($arDefGroupOptions['modules'])) ? ' disabled' : ''?>
			>
				<?php foreach ($arModules as $module_id => $name):
					if ($module_id == 'main')
					{
						continue;
					}
					?>
					<option value="<?=htmlspecialcharsbx($module_id)?>"<?php echo (is_array($arDefGroupOptions['modules']) && in_array($module_id, $arDefGroupOptions['modules'])) ? ' selected' : ''?>><?=htmlspecialcharsbx($name)?></option>
				<?php endforeach; ?>
			</select>
		</td>
	</tr>

	<?php $tabControl->BeginNextTab(); ?>
	<?php
	$arModuleOptions = CControllerGroupSettings::GetData();
	foreach ($arModuleOptions as $module_id => $info):
		if (!is_array($info['options']) || empty($info['options']))
		{
			continue;
		}
		?>
		<tr class="heading">
			<td colspan="2"><?=htmlspecialcharsEx($info['name'])?></td>
		</tr>
		<?php
		$arOptions = $info['options'];
		foreach ($arOptions as $id => $arOptionParams):
			if (mb_substr($id, 0, 2) === '__'):
				?>
				<tr>
					<td colspan="2" align="center"><?=htmlspecialcharsEx($arOptionParams)?>:</td>
				</tr>
				<?php
			else:
				if (isset($arDefGroupOptions['options'][$module_id][$id]))
				{
					$OptionValue = $arDefGroupOptions['options'][$module_id][$id];
				}
				else
				{
					$OptionValue = false;
				}
				?>
				<tr>
					<td width="40%">
						<label for="ACT_<?=htmlspecialcharsbx($id)?>"><?=htmlspecialcharsEx($arOptionParams[0])?>
							:</label></td>
					<td width="60%"><?=CControllerGroupSettings::GenerateInput($id, $arOptionParams, $OptionValue)?></td>
				</tr>
			<?php endif; ?>
		<?php endforeach; ?>
	<?php endforeach; ?>

	<?php
	$tabControl->BeginNextTab();

	$security = $arDefGroupOptions['security'];

	$arModuleRights = [];
	$arModules = CControllerGroupSettings::GetModules();
	foreach ($arModules as $module_id => $name)
	{
		$module = null;
		$installFile = $_SERVER['DOCUMENT_ROOT'] . BX_ROOT . '/modules/' . $module_id . '/install/index.php';
		if ($module_id != 'main')
		{
			if (!file_exists($installFile))
			{
				continue;
			}

			include_once $installFile;
			if (!class_exists($module_id))
			{
				continue;
			}

			$module = new $module_id;
			if ($module->MODULE_GROUP_RIGHTS != 'Y')
			{
				continue;
			}
		}

		if (isset($arTasksModules[$module_id]))
		{
			$arModuleRights[$module_id] = $arTasksModules[$module_id];
		}
		else
		{
			if ($module && method_exists($module, 'GetModuleRightList'))
			{
				$arModuleRights[$module_id] = call_user_func([$module, 'GetModuleRightList']);
			}
			else
			{
				$arModuleRights[$module_id] = CMain::GetDefaultRightList();
			}
		}
	}

	// prepare portion of html to use in js
	ob_start();
	?>
	<br>
	<table class="internal">
		<tr>
			<td colspan="2"><label for="SECURITY_#I#_GROUP"><?php echo GetMessage('CTRLR_GR_ED_GROUP') ?></label>:
				<input type="text" name="SECURITY[#I#][GROUP]" id="SECURITY_#I#_GROUP" size="15" value="#GROUP_NAME#"></td>
		</tr>
		<tr>
			<td align="center"><?php echo GetMessage('CTRLR_GR_ED_MODULE') ?></td>
			<td align="center"><?php echo GetMessage('CTRLR_GR_ED_LEVEL') ?></td>
		</tr>
		<?php
		foreach ($arModuleRights as $module_id => $permissions):
			$fieldName = 'SECURITY[#I#][RIGHTS][' . $module_id . ']';
			?>
			<tr>
				<td><label for="<?=htmlspecialcharsbx('ACT_' . $fieldName)?>"><?=htmlspecialcharsbx($arModules[$module_id])?>
						: </label></td>
				<td nowrap>
					<input type="checkbox" name="<?=htmlspecialcharsbx($fieldName)?>" id="<?=htmlspecialcharsbx('ACT_' . $fieldName)?>" value="Y" title="<?php echo GetMessage('CTRLR_GR_ED_CHCKBOX') ?>"
						onclick="BX('<?=CUtil::JSEscape('E_' . $fieldName)?>').disabled=!this.checked;if(this.checked)BX('<?=CUtil::JSEscape('E_' . $fieldName)?>').focus();"
					/>&nbsp;
					<select
						name="<?=htmlspecialcharsbx($fieldName)?>"
						<?php if ($module_id == 'main'):
?>onchange="BX('<?=CUtil::JSEscape('SUB_' . $fieldName)?>').style.display = (!__CheckTaskSubord(this.value)?'none':'inline');" <?php endif ?>
						id="<?=htmlspecialcharsbx('E_' . $fieldName)?>"
						disabled="disabled"
						title=""
					>
						<option value=""><?=GetMessage('CTRLR_GR_ED_LEVEL_DEF')?></option>
						<?php foreach ($permissions['reference'] as $j => $reference): ?>
							<option value="<?=$permissions['reference_id'][$j]?>"><?=htmlspecialcharsEx($reference)?></option>
						<?php endforeach ?>
					</select>
					<?php if ($module_id == 'main'): ?>
						<br>
						<textarea name="SUB_SECURITY[#I#]" title="<?php echo GetMessage('CTRLR_GR_ED_SUBORD') ?>" rows="3" cols="40" id="SUB_<?=$fieldName?>" style="display:none;"></textarea>
					<?php endif ?>
				</td>
			</tr>
		<?php endforeach; ?>
	</table>
	<?php
	$content = ob_get_contents();
	ob_end_clean();
	?>
	<script>
		function __CheckNewAdmin()
		{
			var i, el, new_i = document.getElementById('SECURITY_COUNT').value;
			for (i = 0; i <= new_i; i++)
			{
				el = document.getElementById('SECURITY[' + i + '][GROUP]');
				if (el && el.value.toLowerCase() == 'administrators')
					return true;
			}
			return false;
		}

		function __NewSecGroup(group_name, to_begin)
		{
			var link_from = document.getElementById('security_add_link');
			if (to_begin)
				link_from = document.getElementById('begin_p');
			var oDiv = document.createElement('DIV');
			link_from.parentNode.insertBefore(oDiv, link_from);

			var new_i = document.getElementById('SECURITY_COUNT').value;
			new_i++;
			document.getElementById('SECURITY_COUNT').value = new_i;
			var html = '<?=CUtil::JSEscape($content)?>';
			html = html.replace(new RegExp("#I#", "g"), new_i);
			html = html.replace(new RegExp("#GROUP_NAME#", "g"), group_name);
			oDiv.innerHTML = html;

			setTimeout(function ()
			{
				var r = BX.findChildren(oDiv, {tag: /^(input|select|textarea)$/i}, true);
				if (r && r.length > 0)
				{
					for (var i = 0, l = r.length; i < l; i++)
					{
						if (r[i].form && r[i].form.BXAUTOSAVE)
							r[i].form.BXAUTOSAVE.RegisterInput(r[i]);
						else
							break;
					}
				}
			}, 10);
		}

		function __CheckTaskSubord(task_id)
		{
			var tasks = <?=\Bitrix\Main\Web\Json::encode($arMainSubordinateTask)?>;
			if (tasks)
			{
				for (var i = 0; i < tasks.length; i++)
				{
					if (task_id == tasks[i])
						return true;
				}
			}
			return false;
		}

		BX.ready(function ()
		{
			BX.addCustomEvent(document.forms.form1, 'onAutoSaveRestore', function (ob, data)
			{
				while (data['SECURITY[' + BX('SECURITY_COUNT').value + '][GROUP]'])
					__NewSecGroup('');
			})
		});
	</script>
	<tr>
		<td width="40%"><label for="OPTIONS_default_security_limit_admin"><?php echo GetMessage('CTRLR_GR_ED_NOADMIN') ?></label></td>
		<td width="60%">
			<input
				onclick="if(this.checked && !__CheckNewAdmin())__NewSecGroup('Administrators', true);"
				type="checkbox"
				name="OPTIONS[default][security][limit_admin]"
				id="OPTIONS_default_security_limit_admin"
				value="Y"
				<?php echo ($security['limit_admin'] == 'Y') ? ' checked' : ''?>
			>
		</td>
	</tr>
	<tr>
		<td class="adm-detail-valign-top"><?php echo GetMessage('CTRLR_GR_ED_PERM') ?></td>
		<td>
			<?php
			$arSecurityGroups = $arDefGroupOptions['security']['groups'];
			$arSecuritySubordGroups = $arDefGroupOptions['security']['subord_groups'];
			$arSecurityGroups['__Group_ID__'] = [];

			$i = -1;
			foreach ($arSecurityGroups as $group_id => $arSecOptions):
				$i++;
				?>
				<input type="hidden" id="begin_p">
				<table class="internal">
					<tr>
						<td colspan="2"><label for="SECURITY_<?=$i?>_GROUP"><?php echo GetMessage('CTRLR_GR_ED_GROUP') ?></label>:
							<input
								type="text"
								name="SECURITY[<?=$i?>][GROUP]"
								id="SECURITY_<?=$i?>_GROUP"
								size="15"
								value="<?=($group_id == '__Group_ID__' ? '' : htmlspecialcharsbx($group_id))?>"
							>
						</td>
					</tr>
					<tr>
						<td align="center"><?php echo GetMessage('CTRLR_GR_ED_MODULE') ?></td>
						<td align="center"><?php echo GetMessage('CTRLR_GR_ED_LEVEL') ?></td>
					</tr>
					<?php
					foreach ($arModuleRights as $module_id => $permissions):
						$fieldName = 'SECURITY[' . $i . '][RIGHTS][' . $module_id . ']';
						?>
						<tr>
							<td>
								<label for="<?=htmlspecialcharsbx('ACT_' . $fieldName)?>"><?=htmlspecialcharsbx($arModules[$module_id])?>
									: </label></td>
							<td nowrap>
								<input
									type="checkbox"
									name="<?=htmlspecialcharsbx($fieldName)?>"
									id="<?=htmlspecialcharsbx('ACT_' . $fieldName)?>"
									value="Y"
									title="<?php echo GetMessage('CTRLR_GR_ED_CHCKBOX') ?>"
									onclick="BX('<?=CUtil::JSEscape('E_' . $fieldName)?>').disabled=!this.checked;if(this.checked)BX('<?=CUtil::JSEscape('E_' . $fieldName)?>').focus();"
									<?php echo (isset($arSecOptions[$module_id])) ? 'checked="checked"' : ''?>
								/>
								<select
									name="<?=htmlspecialcharsbx($fieldName)?>"
									<?php if ($module_id == 'main'):?>
										onchange="BX('<?=CUtil::JSEscape('SUB_' . $fieldName)?>').style.display = (!__CheckTaskSubord(this.value)?'none':'inline');"
									<?php endif ?>
									id="<?=htmlspecialcharsbx('E_' . $fieldName)?>"
									title=""
									<?php echo (!isset($arSecOptions[$module_id])) ? 'disabled="disabled"' : ''?>
								>
									<option value=""><?=GetMessage('CTRLR_GR_ED_LEVEL_DEF')?></option>
									<?php foreach ($permissions['reference_id'] as $j => $reference_id): ?>
										<option value="<?=$reference_id?>" <?php echo ($arSecOptions[$module_id] == $reference_id) ? 'selected' : ''?>><?=htmlspecialcharsEx($permissions['reference'][$j])?></option>
									<?php endforeach ?>
								</select>
								<?php if ($module_id == 'main'): ?>
									<br>
									<textarea
										name="SUB_SECURITY[<?=$i?>]"
										title="<?php echo GetMessage('CTRLR_GR_ED_SUBORD') ?>"
										rows="3"
										cols="40"
										id="<?=htmlspecialcharsbx('SUB_' . $fieldName)?>"
										<?php if (!in_array($arSecOptions[$module_id], $arMainSubordinateTask)):?>
											style="display:none;"
										<?php endif ?>
									><?=htmlspecialcharsbx($arSecuritySubordGroups[$group_id])?></textarea>
								<?php endif ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</table>
			<?php endforeach; ?>
			<a href="javascript:__NewSecGroup('')" id="security_add_link"><?php echo GetMessage('CTRLR_GR_ED_GROUP_MORE') ?></a>
			<input type="hidden" name="SECURITY_COUNT" id="SECURITY_COUNT" value="<?=$i?>">
		</td>
	</tr>
	<?php $tabControl->BeginNextTab(); ?>
	<?php
	$COUNTER_UPDATE_PERIOD = intval($arGroupFields['COUNTER_UPDATE_PERIOD']);
	if ($COUNTER_UPDATE_PERIOD % (60 * 24 * 30) == 0)
	{
		$COUNTER_UPDATE_PERIOD_TYPE = 'N';
		$COUNTER_UPDATE_PERIOD /= (60 * 24 * 30);
	}
	elseif ($COUNTER_UPDATE_PERIOD % (60 * 24 * 7) == 0)
	{
		$COUNTER_UPDATE_PERIOD_TYPE = 'W';
		$COUNTER_UPDATE_PERIOD /= (60 * 24 * 7);
	}
	elseif ($COUNTER_UPDATE_PERIOD % (60 * 24) == 0)
	{
		$COUNTER_UPDATE_PERIOD_TYPE = 'D';
		$COUNTER_UPDATE_PERIOD /= (60 * 24);
	}
	elseif ($COUNTER_UPDATE_PERIOD % 60 == 0)
	{
		$COUNTER_UPDATE_PERIOD_TYPE = 'H';
		$COUNTER_UPDATE_PERIOD /= (60);
	}
	else
	{
		$COUNTER_UPDATE_PERIOD_TYPE = 'M';
	}
	?>
	<tr>
		<td width="40%"><label for="COUNTER_UPDATE_PERIOD"><?php echo GetMessage('CTRL_GR_ED_COUNTERS_REF') ?></label></td>
		<td width="60%">
			<input type="text" name="COUNTER_UPDATE_PERIOD" id="COUNTER_UPDATE_PERIOD" size="5" value="<?php echo $COUNTER_UPDATE_PERIOD ?>">
			<select name="COUNTER_UPDATE_PERIOD_TYPE" title="">
				<option value="M"<?php echo ($COUNTER_UPDATE_PERIOD_TYPE === 'M') ? ' selected' : ''?>><?php echo GetMessage('CTRL_GR_ED_COUNTERS_REF_MI') ?></option>
				<option value="H"<?php echo ($COUNTER_UPDATE_PERIOD_TYPE === 'H') ? ' selected' : ''?>><?php echo GetMessage('CTRL_GR_ED_COUNTERS_REF_HO') ?></option>
				<option value="D"<?php echo ($COUNTER_UPDATE_PERIOD_TYPE === 'D') ? ' selected' : ''?>><?php echo GetMessage('CTRL_GR_ED_COUNTERS_REF_DA') ?></option>
				<option value="W"<?php echo ($COUNTER_UPDATE_PERIOD_TYPE === 'W') ? ' selected' : ''?>><?php echo GetMessage('CTRL_GR_ED_COUNTERS_REF_WE') ?></option>
				<option value="N"<?php echo ($COUNTER_UPDATE_PERIOD_TYPE === 'N') ? ' selected' : ''?>><?php echo GetMessage('CTRL_GR_ED_COUNTERS_REF_MO') ?></option>
			</select>
		</td>
	</tr>

	<tr class="heading">
		<td colspan="2"><?php echo GetMessage('CTRL_GR_ED_COUNTERS_TITLE') ?></td>
	</tr>

	<tr>
		<td><label for="COUNTER_FREE_SPACE"><?php echo GetMessage('CTRL_GR_ED_COUNTERS_FREE') ?></label></td>
		<td>
			<input
				type="checkbox"
				id="COUNTER_FREE_SPACE"
				name="CHECK_COUNTER_FREE_SPACE"
				value="Y"
				<?php echo ($arGroupFields['CHECK_COUNTER_FREE_SPACE'] == 'Y') ? ' checked' : ''?>
			>
		</td>
	</tr>

	<tr>
		<td><label for="COUNTER_SITES"><?php echo GetMessage('CTRL_GR_ED_COUNTERS_SITES') ?></label></td>
		<td>
			<input
				type="checkbox"
				id="COUNTER_SITES"
				name="CHECK_COUNTER_SITES"
				value="Y"
				<?php echo ($arGroupFields['CHECK_COUNTER_SITES'] == 'Y') ? ' checked' : ''?>
			>
		</td>
	</tr>

	<tr>
		<td><label for="COUNTER_USERS"><?php echo GetMessage('CTRL_GR_ED_COUNTERS_USERS') ?></label></td>
		<td>
			<input
				type="checkbox"
				id="COUNTER_USERS"
				name="CHECK_COUNTER_USERS"
				value="Y"
				<?php echo ($arGroupFields['CHECK_COUNTER_USERS'] == 'Y') ? ' checked' : ''?>
			>
		</td>
	</tr>

	<tr>
		<td><label for="COUNTER_LAST_AUTH"><?php echo GetMessage('CTRL_GR_ED_COUNTERS_LAST_AU') ?></label></td>
		<td>
			<input
				type="checkbox"
				id="COUNTER_LAST_AUTH"
				name="CHECK_COUNTER_LAST_AUTH"
				value="Y"
				<?php echo ($arGroupFields['CHECK_COUNTER_LAST_AUTH'] == 'Y') ? ' checked' : ''?>
			>
		</td>
	</tr>
	<?php
	$arGroupCounters = [];
	if ($bVarsFromForm)
	{
		if (is_array($_REQUEST['CONTROLLER_COUNTER_ID']))
		{
			foreach ($_REQUEST['CONTROLLER_COUNTER_ID'] as $counterId)
			{
				$counterId = intval($counterId);
				$arGroupCounters[$counterId] = $counterId;
			}
		}
	}
	elseif ($copy_id || $ID)
	{
		$rsCounters = CControllerCounter::GetList([], [
			'CONTROLLER_GROUP_ID' => $copy_id ?: $ID,
		]);
		while ($arCounter = $rsCounters->Fetch())
		{
			$arGroupCounters[$arCounter['ID']] = $arCounter['ID'];
		}
	}

	$rsCounters = CControllerCounter::GetList(['NAME' => 'ASC'], []);
	while ($arCounter = $rsCounters->Fetch())
	{
		?>
		<tr>
			<td>
				<label for="COUNTER_<?php echo $arCounter['ID'] ?>"><?php echo htmlspecialcharsEx($arCounter['NAME']) ?>
					:</label></td>
			<td>
				<input
					type="checkbox"
					id="COUNTER_<?php echo $arCounter['ID'] ?>"
					name="CONTROLLER_COUNTER_ID[]"
					value="<?php echo $arCounter['ID'] ?>"
					<?php echo (array_key_exists($arCounter['ID'], $arGroupCounters)) ? ' checked' : ''?>
				>
			</td>
		</tr>
		<?php
	}
	?>

	<?php
	foreach ($arThirdSettings as $obOption):
		/** @var IControllerGroupOption $obOption */
		$tabControl->BeginNextTab();

		$arOptions = $obOption->GetOptionArray();
		foreach ($arOptions as $id => $arOptionParams):
			if (mb_substr($id, 0, 2) === '__'):
				?>
				<tr>
					<td colspan="2" align="center"><?=htmlspecialcharsEx($arOptionParams)?>:</td>
				</tr>
				<?php
			else:
				$OptionValue = $arGroupOptions[$obOption->id][$id];
				?>
				<tr>
					<td width="40%">
						<label for="ACT_<?=htmlspecialcharsbx($id)?>"><?=htmlspecialcharsEx($arOptionParams[0])?>
							:</label></td>
					<td width="60%"><?=CControllerGroupSettings::GenerateInput($id, $arOptionParams, $OptionValue, $obOption->id)?></td>
				</tr>
			<?php endif; ?>
		<?php endforeach; ?>
	<?php endforeach; ?>

	<?php $tabControl->BeginNextTab(); ?>
	<tr>
		<td><?php echo GetMessage('CTRLR_GR_ED_PHP_INST') ?></td>
	</tr>
	<tr>
		<td>
			<textarea
				style="width:100%; white-space: nowrap; overflow: auto;"
				rows="15"
				name="INSTALL_PHP"
				id="INSTALL_PHP"
				title=""
			><?php echo htmlspecialcharsbx($arGroupFields['INSTALL_PHP']) ?></textarea>
		</td>
	</tr>
	<tr>
		<td><?php echo GetMessage('CTRLR_GR_ED_PHP_UNINST') ?></td>
	</tr>
	<tr>
		<td>
			<textarea
				style="width:100%; white-space: nowrap; overflow: auto;"
				rows="15"
				name="UNINSTALL_PHP"
				id="UNINSTALL_PHP"
				title=""
			><?php echo htmlspecialcharsbx($arGroupFields['UNINSTALL_PHP']) ?></textarea>
		</td>
	</tr>
	<?php
	if (
		(count($USER_FIELD_MANAGER->GetUserFields($ENTITY_ID)) > 0) ||
		($USER_FIELD_MANAGER->GetRights($ENTITY_ID) >= 'W')
	)
	{
		$tabControl->BeginNextTab();
		if ($USER_FIELD_MANAGER->GetRights($ENTITY_ID) >= 'W')
		{
			echo '<tr ' . 'colspan="2"><td align="left"><a href="/bitrix/admin/userfield_edit.php?lang=' . LANGUAGE_ID . '&ENTITY_ID=' . urlencode($ENTITY_ID) . '&back_url=' . urlencode($APPLICATION->GetCurPageParam('', ['bxpublic']) . '&tabControl_active_tab=user_fields_tab') . '">' . GetMessage('USER_TYPE_EDIT_TAB_HREF') . '</a></td></tr>';
		}

		$arUserFields = $USER_FIELD_MANAGER->GetUserFields($ENTITY_ID, ($copy_id ?: $ID), LANGUAGE_ID);
		if (count($arUserFields) > 0)
		{
			foreach ($arUserFields as $FIELD_NAME => $arUserField)
			{
				$arUserField['VALUE_ID'] = intval($ID);
				echo $USER_FIELD_MANAGER->GetEditFormHTML(is_object($message), $GLOBALS[$FIELD_NAME], $arUserField);
			}
		}
	}

	$tabControl->EndTab();

	$tabControl->Buttons([
		'back_url' => 'controller_group_admin.php?lang=' . LANGUAGE_ID,
		'disabled' => !$USER->CanDoOperation('controller_group_manage'),
	]);?>
	<?php $tabControl->End(); ?>
	<input type="hidden" value="Y" name="apply">
</form>
<?php
if (COption::GetOptionString('fileman', 'use_code_editor', 'Y') == 'Y' && CModule::IncludeModule('fileman'))
{
	CCodeEditor::Show([
		'textareaId' => 'INSTALL_PHP',
		'height' => 250,
		'forceSyntax' => 'php',
	]);
	CCodeEditor::Show([
		'textareaId' => 'UNINSTALL_PHP',
		'height' => 250,
		'forceSyntax' => 'php',
	]);
}
?>
<?php $tabControl->ShowWarnings('form1', $message); ?>

<?php require $_SERVER['DOCUMENT_ROOT'] . BX_ROOT . '/modules/main/include/epilog_admin.php';
