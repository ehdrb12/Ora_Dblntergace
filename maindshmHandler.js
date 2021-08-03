GF.libPool.maindshmHandler = {
	// global variable
	_DS_POPNOTICE: null,
	_USER_AGENT: null,
	_DS_CHART_STD_DATA:null,
	_init: function (param) {

		this._initData();
		
		return this;
	}
	, _initData: function () {
		var oThis = this;
		
		var loginInfo = GF.getLogin();

		$("#user_info").prepend(" / <a href='#;' class='user'><strong>" + loginInfo.USER_NM + "</strong></a>");
		$("#user_info").prepend(" / " + loginInfo.USER_DESC);
		$("#user_info").prepend(loginInfo.DEPT_NM);

		$("#sel_lang").val(loginInfo.LANG_CD).prop("selected", true);
		
		oThis._USER_AGENT = navigator.userAgent.toLowerCase();

		var data = {};
		data.ACTION_ID = "SYSCOM001_01";
		data.DS_SEARCH = [];
		var sParam = {};
		sParam.WEB_TYPE = "PC";	
		
		if(oThis._USER_AGENT.match('iphone')|| oThis._USER_AGENT.match('ipad') || oThis._USER_AGENT.match('ipod') || oThis._USER_AGENT.match('android')) { 
			sParam.WEB_TYPE = "MOBILE";
		}		

		data.DS_SEARCH.push(sParam);
		
		AdaptorTransaction(data, function(res) {
		
			GV.MESSAGE = res.GDS_MESSAGE;
			GV.LABEL = res.GDS_LABEL;

			if (localStorageSupport()) {

				localStorage.setItem("GV.MESSAGE", JSON.stringify(res.GDS_MESSAGE));
				localStorage.setItem("GV.LABEL", JSON.stringify(res.GDS_LABEL));
			}
			
			//메뉴 start
			var source =
			{
				datatype: "json",
				datafields: [
					{ name: 'MENU_ID' },
					{ name: 'PRNT_MENU_ID' },
					{ name: 'MENU_NM' },
					{ name: 'PGM_URL' }
				],
				id: 'MENU_ID',
				localdata: JSON.stringify(res.GDS_ALL_MENU)
			};
			
			var dataAdapter = new $.jqx.dataAdapter(source, {
				loadComplete: function (records) {
					var menu_nm = "";
					var menu_ids = [];
					
					var getMenu = function(mData, cMenu){
						for(var i = 0; i<mData.length; i++){
							if(mData[i].MENU_ID == cMenu){

								menu_nm = mData[i].MENU_NM + " > " + menu_nm;
								menu_ids.push(mData[i].MENU_ID);
								
								if(mData[i].PRNT_MENU_ID != ""){
									getMenu(mData, mData[i].PRNT_MENU_ID);
								}else{
									
									return {"menu_nm":menu_nm, "menu_ids":menu_ids};
								}
							}
						}
						return {"menu_nm":menu_nm, "menu_ids":menu_ids};
					}

					var data = JSON.parse(records);
					var menu_info = {}
					for(var i=0; i < data.length; i++){
						menu_nm = "";
						menu_info = {};
						menu_info.id = data[i].MENU_ID;
						menu_info.text = data[i].MENU_NM;
						menu_nm = "[ " + data[i].MENU_NM + " ]";
						
						if(data[i].PRNT_MENU_ID != ""){
							menu_ids = [];
							menu_ids.push(data[i].MENU_ID);
							var cMenu = getMenu(data, data[i].PRNT_MENU_ID);
							menu_info.navi = cMenu.menu_nm;
							menu_info.ids = cMenu.menu_ids;
						}else{
							menu_info.navi = menu_nm;
							menu_ids = [];
							menu_ids.push(data[i].MENU_ID);
							menu_info.ids = menu_ids;
						}
						
						menu_info.com_btn = data[i].COM_BTN;
							
						GV.MENU.push(menu_info);
						
						// 메뉴정보 LocalStrorage 저장
						// frame 영역에서 접근하기 용이하도록
						if (localStorageSupport()) {
							localStorage.setItem("GV.MENU", JSON.stringify(GV.MENU));
						}
					}

					var records = dataAdapter.getRecordsHierarchy('MENU_ID', 'PRNT_MENU_ID', 'items', [{ name: 'MENU_NM', map: 'label'},{ name: 'MENU_ID', map: 'id'}]);

					// Top : main menu binding
					$("#jqxMenu").jqxMenu({ 
						source: records,
						width: '100%', 
						height: '36',
						enableHover: true,
						autoOpen: false, //true, false
						clickToOpen: true, //true, false
						autoCloseOnClick: true,
						showTopLevelArrows: false, //true, false
						autoSizeMainItems: true,
						//autoCloseInterval: 4000,  //마우스 오버 시 Not Close 2019-05-14 윤완희
						theme: 'custom',
						minimizeWidth: 800
					});

					$("#jqxMenu").css('visibility', 'visible');

					$("#jqxMenu").on('itemclick', function (event) {

						if(event.args.childElementCount!=0) return; //최하위 노드를 클릭했을 경우가 아니면
						var id = event.args.id;
						var text = $(event.args).text();

						$.grep(data, function (obj,index) { 
							if((obj.MENU_LVL=='2' || obj.MENU_LVL=='3') && obj.PGM_URL != '' && obj.MENU_ID==id) {

								//COM_MENU_LOG 저장
								if(id != "") {
									var menudata = {};
									menudata.ACTION_ID = "COMSYS010_01";
									menudata.MENU_ID = id;
									menudata.async = false;
									AdaptorTransaction(menudata, function(res){});
								}

								$("#menuid").val(id);
								$("#menunm").val(text);
								$("#pageurl").val(obj.PGM_URL);
								$("#event").val(event);
								$("#menuForm").attr({
									"target" : "_self",
									"action" : "indexm.jsp"
								}).submit();
							}
						});
					});
				}
			});
			dataAdapter.dataBind();			

			oThis._initForm()._clickEvent();
		});
		
	}
	, _initForm: function () {
		var oThis = this;

//		var cookiedata = document.cookie;
//		
//		if ( oThis._DS_POPNOTICE.length > 0 && cookiedata.indexOf("noticeWindow=done") < 0 ) {
//			setTimeout(function() {
//				callPopup({ id: "noticeWindow", title: "공지사항", url: "/kci_admin/pages/POPUP/POPNOTICE.jsp", width: 620, height: 630 });
//			}, 200);
//		}
		/*var loginInfo = GF.getLogin();
		
		let data = {};
		let cData = {};
		
		data.ACTION_ID = "DSHCOM001_01";	//CHART 기준정보
		data.DS_SEARCH = [];				//Action Parameter
		
		cData = {};
    	cData.BOARD_NO = 1;// Dashboard 1
    	data.DS_SEARCH.push(cData);
    	AdaptorTransaction(data, function(res){
			oThis._DS_CHART_STD_DATA = res.DS_LIST;
			
			oThis._initDshBrd();
		});*/
		return this;
	}
	, _initDshBrd : function () {
		const oThis = this;
		
		$("#dnChartTitle").text(GF.label(oThis._DS_CHART_STD_DATA[2].CHART_NAME));		
		$("#brChartTitle").text(GF.label(oThis._DS_CHART_STD_DATA[3].CHART_NAME));
		
		//심플
		oThis._drawSPchart1();
		oThis._drawSPchart2();
		oThis._drawDNchart();
		oThis._drawBRchart();
		
		//차트 데이터 조회 및 갱신 주기
		$.each(oThis._DS_CHART_STD_DATA, function(index, item){
			if(index == 0){
				oThis._getSPdata1(item);
			}else if(index == 1){
				oThis._getSPdata2(item);
			}else if(index == 2){
				oThis._getDNdata(item);
			}else if(index == 3){
				oThis._getBRdata(item);
			}
			oThis._setCycle(item);
		})
		
	}
	, _clickEvent: function () {
		var oThis = this;

		
		$("#modifyinfo").off("click").on('click', function (event) {
			
			var title = "사용자 정보";
			callPopup({ id: "modifyinfoWindow", title: title, isModal: true, url: "modifyinfo.jsp", width: 390, height: 505 });
		});

		var loginInfo = GF.getLogin();
		$("#sel_lang").change(function(event){
			
		    //var actionUrl = "maindshm.jsp";
            
            //$("#paramLang").val(event.target.value);
            
            GV.loginInfo.LANG_CD = event.target.value;
            
            if (localStorageSupport()) {
                localStorage.setItem("GF.login", JSON.stringify(GV.loginInfo));
            }

            $("#menuForm").attr({
                "target" : "_self",
                "action" : "maindshm.jsp",
                success: function (response) {
                }
            }).submit();
		});

		//로그아웃
		$("#logout").off("click").on("click", function () {

			swal({title:GF.message("COM_SYS_Q0001",["로그아웃"]), type: "question", showCancelButton: true}).then(function (isConfirm){ //로그아웃하시겠습니까?
				if(isConfirm.value){
					oThis._logOut();
				}
			});
		});


		$("#smsSend").off("click").on('click', function(event) {
			var title = "SMS 발송";
			callPopup({ id: "sendSmsWindow", title: title, isModal: false, url: "/kci_admin/pages/POPUP/POPSENDSMS.jsp", width: 675, height: 710 });
		});


		$("#help_desk").off("click").on('click', function(event) {
			var title = "Help Desk";
			callPopup({ id: "popupManager", title: title, isModal: false, url: "/kci_admin/pages/POPUP/POPMANAGER.jsp", width: 380, height: 275 });
		});
		
		// Collector, Machine 상태 팝업
		$(".state_popup").off("click").on("click", function () {

        	var xOffset = $(this).offset().left + $(this).width() + 10;
        	var yOffset = $(this).offset().top;

        	callPopup({ id: "popupWindow"
        			  , title: ""
        			  , isModal: true, url: "/kci_admin/pages/SAMPLE/SAMPLE013_P01.jsp"
        			  , width: 300
        			  , height: 370
        			  , position: { x: xOffset, y: yOffset }
        			   });
        });

		return this;
	}
//	, _getMenuInfo: function () {
//		var oThis = this;
//
//		var actionID = "COMSYS001_03";
//		var data = {};
//		data.ACTION_ID = actionID;
//		data.DS_SEARCH = [];
//		var sParam = {};
//		sParam.WEB_TYPE = "PC";	
//		
////		var filter = "win16|win32|win64|mac|macintel";
////		if (navigator.platform ) {
////			if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
////				sParam.WEB_TYPE = "MOBILE";
////			} 
////		}
//		var userAgent = navigator.userAgent.toLowerCase();
//		//모바일 접속 시 모바일 화면으로 이동
//		if(userAgent.match('iphone') || userAgent.match('ipad') || userAgent.match('ipod') || userAgent.match('android') ) { 
//			sParam.WEB_TYPE = "MOBILE";
//		}
//
//		data.DS_SEARCH.push(sParam);
//
//		AdaptorTransaction(data, function(res){
//
//			var source =
//			{
//				datatype: "json",
//				datafields: [
//					{ name: 'MENU_ID' },
//					{ name: 'PRNT_MENU_ID' },
//					{ name: 'MENU_NM' },
//					{ name: 'PGM_URL' }
//				],
//				id: 'MENU_ID',
//				//localdata: res.GDS_ALL_MENU
//				localdata: JSON.stringify(res.GDS_ALL_MENU)
//			};
//			
//			var dataAdapter = new $.jqx.dataAdapter(source, {
//				loadComplete: function (records) {
//					var menu_nm = "";
//					var menu_ids = [];
//					
//					var getMenu = function(mData, cMenu){
//						for(var i = 0; i<mData.length; i++){
//							if(mData[i].MENU_ID == cMenu){
//
//								menu_nm = mData[i].MENU_NM + " > " + menu_nm;
//								menu_ids.push(mData[i].MENU_ID);
//								
//								if(mData[i].PRNT_MENU_ID != ""){
//									getMenu(mData, mData[i].PRNT_MENU_ID);
//								}else{
//									
//									return {"menu_nm":menu_nm, "menu_ids":menu_ids};
//								}
//							}
//						}
//						return {"menu_nm":menu_nm, "menu_ids":menu_ids};
//					}
//
//					var data = JSON.parse(records);
//					var menu_info = {}
//					for(var i=0; i < data.length; i++){
//						menu_nm = "";
//						menu_info = {};
//						menu_info.id = data[i].MENU_ID;
//						menu_info.text = data[i].MENU_NM;
//						menu_nm = "[ " + data[i].MENU_NM + " ]";
//						
//						if(data[i].PRNT_MENU_ID != ""){
//							menu_ids = [];
//							menu_ids.push(data[i].MENU_ID);
//							var cMenu = getMenu(data, data[i].PRNT_MENU_ID);
//							menu_info.navi = cMenu.menu_nm;
//							menu_info.ids = cMenu.menu_ids;
//						}else{
//							menu_info.navi = menu_nm;
//							menu_ids = [];
//							menu_ids.push(data[i].MENU_ID);
//							menu_info.ids = menu_ids;
//						}
//						
//						menu_info.com_btn = data[i].COM_BTN;
//							
//						GV.MENU.push(menu_info);
//						
//						// 메뉴정보 LocalStrorage 저장
//						// frame 영역에서 접근하기 용이하도록
//						if (localStorageSupport()) {
//							localStorage.setItem("GV.MENU", JSON.stringify(GV.MENU));
//						}
//					}
//
//					var records = dataAdapter.getRecordsHierarchy('MENU_ID', 'PRNT_MENU_ID', 'items', [{ name: 'MENU_NM', map: 'label'},{ name: 'MENU_ID', map: 'id'}]);
//
//					// Top : main menu binding
//					$("#jqxMenu").jqxMenu({ 
//						source: records,
//						width: '100%', 
//						height: '36',
//						enableHover: true,
//						autoOpen: false, //true, false
//						clickToOpen: true, //true, false
//						autoCloseOnClick: true,
//						showTopLevelArrows: false, //true, false
//						autoSizeMainItems: true,
//						//autoCloseInterval: 4000,  //마우스 오버 시 Not Close 2019-05-14 윤완희
//						theme: 'custom',
//						minimizeWidth: 800
//					});
//
//					$("#jqxMenu").css('visibility', 'visible');
//
//					$("#jqxMenu").on('itemclick', function (event) {
//
//						if(event.args.childElementCount!=0) return; //최하위 노드를 클릭했을 경우가 아니면
//						var id = event.args.id;
//						var text = $(event.args).text();
//
//						$.grep(data, function (obj,index) { 
//							if((obj.MENU_LVL=='2' || obj.MENU_LVL=='3') && obj.PGM_URL != '' && obj.MENU_ID==id) {
//
//								//COM_MENU_LOG 저장
//								if(id != "") {
//									var menudata = {};
//									menudata.ACTION_ID = "COMSYS010_01";
//									menudata.MENU_ID = id;
//									menudata.async = false;
//									AdaptorTransaction(menudata, function(res){});
//								}
//
//								$("#menuid").val(id);
//								$("#menunm").val(text);
//								$("#pageurl").val(obj.PGM_URL);
//								$("#event").val(event);
//								$("#menuForm").attr({
//									"target" : "_self",
//									"action" : "index.jsp"
//								}).submit();
//							}
//						});
//					});
//				},
//				loadError: function(jqXHR, status, error)
//				{
//	//                	console.log('error');
//				},
//				beforeLoadComplete: function (records) {
//	//                	console.log('beforeLoadComplete');
//				}               
//			});
//
//			dataAdapter.dataBind();
//		});
//
//		return this;
//    }

	, _getArgs: function () {
		var oThis = this;
		
		return this;
	}
	, _logOut: function () {
		
		var oThis = this;
		
		var data = {};
		data.ACTION_ID = "COMSYS007_04";
		
		AdaptorTransaction(data, function(res) {
			$(document).empty();
			window.location.replace('login.jsp');
		});
		return this;
	}
	//좌측상단 심플차트1 (좌측)
	, _drawSPchart1: function() {
		
		const oThis = this;
		//차트명
		var chartNm = oThis._DS_CHART_STD_DATA[0].CHART_NAME;
		
        const metrics = 
            {
            	name: chartNm,
            	value: 0,
            };
        const data = [];
        data.push({ text: 'Used', value: 0 }); // current
        data.push({ text: 'Available', value: 100 }); // remaining
        const settings = {
            title: '',
            description: metrics.name,
            enableAnimations: true,
            showLegend: false,
            showBorderLine: false,
            backgroundColor: '#22bb9f',
            padding: { left: 5, top: 5, right: 5, bottom: 5 },
            titlePadding: { left: 5, top: 5, right: 5, bottom: 5 },
            showToolTips: true,
        };
        const selector = '#chartContainer1'.toString();
        const str = metrics.value.toString();
        settings.drawBefore = function (renderer, rect) {
            sz = renderer.measureText(str, 0, { 'class': 'chart-inner-text' });
            renderer.text(
        		str,
	            rect.x + (rect.width - sz.width) / 2,
	            rect.y + rect.height / 2, 0, 0, 0,
	            { 'class': 'chart-inner-text' }
            );
        }
        $(selector).jqxChart(settings);
        $(selector).jqxChart('addColorScheme', 'customColorScheme', ['#00BAFF', '#EDE6E7']);
        $(selector).jqxChart({ colorScheme: 'customColorScheme' });
        
		return this;
	}
	// 심플1 데이터 조회
	,_getSPdata1: function (sParam) {
		var oThis = this;

		//  데이터 조회후 바인딩
		var data = {};
		data.ACTION_ID = "DSHCOM001_02";
		data.loading = false;
		data.DS_CHART_INFO = [];
		data.DS_SEARCH = [];
		var cData = {};
    	cData.BOARD_NO=sParam.BOARD_NO;// Dashboard 1
    	cData.AREA_NO=sParam.AREA_NO;// Dashboard 1
    	data.DS_SEARCH.push(cData);
		
		//console.log(sParam);
		var now = gfnNowDateTime();
		// 파라메터 정의
		sParam.NOW = now;
		data.DS_CHART_INFO.push(sParam);
		
    	AdaptorTransaction(data, function(res)
    	{
    		const selector = '#chartContainer1';
    		var chatCd  = sParam.CHART_CD;
    		// H/H Verification 누적 실패율 
    		var sufixStr = chatCd=='SP04'?'%':'';//'건'
    		//console.log(res.DS_CHART);
    		var val = parseInt(res.DS_CHART[0].VAL).toLocaleString() + sufixStr;
    		//console.log("val >> "+val);
    		$(selector + " .chart-inner-text").text(val);
        	
        	const settings = {};
        	settings.description = sParam.CHART_NAME;
            settings.drawBefore = function (renderer, rect) {
                sz = renderer.measureText(val, 0, { 'class': 'chart-inner-text' });
                renderer.text(
                val,
                rect.x + (rect.width - sz.width) / 2,
                rect.y + rect.height / 2, 0, 0, 0,
                { 'class': 'chart-inner-text' }
                );
            }
            // setup the chart
            $(selector).jqxChart(settings);
    	});
    	
    	return this;
	}
	
	//좌측상단 심플차트2 (우측)
	, _drawSPchart2: function() {
		
		const oThis = this;
		//차트명
		var chartNm = oThis._DS_CHART_STD_DATA[1].CHART_NAME;
		var chatCd  = oThis._DS_CHART_STD_DATA[1].CHART_CD;
		// H/H Verification 누적 실패율 
		var unitStr = chatCd=='SP04'?'%':'건';
        const metrics = 
            {
            	name: chartNm,
            	unit: unitStr,
            };
        const data = [];
        data.push({ text: '', value: 0 }); // current
        data.push({ text: 'Available', value: 100 }); // remaining
        const settings = {
            title: '',
            description: metrics.name,
            enableAnimations: true,
            showLegend: false,
            showBorderLine: false,
            backgroundColor: '#ff943f',
            padding: { left: 5, top: 5, right: 5, bottom: 5 },
            titlePadding: { left: 5, top: 5, right: 5, bottom: 5 },
            showToolTips: true
        };
        const selector = '#chartContainer2'.toString();
        const str = "";//metrics.value.toString();
        settings.drawBefore = function (renderer, rect) {
            sz = renderer.measureText(str, 0, { 'class': 'chart-inner-text' });
            renderer.text(
        		str,
	            rect.x + (rect.width - sz.width) / 2,
	            rect.y + rect.height / 2, 0, 0, 0,
	            { 'class': 'chart-inner-text' }
            );
        }
        $(selector).jqxChart(settings);
        $(selector).jqxChart('addColorScheme', 'customColorScheme', ['#00BAFF', '#EDE6E7']);
        $(selector).jqxChart({ colorScheme: 'customColorScheme' });
            
		return this;
	}
	// 심플2 데이터 조회
	,_getSPdata2: function (sParam) {
		var oThis = this;

		//  데이터 조회후 바인딩
		var data = {};
		data.ACTION_ID = "DSHCOM001_02";
		data.loading = false;
		data.DS_CHART_INFO = [];
		data.DS_SEARCH = [];
		var cData = {};
    	cData.BOARD_NO=sParam.BOARD_NO;// Dashboard 1
    	cData.AREA_NO=sParam.AREA_NO;// Dashboard 1
    	data.DS_SEARCH.push(cData);
		
		var now = gfnNowDateTime();
		// 파라메터 정의
		sParam.NOW = now;
		data.DS_CHART_INFO.push(sParam);
		
    	AdaptorTransaction(data, function(res)
    	{
    		const selector = '#chartContainer2';
    		var chatCd  = sParam.CHART_CD;
    		// H/H Verification 누적 실패율 
    		var sufixStr = chatCd=='SP04'?'%':'';//'건'
    		var val = parseInt(res.DS_CHART[0].VAL).toLocaleString() + sufixStr;
    		$(selector + " .chart-inner-text").text(val);
        	
        	const settings = {};
        	settings.description = sParam.CHART_NAME;
            settings.drawBefore = function (renderer, rect) {
                sz = renderer.measureText(val, 0, { 'class': 'chart-inner-text' });
                renderer.text(
                val,
                rect.x + (rect.width - sz.width) / 2,
                rect.y + rect.height / 2, 0, 0, 0,
                { 'class': 'chart-inner-text' }
                );
            }
            // setup the chart
            $(selector).jqxChart(settings);
    	});
    	
    	return this;
	}
	//촤측중간 도넛 차트
	, _drawDNchart: function() {
		var oThis = this;
		
		const selector = '#chartContainer3';
		var chatCd  = oThis._DS_CHART_STD_DATA[2].CHART_CD;
		// H/H Verification 누적 실패율 장비ID별 Top 5 
		var sufixStr = chatCd=='DN05'?'%':'건';
		var decimal = chatCd=='DN05'?1:0;
		
		const data= [];
        data.push({ GR: 'A', VAL: 0 }); // current
        data.push({ GR: 'B', VAL: 0 }); // remaining
        data.push({ GR: 'C', VAL: 0 }); // remaining
        data.push({ GR: 'D', VAL: 0 }); // remaining
        data.push({ GR: 'E', VAL: 0 }); // remaining
        
        // prepare jqxChart settings
        const settings = {
            title: "",
            description: "",
            enableAnimations: true,
            showLegend: true,
            showBorderLine: true,
            //legendLayout: { left: 230, top: 25, width: 300, height: 200, flow: 'vertical' },
            padding: { left: 5, top: 5, right: 5, bottom: 5 },
            titlePadding: { left: 0, top: 0, right: 0, bottom: 10 },
            //colorScheme: 'scheme01',
            seriesGroups:
            [{
                type: 'donut',
                offsetX: 100,
                source: data,
                xAxis:
                {
                    formatSettings: { prefix: ' ' }
                },
                series:
                [{
                	showLabels: true,
					enableSelection: true,
                	dataField: 'VAL',
                    displayText: 'GR',
                    labelRadius: 120,
                    initialAngle: 90,
                    radius: 80,
                    innerRadius: 50,
                    centerOffset: 0,
                    formatSettings: { sufix: sufixStr, thousandsSeparator : ',', decimalPlaces: decimal }
                }]
            }]
        };

        // setup the chart
        $(selector).jqxChart(settings);
	}
	// 도넛 데이터 조회
	,_getDNdata: function (sParam) {
		var oThis = this;

		//  데이터 조회후 바인딩
		var data = {};
		data.ACTION_ID = "DSHCOM001_02";
		data.loading = false;
		data.DS_CHART_INFO = [];
		data.DS_SEARCH = [];
		var cData = {};
    	cData.BOARD_NO=sParam.BOARD_NO;// Dashboard 1
    	cData.AREA_NO=sParam.AREA_NO;// Dashboard 1
    	data.DS_SEARCH.push(cData);
		
		var now = gfnNowDateTime();
		// 파라메터 정의
		sParam.NOW = now;
		data.DS_CHART_INFO.push(sParam);
		
    	AdaptorTransaction(data, function(res)
    	{
    		const selector = '#chartContainer3';
    		//제목셋팅
    		$("#dnChartTitle").text(GF.label(sParam.CHART_NAME));
    		var chatCd  = sParam.CHART_CD;
    		// H/H Verification 누적 실패율 장비ID별 Top 5 
    		var sufixStr = chatCd=='DN05'?'%':'건';
    		var decimal = chatCd=='DN05'?1:0;
    		
    		const settings = {
	            title: "",
	            description: "",
	            enableAnimations: true,
	            showLegend: true,
	            showBorderLine: true,
	            //legendLayout: { left: 230, top: 25, width: 300, height: 200, flow: 'vertical' },
	            padding: { left: 5, top: 5, right: 5, bottom: 5 },
	            titlePadding: { left: 0, top: 0, right: 0, bottom: 10 },
	            showToolTips: true,
	            seriesGroups:
	            [{
	                type: 'donut',
	                useGradientColors: false,
	                source: res.DS_CHART,
	                xAxis:
	                {
	                    formatSettings: { prefix: ' ' }
	                },
	                series:
	                [{
	                	showLabels: true,
						enableSelection: true,
	                	dataField: 'VAL',
	                    displayText: 'GR',
	                    labelRadius: 120,
	                    initialAngle: 90,
	                    radius: 80,
	                    innerRadius: 50,
	                    centerOffset: 0,
	                    formatSettings: { sufix: sufixStr, thousandsSeparator : ',', decimalPlaces: decimal }
	                }]
	            }]
	        };
            // setup the chart
            $(selector).jqxChart(settings);
            $(selector).jqxChart('addColorScheme', 'customColorScheme', ['#67b7dc', '#8067dc', '#dc6788', '#f6bc60', '#7ac89a']);
            $(selector).jqxChart({ colorScheme: 'customColorScheme' });
    	});
    	
    	return this;
	}
	//좌측하단 바 차트
	, _drawBRchart: function() {
		
		const selector = '#chartContainer4';
		//var chatCd  = sParam.CHART_CD;
		// H/H Verification 누적 실패율 장비ID별 Top 5 
		var sufixStr = '건';
		var decimal = 0;
		var sdpText = 'Count';
		var	dpText = '';
		
        // prepare jqxChart settings
		const settings = {
			title: " ",
			description: " ",
			showLegend: false,
	        enableAnimations: false,
			padding: { left: 20, top: 5, right: 20, bottom: 5 },
	        titlePadding: { left: 0, top: 0, right: 0, bottom: 10 },
			//source: data,
			xAxis:
			{
				dataField: 'GR',
				displayText: dpText,
				type: 'basic',
				gridLines: { visible: true },
				flip: false
			},
			valueAxis:
			{
				flip: true,
	            labels: {
	                visible: true,
	                formatFunction: function (val) {
	                    return parseInt(val).toLocaleString();
	                }
	            }
			},
			colorScheme: 'scheme01',
			seriesGroups:
			[{
				type: 'column',
				orientation: 'horizontal',
				useGradientColors: false,
				columnsGapPercent: 50,
				toolTipFormatSettings: { thousandsSeparator: ',' },
				series: [{ 
					dataField: 'VAL', 
				    displayText: sdpText, 
				    opacity: 1,
				    fillColorSymbolSelected: 'white',
					formatSettings : { sufix: sufixStr, thousandsSeparator : ',' } 
				}]
			}]
		};
	    
	    $(selector).jqxChart(settings);
	}
	// 바 차트 데이터 조회
	,_getBRdata: function (sParam) {
		var oThis = this;

		//  데이터 조회후 바인딩
		var data = {};
		data.ACTION_ID = "DSHCOM001_02";
		data.loading = false;
		data.DS_CHART_INFO = [];
		data.DS_SEARCH = [];
		var cData = {};
    	cData.BOARD_NO=sParam.BOARD_NO;// Dashboard 1
    	cData.AREA_NO=sParam.AREA_NO;// Dashboard 1
    	data.DS_SEARCH.push(cData);
		
		var now = gfnNowDateTime();
		// 파라메터 정의
		sParam.NOW = now;
		data.DS_CHART_INFO.push(sParam);
		
    	AdaptorTransaction(data, function(res)
    	{
    		const selector = '#chartContainer4';
    		//제목셋팅
    		$("#brChartTitle").text(GF.label(sParam.CHART_NAME));
    		var chatCd  = sParam.CHART_CD;
    		// H/H Verification 누적 실패율 장비ID별 Top 5 
    		var sufixStr = chatCd=='DN05'?'%':'건';
    		var decimal = chatCd=='DN05'?1:0;
    		var sdpText = chatCd=='DN05'?'Rate':'Count';
    		var	dpText = sParam.COLUMN_NM;
    		
    		// prepare jqxChart settings
    		const settings = {};
    		settings.source = res.DS_CHART;
    		settings.xAxis = {
				dataField: 'GR',
				displayText: dpText,
            }
    		settings.seriesGroups = 
            [{
            	type: 'column',
                orientation: 'horizontal',
                useGradientColors: false,
                columnsGapPercent: 50,
                toolTipFormatSettings: { thousandsSeparator: ',' },
				series: [{ 
					dataField: 'VAL', 
				    displayText: sdpText, 
				    opacity: 1,
				    fillColorSymbolSelected: 'white',
					formatSettings : { sufix: sufixStr, thousandsSeparator : ',' } 
				}]
			}]
			
            // setup the chart
            $(selector).jqxChart(settings);
    		$(selector).jqxChart('addColorScheme', 'customColorScheme', ['#6794dc']);
            $(selector).jqxChart({ colorScheme: 'customColorScheme' });
    	});
    	
    	return this;
	}
	
    // 각각의 차트 갱신 주기에 맞게 Refresh
    , _setCycle: function(p) {
    	
    	const oThis = this;
    	// 우측 simple / Donut / Bar
    	if(p.AREA_NO=="DL01")
    	{
			const ttimer = setInterval(function () {
	        	oThis._getSPdata1(p);
	        }, (60000 * p.CYCLE_TIME));
    	}
    	else if(p.AREA_NO=="DL02")
    	{
			const ttimer = setInterval(function () {
	        	oThis._getSPdata2(p);
	        }, (60000 * p.CYCLE_TIME));
    	}
    	else if(p.AREA_NO=="DL03")
    	{
			const ttimer = setInterval(function () {
	        	oThis._getDNdata(p);
	        }, (60000 * p.CYCLE_TIME));
    	}
    	else if(p.AREA_NO=="DL04")
    	{
			const ttimer = setInterval(function () {
	        	oThis._getBRdata(p);
	        }, (60000 * p.CYCLE_TIME));
    	}
    }
};
