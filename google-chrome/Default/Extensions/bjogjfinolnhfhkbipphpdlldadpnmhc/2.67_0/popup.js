console.log("POPUP.JS - START");

// =====================================================================
// GLOGAL VARIABLES

var pageInfo;

var url;

// =====================================================================
// INIT HTML on front-end

// It is called when it receives a message from content_script.js
function initHtml() {
  console.log("-- function - initHtml");

  $('#basic-tab-content').html(pageInfo.basicTabHtml);
  console.debug(pageInfo.headersTabHtml);
  $('#headers-tab-content').html(pageInfo.headersTabHtml); // attention, j'ai certain problème avec cette ligne.

//	$('#output-tab-content').html(  getTypoMsg() + pageInfo.outputTabHtml );

  $('#images-tab-content').html(pageInfo.imagesTabHtml);
  $('#links-tab-content').html(pageInfo.linksTabHtml);
  $('#social-tab-content').html(pageInfo.socialTabHtml);

  $('#tools-tab-content').html(pageInfo.toolsTabHtml);

  initHelps();

  // DISPLAY ALL
  $('#mainDiv').css("display", "block");
  $('#loadingDiv').css("display", "none");

  initTracks();

  initReadMores(); // Il y a un bug au changement de tabulation.

}

function initReadMores() {
  $('article').readmore({
    speed: 300,
    maxHeight: 60
  });

//	$('.header-readmore').readmore({
//		  speed: 300,
//		  maxHeight: 40
//		});
}

// =====================================================================
// Perform the CALLBACK when a request is received from the content script

index = 0;

//Perform the callback when a request is received from the content script
chrome.runtime.onMessage.addListener(function (request) {

  console.log("-- function - chrome.runtime.onMessage.addListener");

  index++;

  if (index > 1) { // sometimes the script runs twice : / this is the only way I found ; )
    return;
  }

  pageInfo = request;

  initHtml();

  imagePreview();

});

// =====================================================================
// ON START !

// =====================================================================
// ON START !

// Set up event handlers and inject content_script.js into all frames in the active
// tab.
function buildTheDisplay() {

  console.log("-- function - buildTheDisplay");

  chrome.windows.getCurrent(function (currentWindow) {

    // tabId = null;
    // chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    //   console.log(tabs[0].url);
    //   console.log(tabs[0].id);
    //   tabId = tabs[0].id;
    //
    //   alert(tabId);
    //
    //   if (tabId) {
    //     chrome.scripting.executeScript(
    //         {
    //           target: {tabId: tabId},
    //           files: ['content_script.js'],
    //         });
    //   }
    // });

   chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        console.log(tabs[0].url);
        console.log(tabs[0].id);
        tabId = tabs[0].id;

        if (tabId) {
          chrome.scripting.executeScript({
            target: {tabId: tabId, allFrames : true},
            files: [
              'js/jquery.min.js',
              'js/tsort/jquery.tinysort.js',
              'js/tsort/jquery.tinysort.charorder.js',
              'js/purl.js',
              'content_script.js']
          })
          .then(injectionResults => {
            for (const {frameId, result} of injectionResults) {
              console.log(`Frame ${frameId} result:`, result);
            }
          });
        }
      });


    // chrome.tabs.query({active: true, windowId: currentWindow.id},
    // 		function(activeTabs) {
    //
    // 			chrome.tabs.executeScript(activeTabs[0].id, { file: "js/jquery.min.js" }, function() {
    // 				chrome.tabs.executeScript(activeTabs[0].id, { file: "js/tsort/jquery.tinysort.js" }, function() {
    // 					chrome.tabs.executeScript(activeTabs[0].id, { file: "js/tsort/jquery.tinysort.charorder.js" }, function() {
    // 						chrome.tabs.executeScript(activeTabs[0].id, { file: "js/purl.js" }, function() {
    // 							chrome.tabs.executeScript(activeTabs[0].id, { file: "content_script.js" });
    // 						});
    // 					});
    // 				});
    // 			});
    //
    //
    // 		});

  });

};

this.imagePreview = function () {

  $("a.preview").hover(function (e) {
        this.t = this.title;
        this.title = "";
        var c = (this.t != "") ? "<br/>" + this.t : "";
        $("body").append(
            "<p id='preview'><img src='" + this.href + "' alt='Image preview' />"
            + c + "</p>");
        $("#preview")
        .css("top", ($(this).position().top + 480) + "px")
        .css("left", (300) + "px")
        .fadeIn("fast");
      },
      function () {
        this.title = this.t;
        $("#preview").remove();
      });
  $("a.preview").mousemove(function (e) {
    $("#preview")
    .css("top", ($(this).position().top + 480) + "px")
    .css("left", (300) + "px");
  });

  // preview in IMAGE
  $("a.preview2").hover(function (e) {
        this.t = this.title;
        this.title = "";
        var c = (this.t != "") ? "<br/>" + this.t : "";
        $("body").append(
            "<p id='preview'><img src='" + this.href + "' alt='Image preview' />"
            + c + "</p>");
        $("#preview")
        .css("top", ($(this).position().top + 80) + "px")
        .css("left", (300) + "px")
        .fadeIn("fast");
      },
      function () {
        this.title = this.t;
        $("#preview").remove();
      });
  $("a.preview2").mousemove(function (e) {
    $("#preview")
    .css("top", ($(this).position().top + 80) + "px")
    .css("left", (300) + "px");
  });

  $("a.preview3").hover(function (e) {
        this.t = this.title;
        this.title = "";
        var c = (this.t != "") ? "<br/>" + this.t : "";
        $("body").append(
            "<p id='preview'><img src='" + this.href + "' alt='Image preview' />"
            + c + "</p>");
        $("#preview")
        .css("top", ($(this).position().top + 80) + "px")
        .css("left", (300) + "px")
        .fadeIn("fast");
      },
      function () {
        this.title = this.t;
        $("#preview").remove();
      });
  $("a.preview3").mousemove(function (e) {
    $("#preview")
    .css("top", ($(this).position().top + 80) + "px")
    .css("left", (300) + "px");
  });

};

// Set the window to the top
function toTop() {
  $('html, body').animate({scrollTop: 0}, 0);
}

// Init GA.
function initTracks() {

  $("#id-basic-tab").click(function () {
    trackGa('basic-tab');
  });

  $("#id-headers-tab").click(function () {
    trackGa('headers-tab');
  });

  $('#id-images-tab').click(function () {
    trackGa('images-tab');
  });

  $('#id-links-tab').click(function () {
    trackGa('links-tab');
  });

  $('#id-social-tab').click(function () {
    trackGa('social-tab');
  });

  $('#id-tools-tab').click(function () {
    trackGa('tools-tab');
  });

  $("#201810-divi-btnad").click(function () {
    trackGa('201810-divi-btnad');
  });

  // Tout les liens (avec le title !)
//	console.log("-----------");
//	console.log("----------- href with l-ext"+$( 'a[class="l-ext"]' ).length);

  $('a[class~="l-ext"]').click(function () {
    // console.log('(GA) Tool - '+$(this).attr('alt'));
    trackGa('Tool - ' + $(this).attr('alt'));
  });

  // Helps
  $("img[class~='hpr']").click(function () {
    // console.log('(GA) Help - '+$(this).attr('id'));
    trackGa('Help - ' + $(this).attr('id'));
  });

  // current tab
  chrome.runtime.sendMessage({message: 'basic-tab', type: 'first-tab'},
      function (response) {
      });
}

function trackGa(pathWithSlash) {
  chrome.runtime.sendMessage({message: pathWithSlash, type: 'clicked'},
      function (response) {
      });
}

function initHelps() {
  // hover

  // http://qtip2.com/options voir style.class
//	styleClass = 'qtip-bootstrap qtip-blue qtip-shadow';	
//	styleClass = 'qtip-green';
  styleClass = 'qtip-bootstrap';

  msgLoading = "Loading...";
//	console.log("initHelps");

  var titles = new Object();
  titles["h-title"] = "Title Tag";
  titles["h-description"] = "Description Meta Tag";
  titles["h-keywords"] = "Keywords Meta Tag";
  titles["h-canonical"] = "Canonical Link Tag";
  titles["h-url"] = "Current URL";
  titles["h-robots"] = "Robots Meta Tag";
  titles["h-headers"] = "H1 to H6 heading elements";
  titles["h-images"] = "Number of images";
  titles["h-sitemap"] = "Sitemap XML";
  titles["h-robots-txt"] = "Robots.txt File";
  titles["h-links"] = "Number of links";
  titles["h-ga"] = "Google Analytics";

  titles["h-graph"] = "Open Graph";
  titles["h-twitter"] = "Twitter Cards";
  titles["h-schema"] = "Schema.org";
  titles["h-imagesrc"] = "Image src Tag";

  titles["h-images-tab"] = "Images";
  titles["h-links-tab"] = "Links";

  titles["h-doubleclick"] = "DoubleClick (Google)";

  titles["h-yahoo-yimg"] = "Yimb.com (Yahoo! images service)";

  titles["h-author"] = "Author link or meta";

  titles["h-lang"] = "Lang attribute of HTML element";

  titles["h-xfn"] = "XFN (Xhtml Friends Network) / REL";

  titles["h-publisher"] = "Publisher (Link tag)";

  $("img[class~='hpr']").each(function () {

//		console.log('span: '+$(this).attr('id'));

    title = titles[$(this).attr('id')];
    contentUrl = $(this).attr('id');

//		console.log("QTIP : "+title+ " / " +contentUrl);

    $(this).qtip({
      content: {
        title: "<strong>" + title + "</strong>",
        ajax: {
          url: '/help/' + contentUrl + '-en.html'
        },
        text: msgLoading
      }
      , position: {
        viewport: $(".panel-container")
      }
      , style: {classes: styleClass}
      , show: {
        event: 'click'

      }
      , hide: {event: 'unfocus mouseleave', delay: 300, fixed: true}

    });

  });

  $("[class~='ftltp']").each(function () {

//		console.log('span: '+$(this).attr('id'));

    title = titles[$(this).attr('id')];
    contentUrl = $(this).attr('id');

//		console.log("QTIP : "+title+ " / " +contentUrl);

    $(this).qtip({
      content: {
        attr: 'title'
      }
      , style: {classes: styleClass}
      , position: {
        viewport: $(".panel-container")
      }
      , hide: {event: 'unfocus mouseleave', delay: 300, fixed: true}
    });

  });

  $("img[class~='hpbr']").each(function () {

//		console.log('span: '+$(this).attr('id'));

    title = titles[$(this).attr('id')];
    contentUrl = $(this).attr('id');

//		console.log("QTIP : "+title+ " / " +contentUrl);

    $(this).qtip({
      content: {
        title: "<strong>" + title + "</strong>",
        ajax: {
          url: '/help/' + contentUrl + '-en.html'
        },
        text: msgLoading
      }
      , style: {classes: styleClass}
      , show: {
        event: 'click', effect: false

      }
      , hide: {event: 'unfocus click mouseleave', delay: 300, fixed: true}

    });

  });

  $("img[class=hpr]").hover(
      function () {
        $(this).attr('src', 'img/help-icon.png');
      },
      function () {
        $(this).attr('src', 'img/help-icon-i.png');
      }
  );
  $("img[class=hpbr]").hover(
      function () {
        $(this).attr('src', 'img/help-icon.png');
      },
      function () {
        $(this).attr('src', 'img/help-icon-i.png');
      }
  );

}

$(document).ready(function () {

  console.log("-- function - $(document).ready");

  buildTheDisplay();

  $('#tab-container').easytabs();

  $('a[href$="-tab"]').click(function () {
    toTop();
    initReadMores(); // pour la colonne de droite (scroll)
  });

  //current tab
  chrome.runtime.sendMessage({message: 'basic-tab', type: 'first-tab'},
      function (response) {
      });

});

// ==============
// message typo
function getTypoMsg() {

  // intro tab
  c = "<span class='intro-tab'>This is an intro tab.</span><br/>";

  // Titre
  c += "<span class='basic-title'>This is a title.</span><br/>";

  // contenu body
  c += "<span>This is a body content.</span><br/>";

  // message error
  c += "<span class='error-value'>This is an error message.</span><br/>";

  // message warning
  c += "<span class='warning-value'>This is a warning message.</span><br/>";

  // message good
  c += "<span class='good-value'>This is an encouraging message.</span><br/>";

  // message missing
  c += "<span class='no-data'>This is a missing text sample.</span><br/>";

  // conteny body level deux
  c += "<span class='message-h2'>This is a body content level 2.</span><br/>";

  return c;

}

console.log("POPUP.JS - END");
