
var data = require("sdk/self").data;
var self = require("sdk/self");
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
  include: "*.it",
  contentScriptWhen: 'end',
  contentScriptFile: data.url("get-text.js"),
  onAttach: startConn
});

function startConn(worker) {
  worker.port.emit("getElem", "ciao");
  worker.port.on("retElem", function(content) {
    document.getElementsByTagName("span")[0].innerHTML = content;
    console.log(content);
  });
}


// Construct a panel, loading its content from the "text-entry.html"
// file in the "data" directory, and loading the "get-text.js" script
// into it.
var text_entry = require("sdk/panel").Panel({
  contentURL: data.url("text-entry.html"),
  //contentScriptFile: data.url("get-text.js")
});

//tutorial
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "16": "./327.png",
    "32": "./327.png",
    "64": "./327.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  text_entry.show({
    position: button
  });
}


// When the panel is displayed it generated an event called
// "show": we will listen for that event and when it happens,
// send our own "show" event to the panel's script, so the
// script can prepare the panel for display.
text_entry.on("show", function() {
  text_entry.port.emit("show");
});

// Listen for messages called "text-entered" coming from
// the content script. The message payload is the text the user
// entered.
// In this implementation we'll just log the text to the console.
text_entry.port.on("text-entered", function (text) {
  console.log(text);
  text_entry.hide();
});