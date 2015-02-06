
// ==UserScript==
// @name         Get Averages for JIRA
// @namespace    http://wundes.com/
// @version      0.1
// @description  Adds an averages row to bottom of sprint points
// @author       John Wundes
// @match        http://jira.corp.agkn.net/secure/RapidBoard.jspa?rapidView=*&view=reporting&chart=velocityChart
// @grant        none
// ==/UserScript==

var pollFrequency = 1000; //milliseconds
var timer1;

var getAverage = function() {
  var chart = document.getElementById('ghx-chart-data');
  var tableList = chart.getElementsByTagName("table");
  var bodyList = tableList[0].getElementsByTagName("tbody")
  var rows = bodyList[0].rows;

  var existingAverageElement = document.getElementById("average-row");
  if (existingAverageElement) {
    bodyList[0].removeChild(existingAverageElement);
  }
  var completedList = [];
  var completed;
  var commitment;
  var completedTotal = 0;
  var commitTotal = 0;
  var count = 0;
  var commitAverage;
  var completedAverage;

  for (var j = 0; j < rows.length; j++) {
    commitment = rows[j].cells[1].innerHTML;
    completed = rows[j].cells[2].innerHTML;
    if (completed == 0 && commitment == 0) {
      continue;
    }

    commitTotal = commitTotal + Number(commitment);
    completedTotal = completedTotal + Number(completed);
    count++;
  }

  commitAverage = Math.round(commitTotal / count);
  completedAverage = Math.round(completedTotal / count);
  var tr = document.createElement("TR");
  tr.setAttribute("style", "font-weight: bold;border-top:1px solid black;border-bottom:none;");
  tr.setAttribute('id', 'average-row');

  var td0 = document.createElement("TD");
  var td1 = document.createElement("TD");
  td1.setAttribute('class', 'ghx-right');
  var td2 = document.createElement("TD");
  td2.setAttribute('class', 'ghx-right');
  var textnode0 = document.createTextNode('Average Velocity: (skipping zeros)');

  var textnode1 = document.createTextNode(commitAverage);
  var textnode2 = document.createTextNode(completedAverage);

  td0.appendChild(textnode0);
  td1.appendChild(textnode1);
  td2.appendChild(textnode2);
  tr.appendChild(td0);
  tr.appendChild(td1);
  tr.appendChild(td2);
  bodyList[0].appendChild(tr);
  poller();
};

var poller = function() {
  if (document.getElementById('ghx-chart-data')) {
    //update every x milliseconds if we change location.
    timer1 = setTimeout(getAverage, pollFrequency);
  } else {
    timer1 = setTimeout(poller, pollFrequency);
  }
};
poller();
