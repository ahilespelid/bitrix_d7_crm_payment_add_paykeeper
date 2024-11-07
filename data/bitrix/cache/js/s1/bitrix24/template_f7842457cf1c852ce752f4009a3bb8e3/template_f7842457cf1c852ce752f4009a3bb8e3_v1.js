
; /* Start:"a:4:{s:4:"full";s:62:"/local/components/wg/crmpayment/WGCrmPayment.js?17309038866027";s:6:"source";s:47:"/local/components/wg/crmpayment/WGCrmPayment.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
BX.namespace('WGCrmPayment')

BX.WGCrmPayment = {


	init: function (params) {
		var currentWindow = top.window;
		if (top.BX.SidePanel && top.BX.SidePanel.Instance && top.BX.SidePanel.Instance.getTopSlider()) {
			currentWindow = top.BX.SidePanel.Instance.getTopSlider().getWindow();
			panel = top.BX.SidePanel.Instance.getTopSlider().iframe.contentDocument.body;
		
			const observer = new MutationObserver(() => {
				PaymentHref = $(panel).find('#popup-window-content-payment-documents-create-document-action'); 
				TryToFound = $(panel).find('#wg-custom-pay'); 

				if (PaymentHref.length > 0 && TryToFound.length == 0){
					innerWrapper = $(PaymentHref[0]).find('.menu-popup-items');
					var delimiter = BX.create("span",
						{
							props: { className: "popup-window-delimiter-section main-buttons-submenu-delimiter main-buttons-submenu-item main-buttons-manage", 
									 draggable: false, 
									 id: "wg-custom-pay-delimiter"},
							children: [
								BX.create("span",
								{
									props: { className: "popup-window-delimiter-text"},
									html: "Расширения"
								})
							]
						}
					);

					var item = BX.create("span",
						{
							props: { className: "menu-popup-item menu-popup-no-icon"},
							children: [
								BX.create("span",
								{
									props: { className: "menu-popup-item-text", id: "wg-custom-pay"},
									html: "Оплата по ссылке"
								})
							]
						}
					);
					
					BX.bind(item, 'click', BX.delegate(function()
					{
						if(BX.Crm.EntityEditor !== undefined) {
							el = BX.Crm.EntityEditor.defaultInstance;
							if (/deal_/.test(el._id)) {
								   editor = el //BX.Crm.EntityEditor.get(el._id);
								   //editor.reload();
								   //editor.refreshLayout();
								   console.log('CRMPayment runComponentAction');
								   BX.UI.Notification.Center.notify({
										category: "wg-custompay",
										content: 'Ожидайте создания оплаты, репликация с&nbsp;PayKeeper требует больше времени.',
										autoHideDelay: 15000
								   });
								   
								   var request = BX.ajax.runComponentAction('wg:crmpayment' , 'savePayment', {
									   mode: "ajax",
									   data: {
										   entityId: el._entityId
									   }
								});
									request.then(function(response){
									   console.log('ajax', response.data['fields']);
										if (response.data['result'] == false) {
											   BX.UI.Notification.Center.notify({
													category: "wg-custompay",
												    content: response.data['errors'][0],
												    autoHideDelay: 5000
										});
									}
										editor.refreshLayout();
										if (response.data['fields']) {
											BX.UI.Notification.Center.notify({
												category: "wg-custompay",
						 						content: `Создана оплата №${response.data['fields']['accountNumber']} на&nbsp;сумму ${response.data['fields']['sum']}<br>Ссылка на&nbsp;оплату в&nbsp;таймлайн.`,
											    autoHideDelay: 10000,
												actions: [{
												   title: "Обновить сделку",
												   events: {
														click: function(event, balloon, action) {
															balloon.close();
															slider = top.BX.SidePanel.Instance.getTopSlider();
															if (slider) slider.reload();
													   	} 
												  	} 
											   	}]
											});
										}
									});
							}
						}
					}, this));
					
					BX.bind(item, "mousedown", function(event)
					{
						BX.PreventDefault(event);
					});

					innerWrapper.children().last().after(delimiter);
					innerWrapper.children().last().after(item);
				} 
				
			});
			observer.observe(panel, {
	  			subtree: true,
	  			childList: true,
			});
		
			/*	
			BX.addCustomEvent(currentWindow,'PaymentDocuments.EntityEditor:changeDocuments', function (event) {
				panel = top.BX.SidePanel.Instance.getTopSlider().iframe.contentDocument.body;
				BX.WGCrmPayment.showPayButton(panel);
			});
			*/
		}
	},


	showPayButton: function (panel) {
		var btn = null
	
		if ($(panel).find('#crmpayment-btn').length == 0 ) {
	
			//Ищем кнопку "Принять оплату"
			innerWrapper = $(panel).find('.crm-entity-widget-content-block-inner-pay-button');
			//Скрываем "Добавить оплату" в нижней части блока
			//addPaymentHref = $(panel).find('#popup-window-content-payment-documents-create-document-action'); //.css( "visibility", "hidden" );
			
			
			var a = BX.create("button",
				{
					props: { className: "ui-btn ui-btn-sm ui-btn-primary ui-btn-icon-tariff", id: "crmpayment-btn"},
					text : '',
					style: {'margin-left': 'auto'},
					attrs : {type: 'button'}
				}
			);
			
			BX.bind(a, 'click', BX.delegate(function()
			{
				if(BX.Crm.EntityEditor !== undefined) {
					el = BX.Crm.EntityEditor.defaultInstance;
					if (/deal_/.test(el._id)) {
						   editor = el //BX.Crm.EntityEditor.get(el._id);
						   //editor.reload();
						   //editor.refreshLayout();
						   console.log('CRMPayment runComponentAction');
						   
						   var request = BX.ajax.runComponentAction('wg:crmpayment' , 'savePayment', {
							   mode: "ajax",
							   data: {
								   entityId: el._entityId
							   }
						});
							request.then(function(response){
							   console.log('ajax', response.data['fields']);
							   	if (response.data['result'] == false) {
							   		BX.UI.Notification.Center.notify({
								   		content: response.data['errors'][0]
							   		});
								}
							   editor.refreshLayout();
						});
						   
					}
				}
			}, this));
			
			BX.bind(a, "mousedown", function(event)
			{
				BX.PreventDefault(event);
			});
			
			innerWrapper.before(a);
	}
	}	
}
	

/* End */
;
; /* Start:"a:4:{s:4:"full";s:58:"/bitrix/templates/bitrix24/bitrix24.min.js?172899961725366";s:6:"source";s:38:"/bitrix/templates/bitrix24/bitrix24.js";s:3:"min";s:42:"/bitrix/templates/bitrix24/bitrix24.min.js";s:3:"map";s:42:"/bitrix/templates/bitrix24/bitrix24.map.js";}"*/
(function(){var t=window!==window.top;var e=window.location.search;var n=e.indexOf("IFRAME=")!==-1||e.indexOf("IFRAME%3D")!==-1;if(t&&n){return}else if(t){window.top.location=window.location.href;return}BX.addCustomEvent("onFrameDataRequestFail",(function(t){top.location="/auth/?backurl="+encodeURIComponent(B24.getBackUrl())}));BX.addCustomEvent("onAjaxFailure",(function(t){var e="/auth/?backurl="+B24.getBackUrl();if(t=="auth"&&typeof window.frameRequestStart!=="undefined"){top.location=e}}));BX.addCustomEvent("onPopupWindowInit",(function(t,e,n){if(t=="bx_log_filter_popup"){n.lightShadow=true;n.className=""}else if(t=="task-legend-popup"){n.lightShadow=true;n.offsetTop=-15;n.offsetLeft=-670;n.angle={offset:740}}else if(t=="task-gantt-filter"||t=="task-list-filter"){n.lightShadow=true;n.className=""}else if(t.indexOf("sonet_iframe_popup_")>-1){n.lightShadow=true}}));BX.addCustomEvent("onJCClockInit",(function(t){JCClock.setOptions({centerXInline:83,centerX:83,centerYInline:67,centerY:79,minuteLength:31,hourLength:26,popupHeight:229,inaccuracy:15,cancelCheckClick:true})}));BX.addCustomEvent("onPullEvent-main",(function(t,e){if(t=="user_counter"&&e[BX.message("SITE_ID")]){var n=BX.clone(e[BX.message("SITE_ID")]);B24.updateCounters(n,false)}}));BX.addCustomEvent("onPullEvent-tasks",(function(t,e){if(t=="user_counter"&&Number(e.userId)===Number(BX.Loc.getMessage("USER_ID"))){var n={};if(!BX.Type.isUndefined(e.projects_major)){n.projects_major=e.projects_major}if(!BX.Type.isUndefined(e.scrum_total_comments)){n.scrum_total_comments=e.scrum_total_comments}B24.updateCounters(n,false)}}));BX.addCustomEvent("onPullEvent-bitrix24",BX.delegate((function(t,e){if(t=="userLimitNotify"){BX.UI.Notification.Center.notify({content:e.message})}}),this));if(typeof window.frameRequestStart!=="undefined"&&BX.PULL){BX.PULL.subscribe({moduleId:"main",command:"composite-cache-up",callback:function(){setTimeout((function(){const t=BX.localStorage.get("ajax-composite-cache-up-lock");if(!t){BX.localStorage.set("ajax-composite-cache-up-lock","EXECUTE",2);BX.ajax({url:"/blank.php",method:"GET",processData:false,skipBxHeader:true,emulateOnload:false})}}),Math.floor(Math.random()*500))}})}BX.addCustomEvent(window,"onImUpdateCounter",(function(t){if(!t)return;B24.updateCounters(BX.clone(t),false)}));BX.addCustomEvent("onCounterDecrement",(function(t){B24.decrementCounter(BX("menu-counter-live-feed"),t)}));BX.addCustomEvent("onImUpdateCounterNotify",(function(t){B24.updateInformer(BX("im-informer-events",true),t)}));BX.addCustomEvent("onImUpdateCounterMessage",(function(t){B24.updateInformer(BX("im-informer-messages",true),t);B24.updateCounters({"im-message":t},false)}));BX.addCustomEvent("onImUpdateCounterNetwork",(function(t){B24.updateInformer(BX("b24network-informer-events",true),t)}));BX.addCustomEvent("openLicenseAllSlider",(()=>{BX.SidePanel.Instance.open("/bitrix/components/bitrix/bitrix24.license.all/index.php",{cacheable:false,allowChangeHistory:false,width:1250})}));BX.addCustomEvent("Kanban.Grid:onFixedModeStart",(function(){BX.ready((function(){BX("footer").style.visibility="hidden"}))}));BX.addCustomEvent("Intranet.Search.Title:onFocusAction",(function(t){if(!BX.type.isDomNode(BX("header-buttons"))||!BX("header-buttons").querySelector(".ui-btn")){return}var e=BX("timeman-container");var n=BX("header");if(!BX.type.isDomNode(e)||!BX.type.isDomNode(n)){return}if(t==="gain"){e.style.webkitTransition="min-width .2s, width .2s, opacity .1s, padding .2s";n.style.width=n.offsetWidth+"px";if(document.body.offsetWidth<1660){e.style.opacity="0";setTimeout(function(){BX.addClass(e,"timeman-container--hide")}.bind(this),100)}}else if(t==="lost"){e.style.webkitTransition="min-width .2s, width .2s, opacity .3s, padding .2s";BX.removeClass(e,"timeman-container--hide");setTimeout(function(){e.style.opacity="1";n.removeAttribute("style")}.bind(this),300)}}));BX.addCustomEvent("onPullError",BX.delegate((function(t,e){if(t=="AUTHORIZE_ERROR"){B24.connectionStatus("offline")}else if(t=="RECONNECT"&&(e==1008||e==1006)){B24.connectionStatus("connecting")}}),this));BX.addCustomEvent("onImError",BX.delegate((function(t,e){if(t=="AUTHORIZE_ERROR"||t=="SEND_ERROR"&&e=="AUTHORIZE_ERROR"){B24.connectionStatus("offline")}else if(t=="CONNECT_ERROR"){B24.connectionStatus("offline")}}),this));BX.addCustomEvent("onPullStatus",BX.delegate((function(t){if(t=="offline")B24.connectionStatus("offline");else B24.connectionStatus("online")}),this));if(BX.browser.SupportLocalStorage()){BX.addCustomEvent(window,"onLocalStorageSet",(function(t){if(t.key.substring(0,4)=="lmc-"){var e={};e[t.key.substring(4)]=t.value;B24.updateCounters(e,false)}}))}if(BX.getClass("BX.rest.AppLayout")){var i=BX.rest.AppLayout.initializePlacement("DEFAULT");i.prototype.showHelper=function(t,e){var n="";if(BX.type.isNumber(t)){n="redirect=detail&code="+t}else if(BX.type.isNotEmptyString(t)){n=t}else if(BX.type.isPlainObject(t)){for(var i in t){if(n.length){n+="&"}n+=i+"="+t[i]}}if(n.length){BX.Helper.show(n)}}}BX.ready((function(){BX.bind(window,"scroll",BX.throttle(B24.onScroll,150,B24))}))})();var B24={b24ConnectionStatusState:"online",b24ConnectionStatus:null,b24ConnectionStatusText:null,b24ConnectionStatusTimeout:null,formateDate:function(t){return BX.util.str_pad(t.getHours(),2,"0","left")+":"+BX.util.str_pad(t.getMinutes(),2,"0","left")},openLanguagePopup:function(t){if(!BX.type.isDomNode(BX("b24LangPopupContent")))return;BX.PopupWindowManager.create("b24LangPopup",t,{content:BX("b24LangPopupContent"),closeIcon:false,autoHide:true,closeByEsc:true,angle:{offset:50}}).show()},changeLanguage:function(t){window.location.href="/auth/?user_lang="+t+"&backurl="+B24.getBackUrl()},getBackUrl:function(){var t=window.location.pathname;var e=B24.getQueryString(["logout","login","back_url_pub","user_lang"]);return t+(e.length>0?"?"+e:"")},getQueryString:function(t){var e=window.location.search.substring(1);if(!BX.type.isNotEmptyString(e)){return""}var n=e.split("&");t=BX.type.isArray(t)?t:[];var i="";for(var o=0;o<n.length;o++){var a=n[o].split("=");var s=n[o].indexOf("=");var r=a[0];var l=BX.type.isNotEmptyString(a[1])?a[1]:false;if(!BX.util.in_array(r,t)){if(i!==""){i+="&"}i+=r+(s!==-1?"=":"")+(l!==false?l:"")}}return i},updateInformer:function(t,e){if(!t)return false;if(e>0){t.innerHTML=e;BX.addClass(t,"header-informer-act")}else{t.innerHTML="";BX.removeClass(t,"header-informer-act")}},updateCounters:function(t,e){BX.ready((function(){if(BX.getClass("BX.Intranet.LeftMenu")){BX.Intranet.LeftMenu.updateCounters(t,e)}}))},decrementCounter:function(t,e){BX.ready((function(){if(BX.getClass("BX.Intranet.LeftMenu")){BX.Intranet.LeftMenu.decrementCounter(t,e)}}))},showNotifyPopup:function(t){if(BX.hasClass(t,"header-informer-press")){BX.removeClass(t,"header-informer-press");BXIM.closeNotify()}else{BXIM.openNotify()}},showMessagePopup:function(t){if(typeof BXIM=="undefined")return false;BXIM.toggleMessenger()},closeBanner:function(t){BX.userOptions.save("bitrix24","banners",t,"Y");var e=BX("sidebar-banner-"+t);if(e){e.style.minHeight="auto";e.style.overflow="hidden";e.style.border="none";new BX.easing({duration:500,start:{height:e.offsetHeight,opacity:100},finish:{height:0,opacity:0},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function(t){if(t.height>=0){e.style.height=t.height+"px";e.style.opacity=t.opacity/100}if(t.height<=17){e.style.marginBottom=t.height+"px"}},complete:function(){e.style.display="none"}}).animate()}},showLoading:function(t){t=t||500;function e(){var t=BX("b24-loader");if(t){BX.addClass(t,"b24-loader-show intranet-loader-show");return true}return false}setTimeout((function(){if(!e()&&!BX.isReady){BX.ready(e)}}),t)}};B24.onScroll=function(){var t=BX.GetWindowScrollPos();if(B24.b24ConnectionStatus){if(B24.b24ConnectionStatus.getAttribute("data-float")=="true"){if(t.scrollTop<60){BX.removeClass(B24.b24ConnectionStatus,"bx24-connection-status-float");B24.b24ConnectionStatus.setAttribute("data-float","false")}}else{if(t.scrollTop>60){BX.addClass(B24.b24ConnectionStatus,"bx24-connection-status-float");B24.b24ConnectionStatus.setAttribute("data-float","true")}}}};B24.goUp=function(t){var e=BX.GetWindowScrollPos();new BX.easing({duration:500,start:{scroll:e.scrollTop},finish:{scroll:0},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function(t){window.scrollTo(0,t.scroll)},complete:function(){BX.onCustomEvent(window,"onGoUp");if(BX.type.isFunction(t)){t()}}}).animate()};B24.toggleMenu=function(t,e,n){var i=BX.findChild(t.parentNode,{tagName:"ul"},false,false);var o=BX.findChildren(i,{tagName:"li"},false);if(!o)return;var a=BX.findChild(t,{className:"menu-toggle-text"},true,false);if(!a)return;if(BX.hasClass(i,"menu-items-close")){i.style.height="0px";BX.removeClass(i,"menu-items-close");BX.removeClass(BX.nextSibling(BX.nextSibling(t)),"menu-items-close");i.style.opacity=0;s(true,i,i.scrollHeight);a.innerHTML=n;BX.userOptions.save("bitrix24",t.id,"hide","N")}else{s(false,i,i.offsetHeight);a.innerHTML=e;BX.userOptions.save("bitrix24",t.id,"hide","Y")}function s(e,n,i){n.style.overflow="hidden";new BX.easing({duration:200,start:{opacity:e?0:100,height:e?0:i},finish:{opacity:e?100:0,height:e?i:0},transition:BX.easing.transitions.linear,step:function(t){n.style.opacity=t.opacity/100;n.style.height=t.height+"px"},complete:function(){if(!e){BX.addClass(n,"menu-items-close");BX.addClass(BX.nextSibling(BX.nextSibling(t)),"menu-items-close")}n.style.cssText=""}}).animate()}};B24.licenseInfoPopup={show:function(t,e,n,i){if(BX.getClass("BX.Bitrix24.LicenseInfoPopup")){BX.Bitrix24.LicenseInfoPopup.show(t,e,n,i)}}};function showPartnerForm(t){BX=window.BX;BX.Bitrix24PartnerForm={bInit:false,popup:null,arParams:{}};BX.Bitrix24PartnerForm.arParams=t;BX.message(t["MESS"]);BX.Bitrix24PartnerForm.popup=BX.PopupWindowManager.create("BXPartner",null,{className:"bitrix24-partner__popup",autoHide:false,zIndex:0,offsetLeft:0,offsetTop:0,width:540,height:350,overlay:true,draggable:{restrict:true},closeByEsc:true,titleBar:BX.message("BX24_PARTNER_TITLE"),closeIcon:{right:"12px",top:"10px"},buttons:[new BX.PopupWindowButton({text:BX.message("BX24_BUTTON_SEND"),className:"ui-btn ui-btn-success",events:{click:function(){this.popupWindow.close();BX.UI.Feedback.Form.open({id:"intranet-license-partner-form-"+parseInt(Math.random()*1e3),portalUri:"https://bitrix24.team",forms:[{zones:["de"],id:883,lang:"de",sec:"a12ty8"},{zones:["com","in","eu","uk"],id:735,lang:"en",sec:"vlhmlv"},{zones:["es","co","mx"],id:900,lang:"es",sec:"w3qmwq"},{zones:["com.br"],id:901,lang:"pt",sec:"prnm4x"},{zones:["cn/tc"],id:902,lang:"cn-tc",sec:"z8isyg"},{zones:["cn"],id:903,lang:"cn-sc",sec:"hsxnam"},{zones:["pl"],id:904,lang:"pl",sec:"2ph9ph"},{zones:["it"],id:905,lang:"it",sec:"2r3owa"},{zones:["fr"],id:906,lang:"fr",sec:"jt2fii"},{zones:["com.tr"],id:907,lang:"tr",sec:"ovevp8"},{zones:["id"],id:908,lang:"id",sec:"7kq7v2"},{zones:["com/my"],id:909,lang:"ms",sec:"kmncmj"},{zones:["com/th"],id:910,lang:"th",sec:"sknbp9"},{zones:["vn"],id:911,lang:"vn",sec:"a573fy"},{zones:["jp"],id:912,lang:"jp",sec:"3purdq"},{zones:["ru"],id:2122,lang:"ru",sec:"8vralr"},{zones:["kz"],id:2128,lang:"ru",sec:"054phh"},{zones:["by"],id:2129,lang:"ru",sec:"srs85j"}],defaultForm:{id:735,lang:"en",sec:"vlhmlv"}})}}})],events:{onPopupFirstShow:function(){var t=new BX.Loader({size:80});t.show(this.getPopupContainer());BX.ajax.post("/bitrix/tools/b24_site_partner.php",{lang:BX.message("LANGUAGE_ID"),site_id:BX.message("SITE_ID")||"",arParams:BX.Bitrix24PartnerForm.arParams},BX.delegate((function(e){t.hide();this.setContent(e)}),this))}}});BX.Bitrix24PartnerForm.popup.show()}B24.Timemanager={inited:false,layout:{block:null,timer:null,info:null,event:null,tasks:null,status:null},data:null,timer:null,clock:null,formatTime:function(t,e){return BX.util.str_pad(parseInt(t/3600),2,"0","left")+":"+BX.util.str_pad(parseInt(t%3600/60),2,"0","left")+(!!e?":"+BX.util.str_pad(t%60,2,"0","left"):"")},formatWorkTime:function(t,e,n){return'<span class="tm-popup-notice-time-hours"><span class="tm-popup-notice-time-number">'+t+'</span></span><span class="tm-popup-notice-time-minutes"><span class="tm-popup-notice-time-number">'+BX.util.str_pad(e,2,"0","left")+'</span></span><span class="tm-popup-notice-time-seconds"><span class="tm-popup-notice-time-number">'+BX.util.str_pad(n,2,"0","left")+"</span></span>"},formatCurrentTime:function(t,e,n){var i="";if(BX.isAmPmMode()){i="AM";if(t>12){t=t-12;i="PM"}else if(t==0){t=12;i="AM"}else if(t==12){i="PM"}i='<span class="time-am-pm">'+i+"</span>"}else t=BX.util.str_pad(t,2,"0","left");return'<span class="time-hours">'+t+"</span>"+'<span class="time-semicolon">:</span>'+'<span class="time-minutes">'+BX.util.str_pad(e,2,"0","left")+"</span>"+i},init:function(t){BX.addCustomEvent("onTimeManDataRecieved",BX.proxy(this.onDataRecieved,this));BX.addCustomEvent("onTimeManNeedRebuild",BX.proxy(this.onDataRecieved,this));BX.addCustomEvent("onPlannerDataRecieved",BX.proxy(this.onPlannerDataRecieved,this));BX.addCustomEvent("onPlannerQueryResult",BX.proxy(this.onPlannerQueryResult,this));BX.addCustomEvent("onTaskTimerChange",BX.proxy(this.onTaskTimerChange,this));BX.timer.registerFormat("worktime_notice_timeman",BX.proxy(this.formatWorkTime,this));BX.timer.registerFormat("bitrix24_time",BX.proxy(this.formatCurrentTime,this));BX.addCustomEvent(window,"onTimemanInit",BX.proxy((function(){this.inited=true;this.layout.block=BX("timeman-block");this.layout.timer=BX("timeman-timer");this.layout.info=BX("timeman-info");this.layout.event=BX("timeman-event");this.layout.tasks=BX("timeman-tasks");this.layout.status=BX("timeman-status");this.layout.statusBlock=BX("timeman-status-block");this.layout.taskTime=BX("timeman-task-time");this.layout.taskTimer=BX("timeman-task-timer");this.layout.checkInCounter=BX("timeman-stafftrack-counter");window.BXTIMEMAN.ShowFormWeekly(t);BX.bind(this.layout.block,"click",BX.proxy(this.onTimemanClick,this));BXTIMEMAN.setBindOptions({node:this.layout.block,mode:"popup",popupOptions:{angle:{position:"top",offset:130},offsetTop:10,autoHide:true,offsetLeft:-60,events:{onClose:function(){BX.removeClass(this.layout.block,"timeman-block-active")}.bind(this),onFirstShow:function(t){var e=t.getTarget();BX.Event.EventEmitter.subscribe("BX.Main.InterfaceButtons:onMenuShow",(function(){e.close()}))}}}});this.redraw()}),this))},onTimemanClick:function(){BX.addClass(this.layout.block,"timeman-block-active");BXTIMEMAN.Open()},onTaskTimerChange:function(t){if(t.action==="refresh_daemon_event"){if(!!this.taskTimerSwitch){this.layout.taskTime.style.display="";if(this.layout.info.style.display!="none"){this.layout.statusBlock.style.display="none"}this.taskTimerSwitch=false}var e="";e+=this.formatTime(parseInt(t.data.TIMER.RUN_TIME||0)+parseInt(t.data.TASK.TIME_SPENT_IN_LOGS||0),true);if(!!t.data.TASK.TIME_ESTIMATE&&t.data.TASK.TIME_ESTIMATE>0){e+=" / "+this.formatTime(parseInt(t.data.TASK.TIME_ESTIMATE))}this.layout.taskTimer.innerHTML=e}else if(t.action==="start_timer"){this.taskTimerSwitch=true}else if(t.action==="stop_timer"){this.layout.taskTime.style.display="none";this.layout.statusBlock.style.display=""}},setTimer:function(){if(this.timer){this.timer.setFrom(new Date(this.data.INFO.DATE_START*1e3));this.timer.dt=-this.data.INFO.TIME_LEAKS*1e3}else{this.timer=BX.timer(this.layout.timer,{from:new Date(this.data.INFO.DATE_START*1e3),dt:-this.data.INFO.TIME_LEAKS*1e3,display:"simple"})}},stopTimer:function(){if(this.timer!=null){BX.timer.stop(this.timer);this.timer=null}},redraw_planner:function(t){if(!!t.TASKS_ENABLED){t.TASKS_COUNT=!t.TASKS_COUNT?0:t.TASKS_COUNT;this.layout.tasks.innerHTML=t.TASKS_COUNT;this.layout.tasks.style.display=t.TASKS_COUNT==0?"none":"inline-block"}if(!!t.CALENDAR_ENABLED){this.layout.event.innerHTML=t.EVENT_TIME;this.layout.event.style.display=t.EVENT_TIME==""?"none":"inline-block"}this.layout.info.style.display=BX.style(this.layout.tasks,"display")=="none"&&BX.style(this.layout.event,"display")=="none"?"none":"block"},redraw:function(){const t=this.data.CHECKIN_COUNTER?.VALUE;const e=this.data.CHECKIN_COUNTER?.CLASS;if(t){BX.Runtime.loadExtension("ui.counter").then((()=>{BX.Dom.style(this.layout.checkInCounter,"display","");this.layout.checkInCounter.firstElementChild.textContent=t;const n=this.layout.checkInCounter.dataset.class;BX.Dom.removeClass(this.layout.checkInCounter,n);BX.Dom.addClass(this.layout.checkInCounter,e);this.layout.checkInCounter.dataset.class=e}))}else{this.layout.checkInCounter.style.display="none"}this.redraw_planner(this.data.PLANNER);if(this.data.STATE=="CLOSED"&&(this.data.CAN_OPEN=="REOPEN"||!this.data.CAN_OPEN))this.layout.status.innerHTML=this.getStatusName("COMPLETED");else this.layout.status.innerHTML=this.getStatusName(this.data.STATE);if(!this.timer)this.timer=BX.timer({container:this.layout.timer,display:"bitrix24_time"});var n="";if(this.data.STATE=="CLOSED"){if(this.data.CAN_OPEN=="REOPEN"||!this.data.CAN_OPEN)n="timeman-completed";else n="timeman-start"}else if(this.data.STATE=="PAUSED")n="timeman-paused";else if(this.data.STATE=="EXPIRED")n="timeman-expired";BX.removeClass(this.layout.block,"timeman-completed timeman-start timeman-paused timeman-expired");BX.addClass(this.layout.block,n);if(n=="timeman-start"||n=="timeman-paused"){this.startAnimation()}else{this.endAnimation()}},getStatusName:function(t){return BX.message("TM_STATUS_"+t)},onDataRecieved:function(t){t.OPEN_NOW=false;this.data=t;if(this.inited)this.redraw()},onPlannerQueryResult:function(t,e){if(this.inited)this.redraw_planner(t)},onPlannerDataRecieved:function(t,e){if(this.inited)this.redraw_planner(e)},animation:null,animationTimeout:3e4,blinkAnimation:null,blinkLimit:10,blinkTimeout:750,startAnimation:function(){if(this.animation!==null){this.endAnimation()}this.startBlink();this.animation=setInterval(BX.proxy(this.startBlink,this),this.animationTimeout)},endAnimation:function(){this.endBlink();if(this.animation){clearInterval(this.animation)}this.animation=null},startBlink:function(){if(this.blinkAnimation!==null){this.endBlink()}var t=0;this.blinkAnimation=setInterval(BX.proxy((function(){if(++t>=this.blinkLimit){clearInterval(this.blinkAnimation);BX.show(BX("timeman-background",true))}else{BX.toggle(BX("timeman-background",true))}}),this),this.blinkTimeout)},endBlink:function(){if(this.blinkAnimation){clearInterval(this.blinkAnimation)}BX("timeman-background",true).style.cssText="";this.blinkAnimation=null}};B24.Bitrix24InviteDialog={bInit:false,popup:null,arParams:{}};B24.Bitrix24InviteDialog.Init=function(t){if(t)B24.Bitrix24InviteDialog.arParams=t;if(B24.Bitrix24InviteDialog.bInit)return;BX.message(t["MESS"]);B24.Bitrix24InviteDialog.bInit=true;BX.ready(BX.delegate((function(){B24.Bitrix24InviteDialog.popup=BX.PopupWindowManager.create("B24InviteDialog",null,{autoHide:false,zIndex:0,offsetLeft:0,offsetTop:0,overlay:true,draggable:{restrict:true},closeByEsc:true,titleBar:BX.message("BX24_INVITE_TITLE_INVITE"),contentColor:"white",contentNoPaddings:true,closeIcon:{right:"12px",top:"10px"},buttons:[],className:"bx-b24-invite-dialog-popup",content:'<div style="width:500px;height:300px; background: url(/bitrix/templates/bitrix24/images/loader.gif) no-repeat center;"></div>',events:{onAfterPopupShow:function(){B24.Bitrix24InviteDialog.loadForm()},onPopupClose:function(){BX.InviteDialog.onInviteDialogClose()}}})}),this))};B24.Bitrix24InviteDialog.ShowForm=function(t){B24.Bitrix24InviteDialog.Init(t);B24.Bitrix24InviteDialog.popup.show()};B24.Bitrix24InviteDialog.loadForm=function(){B24.Bitrix24InviteDialog.popup.setContent('<div style="width:500px;height:300px; background: url(/bitrix/templates/bitrix24/images/loader.gif) no-repeat center;"></div>');BX.ajax.post("/bitrix/tools/intranet_invite_dialog.php",{lang:BX.message("LANGUAGE_ID"),site_id:BX.message("SITE_ID")||"",arParams:B24.Bitrix24InviteDialog.arParams},BX.delegate((function(t){B24.Bitrix24InviteDialog.popup.setContent(t);B24.Bitrix24InviteDialog.popup.adjustPosition()}),this))};B24.Bitrix24InviteDialog.ReInvite=function(t){BX.ajax.post("/bitrix/tools/intranet_invite_dialog.php",{lang:BX.message("LANGUAGE_ID"),site_id:BX.message("SITE_ID")||"",reinvite:t,sessid:BX.bitrix_sessid()},BX.delegate((function(t){}),this))};B24.connectionStatus=function(t){if(!(t=="online"||t=="connecting"||t=="offline"))return false;if(this.b24ConnectionStatusState==t)return false;this.b24ConnectionStatusState=t;var e="";if(t=="offline"){b24ConnectionStatusStateText=BX.message("BITRIX24_CS_OFFLINE");e="bx24-connection-status-offline"}else if(t=="connecting"){b24ConnectionStatusStateText=BX.message("BITRIX24_CS_CONNECTING");e="bx24-connection-status-connecting"}else if(t=="online"){b24ConnectionStatusStateText=BX.message("BITRIX24_CS_ONLINE");e="bx24-connection-status-online"}clearTimeout(this.b24ConnectionStatusTimeout);var n=document.querySelector('[data-role="b24-connection-status"]');if(!n){var i=BX.GetWindowScrollPos();var o=i.scrollTop>60;this.b24ConnectionStatus=BX.create("div",{attrs:{className:"bx24-connection-status "+(this.b24ConnectionStatusState=="online"?"bx24-connection-status-hide":"bx24-connection-status-show bx24-connection-status-"+this.b24ConnectionStatusState)+(o?" bx24-connection-status-float":""),"data-role":"b24-connection-status","data-float":o?"true":"false"},children:[BX.create("div",{props:{className:"bx24-connection-status-wrap"},children:[this.b24ConnectionStatusText=BX.create("span",{props:{className:"bx24-connection-status-text"},html:b24ConnectionStatusStateText}),BX.create("span",{props:{className:"bx24-connection-status-text-reload"},children:[BX.create("span",{props:{className:"bx24-connection-status-text-reload-title"},html:BX.message("BITRIX24_CS_RELOAD")}),BX.create("span",{props:{className:"bx24-connection-status-text-reload-hotkey"},html:BX.browser.IsMac()?"&#8984;+R":"Ctrl+R"})],events:{click:function(){location.reload()}}})]})]})}else{this.b24ConnectionStatus=n}if(!this.b24ConnectionStatus)return false;if(t=="online"){clearTimeout(this.b24ConnectionStatusTimeout);this.b24ConnectionStatusTimeout=setTimeout(BX.delegate((function(){BX.removeClass(this.b24ConnectionStatus,"bx24-connection-status-show");this.b24ConnectionStatusTimeout=setTimeout(BX.delegate((function(){BX.removeClass(this.b24ConnectionStatus,"bx24-connection-status-hide")}),this),1e3)}),this),4e3)}this.b24ConnectionStatus.className="bx24-connection-status bx24-connection-status-show "+e+" "+(this.b24ConnectionStatus.getAttribute("data-float")=="true"?"bx24-connection-status-float":"");this.b24ConnectionStatusText.innerHTML=b24ConnectionStatusStateText;if(!n){var a=BX.findChild(document.body,{className:"bx-layout-inner-table"},true,false);a.parentNode.insertBefore(this.b24ConnectionStatus,a)}return true};B24.showPartnerOrderForm=function(t){if(typeof t!=="object")return;BX.PopupWindowManager.create("B24PartnerOrderForm",null,{autoHide:true,zIndex:0,offsetLeft:0,offsetTop:0,overlay:true,height:Math.min(document.documentElement.clientHeight-100,740),width:560,draggable:{restrict:true},closeByEsc:true,contentColor:"white",contentNoPaddings:true,content:'<script data-b24-form="inline/'+t.id+"/"+t.sec+'" data-skip-moving="true">'+"(function(w,d,u){"+'var s=d.createElement("script");s.async=true;s.src=u+"?"+(Date.now()/180000|0);'+'var h=d.getElementsByTagName("script")[0];h.parentNode.insertBefore(s,h);'+'})(window,document,"https://bitrix24.team/upload/crm/form/loader_${params.id}_${params.sec}.js");'+"<\/script>",events:{onPopupFirstShow:function(){(function(t,e,n){var i=e.createElement("script");i.async=true;i.src=n+"?"+(Date.now()/18e4|0);var o=e.getElementsByTagName("script")[0];o.parentNode.insertBefore(i,o)})(window,document,"https://bitrix24.team/upload/crm/form/loader_"+t.id+"_"+t.sec+".js")}}}).show()};B24.upgradeButtonRedirect=function(t){if(typeof t!=="object")return;var e=t.COUNTER_URL||"",n=t.LICENSE_PATH||"",i=t.HOST||"";BX.ajax.post(e,{action:"upgradeButton",host:i},BX.proxy((function(){BX.SidePanel.Instance.open(n)}),this))};B24.PopupBlur=function(){BX.PopupWindow.apply(this,arguments);this.setBlurBg();BX.Event.EventEmitter.subscribe("BX.Intranet.Bitrix24:ThemePicker:onThemeApply",this.setBlurBg.bind(this))};B24.PopupBlur.prototype={__proto__:BX.PopupWindow.prototype,constructor:B24.PopupBlur,setBlurBg:function(){var t=this.getPopupContainer();var e=window.getComputedStyle(document.body).backgroundImage;var n=window.getComputedStyle(document.body).backgroundColor;if(BX.Type.isDomNode(t)){t.classList.add("popup-window-blur")}var i=BX.create("style",{attrs:{type:"text/css"}});var o=".popup-window-content:after { "+"background-image: "+e+";"+"background-color: "+n+"} ";o=document.createTextNode(o);i.appendChild(o);document.head.appendChild(i);if(this.angle){this.setBlurBgAngle()}},setBlurBgAngle:function(){var t=window.getComputedStyle(document.body).backgroundColor;var e=BX.create("style",{attrs:{type:"text/css"}});var n=".popup-window-angly:after { "+"background-color: "+t+"} ";n=document.createTextNode(n);e.appendChild(n);document.head.appendChild(e)},setPadding:function(t){if(BX.Type.isNumber(t)&&t>=0){this.padding=t;this.getContentContainer().style.padding=t+"px"}else if(t===null){this.padding=null;this.getContentContainer().style.removeProperty("padding")}}};
/* End */
;; /* /local/components/wg/crmpayment/WGCrmPayment.js?17309038866027*/
; /* /bitrix/templates/bitrix24/bitrix24.min.js?172899961725366*/

//# sourceMappingURL=template_f7842457cf1c852ce752f4009a3bb8e3.map.js