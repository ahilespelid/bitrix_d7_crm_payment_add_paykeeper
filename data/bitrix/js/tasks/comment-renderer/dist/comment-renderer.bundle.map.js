{"version":3,"file":"comment-renderer.bundle.map.js","names":["this","BX","exports","main_core","socialnetwork_commentaux","CommentRenderer","babelHelpers","classCallCheck","createClass","key","value","getCommentPart","entity","_this","message","Loc","getMessage","CODE","e","Type","isStringFilled","isPlainObject","REPLACE_LIST","liveData","LIVE_DATA","Object","keys","forEach","search","replace","replaceAll","match","id","name","CommentAux","renderEntity","ENTITY_TYPE","NAME","LINK","userId","Number","actionList","action","start","concat","end","indexOf","EFFICIENCY_MEMBERS","includes","efficiencyUrlStart","removeAnchors","regExp","RegExp","timestamp","date","format","DATE_FORMAT","isUndefined","TASK_ID","RIGHTS","map","taskActionLink","getTaskActionLink","taskId","deadline","DEADLINE","params","actionMap","DEADLINE_CHANGE","TASK_APPROVE","TASK_DISAPPROVE","TASK_COMPLETE","TASK_CHANGE_RESPONSIBLE","link","Uri","addParam","commentAction","Tasks"],"sources":["comment-renderer.bundle.js"],"mappings":"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"}