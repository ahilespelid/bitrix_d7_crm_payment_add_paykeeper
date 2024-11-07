{"version":3,"file":"channel-selector.bundle.map.js","names":["this","BX","Crm","exports","crm_router","main_core","main_core_events","main_loader","main_popup","ui_icons_service","ui_menuConfigurable","_","t","_t","_t2","_t3","_t4","_t5","_t6","_t7","_t8","_t9","_t10","_t11","_t12","CrmActivityEditor","Reflection","namespace","UserOptions","NotificationCenter","CHANNEL_TYPE_PHONE","CHANNEL_TYPE_EMAIL","CHANNEL_TYPE_IM","MAX_VISIBLE_ITEMS","MARKET_LINK","LINK_IN_MESSAGE_PLACEHOLDER","items","Map","_link","babelHelpers","classPrivateFieldLooseKey","_isInsertLinkInMessage","_loader","_getLinkPromise","_menu","_menuConfigurable","_getChannelById","_isChannelAvailable","_getLink","_handleFooterClick","_handleSettingsClick","_openMenu","_getMenuItemsInViewMode","_getMenu","_switchMenuToEditMode","_saveSettings","_switchMenuToViewMode","_getMenuItemsInEditMode","_getMenuConfigurable","_showGetLinkErrorNotification","_showNotice","_handleChannelClick","_getSmsText","_openContactCenter","_showLoader","_hideLoader","_getLoader","List","EventEmitter","constructor","parameters","_parameters$templateC","super","Object","defineProperty","value","_getLoader2","_hideLoader2","_showLoader2","_openContactCenter2","_getSmsText2","_handleChannelClick2","_showNotice2","_showGetLinkErrorNotification2","_getMenuConfigurable2","_getMenuItemsInEditMode2","_switchMenuToViewMode2","_saveSettings2","_switchMenuToEditMode2","_getMenu2","_getMenuItemsInViewMode2","_openMenu2","_handleSettingsClick2","_handleFooterClick2","_getLink2","_isChannelAvailable2","_getChannelById2","writable","isCombineMessageWithLink","title","Type","isStringFilled","Loc","getMessage","documentTitle","String","body","fullBody","classPrivateFieldLooseBase","link","isLinkObtainable","Text","toBoolean","entityTypeId","toInteger","entityId","id","Math","random","toString","substring","storageTypeId","files","isArray","activityEditorId","smsUrl","isBoolean","isInsertLinkInMessage","templateCode","setChannels","channels","communications","isPlainObject","hasVisibleChannels","channelIcons","contactCenterUrl","layout","setEventNamespace","size","set","forEach","channel","push","render","container","Tag","encode","footer","bind","settings","list","channelNode","renderChannel","map","icon","appendChild","adjustAppearance","channelHandler","getChannelIcon","renderChannelMainTitle","renderChannelTitle","_channel$categoryTitl","categoryTitle","Dom","clean","allChannelsAreHidden","node","append","removeClass","addClass","isHidden","setFiles","setLink","sendEmail","length","Number","then","_CrmActivityEditor$it","addEmail","subject","catch","reason","_CrmActivityEditor$it2","diskfiles","storageTypeID","sendSms","requestParams","text","providerId","isProviderFixed","canUseBitrix24Provider","templatePlaceholders","DOCUMENT_URL","isEditable","Router","openSlider","width","requestMethod","openMessenger","top","BXIM","type","VALUE","RECENT","MENU","getId","static","get","getIconByChannelId","find","isAvailable","hasLink","Boolean","hasFiles","console","log","Promise","resolve","reject","emitAsync","result","finally","focus","setSelectionRange","document","execCommand","event","BaseEvent","emit","isDefaultPrevented","show","settingsItems","onclick","delimiter","href","item","_item$getMenuWindow","menu","getMenuWindow","getRootMenuWindow","close","MenuManager","create","bindElement","open","isCanceled","destroy","save","JSON","stringify","_babelHelpers$classPr","Menu","maxVisibleItems","subscribe","setItems","content","notify","setData","message","replace","location","reload","loader","hide","Loader","offset","left","ChannelSelector","Event","Main","UI","MenuConfigurable"],"sources":["channel-selector.bundle.js"],"mappings":"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"}