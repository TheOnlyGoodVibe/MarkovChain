inlets = 2;
outlets = 2;

var noteListe = [];
var notePlass = -1;
var forrigeNote = -1;

/*var lengdeListe = [];
var lengdePlass = -1;
var forrigeLengde = -1;*/

var iosListe = [];
var iosPlass = -1;
var forrigeIos = -1;

var sistSpilteNote = -1;
//var sistSpilteLengde = -1;
var sistSpilteIos = -1;

var tempo = 120;
var heltakt = (60000/tempo) * 4;
maxLengde = heltakt * 1,5; //Fikk syntaxerror når jeg prøver å ha var foran denne. Derfor er den annerledes
var minLengde = heltakt / 32;

function record(notenr, varighet, ios)
{
	addNote(notenr);
//	addLengde(quantize(varighet));
	addIos(quantize(ios));
}

function startRecord()
{
	notePlass = -1;
	forrigeNote = -1;
//	lengdePlass = -1;
//	forrigeLengde = -1;
	iosPlass = -1;
	forrigeIos = -1;
	sistSpilteNote = -1;
//	sistSpilteLengde = -1;
	sistSpilteIos = -1;
	clear();
	outlet(0, "Ready!");
}

function addNote(pitch)
{
	var forrigePlass = 0;
	
	notePlass = check(pitch, noteListe);
	if (notePlass < 0)
	{
		dummyListe = [pitch];
		noteListe.push(dummyListe);
	}
	if (forrigeNote > -1)
	{
		forrigePlass = check(forrigeNote, noteListe);
		noteListe[forrigePlass].push(pitch);
	}
	forrigeNote = pitch;
}

/*function addLengde(dur)
{
	lengdePlass = check(dur, lengdeListe);
	if (lengdePlass < 0)
	{
		dummyListe = [dur];
		lengdeListe.push(dummyListe);
	}
	if (forrigeLengde > -1)
	{
		forrigePlass = check(forrigeLengde, lengdeListe);
		lengdeListe[forrigePlass].push(dur);
	}
	forrigeLengde = dur;
}*/

function addIos(inter)
{
	var forrigePlass = 0;
	
	iosPlass = check(inter, iosListe);
	if (iosPlass < 0)
	{
		dummyListe = [inter];
		iosListe.push(dummyListe);
	}
	if (forrigeIos > -1)
	{
		forrigePlass = check(forrigeIos, iosListe);
		iosListe[forrigePlass].push(inter);
	}
	forrigeIos = inter;
}

function play()
{
	var nyNote = 0;
	var nyLengde = 0;
	var nyIos = 0;
	var utliste = [];
	
	if (noteListe.length != 0)
	{
		if (sistSpilteNote < 0)
		{
			nyNote = noteListe[Math.floor(Math.random()*noteListe.length)][0];
			//nyLengde = lengdeListe[Math.floor(Math.random() * lengdeListe.length)][0];
			nyLengde = Math.random() * maxLengde;
			nyIos = iosListe[Math.floor(Math.random()*iosListe.length)][0];
		}
		else
		{
			var noteIndex = check(sistSpilteNote, noteListe);
			//var lengdeIndex = check(sistSpilteLengde, lengdeListe);
			var iosIndex = check(sistSpilteIos, iosListe);
			
			nyNote = noteListe[noteIndex][Math.floor(Math.random()*noteListe[noteIndex].length)];
			//nyLengde = lengdeListe[lengdeIndex][Math.floor(Math.random()*lengdeListe[lengdeIndex].length)];
			nyLengde = Math.random() * maxLengde;
			nyIos = iosListe[iosIndex][Math.floor(Math.random()*iosListe[iosIndex].length)];
		}
		utliste = [nyNote, nyLengde, nyIos];
		outlet(1, utliste);
		sistSpilteNote = nyNote;
		//sistSpilteLengde = nyLengde;
		sistSpilteIos = nyIos;
	}
	else
	{
		post("Tom hjerne!");
		post();
	}
}

function clear()
{
	noteListe.length = 0;
//	lengdeListe.length = 0;
	iosListe.length = 0;
}

function quantize(lengde)
{
	if (lengde >= minLengde && lengde < maxLengde)
	{
		var underdeling = Math.round(heltakt/lengde);
		if (underdeling > 1)
		{
			return heltakt / (underdeling / 2)
		}
		else 
		{
			return heltakt/underdeling;
		}	
	}
	else if (lengde >= maxLengde)
	{
		return maxLengde;
	}
	else
	{
		return minLengde;
	}
}

function check(note, liste)
{
	var plass = -1;
	for (y = 0; y < liste.length;)
	{
		if (liste[y][0] == note)
		{
			plass = y;
			y = liste.length;
		}
		else
		{
			y = y+1;
		}
	}
	return plass;
}

function checkNote(note)
{
	plass = check(note, noteListe);
	if (plass < 0)
	{
		outlet(0, "Finnes ikke.");
	}
	else
	{
		outlet(0, "Ligger på plass: " + plass);
	}
}
