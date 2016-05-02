var data = require('sdk/self').data;
var self = require('sdk/self');
var pageMod = require('sdk/page-mod');
var buttons = require('sdk/ui/button/action');
var preferences = require('sdk/simple-prefs').prefs;
var tabs = require('sdk/tabs');
var setElem = [];
var widthPanel = 235;
var heightPanel = 270;
var maxExams = 7;
var numExams = 0;
var totalMarks = 0;
var totalCfu = 0;

pageMod.PageMod({
    include: 'https://almaesami.unibo.it/almaesami/studenti/*',
	contentScriptWhen: 'end',
    contentScriptFile: self.data.url('parseALMA.js'),
    onAttach: startConn
});

function startConn(worker) {
    worker.port.emit('parseALMA', 'getElem');
    worker.port.on('retElem', content => {
		totalMarks = parseInt(content[2]);
		totalCfu = parseInt(content[3]);
		content = [content[0], content[1]];
        var data = JSON.stringify(new MessageContent('retElem', content));
        text_entry.postMessage(data);
    });
}

var text_entry = require('sdk/panel').Panel({
    width: widthPanel,
    height: heightPanel,
    contentURL: data.url('index.html')
});

var button = buttons.ActionButton({
    id: 'almedia',
    label: 'ALMedia',
    icon: {
        '16': './16.png',
        '32': './32.png',
        '64': './64.png'
    },
    onClick: handleClick
});

function handleClick(state) {
    var msg = JSON.stringify(new MessageContent('loadTheme', preferences.DarkTheme));
    text_entry.postMessage(msg);
    text_entry.show({
        position: button
    });
}

/**************************************/
/*************** EVENTS ***************/
/**************************************/

// Open almaesami.unibo.it
text_entry.port.on('openALMA', uri => require('sdk/tabs').open(uri));

// Add two more input and resize the panel (max inputs = 5)
text_entry.port.on('addExam', data => {
	var mark = parseInt(data[0]);
	var cfu = parseInt(data[1]);
	if (parseInt(numExams) <= parseInt(maxExams)) {
		numExams++;
		heightPanel += 34;
		text_entry.resize(widthPanel, heightPanel);
		totalMarks += mark * cfu;
		totalCfu += cfu;
		avg = (totalMarks / totalCfu).toFixed(2);
		finalMark = (avg * 110 / 30).toFixed(2);
		text_entry.postMessage(JSON.stringify(new MessageContent('retElem', [avg, finalMark])));
		text_entry.postMessage(JSON.stringify(new MessageContent('numExams', numExams)));
	}
});

text_entry.port.on('removeExam', data => {
	var mark = parseInt(data[0]);
	var cfu = parseInt(data[1]);
	totalMarks -= mark * cfu;
	totalCfu -= cfu;
	avg = (totalMarks / totalCfu).toFixed(2);
	finalMark = (avg * 110 / 30).toFixed(2);
	var data = JSON.stringify(new MessageContent('retElem', [avg, finalMark]));
	text_entry.postMessage(data);
	heightPanel -= 34;
	text_entry.resize(widthPanel, heightPanel);
	numExams--;
	text_entry.postMessage(JSON.stringify(new MessageContent('numExams', numExams)));
});

// Watch preferences
function onPrefChange(prefName) {
    var msg = JSON.stringify(new MessageContent('changeTheme', preferences.DarkTheme));
    text_entry.postMessage(msg);
}
require('sdk/simple-prefs').on('DarkTheme', onPrefChange);

/**************************************/

/*************************************/
/*************** UTILS ***************/
/*************************************/

/* Create JSON for postMessage() */
function MessageContent(evt, data) {
    this.event = evt;
    this.data = data;
}
