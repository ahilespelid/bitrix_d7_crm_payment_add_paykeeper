{"version":3,"file":"enable-feature.bundle.map.js","names":["this","BX","Messenger","v2","Component","exports","im_v2_component_elements","im_v2_component_message_supervisor_base","main_core","im_v2_lib_analytics","stafftrack_userStatisticsLink","EnableFeatures","Object","freeze","copilot","newsLine","chatCalls","calendar","documents","mail","groups","tasks","crm","marketing","automation","warehouseAccounting","sign","scrum","invoices","saleshub","websitesStores","checkIn","checkInGeo","UpdateFeatures","collaborativeDocumentEditing","leadsCRM","mailBoxNumber","enterpriseAdmin","loginHistory","crmHistory","tasksRobots","crmAnalytics","crmInvoices","onOpenToolsSettings","toolId","Analytics","getInstance","SidePanel","Instance","open","window","location","origin","openCheckInQrCode","UserStatisticsLink","intent","CHECK_IN_SETTINGS_INTENT","show","onHelpClick","ARTICLE_CODE","Helper","metaData","title","Loc","getMessage","description","detailButton","text","callback","infoButton","TOOL_ID_PARAMS_KEY","BUTTON_COLOR","SupervisorEnableFeatureMessage","name","components","ButtonComponent","Button","SupervisorBaseMessage","props","item","type","required","dialogId","String","computed","message","ButtonSize","buttonColorScheme","backgroundColor","borderColor","iconColor","textColor","hoverColor","componentParams","toolData","modifierImageClass","template","Message","Elements","Lib","Stafftrack"],"sources":["enable-feature.bundle.js"],"mappings":"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"}