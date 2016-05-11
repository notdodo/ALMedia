var examID = 0,
	numExams = 0,
	maxExams = 5;
var linkAlma = 'Apri la <a href="https://almaesami.unibo.it/almaesami/studenti/attivitaFormativaPiano-list.htm" target="_blank">pagina</a> del tuo libretto per conoscere la tua media e il voto di laurea di partenza!';
var infoGit = 'ALMedia è Open Source: guarda il <a href="https://github.com/edoz90/ALMedia" target="_blank">codice sorgente</a> su GitHub.';
var tip0 = 'Lo sai che puoi cambiare il tema dalle preferenze dell\'estensione?';
var tip1 = 'Le lodi non sono considerate ai fini della media e del voto di laurea.';
var infoDev = 'Vieni a conoscere chi c\'è dietro ALMedia: <a href="https://addons.mozilla.org/en-GB/firefox/addon/almedia/developers" target="_blank">Edoardo Rosa</a> e <a href="https://addons.mozilla.org/en-GB/firefox/addon/almedia/developers" target="_blank">Lisa Mazzini</a>';
var quotes = [infoGit, infoDev, tip0, tip1];

/* Open link to Almaesami */
document.addEventListener('click', event => {
	let a = event.target.closes('a');
	if (a && a.href) {
		addon.port.emit('openALMA', a.href);
	}
	event.preventDefault();
});

/* receive data from parser */
addon.on('message', data => {
	msg = JSON.parse(data);
	switch(msg.event) {
		case 'retElem':
			// data from parsing
			var avgResult = document.getElementById('avgResult');
			var markResult = document.getElementById('markResult');
			avgResult.value = msg.data[0];
			markResult.value = msg.data[1];
			avgResult.className += ' success';
			markResult.className += ' success';
			avgResult.disabled = false;
			markResult.disabled = false;
		break;
		case 'changeTheme':
			// change theme or initialize css
			changeTheme(msg.data);
		break;
		case 'loadTheme':
			randomQuote();
			if (msg.data && document.styleSheets[4].href.includes('styleClear.css'))
				document.querySelector("link[href='styleClear.css']").href = 'styleDark.css';
		break;
		case 'numExams':
			numExams = msg.data;
		break;
	}
});

function changeTheme(isDark) {
	if (isDark)
		document.querySelector("link[href='styleClear.css']").href = 'styleDark.css';
	else
		document.querySelector("link[href='styleDark.css']").href = 'styleClear.css';
}

function addNewExam() {
	var mark = document.getElementById('newMark');
	var cfu = document.getElementById('newCfu');
	if (parseInt(mark.value) >= 18 && parseInt(cfu.value) >= 1 && numExams <= maxExams) {
		submitNewExam(mark.value, cfu.value);
		displayNewExam(mark.value, cfu.value);
		mark.value = '';
		cfu.value = '';
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
	var data = [mark, cfu];
	addon.port.emit('addExam', data);
}

function removeExam(id, mark, cfu) {
	addon.port.emit('removeExam', [mark, cfu]);
	var div = document.getElementById(id);
	div.parentNode.removeChild(div);
}

function randomQuote() {
	var avgResult = document.getElementById('avgResult');
	var finalMark = document.getElementById('markResult');
	var info = document.getElementsByClassName('info')[0];
	if (avgResult.value === "" || finalMark.value === "")
		info.innerHTML = linkAlma;
	else {
		info.innerHTML = quotes[Math.floor(Math.random()*quotes.length)];
	}
}
