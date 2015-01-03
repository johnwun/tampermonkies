// ==UserScript==
// @name         Add demo button
// @namespace    http://wundes.com/
// @version      1.1
// @description  makes button
// @author       John Wundes 
// @include https://gerrit.nexgen.neustar.biz/*
// @grant        none  
// ==/UserScript==

var pollFrequency = 1000;//milliseconds
var timer1;
var loadButtonFunc = function() {
  var menu = document.getElementsByClassName('topmenuTDglue')[0];
  var oldButton = document.getElementById('ns-demo-button');
  if (oldButton) {
    menu.removeChild(oldButton);
  }
  var node = document.createElement('BUTTON');

  node.style.color = 'white';
  node.id = 'ns-demo-button';


  var urlMatch = window.location.href.toString().match(/\/(\d+)\//);

  if (urlMatch && urlMatch.length === 2) {
    var changeNumber = urlMatch[1];
    var htmlText = document.documentElement.innerHTML;
    var lastStartedIndex = htmlText.lastIndexOf('Build Started');
    var lastSuccessIndex = htmlText.lastIndexOf('SUCCESS');
    var lastMergedIndex = htmlText.lastIndexOf('successfully merged');
    var lastAbandonedIndex = htmlText.lastIndexOf('Abandoned');
    var textnode;
    var openDemoPage = function() {
      window.open('https://mip.dev.agkn.net/' + changeNumber, '_blank');
    };

      if(lastAbandonedIndex > lastStartedIndex && lastStartedIndex !== -1){
        // no onclick
        textnode = document.createTextNode(changeNumber + ' was Abandoned!');
        node.style.backgroundColor = '#aaa';
      }else
      if (lastMergedIndex > lastStartedIndex) {

      // no onclick
      textnode = document.createTextNode(changeNumber + ' was Merged!');
      node.style.backgroundColor = '#f00';
    } else
    // if a new build is in process, or hasn't been triggered yet.
    if (lastSuccessIndex < lastStartedIndex || lastSuccessIndex === -1) {
      node.disabled = 'disabled';
      node.style.backgroundColor = '#aaa';
      node.opacity = 0.5;
      textnode = document.createTextNode('Building ' + changeNumber);
    } else {
      node.onclick = openDemoPage;
      node.style.backgroundColor = '#5A5';
      textnode = document.createTextNode('Demo ' + changeNumber);
    }
    node.appendChild(textnode);
    menu.appendChild(node);
  }

  poller();
};

// HACK: don't know how to make this fire on url update for spa,
// so just polling every second to update button status.
var poller = function() {
  if (document.getElementsByClassName('topmenuMenuLeft').length) {
    //update every x milliseconds if we change location.
    timer1 = setTimeout(loadButtonFunc, pollFrequency);
  } else {
    timer1 = setTimeout(poller, pollFrequency);
  }
};

poller();
