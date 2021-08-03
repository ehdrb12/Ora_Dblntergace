GF.libPool.indexmHandler = {
	// global variable
	_DISPLAY_MODE: null,
	_USER_AGENT: null,
	_ACTION_URL: null,
	_init: function (param) {

		const oThis = this;
		var actionUrl = "maindshm.jsp";
		
		oThis._USER_AGENT = navigator.userAgent.toLowerCase();
		oThis._ACTION_URL = actionUrl;//"index.jsp";
		oThis._DISPLAY_MODE = "NORMAL";

        if(oThis._USER_AGENT.match('iphone') || oThis._USER_AGENT.match('ipad') || oThis._USER_AGENT.match('ipod') || oThis._USER_AGENT.match('android') ) { 
            oThis._ACTION_URL = "maindshm.jsp";
            $("#smsSend").hide();
            $("#manual").hide();
            $("#site_link").hide();
        }
		
		this._initForm()._clickEvent();
		
		this._getMessageInfo();
		this._getLabelInfo();
		this._getMenuInfo();
		
		return this;
	}
	, _initForm: function () {
		var oThis = this;

		$("#helpDeskWindow").jqxWindow({
			position: 'center',
			height: 200, width: 650, resizable: false, showCollapseButton: true,
			autoOpen: false
		});

		return this;
	}
	, _clickEvent: function () {
		var oThis = this;

		$("#help_desk").on('click', function (event) {
			$("#helpDeskWindow").jqxWindow('setTitle', "Help Desk");
			$("#helpDeskWindow").css("visibility", "visible");
			$("#helpDeskWindow").jqxWindow('open');
			$("#helpDeskWindow").jqxWindow('bringToFront');
		});

		//로그아웃
		$("#logout").off("click").on("click", function () {
			swal({title:GF.message("COM_SYS_Q0001",["로그아웃"]), type: "question", showCancelButton: true}).then(function (isConfirm){ //로그아웃하시겠습니까?
				if(isConfirm.value){
					oThis._logOut();
				}
			});
		});
		
		$("#modifyinfo").on('click', function (event) {
			var title = "사용자 정보";
			callPopup({ id: "modifyinfoWindow", title: title, isModal: true, url: "modifyinfo.jsp", width: 430, height: 390 });
		});
		
		$("#closeMenu").on('click', function (event) {
			$("#leftNavbar", parent.document).css({'overflow-y':'hidden', 'width':'0px'})
			$("#page-wrapper", parent.document).css('margin','0 0 0 0px');
		});
		
		$("#openMenu").on('click', function (event) {
			$("#leftNavbar", parent.document).css({'overflow-y':'auto', 'width':'216px'})
			$("#page-wrapper", parent.document).css('margin','0 0 0 215px');
		});
		
		//$("#closeMenu").trigger("click");
		
		return this;
	}
	, _getMenuInfo: function () {
		var oThis = this;
		
		var actionID = "COMSYS001_03";
		var data = {};
		data.ACTION_ID = actionID;
		data.DS_SEARCH = [];
		var sParam = {};
		sParam.WEB_TYPE = "PC";	
		
//		var filter = "win16|win32|win64|mac|macintel";
//
//		if (navigator.platform ) {
//			if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
//				sParam.WEB_TYPE = "MOBILE";	
//			} 
//		}
		
		if(oThis._USER_AGENT.match('iphone') || oThis._USER_AGENT.match('ipad') || oThis._USER_AGENT.match('ipod') || oThis._USER_AGENT.match('android') ) { 
            sParam.WEB_TYPE = "MOBILE";
        }
    	
		data.DS_SEARCH.push(sParam);
		
		AdaptorTransaction(data, function(res){
			
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
				//localdata: res.GDS_ALL_MENU
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

					var getMenuItem = function(menu_id){
						for(var i = 0; i<GV.MENU.length; i++){
							if(GV.MENU[i].id == menu_id){
								return GV.MENU[i].navi;
							}
						}
						return "";
					}

					var getMenuIds = function(menu_id){
						for(var i = 0; i<GV.MENU.length; i++){
							if(GV.MENU[i].id == menu_id){
								return GV.MENU[i].ids;
							}
						}
						return "";
					}

					var data = JSON.parse(records);

					// Left Menu
					var leftMenuHtml = "";
					
					var getThreeDepth = function(items, id){
						var html = "";
						
						for(var i = 0; i < items.length; i++){
							
							if(items[i].MENU_LVL == 3 && items[i].PRNT_MENU_ID == id){
								
								html += '<li id='+items[i].MENU_ID+'><a href="'+items[i].PGM_URL+'">'+items[i].MENU_NM+'</a></li>';
								
							}
						}
						
						if(html != ""){
//							html = '<ul class="nav nav-third-level">' + html + '</ul>';
						    html = '<ul class="nav nav-third-level collapse">' + html + '</ul>';
						}
						
						return html;
					}

					var getTwoDepth = function(items, id){
						var html = "";
						for(var i = 0; i < items.length; i++){
							
							//html += '<ul class="nav nav-second-level collapse">';
							if(items[i].MENU_LVL == 2 && items[i].PRNT_MENU_ID == id){
								//2depth 업무메뉴
								if(items[i].PGM_URL != ""){
									html += '<li id='+items[i].MENU_ID+'><a href="'+items[i].PGM_URL+'">'+items[i].MENU_NM+'</a>';
									html += '</li>';
								}else{
									html += '<li id='+items[i].MENU_ID+'><a href="#">'+items[i].MENU_NM+'<span class="fa arrow"></span></a>';
									html += getThreeDepth(items, items[i].MENU_ID);
									html += '</li>';
								}
							}
							//html += '</ul>';
						}
						if(html != ""){
							html = '<ul class="nav nav-second-level collapse">' + html + '</ul>';
						}
						return html;
					}

					for(var i = 0; i < data.length; i++){
						var menu_item = data[i];
						var next_item = null;
						var prev_item = null;
						
						if(i == 0){
							prev_item = null
						}else{
							prev_item = data[i-1];
						}
						
						if(i < data.length){
							next_item = data[i+1];
						}else{
							next_item = null;
						}
						if(menu_item.MENU_LVL == 1){
							leftMenuHtml += '<li id='+menu_item.MENU_ID+'>';
							leftMenuHtml += '	<a href="#"><i class="fa fa-sitemap"></i> <span class="nav-label">'+menu_item.MENU_NM+' </span><span class="fa arrow"></span></a>';
							leftMenuHtml += getTwoDepth(data, menu_item.MENU_ID);
							leftMenuHtml += '</li>';
						}
					}

					GV.LMENU = leftMenuHtml;

					leftMenuHtml = '<ul class="nav metismenu" id="side-menu">' + leftMenuHtml + '</ul>';
					$("#leftMenu").append(leftMenuHtml);
					$("#side-menu").metisMenu();

					$("#side-menu li a").on("click", function(){
						
						var id = $(this).parent("li").attr('id');
						var text = $(this).text();
						// 메뉴눌렀울때
						var menu_info = {}
						var exist = -1;
						for(var i=0; i < GV.ACT_MENU.length; i++){
							if(id == GV.ACT_MENU[i].id){
								exist = i;
								menu_info = GV.ACT_MENU[i];
							}
						}
						if(exist < 0){
							var src = $(this).attr('href');
							var label = $(this).text();

							if(src == '#')
								return false;
							if(GV.ACT_MENU.length>9){
								GF.alert({title:"Warning", text: GF.message("SYS_SYS_W0001"), type:"warning"});	//최대로 열 수 있는 화면은 10개 입니다.
								return false;
							}
							
							menu_info.id = id;
							menu_info.index = $('#jqxTabs').jqxTabs('length') + 3;
							menu_info.text = text;
							menu_info.navi = getMenuItem(id);
							menu_info.ids = getMenuIds(id);
							  
							GV.ACT_NAVI = menu_info.navi;
							 
							if (localStorageSupport()) {
								localStorage.setItem("GV.ACT_NAVI", GV.ACT_NAVI);
							}
							  
							GV.ACT_MENU.push(menu_info);
							
							if (localStorageSupport()) {
								localStorage.setItem("GV.ACT_MENU", JSON.stringify(GV.ACT_MENU));
							}

							src = "pages/"+ src;
							$('#jqxTabs').jqxTabs('addLast', label, '<iframe src="' + src + '" height="100%" width="100%" frameborder="0" vspace="0" hspace="0" marginwidth="0" marginheight="0" />');
							$('#jqxTabs').jqxTabs('ensureVisible', -1);
							/*
							div 에 페이지 Load (문제점 : 동일 ID 객체가 있을 경우 예) Grid ID 가 동일할 경우
							var loadPage = function (url, tabIndex) {
								console.log("tabIndex="+tabIndex);
								$.get(url, function (data) {
									$('#content' + tabIndex).html(data);
								});
							}
							$('#jqxTabs').jqxTabs('addLast', label);
							$("#content").after("<div id='content1'></div>");
							loadPage(src, 1);
							*/
						}else{
							$('#side-menu .active').removeClass( "active" );
							$('#side-menu .in').removeClass( "in" );
							for(var dCnt =  menu_info.ids.length - 1; dCnt >= 0; dCnt--){
								if(dCnt == menu_info.ids.length - 1){
									$("#"+menu_info.ids[dCnt]).addClass("active");
								}else{
								  
								  var href = $("#"+menu_info.ids[dCnt]+" a:first").attr('href');
								  
								  
								  if(href != "#"){
									  $("#"+menu_info.ids[dCnt]).addClass("active");
									  $("#"+menu_info.ids[dCnt]).parent().parent().find("ul").removeClass( "collapse" );
									  $("#"+menu_info.ids[dCnt]).parent().addClass("collapse");
									  $("#"+menu_info.ids[dCnt]).parent().addClass("in");
								  }else{
									  $("#"+menu_info.ids[dCnt]).addClass("active");
									  $("#"+menu_info.ids[dCnt]).parent().parent().find("ul").removeClass( "collapse" );
									  $("#"+menu_info.ids[dCnt]).parent().addClass("collapse");
									  $("#"+menu_info.ids[dCnt]).parent().addClass("in");  
								  }
								  
							  }
						  }
						  //$('#jqxTabs').jqxTabs('select', exist + 1); //Dashboard 제거
						  $('#jqxTabs').jqxTabs('select', exist); 
						}
						//$("#menuWrapperjqxMenu").hide();
						$('.jqx-menu-minimized-button').click();
						
						oThis._setDisplayMode();
                        oThis._managerSet();

                        return false;
					});
                    
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
						menu_info.pgmUrl = data[i].PGM_URL;
                        menu_info.manual = data[i].MANUAL;
                        menu_info.managerNm = data[i].MANAGER_NM;
                        menu_info.mobile = data[i].MOBILE;
							
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
						autoOpen: true, //true, false
						clickToOpen: false, //true, false
						autoCloseOnClick: true,
						showTopLevelArrows: false, //true, false
						autoSizeMainItems: true,
						//autoCloseInterval: 4000,  //마우스 오버 시 Not Close 2019-05-14 윤완희
						theme: 'custom',
						minimizeWidth: 600
                    });
					
					$("#jqxMenu").css('visibility', 'visible');

					$("#jqxMenu").on('itemclick', function (event) {
//						alert(event.args.childElementCount);
//						if(event.args.childElementCount==0) alert(GV.ACT_MENU.length); //최하위 노드를 클릭했을 경우
					    try {
    						var id = event.args.id;
    						var text = $(event.args).text()
    						var menu_info = {}
    						var exist = -1;
    
    						var flag = false;
    						if(id=="") {
                                flag = true;
                            } else {
                                $.each(data, function (index, item) {
//                                  console.log(item);
                                    if(item.MENU_ID==id) {
                                        if( (item.MENU_LVL=='1' || item.MENU_LVL=='2') && item.PGM_URL == '') {
                                            flag = true;
                                            return;
                                        }
                                    }
                                });
                            }
    
    						if(flag) return;
    
    							for(var i=0; i < GV.ACT_MENU.length; i++){
    								if(id == GV.ACT_MENU[i].id){
    									exist = i;
    									menu_info = GV.ACT_MENU[i];
    								}
    							}
    
    							// 기존에 열린 Tab이 존재하지 않을때 (신규열리는 화면)
    							if(exist < 0){
    								menu_info.id = id;
    								menu_info.index = $('#jqxTabs').jqxTabs('length') + 2;
    								menu_info.text = text;
    								menu_info.navi = getMenuItem(id);
    								menu_info.ids = getMenuIds(id);
    
    								//COM_MENU_LOG 저장
    								if(id != "") {
    									var menudata = {};
    									menudata.ACTION_ID = "COMSYS010_01";
    									menudata.MENU_ID = id;
    									menudata.async = false;
    									AdaptorTransaction(menudata, function(res){});
    								}
    
    								//$('#side-menu .active').removeClass( "active" );
    								//$('#side-menu .in').removeClass( "in" );
    
    								for(var dCnt =  menu_info.ids.length - 1; dCnt >= 0; dCnt--){
    									if(dCnt == menu_info.ids.length - 1){
    										//$("#"+menu_info.ids[dCnt]).addClass("active");
    									}else{
    
    										var href = $("#"+menu_info.ids[dCnt]+" a:first").attr('href');
    										if(href != "#"){
    											//$("#"+menu_info.ids[dCnt]).addClass("active");
    											//$("#"+menu_info.ids[dCnt]).parent().parent().find("ul").removeClass( "collapse" );
    											//$("#"+menu_info.ids[dCnt]).parent().addClass("collapse");
    											//$("#"+menu_info.ids[dCnt]).parent().addClass("in");
    											$("#"+menu_info.ids[dCnt]+" a:first").click();
    										}else{
    											//$("#"+menu_info.ids[dCnt]).addClass("active");
    											//$("#"+menu_info.ids[dCnt]).parent().parent().find("ul").removeClass( "collapse" );
    											//$("#"+menu_info.ids[dCnt]).parent().addClass("collapse");
    											//$("#"+menu_info.ids[dCnt]).parent().addClass("in");
    										}
    									}
    								}

                                    $('.jqx-menu-minimized-button').click();
    								
    							}else{
//    								$('#side-menu .active').removeClass( "active" );
//    								$('#side-menu .in').removeClass( "in" );
//    								for(var dCnt =  menu_info.ids.length - 1; dCnt >= 0; dCnt--){
//    								if(dCnt == menu_info.ids.length - 1){
//    									$("#"+menu_info.ids[dCnt]).addClass("active");
//    								}else{
//    									var href = $("#"+menu_info.ids[dCnt]+" a:first").attr('href');
//    
//    									if(href != "#"){
//    										$("#"+menu_info.ids[dCnt]).addClass("active");
//    										$("#"+menu_info.ids[dCnt]).parent().parent().find("ul").removeClass( "collapse" );
//    										$("#"+menu_info.ids[dCnt]).parent().addClass("collapse");
//    										$("#"+menu_info.ids[dCnt]).parent().addClass("in");
//    									}else{
//    										$("#"+menu_info.ids[dCnt]).addClass("active");
//    										$("#"+menu_info.ids[dCnt]).parent().parent().find("ul").removeClass( "collapse" );
//    										$("#"+menu_info.ids[dCnt]).parent().addClass("collapse");
//    										$("#"+menu_info.ids[dCnt]).parent().addClass("in");
//    									}
//    								}
//    							}
    							//$('#jqxTabs').jqxTabs('select', exist + 1); //Dashboard 제거
    							$('#jqxTabs').jqxTabs('select', exist); 
							}
                            $('#jqxMenu').jqxMenu('minimize'); 

                            $('.jqx-menu-minimized-button').click();
					    }catch(e) {
                            console.log(e);
                        }	
					});

					$('#jqxTabs').on('removed', function (event) { 
					    try {
                            var item = event.args.item;
                            for(var i=0; i < GV.ACT_MENU.length; i++){
                                if(i == item){
                                    GV.ACT_MENU.splice(i, 1);
                                }
                            }
                            if (localStorageSupport()) {
                                localStorage.setItem("GV.ACT_MENU", JSON.stringify(GV.ACT_MENU));
                            }
                            //탭이 없으면 메인페이지로 이동 2018-10-18
                            if(GV.ACT_MENU.length==0) {
                                //location.replace("main.jsp");
                                //return;
                                $(".jqx-tabs-content").css('background', 'url(./img/common/blank_page.png) center center no-repeat' );
//                              oThis._resize();
                                const height = $("#gnb").css("height");
//                              console.log(height);
                                if(height == "0px"){
                                    $("#gnb").css("height", "85px");
                                    $(".fh-no-breadcrumb").css("height", "calc(100% - 110px)");
                                    $("nav").css("visibility", "visible");
                                    $("#page-wrapper").css("margin-left", "210px");
                                }
                            }

                            parent.$("#footer_manager").text("");
                        }catch(e) {
                            console.log(e);
                            return false;
                        }
                        return false;
					});

//                  $('#jqxTabs').on('tabclick', function (event) { 
//                  try {
//                      var clickedItem = event.args.item;
//                  }catch(e) {
//                      console.log(e);
//                  }
//
//              });

					$('.jqx-menu-minimized-button').on('click', function (event){
						//console.log("jqx-menu-minimized-button");
					});
					$('.jqx-tabs-close-all-button').off('click').on('click', function (event){
						
						for(var i = GV.ACT_MENU.length -1; i >= 0; i--){//데시보드 3개면 3으로 셋팅
							$('#jqxTabs').jqxTabs("removeAt", i);
						}
					});
				},
				loadError: function(jqXHR, status, error)
				{
					//console.log('error');
				},
				beforeLoadComplete: function (records) {
					//console.log('beforeLoadComplete');
				}
			});

			dataAdapter.dataBind();
			
			if(GV.ACT_MENU.length==0) {
				//추가 2018-10-18 메인에서 메뉴 클릭 시 탭 오픈
				var getMenuItem = function(menu_id){
					for(var i = 0; i<GV.MENU.length; i++){
						if(GV.MENU[i].id == menu_id){
							return GV.MENU[i].navi;
						}
					}
					return "";
				}
				var getMenuIds = function(menu_id){
					for(var i = 0; i<GV.MENU.length; i++){
						if(GV.MENU[i].id == menu_id){
							return GV.MENU[i].ids;
						}
					}
					return "";
				}

				var menu_info = {};
                menu_info.id = $("#menuid").val();
                menu_info.index = 0;
                menu_info.text = $("#menunm").val();
                menu_info.navi = getMenuItem($("#menuid").val());
                menu_info.ids = getMenuIds($("#menuid").val());
                //menu_info.manual = data[i].MANUAL;

                GV.ACT_MENU.push(menu_info);
                if (localStorageSupport()) {
                    localStorage.setItem("GV.ACT_MENU", JSON.stringify(GV.ACT_MENU));
                    localStorage.setItem("GV.ACT_NAVI", menu_info.navi);
                }

                $('#jqxTabs').jqxTabs('setTitleAt', 0, $("#menunm").val());
                var src = $("#pageurl").val() + "?notikind=" + $("#notikind").val(); //"dashboard.html";
                $('#content').html('<iframe src="' + src + '" height="100%" width="100%" frameborder="0" vspace="0" hspace="0" marginwidth="0" marginheight="0" scrolling = "no" />');
console.log($("#menuid").val());
                oThis._sidemenu($("#menuid").val());
                
                $(document).off('dblclick').on('dblclick', '#jqxTabs li', function() {
                    oThis._resize();
                });
                
                oThis._managerSet();
			}
		});

      	var loginInfo = GF.getLogin();

		$("#user_info").prepend(" / <a href='#;' class='user'><strong>" + loginInfo.USER_NM + "</strong></a>");
		$("#user_info").prepend(" / " + loginInfo.USER_DESC);
		$("#user_info").prepend(loginInfo.DEPT_NM);

		$("#sel_lang").change(function(event){
			$("#paramLang").val(event.target.value);
			GV.loginInfo.LANG_CD = event.target.value;
			if (localStorageSupport()) {
				localStorage.setItem("GF.login", JSON.stringify(GV.loginInfo));
			}

			$("#menuForm").attr({
				"target" : "_self",
				"action" : oThis._ACTION_URL,
				success: function (response) {
				}
			}).submit();
		});
		
		$("#top_logo").on("click", function() {
			window.location.replace(oThis._ACTION_URL);
		});
		
		//사이드 메뉴 접기,펴기. 류형석(2019.05.26)
        $(".ico_menu").off("click").on("click", function() {
            
            const left = $(this).css("left");
            if(left == "20px"){
                $(this).css("left", "200px");
                $("#jqxMenu").css("padding-left", "216px");
                $("nav").css("visibility", "visible");
                $("#page-wrapper").css("margin-left", "210px");                 
            }else{
                $(this).css("left", "20px");
                $("#jqxMenu").css("padding-left", "36px");
                $("nav").css("visibility", "hidden");
                $("#page-wrapper").css("margin-left", "0px");               
            }
//          $(window).trigger("resize");
        });

		// selected event
        $('#jqxTabs').off('selected').on('selected', function (event) {
            try {
                const item = event.args.item;
                const id = GV.ACT_MENU[item].id;
                
                oThis._sidemenu(id);
                oThis._managerSet();
                
            }catch(e) {
                console.log(e);
            }

            return;
        });
        /*
        $('#jqxTabs').on('selected', function (event) {
        	//displayEvent(event);
			return;
        });
        */
        $('#jqxTabs').on('add', function () { 
        	oThis._setDisplayMode();
        }); 

		function displayEvent(event) {
			//console.log($('#jqxTabs').jqxTabs('getTitleAt', event.args.item));
		}

		$('#jqxTabs').jqxTabs({ 
			theme: 'bootstrap',
			height: "100%", 
			//width: "100%",  
			showCloseButtons: true, 
			enableDropAnimation: false,
			scrollPosition: 'both'
			/* 데시보드 html */
			,initTabContent:
				function (tab) {
					// The 'tab' parameter represents the selected tab's index.
					//var pageIndex = tab + 1;
					var src = "dashboard.html";
					$('#content1').html('<iframe src="' + src + '" height="100%" width="100%" frameborder="0" vspace="0" hspace="0" marginwidth="0" marginheight="0" scrolling="yes" />');
				}
		});
		
		return this;
    }
	
	, _getMessageInfo: function () {
		var oThis = this;
		
		var actionID = "COMSYS002_02";
		var data = {};
		data.ACTION_ID = actionID;
		data.DS_SEARCH = [];
		
		AdaptorTransaction(data, function(res){
			
			GV.MESSAGE = res.GDS_MESSAGE;
			
			if (localStorageSupport()) {

				localStorage.setItem("GV.MESSAGE", JSON.stringify(res.GDS_MESSAGE));
			}
		});
		
		return this;
	}
	
	, _getLabelInfo: function () {
		var oThis = this;
		
		var actionID = "COMSYS003_01";
		var data = {};
		data.ACTION_ID = actionID;
		data.langCd = $("#lang_cd").val();
		data.DS_SEARCH = [];
		
		AdaptorTransaction(data, function(res){
			
			GV.LABEL = res.GDS_LABEL;
			if (localStorageSupport()) {

				localStorage.setItem("GV.LABEL", JSON.stringify(res.GDS_LABEL));
			}
		});
		
		return this;
	}
	
	, _closeModifyWindow: function (rtnVal) {
		var oThis = this;
		
		$('#modifyinfoWindow').jqxWindow('close');
		
		if(rtnVal == "LOG_OUT"){
			oThis._logOut();
		}
		
		return this;
	}
	, _logOut: function () {
		
		var oThis = this;
		
		function realClose()
		{
			var win=window.open("","_top","","true");
			win.opener=true;
			win.close();
		}

		var data = {};
		data.ACTION_ID = "COMSYS007_04";
		
		AdaptorTransaction(data, function(res) {
			$(document).empty();
			realClose();
		});		
		return this;
	}	
	
	, _setDisplayMode: function () {
		
		var oThis = this;
		
		var tabs = $('#jqxTabs').find("li");
		tabs.bind('dblclick', function (event) {
			//console.log(event);
			if(oThis._DISPLAY_MODE=="NORMAL") {
				oThis._DISPLAY_MODE = "FULL";
				$("#gnb", parent.document).css('height','0px')
				$("#pageArea", parent.document).css('height','calc(100% - 25px)');
				$("#leftNavbar", parent.document).css({'overflow-y':'hidden', 'width':'0px'})
				$("#page-wrapper", parent.document).css('margin','0 0 0 0px');
				$(window).trigger('resize');
			} else {
				oThis._DISPLAY_MODE = "NORMAL";
				$("#gnb", parent.document).css('height','85px')
				$("#pageArea", parent.document).css('height','calc(100% - 110px)');
				$("#leftNavbar", parent.document).css({'overflow-y':'auto', 'width':'216px'})
				$("#page-wrapper", parent.document).css('margin','0 0 0 215px');
				$(window).trigger('resize');
			}
		});
		
		return this;
	}	
	, _sidemenu: function (id) {
        
        const root = $("#"+id).data("root");
        const sidemenus = $("#side-menu li");
        
        for(let i = 0, len = sidemenus.length; i < len; i++){
            
            if(root == sidemenus[i].dataset.root){
                $(sidemenus[i]).css("display", "block");
            }else{
                $(sidemenus[i]).css("display", "none");
            }
        }
        const parent = $("#"+id).parent();
        const parent3 = $(".nav-third-level");
        parent3.removeClass("in");
        parent.addClass("in"); 
        
        return this;
    }
	, _managerSet : function() { //Bottom 담당자 표시
        let menuid = getCurMenuId();
        var menu = $.grep(GV.MENU, function (obj, idx) {
            return obj.id == menuid;
        });

        if(menu[0].managerNm != "") {
            const managerInfo = "담당자: " + menu[0].managerNm + "\u00A0/\u00A0" + menu[0].mobile;
            parent.$("#footer_manager").text(managerInfo);
        }else {
            parent.$("#footer_manager").text("");
        }
    }
};