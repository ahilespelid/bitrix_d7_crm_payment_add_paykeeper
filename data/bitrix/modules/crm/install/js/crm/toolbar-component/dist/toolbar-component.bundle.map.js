{"version":3,"file":"toolbar-component.bundle.map.js","names":["this","BX","exports","crm_router","main_core_events","main_popup","ui_buttons","ui_tour","ui_hint","main_core","ui_navigationpanel","_classPrivateMethodInitSpec","obj","privateSet","_checkPrivateRedeclaration","add","privateCollection","has","TypeError","_classPrivateMethodGet","receiver","fn","namespace","Reflection","instance","ToolbarEvents","babelHelpers","classCallCheck","defineProperty","_bindAutomationGuide","WeakSet","ToolbarComponent","_EventEmitter","inherits","_this","possibleConstructorReturn","getPrototypeOf","call","assertThisInitialized","initHints","setEventNamespace","Event","ready","bindEvents","bind","createClass","key","value","UI","Hint","init","popupParameters","closeByEsc","autoHide","angle","offset","offsetLeft","_this2","buttonNode","document","querySelector","toolbar","ToolbarManager","getDefaultToolbar","button","getButton","Dom","attr","entityTypeId","Number","dataset","counterNode","innerText","subscribeCategoriesUpdatedEvent","reloadCategoriesMenu","categoryId","_bindAutomationGuide2","emitTypeUpdatedEvent","data","emit","TYPE_UPDATED","emitAutomatedSolutionUpdatedEvent","AUTOMATED_SOLUTION_UPDATED","emitCategoriesUpdatedEvent","CATEGORIES_UPDATED","subscribeTypeUpdatedEvent","callback","subscribe","subscribeAutomatedSolutionUpdatedEvent","unsubscribeAutomatedSolutionUpdatedEvent","unsubscribe","_this3","menu","getMenuWindow","ajax","runAction","then","response","startKey","items","categories","menuItems","forEach","item","id","indexOf","push","options","destroy","unbindAll","getContainer","category","link","CrmEntityType","enumeration","deal","Router","Instance","getItemListUrlInCurrentView","toString","splice","text","Text","encode","name","href","setText","params","menuWindow","Menu","show","reloadAddButtonMenu","console","log","errors","_this4","addButtonNode","addButtonId","btnUniqid","menuItemsIds","getMenuItems","map","filter","Type","isInteger","categoryIds","idsToRemove","includes","newCategories","length","idToRemove","removeMenuItem","targetItemId","isString","at","addMenuItem","onclick","event","SidePanel","open","getSettingsButton","_i","_Object$entries","Object","entries","getButtons","_Object$entries$_i","slicedToArray","getIcon","ButtonIcon","SETTING","get","window","top","getClass","Crm","EventEmitter","hash","location","guide","robotsBtn","Guide","steps","target","title","Loc","getMessage","onEvents","scriptsBtn","article","start","getPopup","setAutoHide","setClosingByEsc","_classPrivateFieldInitSpec","privateMap","_checkPrivateRedeclaration$1","set","namespace$1","_id","WeakMap","_binding","NavigationBar","_NavigationPanel","isPlainObject","isArray","hasOwnProperty","active","isActive","isStringFilled","lockedCallback","locked","url","events","click","eval","openUrl","writable","classPrivateFieldSet","binding","itemId","classPrivateFieldGet","formatDate","Date","userOptions","save","setTimeout","NavigationPanel","Main","Tour"],"sources":["toolbar-component.bundle.js"],"mappings":"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"}