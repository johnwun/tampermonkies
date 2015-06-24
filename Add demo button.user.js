// ==UserScript==
// @name         Add demo buttons
// @namespace    http://wundes.com/
// @version      1.3.1
// @description  makes buttons
// @author       John Wundes 
// @include https://gerrit.nexgen.neustar.biz/*
// @grant        none  
// ==/UserScript==

var pollFrequency = 1000; //milliseconds
var timer1;
var loadButtonFunc = function() {
  var menu = document.getElementsByClassName('topmenuTDglue')[0];
  var oldButtonNode = document.getElementById('ns-demo-button-div');
  if (oldButtonNode) {
    menu.removeChild(oldButtonNode);
  }
  var node = document.createElement('div');
  node.id = 'ns-demo-button-div';
    
  var devBtn = document.createElement('BUTTON');
  devBtn.style.color = 'white';
  devBtn.id = 'ns-dev-button';
  
  var gpBtn = document.createElement('BUTTON');
  gpBtn.style.color = 'white';
  gpBtn.id = 'ns-gp-button';

  var urlMatch = window.location.href.toString().match(/\/(\d+)\/*/);

  if (urlMatch && urlMatch.length === 2) {
    var changeNumber = urlMatch[1];
    var htmlText = document.documentElement.innerHTML;
    var lastStartedIndex = htmlText.lastIndexOf('Build Started');
    var lastSuccessIndex = htmlText.lastIndexOf('SUCCESS');
    var lastMergedIndex = htmlText.lastIndexOf('successfully merged');
    var lastAbandonedIndex = htmlText.lastIndexOf('Abandoned');
    var lastUploadedIndex = htmlText.lastIndexOf('Uploaded');
    var lastFailureIndex = htmlText.lastIndexOf('FAILURE');
    var devTextNode;
    var gpTextNode;
      
        
    devTextNode = document.createTextNode(changeNumber + ' Dev');
    gpTextNode = document.createTextNode(changeNumber + ' GP');  
    gpBtn.style.display = 'none';
    var openDevPage = function() {
      window.open('https://mip.dev.agkn.net/' + changeNumber, '_blank');
    };
    var openGpPage = function() {
      window.open('https://mip.gp.agkn.net/' + changeNumber, '_blank');
    };

    if(lastAbandonedIndex > lastUploadedIndex){
      // no onclick
      devTextNode = document.createTextNode(changeNumber + ' was Abandoned!');
      devBtn.style.backgroundColor = '#aaa'; 
    }else
    if (lastMergedIndex != -1) {
    // no onclick
    devTextNode = document.createTextNode(changeNumber + ' was Merged!');
    devBtn.style.backgroundColor = '#f00'; 
          
    } else 
    if(lastFailureIndex > lastUploadedIndex && lastSuccessIndex < lastFailureIndex){
      devTextNode = document.createTextNode(changeNumber + '  Build FAILURE!');
      devBtn.style.backgroundColor = '#f00'; 
    } else
    // if a new build is in process, or hasn't been triggered yet.
    if (lastSuccessIndex < lastStartedIndex || lastSuccessIndex === -1) {
      node.opacity = 0.5;
      devBtn.disabled = 'disabled';
      devBtn.style.backgroundColor = '#aaa'; 
        
      devTextNode = document.createTextNode('Building ' + changeNumber);
    } else {
      devBtn.onclick = openDevPage;
      devBtn.style.backgroundColor = '#5A5';
      devBtn.style.cursor = 'pointer';
        
      gpBtn.onclick = openGpPage;
      gpBtn.style.backgroundColor = '#5A5';   
      gpBtn.style.cursor = 'pointer';
      gpBtn.style.display = 'inline';
    }
    
    
    if(lastUploadedIndex != -1 ){
        devBtn.appendChild(devTextNode);
        gpBtn.appendChild(gpTextNode);
        node.appendChild(devBtn); 
        node.appendChild(gpBtn);
        menu.appendChild(node);
    }
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
