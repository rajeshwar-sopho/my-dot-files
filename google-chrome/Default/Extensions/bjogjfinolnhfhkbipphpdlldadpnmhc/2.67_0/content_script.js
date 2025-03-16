console.log("CONTENT_SCRIPT.JS");

var notExtraLink = "canonical,description,keywords";

var pageInfo = {
	'basicTabHtml': '-- none --',
	'outputTabHtml': '-- none --',
	'headersTabHtml': '-- none --',
	'imagesTabHtml': '-- none --',
	'linksTabHtml': '-- none --',
	'socialTabHtml': '-- none --',
	'toolsTabHtml': '-- none --'
};

var entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': '&quot;',
	"'": '&#39;',
	"’": '&#39;',
	"ʼ": '&#39;',
	"'": '&#39;',
	"/": '&#x2F;'
};

// =====================================================================
// START HERE
$.extend($.expr[":"], {
	"containsIN": function (elem, i, match, array) {
		return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});


{

	//	initOutputTab();

	initBasicTab();

	initHeadersTab();

	initImagesTab();

	initLinksTab();

	initSocialTab();

	initToolsTabHtml();

}

// =====================================================================
// 

function getMetaContentByProperty(mn) {
	return $("meta[property*='" + mn + "']").attr("content");
}

function getMetaContentByName(mn) {

	returnContent = "";
	var m = document.getElementsByTagName('meta');
	for (var i in m) {

		try {
			if (m[i].name.toLowerCase() == mn.toLowerCase()) {
				returnContent = m[i].content;
				break;
			}
		} catch (err) {
			continue;
		}
	}


	return returnContent.trim();


}

function getLinkByRel(rel) {
	var m = document.getElementsByTagName('link');
	for (var i in m) {

		try {
			if (m[i].rel.toLowerCase() == rel) {
				return m[i].href;
			}
		} catch (err) {
			continue;
		}
	}
	return "";
}


function sortOnTagName(a, b) {
	return jQuery(a).prop("tagName").toLowerCase() > jQuery(b).prop("tagName").toLowerCase() ? 1 : -1;
};

function sortOnAttrRel(a, b) {
	return jQuery(a).attr("rel").toLowerCase() > jQuery(b).attr("rel").toLowerCase() ? 1 : -1;
};

function sortOnAttributeName(a, b) {
	return a.nodeName.toLowerCase() > b.nodeName.toLowerCase() ? 1 : -1;
}



function initOutputTab() {

	output = "";
	separator = "<br/>";


	/*
	headElementsObject = $('head').children().sort(sortOnTagName).clone();
	
	
	$(headElementsObject).each(function(){
		// display the TAG NAME
		output = output + "<strong>" + $(this).prop("tagName").toLowerCase() + " - attributs: " + $(this)[0].attributes.length + "</strong>" + " | " ;
				
		// display ALL ATTRIBUTES
//		for(var i = 0; i < $(this)[0].attributes.length; i++) {			
//			output = output + " - " + $(this)[0].attributes[i].nodeName + " = " + $(this)[0].attributes[i].nodeValue + "<br/>";
//		}
		
		attrts = $($(this)[0].attributes).sort(sortOnAttributeName);
		
		for(var i = 0; i < attrts.length; i++) {			
			output = output + attrts[i].nodeName + " | ";			
		}
		
		output = output + separator;
	});
	
	
	output = output + "<hr/><hr/>";
	 
	*/

	headElementsObject = $('head').children().sort(sortOnTagName).clone();

	$(headElementsObject).each(function () {
		// display the TAG NAME
		output = output + "<strong>" + $(this).prop("tagName").toLowerCase() + " - attributs: " + $(this)[0].attributes.length + "</strong>" + " <br/>  ";

		// display ALL ATTRIBUTES
		//		for(var i = 0; i < $(this)[0].attributes.length; i++) {			
		//			output = output + " - " + $(this)[0].attributes[i].nodeName + " = " + $(this)[0].attributes[i].nodeValue + "<br/>";
		//		}

		attrts = $($(this)[0].attributes).sort(sortOnAttributeName);

		for (var i = 0; i < attrts.length; i++) {
			output = output + "<strong>" + " --- " + attrts[i].nodeName + "</strong>" + " = " + attrts[i].nodeValue + "<br/>";
			if (attrts[i].nodeName == 'title') {
				output = output + "<strong>" + " --- " + attrts[i].nodeName + "</strong>" + " = " + $($(this)[0]).html() + "<br/>";
			}
		}

		output = output + "<hr/>";
	});

	pageInfo.outputTabHtml = output;

}

function initHeadersTab() {

	pageInfo.headersTabHtml = getHeadersDetail();

}


function getRowHeadersImages() {



	numberH1 = document.getElementsByTagName('h1').length;
	numberH2 = document.getElementsByTagName('h2').length;
	numberH3 = document.getElementsByTagName('h3').length;

	numberH4 = document.getElementsByTagName('h4').length;
	numberH5 = document.getElementsByTagName('h5').length;
	numberH6 = document.getElementsByTagName('h6').length;

	numberLinks = $('a').length;
	numberImages = $('img').length;
	output += "<div >";
	output = "<table class='table' style='margin-bottom: 2px;'>";
	output += "<thead>";
	output += "  <tr>";
	output += "    <th>H1</th>";
	output += "    <th>H2</th>";
	output += "    <th>H3</th>";
	output += "    <th>H4</th>";
	output += "    <th>H5</th>";
	output += "    <th>H6 <img class='hpr' src='img/help-icon-i.png' id='h-headers' /> </th>";
	output += "    <th class='text-right'>Images <img class='hpr' src='img/help-icon-i.png' title='Help?' id='h-images' /> </th>";
	output += "    <th class='text-right'>Links <img class='hpr' src='img/help-icon-i.png' title='Help?' id='h-links' /></th>";
	output += "  </tr>";
	output += "</thead>";
	output += "<tbody>";
	output += "  <tr>";
	if (numberH1 == 0) {
		output += "    <td id='seoH1' class='error-value'>" + numberH1 + "</td>";
	} else {
		output += "    <td id='seoH1'>" + numberH1 + "</td>";
	}
	if (numberH2 == 0) {
		output += "    <td id='seoH2' class='error-value'>" + numberH2 + "</td>";
	} else {
		output += "    <td id='seoH2'>" + numberH2 + "</td>";
	}
	output += "    <td id='seoH3'>" + numberH3 + "</td>";
	output += "    <td id='seoH4'>" + numberH4 + "</td>";
	output += "    <td id='seoH5'>" + numberH5 + "</td>";
	output += "    <td id='seoH6'>" + numberH6 + "</td>";
	output += "    <td class='text-right' id='seoImages'>" + numberImages + "</td>";
	output += "    <td class='text-right' id='seoLinks'>" + numberLinks + "</td>";
	output += "  </tr>";
	output += " </tbody>";
	output += "</table>";


	return output;
}

function getHeadersDetail() {

	// Cet onglet affiche les titres de la page courantes dans l'ordre d'apparition (sans tri).
	output = "<span class='intro-tab'>All headers in order of their appearance in HTML.</span>" +
		"<hr/>";

	// headers 
	output += "<div class='headers-bloc'>";

	headersFound = false;
	$('h1,H1,h2,H2,h3,H3,h4,H4,h5,H5,h6,H6').each(function () {

		output += "<div class='c-" + $(this).prop("tagName").toLowerCase() + "'>";
		output += "<strong>&lt;" + $(this).prop("tagName").toUpperCase() + "&gt;</strong> " + escapeHtml($(this).text()) + '<br/>';
		output += "</div>";

		headersFound = true;
	});

	if (!headersFound) {
		output += "<span class='error-value'>No header has been found.</span><br/>";
	}
	output += "</div>";

	output += "<hr />";

	numberH1 = document.getElementsByTagName('h1').length;
	numberH2 = document.getElementsByTagName('h2').length;
	numberH3 = document.getElementsByTagName('h3').length;

	numberH4 = document.getElementsByTagName('h4').length;
	numberH5 = document.getElementsByTagName('h5').length;
	numberH6 = document.getElementsByTagName('h6').length;

	output += "<div >";
	output += "<table class='table' style='margin-bottom: 2px;'>";
	output += "<thead>";
	output += "  <tr>";
	output += "    <th>H1</th>";
	output += "    <th>H2</th>";
	output += "    <th>H3</th>";
	output += "    <th>H4</th>";
	output += "    <th>H5</th>";
	output += "    <th>H6 <img class='hpr' src='img/help-icon-i.png' id='h-headers' /> </th>";

	output += "  </tr>";
	output += "</thead>";
	output += "<tbody>";
	output += "  <tr>";
	if (numberH1 == 0) {
		output += "    <td id='seoH1' class='error-value'>" + numberH1 + "</td>";
	} else {
		output += "    <td id='seoH1'>" + numberH1 + "</td>";
	}
	if (numberH2 == 0) {
		output += "    <td id='seoH2' class='error-value'>" + numberH2 + "</td>";
	} else {
		output += "    <td id='seoH2'>" + numberH2 + "</td>";
	}
	output += "    <td id='seoH3'>" + numberH3 + "</td>";
	output += "    <td id='seoH4'>" + numberH4 + "</td>";
	output += "    <td id='seoH5'>" + numberH5 + "</td>";
	output += "    <td id='seoH6'>" + numberH6 + "</td>";

	output += "  </tr>";
	output += " </tbody>";
	output += "</table>";
	output += "</div>";


	return output;
}

function escapeHtml(string) {
	if (typeof string === "undefined") {
		return "";
	}
	if (string == undefined || string == 'undefined' || string == '' || string == null) {
		return "";
	}
	let sss = "----";
	try {
		return String(string).replace(/[&<>"'’ʼ\/]/g, function (s) {
			sss = s;
			return entityMap[s];
		});
	} catch (e) {
		console.error("Error with escape html of : " + string);
		console.error("sss = "+sss);
		console.error(entityMap);
		console.error(e);
		return "";
	}

}

function isGAAvailable() {

	avalaible = false;
	// ---------------------------------------------------------
	// Google Analytics
	$('script').each(function () {
		contentScript = $(this).html().toLowerCase();
		if (contentScript.indexOf('google-analytics.com') >= 0 ||
			contentScript.indexOf('googleanalytics') >= 0) {
			// || contentScript.indexOf('ga.js') >= 0){
			avalaible = true;
		}
	});

	return avalaible;
}

function isScriptUrlAvailableFor(terme) {

	avalaible = false;
	$('script').each(function () {
		contentScript = $(this).html().toLowerCase();
		if (contentScript.indexOf(terme) >= 0) {
			avalaible = true;
		}
	});

	if (!avalaible) {
		$('script[src]').each(function () {
			contentScript = $(this).attr('src');
			// console.log('in script[src] = '+contentScript);
			if (contentScript == undefined || contentScript == null) {
				contentScript = "";
			}
			if (contentScript.indexOf(terme) >= 0) {
				avalaible = true;
			}
		});
	}
	return avalaible;
}

function isLengthError(number, min, max) {

	var intNumber = parseInt(number);

	if (intNumber < min || intNumber > max) {
		return true;
	}

	return false;
}

function getMsgNoData() {
	return getMsgForNoData("not defined");
}

function getMsgForNoData(msg) {
	return "<span class='no-data'>" + msg + "</span>";
}

function initBasicTab() {
	output = "";

	// -----------------------------------------------------------------
	// TITLE
	content = document.title;
	msgLength = getLengthOf(content);
	msgLengthError = "It is a 30-65 characters page title"
	if (msgLength == '0') {
		content = "<span class='error-message'>Title is missing!</span>";
	} else {
		if (isLengthError(msgLength, 30, 65)) {
			msgLength = "<span class='error-value'>" + msgLength + " characters</span>";
		} else {
			msgLength = "<span class='good-value'>" + msgLength + " characters</span>";
		}
	}

	output += getTitleAndContentLinesAsHtmlV2(
		"Title", // titleName
		"", // titleNameTooltip
		"h-title", // idOfHelpButton - ex: h-description, h-keywords
		msgLength, // rightMessage
		msgLengthError, // rightMessageTooltip
		content // contentAsHtml
	);


	// -----------------------------------------------------------------
	// DESCRIPTION
	content = getMetaContentByName('description');
	msgLength = getLengthOf(content);
	msgLengthError = "";
	if (msgLength == '0') {
		content = "<span class='error-message'>Description is missing!</span>";
		msgLength = "";
	} else {
		if (isLengthError(msgLength, 120, 320)) {
			msgLength = "<span class='error-value'>" + msgLength + " characters</span>";
			msgLengthError = "It is a 120-320 characters page description"
		} else {
			msgLength = "<span class='good-value'>" + msgLength + " characters</span>";
			msgLengthError = "It is a 120-320 characters page description"
		}
	}

	content = "<article>" + content + "</article>";

	output += getTitleAndContentLinesAsHtmlV2(
		"Description", // titleName
		"", // titleNameTooltip
		"h-description", // idOfHelpButton - ex: h-description, h-keywords
		msgLength, // rightMessage
		msgLengthError, // rightMessageTooltip
		content // contentAsHtml
	);

	// -----------------------------------------------------------------
	// KEYWORDS
	content = getMetaContentByName('keywords');
	msgLength = getLengthOf(content);
	msgLengthError = "";
	if (msgLength == '0') {
		content = "<span class='no-data'>Keywords are missing!</span>";
		msgLength = "";
	} else {

		if (content == '' || content == null || content.trim().length == 0) {
			msgLength = 0 + " value";
			content = getMsgNoData();
		} else {
			msgLength = content.split(",").length + " values";
		}

	}

	content = "<article>" + content + "</article>";

	output += getTitleAndContentLinesAsHtmlV2(
		"Keywords", // titleName
		"", // titleNameTooltip
		"h-keywords", // idOfHelpButton - ex: h-description, h-keywords
		msgLength, // rightMessage
		msgLengthError, // rightMessageTooltip
		content // contentAsHtml
	);


	// -----------------------------------------------------------------
	// URL
	content = window.location.href;
	output += getTitleAndContentOnOneLines(
		"URL",
		"",
		"h-url",
		content);

	// -----------------------------------------------------------------
	// CANONICAL
	content = getLinkByRel('canonical');
	if (getLengthOf(content) == '0') {
		content = getMsgForNoData("Canonical URL is not defined.");
	}
	output += getTitleAndContentOnOneLines(
		"Canonical",
		"",
		"h-canonical",
		content);

	// -----------------------------------------------------------------
	// ROBOTS
	content = getMetaContentByName('robots');
	if (getLengthOf(content) == '0') {
		content = getMsgForNoData("Robots meta tag is not defined.");
	} else {
		content = getMoreDetailForRobotsTag(content);
	}

	output += getTitleAndContentOnOneLines(
		"Robots Tag",
		"",
		"h-robots",
		content);


	// -----------------------------------------------------------------
	// AUTHOR
	content = getAuthorContent();
	output += getTitleAndContentOnOneLines(
		"Author",
		"",
		"h-author",
		content);

	// -----------------------------------------------------------------
	// PUBLISHER
	content = getPublisherContent();
	output += getTitleAndContentOnOneLines(
		"Publisher",
		"",
		"h-publisher",
		content);


	// -----------------------------------------------------------------
	// LANG
	content = getHtmlLang();
	output += getTitleAndContentOnOneLines(
		"Lang",
		"",
		"h-lang",
		content);





	// -----------------------------------------------------------------
	// HEADERS + IMAGES summary + LINKS summary
	output += getRowHeadersImages();

	// -----------------------------------------------------------------
	// SCRIPTS + ROBOTS + SITEMAP 
	// GA	
	rightContent = "";
	leftContent = "";
	if (isGAAvailable()) {
		leftContent += "<img src='img/ga-icon.png' title='Google Analytics script found' class='ftltp' /> " + getHelpSymbol("h-ga");
	} else {
		leftContent += "<img src='img/ga-icon-na.png' title='Google Analytics script NOT found' class='ftltp' /> " + getHelpSymbol("h-ga");
	}

	/*
	if (isScriptUrlAvailableFor('stats.g.doubleclick.net')){
    	leftContent += "<span class='b-vertc'> |</span><img src='img/doubleclick-icon.png' title='Stats DoubleClick script found (Google)' class='ftltp script-img' /> "+getHelpSymbol("h-doubleclick");
    }
    
	if (isScriptUrlAvailableFor('yimg.com')){
    	leftContent += "<span class='b-vertc'> |</span><img src='img/yahoo-icon.png' title='Yimg.com script found (Yahoo!)' class='ftltp script-img' /> "+getHelpSymbol("h-yahoo-yimg");
    }
    */



	// -----------------------------------------------------------------
	// RIGHT SIDE - ROBOTS.txt + SITEMAP.XML
	url = $.url(pageInfo.url);
	urlRobots = url.attr('protocol') + "://" + url.attr('host') + "/robots.txt";
	urlSitemapXml = url.attr('protocol') + "://" + url.attr('host') + "/sitemap.xml";

	rightContent = getLink(urlRobots, "Robots.txt", "Click to display the robots.txt. ") + " " + getHelpSymbol("h-robots-txt") +
		"<span class='b-vertc'> | </span>" +
		getLink(urlSitemapXml, "Sitemap.xml", "Click to display the sitemap.xml. ") + " " + getHelpSymbol("h-sitemap");;



	output += getRightLeftContentLine(rightContent, leftContent);


	// -----------------------------------------------------------------
	// EXTRA
	output += "<hr/>";
	output += "<div class='row clearfix content-line' > <div class='col-xs-12 column'> " +
		getExtraMeta() +
		"</div></div>";


	// -----------------------------------------------------------------
	// XFN - REL
	output += "<div class='row clearfix content-line' > <div class='col-xs-12 column'> " +
		getXfnRel() +
		"</div></div>";


	// -----------------------------------------------------------------
	pageInfo.basicTabHtml = output;

}

function isUrlExists(urlPath) {
	exists = false;
	$.get(urlPath)
		.done(function () {
			exists = true;
		}).fail(function () {
			exists = false;
		});
	return exists;
}

function getLengthOf(input) {
	if (input == '' || input == 'undefined' || input == null) {
		return 0;
	} else {
		return input.length;
	}
}

function getXfnRel() {

	output = "<hr class='hr-class-10'/><span class='intro-tab'>XFN / Rel attr. (Xhtml Friends Network)</span>&nbsp;&nbsp;" + getHelpSymbol("h-xfn") + "<br/>";

	elementsObjects = $('a[rel]').sort(sortOnAttrRel).clone();

	console.debug("Number of rel LENGHT = " + elementsObjects.length);

	if (elementsObjects.length == 0) {
		output += '<span class="no-data">No DATA has been found for XFN and REL attributes.</span>';
	} else {
		$(elementsObjects).each(function () {

			href = $(this).attr("href");
			//			console.log("THIS object: %o", $(this));			
			href = getHref(href);
			//			console.log("href after = "+href);
			txt = $.trim($(this).text());

			if (txt == '' || txt == undefined) {
				if (href != '' || href != undefined) {
					txt = href;
				} else {
					txt = "- no text -";
				}
			}

			output += "<span class='basic-title-2'>" + $(this).attr("rel") + ": </span>";
			if (href == undefined || href == null || href == "") {
				output += "<span class='ftltp src-css' title='No link found'>" + txt + "</span>";
			} else {
				output += "<span class='src-css'><a href='" + href + "'  class='ftltp' title='" + href + "' target='_blank'>";
				output += txt + "</a></span>";
			}




			output += "<br/>";

		});
	}


	return output;
}

function getExtraMeta() {

	output = '';
	separator = "<br/>";

	headElementsObject = $('head').children().sort(sortOnTagName).clone();

	console.debug("headElementsObject LENGHT = " + headElementsObject.length);

	linksTab = [];
	scriptsTab = [];
	metasTab = [];

	$(headElementsObject).each(function () {

		tagName = $(this).prop("tagName").toLowerCase();

		// display the TAG NAME
		// output += "<strong>" + tagName + " - attributs: " + $(this)[0].attributes.length + "</strong>" + " | " + separator ;


		switch (tagName) {
			case 'title':
				// Nothing
				break;

			case 'link':
				ct = getLinkContent(this);
				if (ct != '') {
					linksTab[linksTab.length] = ct;
				}
				break;

			case 'script':
				ct = getScriptContent(this);
				// console.debug("ct = "+ct);
				if (ct != '' && ct != undefined && ct != 'undefined') {
					scriptsTab[scriptsTab.length] = ct;
				}
				break;

			case 'meta':
				ct = getMetaContent(this);
				if (ct != '') {
					metasTab[metasTab.length] = ct;
				}
				break;


			default:
				console.error("Tag not handled: " + tagName);
		}


		// display ALL ATTRIBUTES
		//		for(var i = 0; i < $(this)[0].attributes.length; i++) {			
		//			output = output + " - " + $(this)[0].attributes[i].nodeName + " = " + $(this)[0].attributes[i].nodeValue + "<br/>";
		//		}


		/*
		
		attrts = $($(this)[0].attributes).sort(sortOnAttributeName);
		
		for(var i = 0; i < attrts.length; i++) {			
			// output += attrts[i].nodeName + " | ";			
		}
		
		contentUtil = getContentUtilOfElement(this);
		if (contentUtil != ''){ // not empty - we take it then :)
			output += contentUtil + separator;
		}else{
			output += separator;
		}
		
		*/

	});

	// sort arrays and display them
	if (linksTab.length > 0) {
		output += "<span class='intro-tab'>ALL LINKS</span><br/>";
	}
	linksTab.sort();
	for (var i in linksTab) {
		output += linksTab[i] + separator;
	}

	// ALL META
	if (metasTab.length > 0) {
		output += "<hr class='hr-class-10'/><span class='intro-tab'>ALL METAS</span><br/>";
	}
	metasTab.sort();
	for (var i in metasTab) {
		output += metasTab[i] + separator;
	}

	// ALL SCRIPTS
	if (scriptsTab.length > 0) {
		output += "<hr class='hr-class-10'/><span class='intro-tab'>ALL SCRIPTS</span><br/>";
	}
	scriptsTab.sort();
	for (var i in scriptsTab) {
		output += scriptsTab[i] + separator;
	}



	return output;
	//	return '';

}




function getLinkContent(elmt) {

	contentUtil = "";

	if ($(elmt).prop("tagName").toLowerCase() == "link") {
		href = $(elmt).attr("href");
		rel = $(elmt).attr("rel");
		type = $(elmt).attr("type");
		hreflang = $(elmt).attr("hreflang");
		if (!isAnExtra(rel)) {
			return "";
		}

		rel = testAndLowerTrim(rel);
		type = testAndLowerTrim(type);
		hreflang = testAndLowerTrim(hreflang);





		imageName = getLastRightPartOfUrl(href);
		href = getHref(href);
		hrefSliced = myStringSlice(href);
		newHref = imageName;
		if (isAnImage(rel)) {
			newHref = "<span class='src-css'><a href='" + href + "'  class='preview' title='" + myStringSlice(rel) + "' target='_blank'>" + imageName + "</a></span>";
		} else if (isRelAnLink(rel)) {
			if (rel.toLowerCase() == 'alternate' || rel.toLowerCase() == 'edituri') {
				hreflang = $(elmt).attr("hreflang");

				if (type != '' && type != undefined && type != 'undefined') {
					newHref = "<span class='src-css'><a href='" + href + "'  class='ftltp' title='" + hrefSliced + "' target='_blank'>" + imageName + "</a> (" + type + ")</span>";
				} else if (hreflang != '' && hreflang != undefined && hreflang != 'undefined') {
					newHref = "<span class='src-css'><a href='" + href + "'  class='ftltp' title='" + hrefSliced + "' target='_blank'>" + imageName + "</a> </span>";
				} else {
					newHref = "<span class='src-css'><a href='" + href + "'  class='ftltp' title='" + hrefSliced + "' target='_blank'>" + imageName + "</a></span>";
				}

			} else {
				newHref = "<span class='src-css'><a href='" + href + "' title='" + hrefSliced + "' target='_blank' class='ftltp'>" + imageName + "</a></span>";
			}

		}
		contentUtil = getLineExtraMeta(rel, newHref);
	}

	return contentUtil;
}

function getScriptContent(elmt) {

	contentUtil = "";

	if ($(elmt).prop("tagName").toLowerCase() == "script") {

		src = $(elmt).attr("src");
		type = $(elmt).attr("type");

		// console.debug("SRC: "+src+" / TYPE: "+type);

		fileName = getLastRightPartOfUrl(src);
		src = getHref(src);

		if (src == '' || src == undefined) {
			contentUtil = '';
		} else {
			ctt = "<span class='src-css'><a href='" + src + "'  class='ftltp' title='" + myStringSlice(src) + "' target='_blank'>" +
				"<img src='https://www.google.com/s2/favicons?domain=" + src + "' /> " +
				fileName + "</a></span>";
			if (type == '' || type == 'undefinded' || type == null) {
				contentUtil = getLineExtraMeta("Script", ctt);
			} else {
				contentUtil = getLineExtraMeta(type, ctt);
			}
		}


	}

	return contentUtil;
}


function getMetaContent(elmt) {

	contentUtil = "";

	if ($(elmt).prop("tagName").toLowerCase() == "meta") {

		name = $(elmt).attr("name");
		property = $(elmt).attr("property");
		content = $(elmt).attr("content");
		charset = $(elmt).attr("charset");
		httpEquiv = $(elmt).attr("http-equiv");
		itemprop = $(elmt).attr("itemprop");


		// console.debug("SRC: "+src+" / TYPE: "+type);

		partLeft = "";

		if (name != '' && name != undefined && name != 'undefined') {
			partLeft = name.trim();

			if (!isAnExtra(partLeft)) {
				return "";
			}

		} else if (property != '' && property != undefined && property != 'undefined') {
			partLeft = property.trim();
		} else if (charset != '' && charset != undefined && charset != 'undefined') {
			partLeft = "charset";
			content = charset;
		} else if (itemprop != '' && itemprop != undefined && itemprop != 'undefined') {
			partLeft = "itemprop (" + itemprop.trim() + ")";
		} else if (httpEquiv != '' && httpEquiv != undefined && httpEquiv != 'undefined') {
			partLeft = "http-equiv (" + httpEquiv.trim() + ")";
		} else {
			partLeft = "undefined";
		}

		if (isAnImage(partLeft)) {
			imageName = getLastRightPartOfUrl(content);
			href = getHref(content);
			content = "<span class='src-css'><a href='" + href + "'  class='preview' title='" + myStringSlice(imageName) + "' target='_blank'>" + imageName + "</a></span>";
		} else if (isMetaNameAnLink(partLeft)) {
			imageName = getLastRightPartOfUrl(content);
			href = getHref(content);
			content = "<span class='src-css'><a href='" + href + "' title='" + myStringSlice(href) + "' target='_blank' class='ftltp'>" + imageName + "</a></span>";
		}

		// isMetaNameAnLink

		contentUtil = getLineExtraMeta(partLeft, content);
	}

	return contentUtil;
}


function getPublisher() {
	var m = document.getElementsByTagName('link');
	for (var i in m) {

		try {
			if (m[i].rel.toLowerCase() == 'publisher') {
				return m[i].href;
			}
		} catch (err) {
			continue;
		}
	}
	return noDataMsg;
}

function isAnImage(rel) {
	if (rel == undefined || rel == '') {
		return false;
	}

	newRel = rel.toLowerCase();
	if (newRel.indexOf("height") >= 0 ||
		newRel.indexOf("width") >= 0) {
		return false;
	}
	if (newRel.indexOf("icon") >= 0 ||
		newRel.indexOf("image") >= 0) {
		return true;
	}
	return false;

}


function isRelAnLink(rel) {
	if (rel == undefined || rel == '') {
		return false;
	}

	newRel = rel.toLowerCase();
	if (newRel.indexOf("stylesheet") >= 0 ||
		newRel.indexOf("link") >= 0 ||
		newRel.indexOf("search") >= 0 ||
		newRel.indexOf("dns") >= 0 ||
		newRel.indexOf("profile") >= 0 ||
		newRel.indexOf("uri") >= 0 ||
		newRel.indexOf("next") >= 0 ||
		newRel.indexOf("previous") >= 0 ||
		newRel.indexOf("publisher") >= 0 ||
		newRel.indexOf("pingback") >= 0 ||
		newRel.indexOf("alternate") >= 0) {
		return true;
	}
	return false;

}

function isMetaNameAnLink(rel) {
	if (rel == undefined || rel == '') {
		return false;
	}

	newRel = rel.toLowerCase();
	if (newRel.indexOf("url") >= 0) {
		return true;
	}
	return false;

}


function getLastRightPartOfUrl(urlIn) {
	if (urlIn == undefined || urlIn == '') {
		return '';
	}

	imageName = $.url(urlIn).segment(-1);
	if ($.trim(imageName) == '') {
		imageName = $.url(urlIn).segment(1);
	}

	if (imageName == '') {
		if (!(urlIn == null || $.trim(urlIn) == '')) {
			imageName = urlIn;
		}
	}
	return imageName;
}

function getHref(href) {

	src = href;

	var urlHost = url = $.url(window.location.href);

	// Tester le port
	port = "";
	if (urlHost.attr('port') != '') {
		port = ":" + urlHost.attr('port')
	}


	if (src != null && !($.trim(src) == '') && !src.match("^http") && !src.match("^javascript")) { // ($.url(src).attr('host').indexOf(".") > 0) ) { // if ( href != null && ! href.match("^http") && ! $.url(href).attr('host').indexOf("Yes") >= 0)  ) {
		if (src.match("^//")) {
			//			console.log("STARTS with ^// > "+src);
			src = urlHost.attr('protocol') + ":" + src;
		} else if (src.match("^/")) {
			//			console.log("STARTS with ^/ > "+src);
			src = urlHost.attr('protocol') + "://" + urlHost.attr('host') + port + src;
		} else {
			//			console.log("STARTS with ELSE > "+src);
			src = urlHost.attr('protocol') + "://" + urlHost.attr('host') + port + urlHost.attr('directory') + src;
		}
	} else {
		//		console.log("NO MATCH le fameux if !");
	}


	return src;
}

function isAnExtra(input) {

	newInput = ""

	try {
		newInput = input.toLowerCase();
	} catch (e) {
		newInput = input + "";
	}

	var ss = notExtraLink.split(",");
	for (var i in ss) {
		if (newInput == ss[i]) {
			return false;
		}
	}
	return true;

}

function getAuthorContent() {
	content = getLinkByRel('author');
	if (getLengthOf(content) != '0') {
		content = ctt = "<span class='src-css'><a href='" + content + "'  class='' title='" + content + "' target='_blank'>" + content + "</a></span>";
	} else {
		content = getMetaContentByName('author');
		if (getLengthOf(content) == '0') {
			content = getMsgForNoData("Author is missing.");
		}
	}

	return content;
}

function getPublisherContent() {
	content = getLinkByRel('publisher');
	if (getLengthOf(content) != '0') {
		content = ctt = "<span class='src-css'><a href='" + content + "'  class='' title='" + content + "' target='_blank'>" + content + "</a></span>";
	} else {
		content = getMetaContentByName('publisher');
		if (getLengthOf(content) == '0') {
			content = getMsgForNoData("Publisher is missing.");
		}
	}

	return content;
}

function getAuthorContent() {
	content = getLinkByRel('author');
	if (getLengthOf(content) != '0') {
		content = ctt = "<span class='src-css'><a href='" + content + "'  class='' title='" + content + "' target='_blank'>" + content + "</a></span>";
	} else {
		content = getMetaContentByName('author');
		if (getLengthOf(content) == '0') {
			content = getMsgForNoData("Author is missing.");
		}
	}

	return content;
}

function testAndLowerTrim(toTrim) {

	if (toTrim != '' && toTrim != undefined && toTrim != 'undefined') {
		toTrim = toTrim.toLowerCase().trim();
	}

	return toTrim;

}

function getHtmlLang() {
	ct = $('html').attr("lang");
	console.debug("ct = " + ct);
	if (ct == '' || ct == undefined || ct == 'undefined') {
		ct = "<span class='no-data'>Lang attribut of HTML element is missing.</span>";
	}
	return ct;
}



// --------
function initImagesTab() {


	separator = "<br/>";


	numberOfImage = 0;
	numberOfAlt = 0;
	numberOfTitle = 0;





	toCompleteOutput = "";
	goodOutput = "";


	$('img').tsort({
		attr: 'src'
	}).each(function () {

		numberOfImage++;

		insert = true;

		//		if (last != null){
		//			if ($(last).attr("href") == $(this).attr("href")){
		//				insert = false;						
		//			}
		//		}

		if (insert) {

			completed = true;

			trOutput = "<tr>";

			imageName = $.url($(this).attr("src")).segment(-1);
			if ($.trim(imageName) == '') {
				imageName = $.url($(this).attr("src")).segment(1);
			}

			src = $(this).attr("src");
			src = $.trim(src);


			//			console.log("src: "+src);
			var urlHost = $.url(pageInfo.url);

			// Tester le port
			port = "";
			if (urlHost.attr('port') != '') {
				port = ":" + urlHost.attr('port')
			}

			if (src != null && !($.trim(src) == '') && !src.match("^http") && !src.match("^javascript")) { // ($.url(src).attr('host').indexOf(".") > 0) ) { // if ( href != null && ! href.match("^http") && ! $.url(href).attr('host').indexOf("Yes") >= 0)  ) {
				if (src.match("^//")) {
					//					console.log("STARTS with ^// > "+src);
					src = urlHost.attr('protocol') + ":" + src;
				} else if (src.match("^/")) {
					//					console.log("STARTS with ^/ > "+src);
					src = urlHost.attr('protocol') + "://" + urlHost.attr('host') + port + src;
				} else {
					//					console.log("STARTS with ELSE > "+src);
					src = urlHost.attr('protocol') + "://" + urlHost.attr('host') + port + urlHost.attr('directory') + src;
				}
			} else {
				//				console.log("NO MATCH le fameux if !");
			}

			if (imageName == '') {
				if (!(src == null || $.trim(src) == '')) {
					imageName = src;
				}
			}

			if (src == null || $.trim(src) == '') {
				trOutput += "<td colspan='3'><span class='src-css'>Unavailable - Image source is empty.</span><br>";
			} else {
				trOutput += "<td colspan='3'><span class='src-css'><a href='" + src + "'  class='preview2' target='_blank'>" + imageName + "</a></span><br>";
				//			 	trOutput += "<td colspan='3'><span class='src-css'>"+$(this).attr("src")+"</span><br>";
			}

			var temp = $.trim($(this).attr("alt"));
			if (temp == '' || temp == 'undefined') {
				temp = "<span class='wval'>/</span>";
				completed = false;
			} else {
				numberOfAlt++;
			}

			trOutput += "<span class='tval'>ALT: </span>" + temp + "<br>";

			temp = $.trim($(this).attr("title"));
			if (temp == '' || temp == 'undefined') {
				temp = "<span class='wval'>/</span>";
				completed = false;
			} else {
				numberOfTitle++;
			}
			trOutput += "<span class='tval'>Title: </span>" + temp + "<br>";

			trOutput += "</tr>";


			if (completed) {
				goodOutput += trOutput;
			} else {
				toCompleteOutput += trOutput;
			}
		}
	});





	tempOutput = "<div class='row clearfix'>"
	tempOutput += "<div class='col-xs-4 bulle-info'><span class='sub-info'>IMAGES " + getHelpSymbol("h-images-tab") + "</span><br/><span class='main-info'>" + numberOfImage + "</span></div>";

	className = "";
	if (numberOfImage - numberOfAlt != 0) {
		className = "error_length"
	}
	tempOutput += "<div class='col-xs-4 bulle-info'><span class='sub-info'>without ALT</span><br/><span class='main-info-sub " + className + "'>" + (numberOfImage - numberOfAlt) + "</span></div>";

	className = "";
	if (numberOfImage - numberOfTitle != 0) {
		className = "error_length"
	}
	tempOutput += "<div class='col-xs-4 bulle-info'><span class='sub-info'>without TITLE</span><br/><span class='main-info-sub " + className + "'>" + (numberOfImage - numberOfTitle) + "</span></div>";
	tempOutput += "</div><hr/>";


	// ---------------------------------
	// PageSpeed	
	tempOutput += "<span class='intro-tab'>Analyze and optimize your images with</span><br/>";


	link = "http://developers.google.com/speed/pagespeed/insights/?url=" + encodeURIComponent(window.location.href);
	linkName = "PageSpeed";
	linkDesc = "Analyse the current page with PageSpeed.";
	linkImage = "img/tools/pagespeed-google-3.jpg";

	tempOutput += getToolRow(link, linkName, linkDesc, linkImage);

	//	link =  "http://gtmetrix.com/?url="+ window.location.href;
	//	linkName = "GTmetrix";
	//	linkDesc = "Analyse the current page with GTmetrix.";
	//	linkImage = "img/tools/gtmetrix-50.png"; 
	//	
	//	tempOutput += getToolRowHalfRow(link, linkName, linkDesc, linkImage);




	// --------
	if (toCompleteOutput != "") {
		//		tempOutput += "<span class='intro-tab'>Images to complete with an ALT or a TITLE</span><br/>";
		tempOutput += "<span class='intro-tab'>Images to complete</span><br/>";

		tempOutput += "<table class='table table-list' id='table-images-all'><tbody>" + toCompleteOutput + "</tbody></table>";
	}

	if (goodOutput != "") {
		tempOutput += "<span class='intro-tab'>Completed</span><br/>";

		tempOutput += "<table class='table table-list' id='table-images-all'><tbody>" + goodOutput + "</tbody></table>";
	}




	pageInfo.imagesTabHtml = tempOutput;
}

function getToolRowTab(link, linkName, linkDesc, linkImage) {
	return "<div class='col-xs-12 column row-small-tools'>" + getLinkImageIco(link, linkName, linkDesc, linkImage, linkDesc) +
		getLinkForTools(link, linkName, linkDesc) +
		"</div>";
}

function getLinkForTools(link, label, titleLink) {
	return "<a class='ftltp l-ext' href='" + link + "' title='" + titleLink + "' target='_blank' alt='" + label + "'>" + label + "</a>";
}

function getToolRowTabOld(link, linkName, linkDesc, linkImage) {
	return "<div class='col-xs-4 column row-small-tools'>" + getLinkImageIco(link, linkName, linkDesc, linkImage, linkDesc) +
		getLink(link, linkName, linkDesc) +
		"</div>";
}

function getToolRow(link, linkName, linkDesc, linkImage) {
	return "<div class='row-tool'>" + getLinkImage(link, linkName, linkDesc, linkImage, linkDesc) + "</div>";
}

function getToolRowHalfRow(link, linkName, linkDesc, linkImage) {
	return "<div class='row-tool col-xs-5'>" + getLinkImage(link, linkName, linkDesc, linkImage, linkDesc) + "</div>";
}

function getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage) {

	output = "<div class='row-text-tools'>" + getLinkImageBigIco(link, linkName, linkDesc, linkImage, linkDesc) + "<a class='ftltp l-ext' href='" + link + "' title='" + linkName + "' target='_blank' alt='" + linkName + "' ><span class=''>" + mainText + "</span></a></div>";

	// output += "<div class='row-tool' style='text-align: right;'>"+getLinkImage( link  , linkName, linkDesc,linkImage,linkDesc)+"</div>";

	return output;
}

function getLink(link, label, titleLink) {

	return "<a class='l-ext' href='" + link + "' title='" + label + "' target='_blank'>" + label + "</a>";

}

function getLinkImage(link, label, titleLink, imgSrc, linkDesc) {

	return "<a class='ftltp l-ext' href='" + link + "' title='" + label + "' target='_blank'><img src='" + imgSrc + "' /></a>";

}

function getLinkImageIco(link, label, titleLink, imgSrc, linkDesc) {

	return "<a class='ftltp l-ext' href='" + link + "' title='" + linkDesc + "' target='_blank' alt='" + label + "' alt='" + label + "'><img src='" + imgSrc + "' class='ico-tool' /></a>";

}

function getLinkImageBigIco(link, label, titleLink, imgSrc, linkDesc) {

	return "<a class='ftltp l-ext' href='" + link + "' title='" + label + "' target='_blank' alt='" + label + "' ><img src='" + imgSrc + "' class='b-ico-tool' /></a>";

}
// ---------------
function initLinksTab() {

	output = "";


	numberOfLinks = 0;
	numberOfLinksUnique = 0;
	numberOfTitle = 0;
	numberOfInternal = 0;
	numberOfInternalUnique = 0;
	numberOfExternal = 0;
	numberOfExternalUnique = 0;
	numberOfOccurence = 0;
	var last = null;

	allHref = $('a').clone();
	allHref.sort(sortLinksByHref);

	output += "<table class='table table-list' id='table-images-all'><tbody>";

	$(allHref).each(function () {

		numberOfLinks++;

		insert = true;

		if (last != null) {

			lastHref = $(last).attr("href");
			thisHref = $(this).attr("href")

			lastHref = $.trim(lastHref);
			thisHref = $.trim(thisHref);

			if (lastHref == "undefined") {
				lastHref = '';
			}
			if (thisHref == "undefined") {
				thisHref = '';
			}

			if (lastHref == thisHref) {
				numberOfOccurence++;
				insert = false;

			}
		}





		if (insert) {


			if (numberOfOccurence > 0) {
				output += "<tr><td colspan='5' class='fhref link-occurences'><span class='src-css' style='color:grey;'>We found " + (numberOfOccurence + 1) + " more occurence(s) of this link.</td></tr>";
				numberOfOccurence = 0;
			}

			output += "<tr>";

			ressourceName = '';
			try {
				ressourceName = $.url($(this).attr("href")).segment(-1);
			} catch (e) { // console.log('this = '+this );
			}
			if ($.trim(ressourceName) == '') {
				try {
					ressourceName = $.url($(this).attr("href")).segment(1);
				} catch (e) {
					ressourceName = "" + this;
				}
			}

			href = "";
			try {
				href = $(this).attr("href");
			} catch (e) {
				href = "" + this;
			}
			var urlHost = $.url(pageInfo.url);

			// Tester le port
			port = "";
			if (urlHost.attr('port') != '') {
				port = ":" + urlHost.attr('port')
			}

			if (href != null && !($.trim(href) == '') && !href.match("^http") && !href.match("^javascript") && !href.match("^mailto") && !href.match("^#")) {
				if (href.match("^//")) {
					href = urlHost.attr('protocol') + ":" + href;
				} else if (href.match("^/")) {
					href = urlHost.attr('protocol') + "://" + urlHost.attr('host') + port + href;
				} else {
					href = urlHost.attr('protocol') + "://" + urlHost.attr('host') + port + urlHost.attr('directory') + href;
				}
			}

			if (href != null && !($.trim(href) == '')) {

				numberOfLinksUnique++;

				if (href.match("^#")) {
					output += "<td colspan='5' class='fhref'><span class='src-css main-l-i'>" + $(this).attr("href") + " (anchor)</span><br>";
				} else if (href.match("^javascript")) {
					output += "<td colspan='5' class='fhref'><span class='src-css main-l-i'>" + $(this).attr("href") + " (script)</span><br>";
				} else if (href.match("^mail")) {
					output += "<td colspan='5' class='fhref'><span class='src-css main-l-i'>" + $(this).attr("href") + " (email)</span><br>";
				} else {
					output += "<td colspan='5' class='fhref'><span class='src-css main-l-i'><a href='" + href + "'  target='_blank'>" + $(this).attr("href") + "</a></span><br>";
					if (href.toLowerCase().indexOf(urlHost.attr('host')) >= 0) {
						numberOfInternalUnique++;
					}
				}
			} else {
				output += "<td colspan='5' class='fhref'><span class='src-css main-l-i'>Undefined (href link is empty)</span><br>";
			}


			var temp = $.trim($(this).attr("title"));
			if (temp == '' || temp == 'undefined') {
				temp = "<span class='wval'>/</span>";
			} else {
				numberOfTitle++;
			}

			output += "<span class='tval'>Title: </span>" + temp + "<br>";

			output += "</tr>";

		}


		last = this;
	});


	if (numberOfOccurence > 0) {
		output += "<tr><td colspan='5' class='fhref link-occurences'><span class='src-css' style='color:grey;'>We found " + (numberOfOccurence + 1) + " more occurence(s) of this link.</td></tr>";
		numberOfOccurence = 0;
	}

	output += "</tbody></table>";


	tempOutput = "<div class='row clearfix'>"
	tempOutput += "<div class='col-xs-3 bulle-info' title='All links (also javascript, anchor, mailto, ...)'><span class='sub-info'>LINKS " + getHelpSymbol("h-links-tab") + "</span><br/><span class='main-info'>" + numberOfLinks + "</span></div>";
	tempOutput += "<div class='col-xs-3 bulle-info'><span class='sub-info'>unique</span><br/><span class='main-info-sub'>" + numberOfLinksUnique + "</span></div>";
	tempOutput += "<div class='col-xs-3 bulle-info'><span class='sub-info'>internal unique</span><br/><span class='main-info-sub'>" + numberOfInternalUnique + "</span></div>";

	className = "";
	if (numberOfTitle < numberOfLinks) {
		className = "error_length"
	}
	tempOutput += "<div class='col-xs-3 bulle-info'><span class='sub-info'>without TITLE</span><br/><span class='main-info-sub " + className + "'>" + (numberOfLinksUnique - numberOfTitle) + "</span></div>";
	tempOutput += "</div><hr/>";

	tempOutput += "<span class='intro-tab'>LINKS &lt;A /&gt;</span><br/>";


	pageInfo.linksTabHtml = tempOutput + output;


}

function sortLinksByHref(a, b) {

	var aName = $(a).attr("href");
	aName = $.trim(aName);
	if (aName == "undefined") {
		aName = '';
	}

	var bName = $(b).attr("href");
	bName = $.trim(bName);
	if (bName == "undefined") {
		bName = '';
	}

	//	  console.log("sort: "+aName+" | "+bName);

	return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}


function initSocialTab() {
	output = "";

	// ======================================
	// OPEN GRAPH
	output += getSocialInfoTable("OPEN GRAPH (Facebook)", "h-graph", "og,fb,article,music,video,book,profile,website,product");

	// --------------------------------------
	// TWITTER
	output += getSocialInfoTable("TWITTER", "h-twitter", "twitter");

	// --------------------------------------
	// Image source
	output += getImageSource("Image Source", "h-imagesrc");

	// --------------------------------------
	// Schema.org
	output += getSocialInfoSchemaOrg("Schema.org (itemtype only)", "h-schema");

	mainText = "Click here to check <strong>Schema.org structure</strong> of this page (Google validator)";
	// link =  "http://www.google.com/webmasters/tools/richsnippets?q="+ window.location.href;
	// link = "https://search.google.com/structured-data/testing-tool/u/0/#url=" + encodeURIComponent(window.location.href)
	link = "https://search.google.com/test/rich-results?url=" + encodeURIComponent(window.location.href) + "&user_agent=1"; 


	linkName = "Google rich snippets validator";
	linkDesc = "Structured Data Testing Tool.";
	linkImage = "img/tools/no-logo.png";


	output += getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage);

	//	output += "<a class='ftltp l-ext' href='"+link+"' title='"+linkName+"' target='_blank' alt='"+linkName+"' ><span class=''>"+mainText+"</span></a></div>";

	// output += "<div class='row-tool' style='text-align: right;'>"+getLinkImage( link  , linkName, linkDesc,linkImage,linkDesc)+"</div>";


	pageInfo.socialTabHtml = output;
}


function getSocialInfoTable(titleTable, theId, socialMeta) {

	//	console.log("getOpenGraphData");

	socialContent = "";

	if (titleTable != null && $.trim(titleTable) != '') {
		socialContent = "<span class='intro-tab'>" + titleTable + " " + getHelpSymbolBottom(theId) + "</span><br/>";
	}

	socialContent += "<table class='table'><tbody>";

	numberOfMeta = 0;

	socialMetaArray = socialMeta.split(',');

	for (var i = 0; i < socialMetaArray.length; i++) {

		socialMeta = socialMetaArray[i];


		$("meta").each(function () {

			prty = '' + $(this).attr("property");
			ctt = $(this).attr("content");

			if (prty == null || prty.length == 0 || prty == "undefined") {
				prty = '' + $(this).attr("name");
			}

			if (prty.match("^" + socialMeta)) {

				numberOfMeta++;

				if ($.trim(ctt) != '') { // is content empty ?  
					//					console.log("NOT EMPTY : "+$.trim(ctt));

					if (isImage(prty)) {
						socialContent += "<tr><td>";

						socialContent += "<span class='ogprty'>" + getNameOfProperty(prty) + "</span>";

						ctt = getHref(ctt);

						imagesBlocs = "<br/><a href='" + ctt + "'  class='preview3 space-left' target='_blank'><img src='" + ctt + "' style='max-height: 75px' /></a>";

						imageName = $.url(ctt).segment(-1);
						if ($.trim(imageName) == '') {
							imageName = $.url(ctt).segment(1);
						}

						if (imageName == '') {
							if (!(ctt == null || $.trim(ctt) == '')) {
								imageName = ctt;
							}
						}

						imagesLinks = "<a href='" + ctt + "'  class='preview3 space-left' target='_blank'>" + imageName + "</a><br/>";

						socialContent += imagesBlocs;
						socialContent += "<br/>" + imagesLinks;

						socialContent += "</td></tr>";
					} else {
						socialContent += "<tr><td><span class='ogprty'>" + getNameOfProperty(prty) + "</span><br/><span class='space-left'>" + ctt + "</span></td></tr>";
					}

				} else { // content attribut is empty

					//					console.log("EMPTY");

					socialContent += "<tr><td><span class='ogprty'>" + getNameOfProperty(prty) + "</span><br/><span class='space-left'>(empty)</span></td></tr>";

				}


			}

		});

	}


	if (numberOfMeta == 0) {
		socialContent += "<tr><td>No DATA has been found for " + titleTable + "</td></tr>";
	}


	socialContent += "</tbody></table>";

	return socialContent;

}

function isImage(iName) {

	if (iName.toLowerCase().indexOf("image") >= 0) {
		twoPointsArray = iName.split(':');
		if (twoPointsArray.length == 2) {
			return true;
		} else {
			if (iName.toLowerCase().indexOf("src") >= 0) {
				return true;
			}
		}
	}
	return false;
}

function getNameOfProperty(prty) {

	return prty;

	if (prty == null || $.trim(prty) == '') {
		return '';
	}

	twoPointsArray = prty.split(':');
	return twoPointsArray[1];
}

function getImageSource(titleTable, theId) {

	socialContent = "<span class='intro-tab'>" + titleTable + " " + getHelpSymbol(theId) + "</span><br/>";

	numberOf = 0;

	socialContent += "<table class='table'><tbody>";

	$("link").each(function () {

		//		console.log("IN LINK");

		prty = '' + $(this).attr("rel");
		ctt = $(this).attr("href");

		if (prty.match("^image_src")) {

			numberOf++;

			if ($.trim(ctt) != '') { // is content empty ? 
				//				console.log("NOT EMPTY : "+$.trim(ctt));


				socialContent += "<tr><td>";

				socialContent += "<span class='ogprty'>" + getNameOfProperty(prty) + "</span>";

				imagesBlocs = "<br/><a href='" + ctt + "'  class='preview3 space-left' target='_blank'><img src='" + ctt + "' style='max-height: 75px' /></a>";

				imageName = $.url(ctt).segment(-1);
				if ($.trim(imageName) == '') {
					imageName = $.url(ctt).segment(1);
				}

				if (imageName == '') {
					if (!(ctt == null || $.trim(ctt) == '')) {
						imageName = ctt;
					}
				}

				imagesLinks = "<a href='" + ctt + "'  class='preview3 space-left' target='_blank'>" + imageName + "</a><br/>";

				socialContent += imagesBlocs;
				socialContent += "<br/>" + imagesLinks;

				socialContent += "</td></tr>";


			} else { // content attribut is empty

				//				console.log("EMPTY");

				socialContent += "<tr><td><span class='ogprty'>" + getNameOfProperty(prty) + "</span><br/><span class='space-left'>(empty)</span></td></tr>";

			}


		}

	});

	if (numberOf == 0) {
		socialContent += "<tr><td>No IMAGE_SRC has been found</td></tr>";
	}


	socialContent += "</tbody></table>";

	return socialContent;
}

function getSocialInfoSchemaOrg(titleTable, theId) {

	socialContent = "<span class='intro-tab'>" + titleTable + " " + getHelpSymbol(theId) + "</span><br/>";

	numberOf = 0;

	socialContent += "<table class='table'><tbody>";
	$("[itemtype]").each(function () {
		numberOf++;
		socialContent += "<tr><td><span class='ogprty'>Item Type</span><br/><span class='space-left'>" + $(this).attr('itemtype') + "</span></td></tr>";
	});

	if (numberOf == 0) {
		socialContent += "<tr><td>No DATA has been found for " + titleTable + "</td></tr>";
	}

	socialContent += "</tbody></table>";

	return socialContent;
}


function initToolsTabHtml() {

	output = "<div class='content-util text-left'>Use <strong>CTRL + CLICK</strong> to open links <strong>in background</strong>.<br/><br/></div>";

	url = $.url(window.location.href);

	// =======================

	mainText = "Is your page is <strong>Mobile Friendly ?</strong>";

	link = "https://search.google.com/test/mobile-friendly?referer=seo-extension.com&url=" + encodeURIComponent(window.location.href);
	linkName = "Mobile-Friendly Test";
	linkDesc = "Check if your page is Mobile Friendly. It is a Google Tool.";
	linkImage = "https://www.google.com/s2/favicons?domain=https://search.google.com/test/mobile-friendly";

	output += getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage);

	// =======================	

	mainText = "Analyze <strong>Performance</strong> with <strong>GTmetrix</strong>";
	link = "http://gtmetrix.com/?url=" + window.location.href;
	linkName = "GTmetrix";
	linkDesc = "Analyse the current page with GTmetrix.";
	linkImage = "https://www.google.com/s2/favicons?domain=http://gtmetrix.com/";

	output += getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage);

	// =======================

	mainText = "Analyze <strong>Performance</strong> with <strong>PageSpeed</strong> (Google tool)";
	link = "http://developers.google.com/speed/pagespeed/insights/?url=" + encodeURIComponent(window.location.href);
	linkName = "PageSpeed";
	linkDesc = "Analyse the current page with PageSpeed.";
	linkImage = "https://www.google.com/s2/favicons?domain=http://developers.google.com";

	output += getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage);

	// =======================


	mainText = "Validate <strong>HTML, XHTML,...</strong>";
	link = "http://validator.w3.org/check?uri=" + window.location.href;
	linkName = "W3.org";
	linkDesc = "Markup Validation Service. Check the markup (HTML, XHTML,...) of a web page.";
	linkImage = "img/tools/w3c-ico.png";

	output += getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage);

	// =======================

	mainText = "Validate <strong>CSS</strong>";
	link = "http://jigsaw.w3.org/css-validator/validator?uri=" + window.location.href;
	linkName = "W3.org - Validate CSS";
	linkDesc = "This is the W3C CSS Validation Service.";
	linkImage = "https://www.google.com/s2/favicons?domain=http://jigsaw.w3.org";
	output += getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage);


	//	=======================


	mainText = "Check <strong>Open Graph</strong> properties with <strong>Facebook</strong> Sharing Debugger";	
	link = "https://developers.facebook.com/tools/debug/?q=" + encodeURIComponent(window.location.href);
	linkName = "Facebook debugger";
	linkDesc = "Open Graph Object Debugger";
	linkImage = "https://www.google.com/s2/favicons?domain=https://www.facebook.com/";

	output += getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage);

	// =======================


	/*

	mainText = "Analyze <strong>SEO & Performance</strong> with <strong>MetricSpot</strong>";
	link = "http://www.metricspot.com/" + url.attr('host') + url.attr('relative');
	linkName = "MetricSpot";
	linkDesc = "Measure your Web s and your competition s optimization grade analyzing more than 50 SEO parameters that affect your ranking in Google and other search engines.";
	linkImage = "img/tools/metricspot.png";

	output += getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage);

	*/

	// =======================

	mainText = "Analyze <strong>Keyword density</strong> with WMtips";
	link = "http://www.wmtips.com/tools/keyword-density-analyzer/?&url=" + window.location.href;
	linkName = "WMtips.com - Keyword Analyzer";
	linkDesc = "Keyword Density Analyzer.";
	linkImage = "img/tools/seo-wmtips.png"; // "img/tools/wmtips.jpg"; 

	output += getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage);

	// =======================

	mainText = "Check <strong>Microdata, Microformats</strong> and <strong>RDFa</strong>";
	// "http://www.google.com/webmasters/tools/richsnippets?q="+ window.location.href;
	// link = "https://developers.google.com/structured-data/testing-tool/";
	link = "https://search.google.com/test/rich-results?url=" + encodeURIComponent(window.location.href) + "&user_agent=1"; 
	linkName = "Google rich snippets validator";
	linkDesc = "Structured Data Testing Tool.";
	linkImage = "https://www.google.com/s2/favicons?domain=https://www.google.be/";

	output += getToolRowWithArrow(mainText, link, linkName, linkDesc, linkImage);

	//	=======================



	// TABLEAU ----------  OTHERS

	output += "<hr/><div class='row clearfix'>  ";

	// 1 ère colonne
	output += "   <div class='col-xs-4 column row-small-tools'>";

	output += "   <div class='col-xs-12 column row-small-tools'>SEO</div>";

	link = "http://gtmetrix.com/?url=" + window.location.href;
	linkName = "GTmetrix";
	linkDesc = "Analyse the current page with GTmetrix.";
	linkImage = "https://www.google.com/s2/favicons?domain=http://gtmetrix.com/";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	link = "http://www.alexa.com/siteinfo/" + url.attr('host');
	linkName = "Alexa";
	linkDesc = "Analyse your site with Alexa.com";
	linkImage = "img/tools/seo-alexa.png";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);


	/*

	// As of December 31, 2016, Compete.com and the Compete PRO platform have been shut down. http://www.compete.com

	link = "http://siteanalytics.compete.com/" + url.attr('host').replace('www.', '');
	linkName = "Compete (analytics)";
	linkDesc = "Data overview, find more sites like yours, where does this traffic come from?, Compare this site to other sites.";
	linkImage = "img/tools/seo-compete.png";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	*/

	link = "http://www.majesticseo.com/reports/site-explorer/summary/" + url.attr('host');
	linkName = "Majestic.com";
	linkDesc = "Majestic lets you explore a domain/url in great detail.";
	linkImage = "img/tools/seo-majestic.png";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	link = "http://www.wmtips.com/tools/info/?url=" + window.location.href
	linkName = "WMtips.com - Info (whois, ...)";
	linkDesc = "Results will include whois information, Google page rank, Alexa rank, Compete.com rank, Quantcast rank, Technorati rank,...";
	linkImage = "img/tools/seo-wmtips.png";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	// link = "http://www.metricspot.com/" + url.attr('host') + url.attr('relative');
	link = "http://www.metricspot.com/";
	linkName = "MetricSpot";
	linkDesc = "Measure your Web s and your competition s optimization grade analyzing more than 50 SEO parameters that affect your ranking in Google and other search engines.";
	linkImage = "img/tools/metricspot.png";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	output += "   </div>"; // fin 1ere colonne


	// 2 ère colonne
	output += "   <div class='col-xs-4 column row-small-tools'>";

	output += "   <div class='col-xs-12 column row-small-tools'>Social Networks</div>";

	link = "https://developers.facebook.com/tools/debug/?q=" + encodeURIComponent(window.location.href);
	linkName = "Facebook debugger";
	linkDesc = "Open Graph Object Debugger";
	linkImage = "https://www.google.com/s2/favicons?domain=https://www.facebook.com/";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	link = "https://cards-dev.twitter.com/validator"
	linkName = "Twitter Card Validator";
	linkDesc = "Twitter Card Validator.";
	linkImage = "img/tools/twitter.jpg";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	link = "http://developers.pinterest.com/rich_pins/validator/?link=" + encodeURIComponent(window.location.href);
	linkName = "Pinterest Validator";
	linkDesc = "Pinterest Rich Pin Validator.";
	linkImage = "img/tools/pinterest.jpg";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);


	link = "https://search.google.com/test/rich-results?url=" + encodeURIComponent(window.location.href) + "&user_agent=1"; 
	linkName = "Google rich snippets validator";
	linkDesc = "Structured Data Testing Tool.";
	linkImage = "https://www.google.com/s2/favicons?domain=https://search.google.com/structured-data/testing-tool";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);


	/* 
	// Not longer available :  https://plus.google.com/+googleplus/posts/dbVpERPaqYA

	link = "https://plus.google.com/ripple/details?url=" + url.attr('host') + url.attr('relative');
	linkName = "Google+ Ripples";
	linkDesc = "Display how many times your post has been shared on Google+.";
	linkImage = "https://www.google.com/s2/favicons?domain=https://plus.google.com/";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	*/



	output += "   </div>"; // fin 2eme colonne


	// 3eme colonne
	output += "   <div class='col-xs-4 column row-small-tools'>";

	output += "   <div class='col-xs-12 column row-small-tools'>Security/Malware</div>";


	link = "http://www.siteadvisor.com/sites/" + url.attr('host');
	linkName = "McAfee SiteAdvisor";
	linkDesc = "Check out McAfee SiteAdvisor safety test results for the sites you want to visit.";
	linkImage = "https://www.google.com/s2/favicons?domain=http://www.siteadvisor.com";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	link = "http://www.google.com/safebrowsing/diagnostic?site=" + url.attr('host');
	linkName = "Safe Browsing (Google)";
	linkDesc = "What is the current listing status? Has this site hosted malware?";
	linkImage = "https://www.google.com/s2/favicons?domain=http://www.google.com/";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);



	output += "   </div>"; // fin 3eme colonne



	output += "</div>  ";
	// ------------


	// 2eme ligne
	output += "<hr class='hr-in-tools'/><div class='row clearfix content-line'>  ";

	// 1 ère colonne
	output += "   <div class='col-xs-4 column row-small-tools'>";

	output += "   <div class='row-small-tools'>Other (whois,...)</div>";

	// =======================
	link = "http://dnsquery.org/whois/" + url.attr('host').replace('www.', '');
	linkName = "dnsquery.org - WHOIS";
	linkDesc = "dnsquery.org";
	linkImage = "https://www.google.com/s2/favicons?domain=http://dnsquery.org";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);


	link = "https://redbot.org/?uri=" + encodeURIComponent(window.location.href);
	// link = "https://redbot.org/?uri=" + window.location.href; encodeURIComponent(window.location.href)
	linkName = "REDbot.org validator";
	linkDesc = "RED is a robot that checks HTTP resources; invalid syntax in headers, Ill-formed messages (e.g., bad chunking, incorrect content-length), Incorrect gzip encoding, Missing headers,...";
	linkImage = "img/tools/redbot.jpg";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);


	// link = "http://www.reactionengine.com/analyse?keyphrase=&uri=" + url.attr('host') + url.attr('relative');
	link = "http://www.reactionengine.com/analyse?keyphrase=&uri=" + encodeURIComponent(window.location.href);
	linkName = "ReactionEngine.com";
	linkDesc = "This is an instant, free and no-registration tool to analyse the SEO performance of a URI for a given KEYPHRASE.";
	linkImage = "https://www.google.com/s2/favicons?domain=http://www.reactionengine.com";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);


	output += "   </div>"; // fin 1ere colonne




	// 2 ème colonne
	output += "   <div class='col-xs-8 column row-small-tools'>";

	output += "   <div class='row-small-tools'>&nbsp;</div>";


	link = "https://www.google.com/search?q=related:" + encodeURIComponent(window.location.href) +
		"&gws_rd=cr,ssl";
	linkName = "Similar pages (Google)";
	linkDesc = "Find sites that are similar to this site.";
	linkImage = "https://www.google.com/s2/favicons?domain=https://www.google.com";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);


	link = "https://www.google.com/search?q=link:" + encodeURIComponent(window.location.href) + "&gws_rd=cr,ssl";
	linkName = "Links to this page (Google)";
	linkDesc = "Find pages that links to this page.";
	linkImage = "https://www.google.com/s2/favicons?domain=https://www.google.com";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);


	link = "https://www.google.com/search?tbm=isch&q=site:" + url.attr('host');
	linkName = "Google Images";
	linkDesc = "Google Images for you site.";
	linkImage = "https://www.google.com/s2/favicons?domain=https://www.google.com";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);


	link = "http://ismyblogworking.com/" + url.attr('host') + url.attr('relative');
	linkName = "IsMyBlogWorking.com";
	linkDesc = "Check your server status, RSS feed, markup, security, and performance.";
	linkImage = "img/tools/no-logo.png";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	link = "http://www.serpanalytics.com/sites/" + url.attr('host');
	linkName = "SERPAnalytics.com";
	linkDesc = "SERPAnalytics is an online Position Tracking Service designed for SEO & SEM specialists.";
	linkImage = "https://www.google.com/s2/favicons?domain=http://www.serpanalytics.com";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	/*

	No longer available

	link = "http://www.semrush.com/info/" + url.attr('host');
	linkName = "semrush.com";
	linkDesc = "SEMRUSH competitive data for digital marketing professionals";
	linkImage = "https://www.google.com/s2/favicons?domain=http://www.semrush.com";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);

	*/

	link = "https://www.quantcast.com/" + url.attr('host');
	linkName = "quantcast.com";
	linkDesc = "Search sites for demographic and traffic stats.";
	linkImage = "https://www.google.com/s2/favicons?domain=https://www.quantcast.com";
	output += getToolRowTab(link, linkName, linkDesc, linkImage);



	output += "   </div>"; // fin 2 ème colonne




	// --------------

	output += "   </div>"; // fin bloc others


	output += "</div>  ";



	pageInfo.toolsTabHtml = output;

}

function myStringSlice(str) {
	if (str == null || str == undefined) {
		str = '';
	}
	numberMaxOfWCharacters = 130;
	if (str.length > numberMaxOfWCharacters) str = str.substring(0, numberMaxOfWCharacters) + "...";
	return str;

}

// =====================================================================
// DISPLAY FUNCTIONS (in HTML)

function getTitleAndContentLinesAsHtml(
	titleName,
	titleNameTooltip,
	idOfHelpButton,
	rightMessage,
	rightMessageTooltip,
	contentAsHtml
) {


	outputHtml = "<div class='row clearfix title-line' >";
	outputHtml += "   <div class='col-xs-3 column'>";
	outputHtml += "		<span class='ftltp basic-title' title='" + titleNameTooltip + "'>" + titleName + "</span> <img class='hpr' src='img/help-icon-i.png' id='" + idOfHelpButton + "' data-hasqtip='0' oldtitle='Help?' title=''>";
	outputHtml += "	  </div>";
	outputHtml += "   <div class='col-xs-9 column'>";
	outputHtml += "     <span class='text-right numberInRigth' id='seoTitleLength'><span class='ftltp' title='" + rightMessageTooltip + "'>" + rightMessage + "</span></span>";
	outputHtml += "   </div>";
	outputHtml += "</div>";


	outputHtml += "<div class='row clearfix content-line' >";
	outputHtml += "  <div class=' col-xs-12 column content-util' >";
	outputHtml += contentAsHtml;
	outputHtml += "  </div>";
	outputHtml += "</div>";


	return outputHtml;
}


function getTitleAndContentLinesAsHtmlV2(
	titleName,
	titleNameTooltip,
	idOfHelpButton,
	rightMessage,
	rightMessageTooltip,
	contentAsHtml
) {


	outputHtml = "<div class='row clearfix content-line' >";
	outputHtml += "   <div class='col-xs-3 column'>  ";
	outputHtml += "		<span class='ftltp basic-title' title='" + titleNameTooltip + "'>" + titleName + "</span> <img class='hpr' src='img/help-icon-i.png' id='" + idOfHelpButton + "' data-hasqtip='0' oldtitle='Help?' title=''>";
	outputHtml += "		<br/><span class='text-right numberInRigth' id='seoTitleLength'><span class='ftltp' title='" + rightMessageTooltip + "'>" + rightMessage + "</span></span>";
	outputHtml += "	  </div>";
	outputHtml += "   <div class='col-xs-9 column content-util'>";
	outputHtml += contentAsHtml;
	outputHtml += "   </div>";
	outputHtml += "</div>";



	return outputHtml;
}

function getTitleAndContentOnOneLines(
	titleName,
	titleNameTooltip,
	idOfHelpButton,
	contentAsHtml
) {


	outputHtml = "<div class='row clearfix content-line' >";
	outputHtml += "   <div class='col-xs-3 column'>  ";
	outputHtml += "		<span class='ftltp basic-title' title='" + titleNameTooltip + "'>" + titleName + "</span> <img class='hpr' src='img/help-icon-i.png' id='" + idOfHelpButton + "' data-hasqtip='0' oldtitle='Help?' title=''>";

	outputHtml += "	  </div>";
	outputHtml += "   <div class='col-xs-9 column content-util'>";
	outputHtml += contentAsHtml;
	outputHtml += "   </div>";
	outputHtml += "</div>";



	return outputHtml;
}


function getRightLeftContentLine(rightContent, leftContent) {

	outputHtml = "<div class='row clearfix'>";
	outputHtml += "				<div class='col-xs-6 column'>";
	outputHtml += "					<p  class='text-left' id='scriptSpace'>";
	outputHtml += leftContent;
	outputHtml += "					</p>";
	outputHtml += "				</div>";
	outputHtml += "				<div class='col-xs-6 column content-util'>";
	outputHtml += "					<p  class='text-right' id='seoLinksBasic'>";
	outputHtml += rightContent;
	outputHtml += "					</p>";
	outputHtml += "				</div>";
	outputHtml += "	</div>";

	return outputHtml;
}

function getHelpSymbol(theId) {

	image = "<img class='hpr' src='img/help-icon-i.png' title='Help?' id='" + theId + "' />";

	return image;

}

function getHelpSymbolBottom(theId) {

	image = "<img class='hpbr' src='img/help-icon-i.png' title='Help?' id='" + theId + "' />";

	return image;

}

function getLink(link, label, titleLink) {

	return "<a class='ftltp l-ext' href='" + link + "' title='" + titleLink + "' target='_blank'>" + label + "</a>";

}


function getMoreDetailForRobotsTag(content) {

	content = content.toUpperCase();
	content = content.replace(/(NOINDEX)/g, '<span class="ftltp help-cursor" title="NOINDEX - prevents the page from being included in the index." >$1</span>');
	content = content.replace(/(NOFOLLOW)/g, '<span class="ftltp help-cursor" title="NOFOLLOW - prevents Googlebot from following any links on the page." >$1</span>');
	content = content.replace(/(NOARCHIVE)/g, '<span class="ftltp help-cursor" title="NOARCHIVE - prevents a cached copy of this page from being available in the search results." >$1</span>');
	content = content.replace(/(NOSNIPPET)/g, '<span class="ftltp help-cursor" title="NOSNIPPET - prevents a description from appearing below the page in the search results, as well as prevents caching of the page." >$1</span>');
	content = content.replace(/(NOODP)/g, '<span class="ftltp help-cursor" title="NOODP - blocks the Open Directory Project description of the page from being used in the description that appears below the page in the search results." >$1</span>');
	content = content.replace(/(NONE)/g, '<span class="ftltp help-cursor" title="NONE - equivalent to "NOINDEX (prevents the page from being included in the index), NOFOLLOW (prevents Googlebot from following any links on the page)"." >$1</span>');

	content = content.replace(/(ALL)/g, '<span class="ftltp help-cursor" title="ALL - There are no restrictions for indexing or serving." >$1</span>');

	content = content.replace(/(NOTRANSLATE)/g, '<span class="ftltp help-cursor" title="NOTRANSLATE - Do not offer translation of this page in search results." >$1</span>');
	content = content.replace(/(NOIMAGEINDEX)/g, '<span class="ftltp help-cursor" title="NOIMAGEINDEX - Do not index images on this page." >$1</span>');
	content = content.replace(/(UNAVAILABLE_AFTER)/g, '<span class="ftltp help-cursor" title="UNAVAILABLE_AFTER - Do not show this page in search results after the specified date/time. The date/time must be specified in the RFC 850 format." >$1</span>');

	content = content.replace(/(NOYDIR)/g, '<span class="ftltp help-cursor" title="NOYDIR - tells every search engine spider not to add the Yahoo Directory title." >$1</span>');

	/*
	if (! content.indexOf("NOINDEX") >= 0){
		content = content.replace(/(INDEX)/g, '<span class="ftltp help-cursor" title="By default, search engines will index a page and its links. So there is no need to tag pages with content value of INDEX." >$1</span>');
	}

	if (! content.indexOf("NOFOLLOW") >= 0){		
		content = content.replace(/(FOLLOW)/g, '<span class="ftltp help-cursor" title="By default, search engines will index a page and follow links to it. So there is no need to tag pages with content value of FOLLOW." >$1</span>');
	}*/

	return content;
}

function getLineExtraMeta(titleName, description) {

	return "<span class='basic-title-2'>" + titleName + " : </span><span class='basic-ct-2'>" + description + "</span>";

}

function countWords(str) {
  var matches = str.match(/[\w\d\’\'-]+/gi);
  return matches ? matches.length : 0;
}

chrome.runtime.sendMessage(pageInfo);