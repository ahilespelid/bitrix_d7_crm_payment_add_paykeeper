{"version":3,"file":"access-rights-wrapper.bundle.map.js","names":["this","BX","Crm","exports","ui_accessrights","_dialogOptions","babelHelpers","classPrivateFieldLooseKey","_entitiesIdsEncoder","_entitiesIdsDecoder","_normalizeType","AccessRightsWrapper","constructor","Object","defineProperty","value","_normalizeType2","_entitiesIdsDecoder2","_entitiesIdsEncoder2","_dialogOptions2","draw","userGroups","accessRights","renderTo","accessRightsInstance","AccessRights","component","actionSave","actionDelete","isSaveOnlyChangedRights","useEntitySelectorDialogAsPopup","entitySelectorDialogOptions","options","classPrivateFieldLooseBase","entitiesIdsEncoder","entitiesIdsDecoder","normalizeType","sendActionRequest","fireEventReset","enableSearch","context","entities","id","intranetUsersOnly","emailUsers","inviteEmployeeLink","inviteGuestLink","selectMode","allowSelectRootDepartment","allowFlatDepartments","dynamicLoad","addProjectMembersCategories","itemOptions","default","link","linkTitle","dynamicSearch","code","test","match","userId","entityName","departmentId","projectId","postfix","item","entityId","originalId","subType","customData","get","originalType","Perms","UI"],"sources":["access-rights-wrapper.bundle.js"],"mappings":"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"}