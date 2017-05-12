function parseALMA() {
    var tableName = 'iceDataTblOutline',
        table = document.getElementsByClassName(tableName)[0],
        markOffset = 5,
        cfuOffset = 4,
        totalMarks = 0,
        totalCFU = 0,
        numMarks = 0,
        average = 0,
        finalMark = 0,
        tableMarks = table.getElementsByTagName('tr'),
        result = null;

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

    average = (totalMarks / totalCFU).toFixed(2);
    finalMark = (average * 110 / 30).toFixed(2);
    return [average, finalMark, totalMarks, totalCFU];
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request["action"] === "parse")
        sendResponse({"results": parseALMA()});
});
