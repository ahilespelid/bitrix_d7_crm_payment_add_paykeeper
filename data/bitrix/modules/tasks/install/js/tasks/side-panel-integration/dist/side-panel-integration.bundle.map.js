{"version":3,"file":"side-panel-integration.bundle.map.js","names":["this","BX","exports","main_core","main_popup","_popup","babelHelpers","classPrivateFieldLooseKey","_sliders","_frozen","_frozenProps","SidePanelIntegration","constructor","popup","Object","defineProperty","writable","value","Set","classPrivateFieldLooseBase","subscribe","handlePopupShow","bind","handlePopupClose","handleSliderOpen","handleSliderClose","handleSliderDestroy","bindEvents","clear","unbindEvents","unfreeze","top","Event","EventEmitter","unsubscribe","event","sliderEvent","getData","slider","getSlider","isPopupInSlider","add","freeze","delete","size","destroy","getFrameWindow","document","contains","getPopupContainer","getContainer","autoHide","closeByEsc","setAutoHide","setClosingByEsc","Dom","style","Tasks","Main"],"sources":["side-panel-integration.bundle.js"],"mappings":"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"}