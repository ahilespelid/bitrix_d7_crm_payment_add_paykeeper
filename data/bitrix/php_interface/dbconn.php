<?php
define("REST_APAUTH_ALLOW_HTTP", true);
define("C_REST_IGNORE_SSL", true);

$DBDebug = false;
$DBDebugToFile = false;

define("BX_FILE_PERMISSIONS", 0644);
define("BX_DIR_PERMISSIONS", 0755);
@umask(~(BX_FILE_PERMISSIONS | BX_DIR_PERMISSIONS) & 0777);

@ini_set("memory_limit", "1024M");

define("BX_DISABLE_INDEX_PAGE", true);

mb_internal_encoding("UTF-8");