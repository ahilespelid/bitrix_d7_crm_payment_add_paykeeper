{"version":3,"file":"requisites.bundle.map.js","names":["this","BX","Sign","exports","main_core","main_core_events","main_loader","sign_v2_api","_","t","_t","_t2","_t3","crmEditorSettings","entityTypeId","guid","params","ENABLE_PAGE_TITLE_CONTROLS","ENABLE_MODE_TOGGLE","IS_EMBEDDED","forceDefaultConfig","enableSingleSectionCombining","companyEntity","contactEntity","events","_requisitesNode","babelHelpers","classPrivateFieldLooseKey","_initiatorNode","_api","_editors","_members","_loadEntityEditor","_showEntityEditor","_getMembersData","_saveEditor","_addMembers","_removeMembers","_loadMembers","_getRequisiteData","_toggleCompany","_toggleContact","_toggleEntity","Requisites","EventEmitter","constructor","super","Object","defineProperty","value","_toggleEntity2","_toggleContact2","_toggleCompany2","_getRequisiteData2","_loadMembers2","_removeMembers2","_addMembers2","_saveEditor2","_getMembersData2","_showEntityEditor2","_loadEntityEditor2","writable","setEventNamespace","classPrivateFieldLooseBase","Tag","render","Api","documentData","getLayout","Text","encode","initiator","Event","bind","target","emit","preparingNode","Loc","getMessage","Hint","Reflection","getClass","init","checkInitiator","parentNode","Dom","addClass","focus","removeClass","async","entityData","uid","documentUid","MYCOMPANY_ID_INFO","COMPANY_DATA","companyData","CLIENT_INFO","CONTACT_DATA","contactData","REQUISITE_BINDING","REQUISITE_ID","selectedContactRequisite","companyEntityId","id","contactEntityId","companyRequisiteData","contactRequisiteData","documentMembers","itemsForRemove","filter","member","index","entityId","membersData","result","company","part","contact","length","companyUid","contactUid","companyPresetId","presetId","contactPresetId","reload","_babelHelpers$classPr","documentId","loader","Loader","size","_response$data","show","response","ajax","runAction","data","destroy","html","e","console","error","clean","editorNode","getContainer","appendChild","editorHtml","Runtime","Editor","defaultInstance","map","party","_advancedInfo$multiFi","title","url","advancedInfo","type","multiFields","editor","clientControl","getControlById","isInViewMode","hasContentToDisplay","promise","Promise","resolve","successFullEvent","errorEvents","subscribeOnce","event","forEach","save","unsubscribeAll","_babelHelpers$classPr2","_documentMembers$","_documentMembers$2","sameCompany","sameContact","companyPromise","addMember","contactPromise","all","removeItems","removeItem","removeMember","loadMembers","memberData","_babelHelpers$classPr3","selectedRequisiteId","_requisiteData$find","requisiteData","selectedItem","find","item","requisiteId","selected","crmEditor","companyField","companySection","contactsField","clientSection","field","section","switchToSingleEditMode","isRequired","args","getMode","UI","EntityEditorMode","view","switchControlMode","edit","apply","layout","remove","_addContactButton","switchToViewMode","getId","hasContacts","hasCompanies","enableToggling","V2"],"sources":["requisites.bundle.js"],"mappings":"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"}