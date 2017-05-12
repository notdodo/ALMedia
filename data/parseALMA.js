var tableName = 'iceDataTblOutline',
	table = document.getElementsByClassName(tableName)[0],
	markOffset = 5,
	cfuOffset = 4,
	totalMarks = 0,
	totalCFU = 0,
	numMarks = 0,
	average = 0,
	finalMark = 0,
	tableMarks = table.getElementsByTagName('tr');

function sendResults() {
	average = (totalMarks / totalCFU).toFixed(2);
	finalMark = (average * 110 / 30).toFixed(2);
	var ret = [average, finalMark, totalMarks, totalCFU];
	self.port.emit('retElem', ret);
}

function parseExams() {
	for (var index = 1; index < tableMarks.length; ++index) {
		var voto = tableMarks[index].getElementsByTagName('td')[markOffset].innerHTML;
		if (voto.includes('verbalizzato') && /\d/.test(voto)) {
			var value = parseInt(voto.replace(/[^\d\.\-]/g, ''));
			if (value > 0) {
				var cfu = parseInt(tableMarks[index].getElementsByTagName('td')[cfuOffset].innerHTML);
				totalMarks += value * cfu;
				totalCFU += cfu;
			}
		}
	}
	sendResults();
}

self.port.on('parseALMA', data => {
	if (data === 'getElem') {
		parseExams();
	}
});
