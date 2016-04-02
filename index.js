var data = require("sdk/self").data;
var self = require("sdk/self");
var pageMod = require("sdk/page-mod");
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var setElem = [];

pageMod.PageMod({
    include: "https://almaesami.unibo.it/almaesami/studenti/*",
    contentScriptWhen: 'end',
    contentScriptFile: data.url("get-text.js"),
    onAttach: startConn
});

function startConn(worker) {
    worker.port.emit("qu]*Bvu0tYkP@A~E5qfR7b}58SB=T~QDKDEhtw[8", "getElem");
    worker.port.on("retElem", content => {
        text_entry.postMessage(content);
    });
}

var text_entry = require("sdk/panel").Panel({
    width: 180,
    height: 160,
    contentURL: data.url("text-entry.html")
});

var button = buttons.ActionButton({
    id: "almedia",
    label: "ALMedia",
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