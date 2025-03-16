document.addEventListener("sendmessage",function(a){console.log("sendMessage");browser.runtime.sendMessage({action:a.detail.topic,source:a.detail.message})});
