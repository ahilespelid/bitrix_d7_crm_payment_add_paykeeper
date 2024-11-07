{"version":3,"file":"extension.map.js","names":["jn","define","require","exports","module","Loc","InputDesign","InputSize","InputMode","Input","SocialNetworkUserSelector","usersSelector","usersUpserted","intranetUsersUpserted","batchActions","store","dispatch","UserSelectorCard","LayoutComponent","constructor","props","super","this","parentWidget","PageManager","defaultUser","state","selectedUser","getDefaultUser","componentDidMount","fetchDefaultUser","env","userId","selectById","getState","id","title","fullName","BX","ajax","runAction","data","ids","then","result","status","Error","errors","items","mainInfo","users","intranetInfo","saveUserToRedux","setState","catch","console","error","actions","render","value","label","getMessage","size","L","design","PRIMARY","mode","NAKED","align","dropdown","onDropdown","openUserSelector","onFocus","make","provider","options","userProviderOptions","initSelectedIds","widgetParams","backdrop","mediumPositionPercent","horizontalSwipeAllowed","allowMultipleSelection","closeOnSelect","events","onClose","onChange","onViewHidden","show","pop","propTypes","PropTypes","string","object","func"],"sources":["extension.js"],"mappings":"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"}