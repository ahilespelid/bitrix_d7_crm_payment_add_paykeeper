{"version":3,"file":"smiley.bundle.map.js","names":["this","BX","UI","exports","ui_textParser","main_core","_name","babelHelpers","classPrivateFieldLooseKey","_image","_typing","_width","_height","Smiley","constructor","smileyOptions","Object","defineProperty","writable","value","options","Type","isPlainObject","setName","name","setImage","image","setTyping","typing","setWidth","width","setHeight","height","getName","classPrivateFieldLooseBase","getImage","getTyping","getWidth","getHeight","_splitOffsets","_tokenTree","_textParser","_parseSmileys","_consumeSmiley","_isWordBoundary","_isNextWordBoundary","_parseEmoji","SmileyParser","smileys","_parseEmoji2","_isNextWordBoundary2","_isWordBoundary2","_consumeSmiley2","_parseSmileys2","TokenTree","forEach","smiley","addToken","parse","text","TextParser","hasNext","success","consumeText","tryChangePosition","currentPosition","getCurrentPosition","push","start","end","flushText","consumeTree","getTreeIndex","hasPendingText","last","at","isWordBoundary","isSmileyNext","isDelimiter","peek","_smileys","SmileyManager","static","size","get","values","Map","settings","Extension","getSettings","set"],"sources":["smiley.bundle.js"],"mappings":"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"}