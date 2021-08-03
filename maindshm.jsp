<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@ include file="./include/incInit.jspf" %>
<%@ page import="com.awesome.core.base.util.SessionCookieUtil" %>
<%
//세션이 끊겼을 때 에러 발생 2019.06.27(류형석)
String paramLang = request.getParameter("paramLang");
if(paramLang != null && paramLang.equals("CO")) {
	paramLang = "KO";
}
if( paramLang != null && !paramLang.equals((String)SessionCookieUtil.getSessionAttribute(request, "langCd")) ) {
	SessionCookieUtil.setSessionAttribute(request, "langCd", paramLang);
}
String langCd = (String)SessionCookieUtil.getSessionAttribute(request, "langCd");
%>
<!DOCTYPE html>
<html lang="utf-8">
<head>
	<%@ include file="./include/incHead.jspf" %>
	<link rel="stylesheet" href="./css/common.css" />
	<link rel="stylesheet" href="./css/main.css" />
	<link rel="stylesheet" href="./css/mobile.css" />
	<link rel="stylesheet" href="./css/jquery.bxsliderm.css" />
	<link rel="stylesheet" href="./css/Mdashboard.css" />
     <style type="text/css">
        .chart-inner-text
        {
            fill: #ffffff;
            /*color: #00BAFF;*/
            font-size: 36px;
            font-family:"malgun gothic";
            font-weight:bold;
            text-align: center;
        }    
    </style>
</head>
<body>
<div id="wrap" src="#">

	<!-- top -->
	<!-- gnb -->
	<header id="gnb">

		<h1><a href="#;"><img src="./img/common/logo_system2.png" alt="Moldmate" title="Moldmate MLM SYSTEM"></a></h1>

		<!-- dropdown_menu -->
		<div class="dropdown_menu" id="topmenu">
			<div id='jqxMenu' style='visibility: hidden; padding-left:10px; margin-left:-10px;'></div>
		</div>
		<!-- //dropdown_menu -->

		<!-- function -->
		<div class="function">

			<div class="log" id="user_info">
				<span id="logout"><a href="#;" class="logout">Logout<em class="tooltip">Logout</em></a></span>
			</div>

			<!-- function -->
			<ul class="utility">
				<li>
				<select id="sel_lang">
                    <option value="KO" <%=langCd.equals("KO")?"selected":""%>>Korean</option>
                    <option value="EN" <%=langCd.equals("EN")?"selected":""%>>English</option>
                    <option value="CN" <%=langCd.equals("CN") || langCd.equals("ZH")?"selected":""%>>Chinese</option>
                    <option value="VI" <%=langCd.equals("VI")?"selected":""%>>Vietnamese</option>
                    <option value="HU" <%=langCd.equals("HU")?"selected":""%>>Hungarian</option>
                </select>
				</li>
			</ul>
			<!-- //function -->

		</div>

		<!-- //function -->

		<!-- nav_icon 2019-01-22 추가 -->
    <div class="nav_icon">
        <div class="utility">
            <!-- <span id="modifyinfo"><a href="#" class="user_ico" alt="User Information" title="User Information"></a></span> -->
            <!-- <span id="fav"><a href="#" class="fav_ico" alt="favorite" title="favorite"></a></span> -->
            <!-- <span id="setup"><a href="#" class="setup_ico" alt="setup" title="setup"></a></span> -->
            <!-- <span id="help_desk"><a href="#" class="help_ico" alt="help desk" title="help desk"></a></span> -->
            <!-- <span id="smsSend"><a href="#" class="sms_ico" alt="send sms" title="send sms"></a></span> -->
            <!-- <span id="manual"><a href="#" class="manual_ico" alt="manual" title="manual"></a></span> -->
            <!-- <span id="site_link"><a href="#" class="link_ico" alt="site link" title="site link"></a></span> -->
            <!--<span id="open"><a href="#" class="open_ico" alt="open menu" title="open menu"></a></span> -->
            <!--<span id="close"><a href="#" class="close_ico" alt="close menu" title="close menu"></a></span>-->
        </div>
    </div>
    <!-- //nav_icon -->

    </header>
    <!-- //gnb -->

    <!-- container -->
    <div id="container">

    <div class="container_box">

        <!-- ccr_01 -->
        <div class="ccr_01">
            <div class="ccr_title_01">SOCKET COLLECTOR</div>

            <!-- machine_box -->
                <div class="machine_box">
                
                    <div class="machine_box_in">

                        <div class="machine_L">
                            <div class="machine_btn" title="control"><a href='#'>control</a></div>                          
                            <div class="machine_tit">Machine #01</div>
                            
                            <dl>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;STATUS</dt>
                                <dd>RUNNING</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;CPU</dt>
                                <dd>12 %</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;MEM</dt>
                                <dd>814 MB</dd>
                            </dl>

                            <div class="coll_img"></div>

                            <div class="coll_box">
                                <div class="col_btn"><a href='#'>control</a></div>
                                <div class="state_popup"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Collector #01</a></div>
                            </div>
                            <div class="coll_box">
                                <div class="col_btn"><a href='#'>control</a></div>
                                <div class="state_popup"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Collector #02</a></div>
                            </div>
                            <div class="coll_box">
                                <div class="col_btn"><a href='#'>control</a></div>
                                <div class="state_popup"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Collector #03</a></div>
                            </div>
                        </div>


                        <div class="machine_R">
                            <div class="machine_btn" title="control"><a href='#'>control</a></div>
                            <div class="machine_tit">Machine #02</div>
                            
                            <dl>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;STATUS</dt>
                                <dd>IDLE</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;CPU</dt>
                                <dd>10 %</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;MEM</dt>
                                <dd>814 MB</dd>
                            </dl>

                            <div class="coll_img"></div>

                            <div class="coll_box">
                                <div class="col_btn"><a href='#'>control</a></div>
                                <div class="state_popup"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Collector #01</a></div>
                            </div>
                            <div class="coll_box">
                                <div class="col_btn"><a href='#'>control</a></div>
                                <div class="state_popup"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Collector #02</a></div>
                            </div>
                            <div class="coll_box">
                                <div class="col_btn"><a href='#'>control</a></div>
                                <div class="state_popup"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Collector #03</a></div>
                            </div>
                        </div>

                    </div>
                </div>
                <!-- end machine_box -->

        </div>
        <!-- end ccr_01 -->

        <!-- ccr_02 -->
        <div class="ccr_02">
            <div class="ccr_title_02">SCHEDULER</div>

            <!-- machine_box -->
                <div class="machine_box">
                
                    <div class="machine_box_in">

                        <div class="machine_L">
                            <div class="machine_btn" title="control"><a href='#'>control</a></div>                          
                            <div class="machine_tit">Machine #03</div>
                            
                            <dl>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;STATUS</dt>
                                <dd>RUNNING</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;CPU</dt>
                                <dd>12 %</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;MEM</dt>
                                <dd>814 MB</dd>
                            </dl>

                            <div class="coll_img"></div>

                            <div class="coll_box">
                                <div class="col_btn"><a href='#'>control</a></div>
                                <div class="state_popup"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Collector #01</a></div>
                            </div>
                        </div>


                        <div class="machine_R">
                            <div class="machine_btn" title="control"><a href='#'>control</a></div>
                            <div class="machine_tit">Machine #04</div>
                            
                            <dl>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;STATUS</dt>
                                <dd>IDLE</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;CPU</dt>
                                <dd>10 %</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;MEM</dt>
                                <dd>814 MB</dd>
                            </dl>

                            <div class="coll_img"></div>

                            <div class="coll_box">
                                <div class="col_btn"><a href='#'>control</a></div>
                                <div class="state_popup"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Collector #01</a></div>
                            </div>
                        </div>

                    </div>
                </div>
                <!-- end machine_box -->

        </div>
        <!-- end ccr_02 -->

        <!-- ccr_03 -->
        <div class="ccr_03">
            <div class="ccr_title_03">3rd Party Agent</div>

            <!-- machine_box -->
                <div class="machine_box">
                
                    <div class="machine_box_in">

                        <div class="machine_L">
                            <div class="machine_btn" title="control"><a href='#'>control</a></div>                          
                            <div class="machine_tit">Machine #05</div>
                            
                            <dl>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;STATUS</dt>
                                <dd>RUNNING</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;CPU</dt>
                                <dd>12 %</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;MEM</dt>
                                <dd>814 MB</dd>
                            </dl>

                            <div class="coll_img"></div>

                            <div class="coll_box">
                                <div class="col_btn"><a href='#'>control</a></div>
                                <a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Collector #01</a>
                            </div>
                        </div>


                        <div class="machine_R">
                            <div class="machine_btn" title="control"><a href='#'>control</a></div>
                            <div class="machine_tit">Machine #06</div>
                            
                            <dl>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;STATUS</dt>
                                <dd>IDLE</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;CPU</dt>
                                <dd>10 %</dd>
                                <dt>&nbsp;&nbsp;&nbsp;&nbsp;MEM</dt>
                                <dd>814 MB</dd>
                            </dl>

                            <div class="coll_img"></div>

                            <div class="coll_box">
                                <div class="col_btn"><a href='#'>control</a></div>
                                <a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Collector #01</a>
                            </div>
                        </div>

                    </div>
                </div>
                <!-- end machine_box -->

        </div>
        <!-- end ccr_03 -->

    </div>

    </div>
    <!-- end container -->


    <!-- footer -->
    <div class="footer">
        <div class="pull-left"><img src="./img/common/logo_copy.png" alt="KCI Admin" title="KCI Admin"></div>
    </div>
    <!-- //footer -->

<div id="jqxLoader"></div>
<form id="menuForm" method="post">
<input type="hidden" id="menuid" name="menuid">
<input type="hidden" id="menunm" name="menunm">
<input type="hidden" id="pageurl" name="pageurl">
<input type="hidden" id="notikind" name="notikind">
</form>
</div>
<div id='popupWindow'><div></div><div></div></div>
<div id='modifyinfoWindow'><div></div><div></div></div>
<div id='noticeWindow'><div></div><div></div></div>
<div id='smsWindow'><div></div><div></div></div>
<div id='sendSmsWindow'><div></div><div></div></div>
<div id='popupManager'><div></div><div></div></div>
<div id='fileWindow'><div></div><div></div></div>
<%@ include file="./include/incScriptAPI.jspf" %>
<script type="text/javascript">
	$(document).ready(function () {
		GF.pageInit("BASE", "maindshm");
	});
</script>
<script> 
$(document).ready(function(){ 
    var main = $('.bxslider00').bxSlider({ 
    mode: 'fade', 
    auto: true,	//자동으로 슬라이드 
    controls : false,	//좌우 화살표	
    autoControls: false,	//stop,play 
    pager:true,	//페이징 
    autoDelay: 0,	
    slideWidth: 800, 
    speed: 1000, 
    stopAutoOnclick:true 
}); 
   
 

  $(".bx-start").hide();	//onload시 시작버튼 숨김. 
}); 
</script> 

</body>
</html>