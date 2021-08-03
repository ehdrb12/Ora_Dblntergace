<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@ include file="./include/incInit.jspf" %>
<%@ page import="com.awesome.core.base.util.SessionCookieUtil" %>
<%
request.setCharacterEncoding("UTF-8");
String menuid_p = request.getParameter("menuid");
String menunm_p = request.getParameter("menunm");
String pageurl_p = "pages/" + request.getParameter("pageurl");
String notikind_p = request.getParameter("notikind");

if( menuid_p != null && !menuid_p.equals((String)SessionCookieUtil.getSessionAttribute(request, "menuid")) ) {
	SessionCookieUtil.setSessionAttribute(request, "menuid", menuid_p);
}
String menuid = (String)SessionCookieUtil.getSessionAttribute(request, "menuid");

if( menunm_p != null && !menunm_p.equals((String)SessionCookieUtil.getSessionAttribute(request, "menunm")) ) {
	SessionCookieUtil.setSessionAttribute(request, "menunm", menunm_p);
}
String menunm = (String)SessionCookieUtil.getSessionAttribute(request, "menunm");

if( pageurl_p != null && !pageurl_p.equals((String)SessionCookieUtil.getSessionAttribute(request, "pageurl")) ) {
	SessionCookieUtil.setSessionAttribute(request, "pageurl", pageurl_p);
}
String pageurl = (String)SessionCookieUtil.getSessionAttribute(request, "pageurl");

if( notikind_p != null && !notikind_p.equals((String)SessionCookieUtil.getSessionAttribute(request, "notikind")) ) {
	SessionCookieUtil.setSessionAttribute(request, "notikind", notikind_p);
}
String notikind = (String)SessionCookieUtil.getSessionAttribute(request, "notikind");

//String langCd = (String)SessionCookieUtil.getSessionAttribute(request, "langCd");
%>
<%
	String paramLang = request.getParameter("paramLang");
	if(paramLang != null && paramLang.equals("CO")) {
		paramLang = "KO";
	}
	if( paramLang != null && !paramLang.equals((String)SessionCookieUtil.getSessionAttribute(request, "langCd")) ) {
		SessionCookieUtil.setSessionAttribute(request, "langCd", paramLang);
	}
	String langCd = (String)SessionCookieUtil.getSessionAttribute(request, "langCd");
	if(langCd == null) {
		langCd = "KO";
	}
	String cntxtPath =  (String) request.getContextPath();
	String webUrl =  (String) request.getAttribute("WEB_URL");
%>
<!DOCTYPE html>
<html lang="utf-8">
<head>
	<%@ include file="./include/incHead.jspf" %>
	<link rel="stylesheet" href="./css/common.css" />
	<link rel="stylesheet" href="./css/main.css" />
</head>
<body class="full-height-layout">
<div id="wrapper">
	<div id = "wrap">
		<header id="gnb">
			<!-- h1><span id="top_logo" style="cursor:pointer"><img src="./img/common/logo_system.png" alt="Moldmate" title="Moldmate MLM SYSTEM"></span></h1-->
			<h1 id="top_logo"><a href="#;">Moldmate <span>MLM</span></a></h1>
			<!-- dropdown_menu -->
			
			<!--  width="768px" 일때 활성화
			<div class="ico_menu"><a href=""><img src="./img/common/ico_menu.png" alt="menu" title="menu"></a></div>
			-->
			
			<div class="dropdown_menu" id="topmenu">
				<div id='jqxMenu' style='visibility: hidden; position:absolute; z-index:1;'>
			</div>			
			<!-- //dropdown_menu -->

			<div class="function">
				<div class="log" id="user_info">
					<span id="logout"><a href="#;" class="logout">Logout<em class="tooltip">Logout</em></a></span>
				</div>
				<ul class="utility">
					<li>
					<select id="sel_lang">
						<option value="CO" <%=langCd.equals("KO")?"selected":""%>>Korean</option>
						<option value="EN" <%=langCd.equals("EN")?"selected":""%>>English</option>
						<option value="CN" <%=langCd.equals("CN") || langCd.equals("ZH")?"selected":""%>>Chinese</option>
						<option value="VI" <%=langCd.equals("VI")?"selected":""%>>Vietnamese</option>
						<option value="HU" <%=langCd.equals("HU")?"selected":""%>>Hungarian</option>
					</select>
					</li>
				</ul>
			</div>

			<!-- nav_icon 2019-01-22 추가 -->
			<div class="nav_icon">
				<div class="utility">
					<!-- <span id="modifyinfo"><a href="#;" class="user_ico" alt="User Information" title="User Information"></a></span>
					<span id="fav"><a href="#;" class="fav_ico" alt="favorite" title="favorite"></a></span>
					<span id="setup"><a href="#;" class="setup_ico" alt="setup" title="setup"></a></span>
					<span id="help_desk"><a href="#;" class="help_ico" alt="help desk" title="help desk"></a></span>
					<span id="manual"><a href="#" class="manual_ico" alt="manual" title="manual"></a></span>
					<span id="site_link"><a href="#" class="link_ico" alt="site link" title="site link"></a></span-->
					<!--<span id="open"><a href="#;" class="open_ico" alt="open menu" title="open menu"></a></span>-->
					<!--<span id="close"><a href="#;" class="close_ico" alt="close menu" title="close menu"></a></span>-->
				</div>
			</div>
			<!-- //nav_icon -->
		</header>
	</div>

	<!-- style="padding-top:60px;" -->
	<div id="leftMenuDiv">
		<nav class="navbar-default navbar-static-side" role="navigation" style="overflow-y: auto;" id="leftNavbar"> 
			<div class="sidebar-collapse" style="" id="leftMenu"></div> 
		</nav>
	</div>
	<div id="page-wrapper">
		<div class="fh-no-breadcrumb" id="pageArea">
			<div class="full-height">
				
				<div id='jqxTabs'>
					<span class="jqx-tabs-close-all-button" alt="All Close" title="All Close"></span>
					<ul>
						<li hasclosebutton='false'></li>
					</ul>
					<div id="content"></div>
				</div>
			</div>
		</div>
	</div>
<%@ include file="./include/incFooter.jspf" %>
<form id="menuForm" method="post">
<input type="hidden" id="menuid" name="menuid" value="<%=menuid%>">
<input type="hidden" id="menunm" name="menunm" value="<%=menunm%>">
<input type="hidden" id="pageurl" name="pageurl" value="<%=pageurl%>">
<input type="hidden" id="notikind" name="notikind" value="<%=notikind%>">
<input type="hidden" id="paramLang" name="paramLang" value="<%=langCd%>">
</form>
</div>
<div id='modifyinfoWindow'><div></div><div></div></div>
<div id="helpDeskWindow" style="visibility:hidden; border:1px solid #333;">
	<div style="padding:20px;">
		<table class="form_table">
			<tr>
				<th width="25%">구분</th>
				<th width="15%">담당자</th>
				<th width="30%">연락처</th>
				<th width="30%">비고</th>
			</tr>
			<tr>
				<td>제조혁신)인프라기술그룹</td>
				<td>홍길동</td>
				<td>honggildong@gmail.com</td>
				<td>&nbsp;</td>
			</tr>
			<tr>
				<td>시스템</td>
				<td>홍길동</td>
				<td>honggildong@gmail.com</td>
				<td>&nbsp;</td>
			</tr>
		</table>
	</div>
</div>
<%@ include file="./include/incScriptAPI.jspf" %>
<script type="text/javascript">
	document.addEventListener("DOMContentLoaded", function(){
		// Handler when the DOM is fully loaded
	});

	$(window).on("load", function(){
	  // Handler when all assets (including images) are loaded
	});

	$(document).ready(function () {
		GF.pageInit("BASE", "indexm");
	});
</script>
</body>
</html>