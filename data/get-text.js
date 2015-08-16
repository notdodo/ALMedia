
var tableName = 'iceDataTblOutline';
var table = document.getElementsByClassName(tableName)[0];
var markOffset = 5;
var cfuOffset = 4;
var totalMarks = totalCFU = numMarks = average = 0;
var finalMark = 0;

var marks = table.getElementsByTagName('tr');
for (var index = 1; index < marks.length; ++index) {
  var voto = marks[index].getElementsByTagName('td') [markOffset].innerHTML;
  var value = parseInt(voto.replace(/[^\d\.\-]/g, ''));
  if (value > 0) {
    var cfu = parseInt(marks[index].getElementsByTagName('td') [cfuOffset].innerHTML);
    totalMarks += value * cfu;
    totalCFU += cfu;
  }
}

average = totalMarks / totalCFU;
finalMark = average * 110 / 30;
//document.getElementById("average").innerHTML = average;
//document.getElementById("mark").innerHTML = finalMark;
//console.log(average);
//console.log(finalMark);

self.port.on('getElem', function(data) {
	console.log("received: ", data);
	self.port.emit("retElem", average);
	self.port.emit("retElem", finalMark);
});