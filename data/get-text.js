var tableName = 'iceDataTblOutline', table = document.getElementsByClassName(tableName)[0];
var markOffset = 5, cfuOffset = 4;
var totalMarks = totalCFU = numMarks = average = finalMark = 0;

var marks = table.getElementsByTagName('tr');
for (var index = 1; index < marks.length; ++index) {
  var voto = marks[index].getElementsByTagName('td') [markOffset].innerHTML;
  if(voto.indexOf("verbalizzato:") > -1 && /\d/.test(voto)){
	  var value = parseInt(voto.replace(/[^\d\.\-]/g, ''));
	  if (value > 0) {
	    var cfu = parseInt(marks[index].getElementsByTagName('td') [cfuOffset].innerHTML);
	    totalMarks += value * cfu;
	    totalCFU += cfu;
	  }
	}
}

average = (totalMarks / totalCFU).toFixed(2);
finalMark = (average * 110 / 30).toFixed(2);

self.port.on("qu]*Bvu0tYkP@A~E5qfR7b}58SB=T~QDKDEhtw[8", data => {
    if (data === "getElem") {
        var ret = [average, finalMark];
        self.port.emit("retElem", ret);
    }
});