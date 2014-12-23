// ==UserScript==
// @name         Add demo button
// @namespace    http://wundes.com/
// @version      1.1
// @description  makes button
// @author       John Wundes 
// @include https://gerrit.nexgen.neustar.biz/*
// @grant		 none  
// ==/UserScript==

var pollFrequency = 1000;//milliseconds
var loadButtonFunc = function(){ 
    var menu = document.getElementsByClassName('topmenuTDglue')[0];
    var oldButton = document.getElementById('ns-demo-button');
    if(oldButton){
        menu.removeChild(oldButton);
    }
    var node = document.createElement("BUTTON");
    
    node.style.color= "white";
    node.id = 'ns-demo-button';
    
    
    var urlMatch= window.location.href.toString().match(/\/(\d+)\//);
    
    if(urlMatch && urlMatch.length === 2){
        var changeNumber = urlMatch[1];
        var htmlText = document.documentElement.innerHTML;
        var lastStartedIndex = htmlText.lastIndexOf('Build Started');
        var lastSuccessIndex = htmlText.lastIndexOf('SUCCESS');
        var textnode;
        if( lastSuccessIndex < lastStartedIndex){
            node.disabled = 'disabled';  
            node.style.backgroundColor = "#aaa";
            node.opacity = 0.5;
            textnode = document.createTextNode("Building "+ changeNumber);
        }else{
            node.style.backgroundColor = "#5A5";
            textnode = document.createTextNode("Demo "+ changeNumber);
        }
        
        
        var openDemoPage = function() {
            window.open('https://mip.dev.agkn.net/'+changeNumber, '_blank'); 
        };
        node.onclick = openDemoPage;
        node.appendChild(textnode);
        menu.appendChild(node);
    }    
    poller();
};

// HACK: don't know how to make this fire on url update for spa,
// so just polling every second to update button status.
var poller = function(){
    if(document.getElementsByClassName('topmenuMenuLeft').length){
        //update every x milliseconds if we change location.
        setTimeout(loadButtonFunc,pollFrequency);
    }else{ 
        setTimeout(poller,pollFrequency);
    }
};

poller();


