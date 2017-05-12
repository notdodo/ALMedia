var examID =     0,
    numExams =   0,
    maxExams =   7,
    totalMarks = 0,
    totalCfu =   0,
    avg =        0,
    finalMark =  0,
    examID =     0;

var urlAlma = "https://almaesami.unibo.it/almaesami/studenti/attivitaFormativaPiano-list.htm"
var wrongPage = 'Apri la <a href="' + urlAlma + '" target="_blank">pagina</a> del tuo libretto per conoscere la tua media e il voto di laurea di partenza!';
var infoGit = 'ALMedia è Open Source: guarda il <a href="https://github.com/edoz90/ALMedia" target="_blank">codice sorgente</a> su GitHub.';
var tip0 = 'Lo sai che puoi cambiare il tema dalle preferenze dell\'estensione?';
var tip1 = 'Le lodi non sono considerate ai fini della media e del voto di laurea.';
var infoDev = 'Vieni a conoscere chi c\'è dietro ALMedia: <a href="https://addons.mozilla.org/en-GB/firefox/addon/almedia/developers" target="_blank">Edoardo Rosa</a> e <a href="https://addons.mozilla.org/en-GB/firefox/addon/almedia/developers" target="_blank">Lisa Mazzini</a>';
var quotes = [infoGit, infoDev, tip0, tip1];


document.addEventListener('DOMContentLoaded', () => {
    /* Open link to Almaesami */
    document.addEventListener('click', event => {
        let a = event.target.closest('a');
        // typeof null -> 'object' WTF!
        // a = 0 if (a) -> undefined WTF!
        // a = false if (a) -> undefined WTF!
        if (a !== null && typeof a !== 'undefined' && typeof a.href !== 'undefined') {
            browser.tabs.create({
                url: a.href
            });
        }
        event.preventDefault();
    });

    document.getElementById('addExam').addEventListener('click', addNewExam);
    main();
});

function main() {
    // run content-script
    browser.tabs.executeScript(null, {
        file: 'parseALMA.js'
    });

    var activeTab = browser.tabs.query({active: true, currentWindow: true});
    activeTab.then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {"action": "parse"}).then(response => {
            updateView(response["results"]);
            randomQuote();
        }).catch(onError);
    });
    randomQuote();

    // update/read theme settings
    var getting = browser.storage.local.get("theme");
    getting.then((item) => {
        if (item.theme === "dark")
            document.querySelector("link[href='styles/styleLight.css']").href = 'styles/styleDark.css';
        else
            document.querySelector("link[href='styles/styleDark.css']").href = 'styles/styleClear.css';
    }, onError);
}

function onError(e) {
    console.log("Error detected: " + e);
}

// Update HTML view and globals variables
function updateView(data) {
    // [average, finalMark, totalMarks, totalCFU]
    console.log(data);
    avg = data[0];
    finalMark = data[1];
    totalMarks = data[2];
    totalCfu = data[3];
    var avgResult = document.getElementById('avgResult');
    var markResult = document.getElementById('markResult');
    avgResult.value = avg;
    markResult.value = finalMark;
    avgResult.className += ' success';
    markResult.className += ' success';
    avgResult.disabled = false;
    markResult.disabled = false;
}

function addNewExam() {
    var mark = document.getElementById('newMark').value;
    var cfu = document.getElementById('newCfu').value;
    if (parseInt(mark) >= 18 && parseInt(cfu) >= 1 && numExams <= maxExams) {
        submitNewExam(mark, cfu);
        displayNewExam(mark, cfu);
        updateView([avg, finalMark, totalMarks, totalCfu]);
        mark = '';
        cfu = '';
    }
}

function displayNewExam(mark, cfu) {
    var trashIcon = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
    var root = document.getElementsByClassName('historyMarks')[0];

    var div = document.createElement('div');
    div.className = "examRow";
    div.id = examID;
    var newMark = document.createElement('input');
    newMark.className = 'clean success';
    newMark.type = 'number';
    newMark.disabled = true;
    newMark.value = mark;
    var newCfu = document.createElement('input');
    newCfu.className = "clean success";
    newCfu.type = 'number';
    newCfu.disabled = true;
    newCfu.value = cfu;
    var del = document.createElement('button');
    del.innerHTML = trashIcon;
    del.id = examID;
    del.onclick = function() { removeExam(del.id, newMark.value, newCfu.value); };

    div.appendChild(newMark);
    div.appendChild(newCfu);
    div.appendChild(del);
    root.appendChild(div);
    examID++;
}

function submitNewExam(mark, cfu) {
    var mark = parseInt(mark);
    var cfu = parseInt(cfu);
    if (parseInt(numExams) <= parseInt(maxExams)) {
        totalMarks += mark * cfu;
        totalCfu += cfu;
        avg = (totalMarks / totalCfu).toFixed(2);
        finalMark = (avg * 110 / 30).toFixed(2);
    }
}

function removeExam(id, mark, cfu) {
    var mark = parseInt(mark);
    var cfu = parseInt(cfu);

    totalMarks -= mark * cfu;
    totalCfu -= cfu;
    avg = (totalMarks / totalCfu).toFixed(2);
    finalMark = (avg * 110 / 30).toFixed(2);
    numExams--;
    updateView([avg, finalMark, totalMarks, totalCfu]);

    var div = document.getElementById(id);
    div.parentNode.removeChild(div);
}

function randomQuote() {
    var avgResult = document.getElementById('avgResult');
    var finalMark = document.getElementById('markResult');
    var info = document.getElementsByClassName('info')[0];
    if (avgResult.value === "" || finalMark.value === "")
        info.innerHTML = wrongPage;
    else {
        info.innerHTML = quotes[Math.floor(Math.random()*quotes.length)];
    }
}
