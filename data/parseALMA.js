class ALMedia {
	constructor() {
		this._tableName = 'iceDataTblOutline';
		this._table = document.getElementsByClassName(this._tableName)[0];
		this._markOffset = 5;
		this._cfuOffset = 4;
		this._totalMarks = 0;
		this._totalCFU = 0;
		this._numMarks = 0;
		this._average = 0;
		this._finalMark = 0;
		this._tableMarks = this._table.getElementsByTagName('tr');
	}
	
	_sendResults() {
		this._average = (this._totalMarks / this._totalCFU).toFixed(2);
		this._finalMark = (this._average * 110 / 30).toFixed(2);
		var _ret = [this._average, this._finalMark, this._totalMarks, this._totalCFU];
		self.port.emit('retElem', _ret);
	}
	
	parseExams() {
		for (var _index = 1; _index < this._tableMarks.length; ++_index) {
			var _voto = this._tableMarks[_index].getElementsByTagName('td')[this._markOffset].innerHTML;
			if (_voto.includes('verbalizzato') && /\d/.test(_voto)) {
				var _value = parseInt(_voto.replace(/[^\d\.\-]/g, ''));
				if (_value > 0) {
					var _cfu = parseInt(this._tableMarks[_index].getElementsByTagName('td')[this._cfuOffset].innerHTML);
					this._totalMarks += _value * _cfu;
					this._totalCFU += _cfu;
				}
			}
		}
		this._sendResults();
	}
}

let parse = new ALMedia();
self.port.on('parseALMA', data => {
	if (data === 'getElem') {
		parse.parseExams();
	}
});
