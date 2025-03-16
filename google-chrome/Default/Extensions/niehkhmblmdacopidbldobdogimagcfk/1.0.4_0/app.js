 /*************************************************************************
  * 
  * LINANGDATA CONFIDENTIAL
  * __________________
  * 
  *  [2015] - [2017] Linangdata 
  *  All Rights Reserved.
  * 
  * NOTICE:  All information contained herein is, and remains
  * the property of Linangdata and its suppliers, if any. 
  * Dissemination of this information or reproduction of this material
  * is strictly forbidden unless prior written permission is obtained
  * from Linangdata.
  */
 document.addEventListener('DOMContentLoaded', function () {

 	(function () {

 		try {
 			$(function () {
 				$('[data-toggle="tooltip"]').tooltip({
 					"trigger": "hover"
 				})
 			})

 			var jsonFormatterApp = angular.module('jsonFormatterApp', ['ui', 'ui.bootstrap'])
 				.controller('codeCtrl', function ($scope, $http) {
 					$scope.code = "";
 					$scope.rawcode = localStorage.getItem("htmlPretty");
 					$scope.isSomething = true;

 					$scope.setLastState = function (formatterState) {
 						localStorage.setItem("htmlPretty", formatterState);
 					};

 					$scope.$watch('rawcode', function (newValue, oldValue, $scope) {
 						if (newValue) {
 							$scope.code = beautify(newValue);
 							$scope.setLastState(newValue);
 						}
 					});

 					$scope.copyToClipBoard = function (str, mimetype) {
 						document.oncopy = function (event) {
 							event.preventDefault();
 							event.clipboardData.setData(mimetype, str);
 						};

 						try {
 							//var successful = document.execCommand("Copy", false, null);
 							var successful = document.execCommand("Copy");
 							var msg = successful ? 'successful' : 'unsuccessful';
 							console.log('Copying text command was ' + msg);
 						} catch (err) {
 							console.log('Oops, unable to copy');
 						}
 					};

 					$scope.pasteFromClipBoard = function (elementId, append) {
 						document.onpaste = function (event) {
 							event.preventDefault();
 							var clipboardText = event.clipboardData.getData("Text");
 							console.log(clipboardText)
 							//console.log($(elementId))
 							if (append)
 								$scope.rawcode = $scope.rawcode + clipboardText;
 							else
 								$scope.rawcode = clipboardText;
 						};
 						try {
 							var successful = document.execCommand("Paste", false, null);
 							var msg = successful ? 'successful' : 'unsuccessful';
 							console.log('Paste text command was ' + msg);
 						} catch (err) {
 							console.log('Oops, unable to paste');
 						}
 					};

 					$scope.getCopyHTMLToCB = function () {
 						var copy = $scope.getHTML();
 						//console.log(copy)
 						$scope.copyToClipBoard(copy, 'text/plain');
 					};

 					//Paste from clipboard
 					$scope.pasteFromCB = function () {
 						$scope.pasteFromClipBoard("#textarea");
 					};
 					$scope.appendHTML = function () {
 						$scope.pasteFromClipBoard("#textarea", true);
 					};

 					//Returns contents of  for saving to clipboard
 					$scope.getHTML = function () {
 						//return angular.element( '#formattedJson' ).text()
 						//Get a reference to the CodeMirror editor
 						var editor = $('.CodeMirror')[0].CodeMirror;
 						//console.log(editor.getValue())
 						return editor.getValue();

 					};
 					$scope.replaceHtml = function () {
 						var editor = $('.CodeMirror')[0].CodeMirror;
 						var htmlStr = editor.getValue()
 						$('#textarea').val(htmlStr);
 					};

 					// Save as function - a bit hoakey!
 					$scope.download = function () {
 						var editor = $('.CodeMirror')[0].CodeMirror;
 						angular.element('.saveas').attr("href", "data:text/javascript;charset=utf-8," + editor.getValue()).attr("download", "generatedFile.js");
 					}

 				})
 				.value('ui.config', {
 					codemirror: {
 						mode: 'javascript',
 						lineNumbers: true,
 						matchBrackets: true,
 						theme: 'rubyblue'
 					}
 				})
 		} catch (error) {

 		}
 	})();


 	Formatter = {
 		init: function () {

 			try {
 				$.get("https://linangdata.com/servedcontent/dynamiclinks.php?source=html-pretty", function (data) {
 					if (data) {
 						$("#links").html(data);
 						// $(".moretools").addClass("d-block");
 						$(".moretools").removeClass("d-none");
 						$(".navopentab").unbind().on("click", function (e) {
 							e.preventDefault();
 							var link = $(this).attr('href');
 							chrome.tabs.create({
 								url: link
 							});
 						})
 					} else {
 						// $(".moretools").addClass("d-none");
 					}
 				});
 				$.get("https://linangdata.com/servedcontent/bannertop.php?source=html-pretty", function (data) {
 					if (data) {
 						$("#banner-top").html(data).removeClass('hidden');
 					}

 					$(".navopentab").unbind().on("click", function (e) {
 						e.preventDefault();
 						var link = $(this).attr('href');
 						chrome.tabs.create({
 							url: link
 						});
 					})
 				});
 				$.get("https://linangdata.com/servedcontent/bannerbottom.php?source=html-pretty", function (data) {
 					if (data) {
 						$("#banner-bottom").html(data).removeClass('hidden');
 					}

 					$(".navopentab").unbind().on("click", function (e) {
 						e.preventDefault();
 						var link = $(this).attr('href');
 						chrome.tabs.create({
 							url: link
 						});
 					})
 				});
 			} catch (err) {}

 			$('#linangdata,.btn ').tooltip();

 			$(".navopenfullpage").on("click", function (e) {
 				e.preventDefault();

 				var params = $("#url").val() ? ('?url=' + $("#url").val()) : '';
 				var link = $(this).attr('href') + params;
 				chrome.tabs.create({
 					url: link
 				});
 			})

 			$("#linangdata").click(function () {
 				chrome.tabs.create({
 					url: "https://linangdata.com"
 				});
 			});
 			$(".navopentab").on("click", function (e) {
 				e.preventDefault();
 				var link = $(this).attr('href');
 				chrome.tabs.create({
 					url: link
 				});
 			})

 			$(".resize").click(function (e) {
 				//console.log(e)
 				e.preventDefault();
 				e.stopPropagation();

 				if ($('#resize i').hasClass('glyphicon-resize-full')) {
 					$('#formatter').addClass('large');
 					$('#resize i').removeClass('glyphicon-resize-full');
 					$('#resize i').addClass('glyphicon-resize-small');

 				} else {
 					$('#formatter').removeClass('large');
 					$('#resize i').removeClass('glyphicon-resize-small');
 					$('#resize i').addClass('glyphicon-resize-full');
 				}
 			})
 		}
 	}

 	Formatter.init(); //Build formatter

 });