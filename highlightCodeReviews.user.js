// ==UserScript==
// @name         Highlight Reviews
// @namespace    http://wundes.com/
// @version      0.0.5
// @description  highlights code reviews as red and green, or blue for comments only
// @author       John Wundes
// @include      https://gerrit.nexgen.neustar.biz/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/johnwun/tampermonkies/master/highlightCodeReviews.js
// @downloadURL  https://raw.githubusercontent.com/johnwun/tampermonkies/master/highlightCodeReviews.js
// ==/UserScript==

var $$ = document.querySelector.bind(document);
var $$all = document.querySelectorAll.bind(document);
var pollFrequency = 1000; //milliseconds
var timer2;
var checkChanges = function() {
  
  // redirects from 'sign-in' status to login page'
  var loginLinkArray = Array.from(document.getElementsByClassName('menuItem')).filter(e => e.text === 'Sign In');
  var loginButtons = Array.from(document.getElementsByTagName('button')).filter(e => e.innerHTML === 'Sign In');
  if(loginButtons.length) {
      loginLinkArray.push(loginButtons[0]);
  }
  if(loginLinkArray.length) {
      loginLinkArray[loginLinkArray.length-1].click();
  }
  [].filter.call($$all('.com-google-gerrit-client-change-Message_BinderImpl_GenCss_style-closed'), (e) => {
      return e.textContent.match(/Patch Set [0-9]+:/) &&
            !e.textContent.match(/Patch Set [0-9]+ was rebased/) &&
            !e.textContent.match('JenkinsEnterprise') ||
             e.textContent.match('successfully merged')||
             e.textContent.match('Abandoned');
  }).filter((e) => {
      return typeof e === 'object';}).map((e) => {
        if(e.textContent.match('Review[+]1')){
            // light green
            e.style.backgroundColor = '#dfd';}
        else if(e.textContent.match('Review[+]2')){
            // dark green
            e.style.backgroundColor = '#9f9';}
        else if (e.textContent.match('Review[-]1')) {
            // light red
            e.style.backgroundColor = '#fdd';
        }
        else if (e.textContent.match('Review[-]2')) {
            // dark red with red text
            e.style.backgroundColor = '#f99';
            [].map.call(e.getElementsByTagName("div"),(function(c){c.style.color = '#c00';}));
        } else if (e.textContent.match('successfully merged')) {
            // black with green text
            e.style.backgroundColor = '#666';
            [].map.call(e.getElementsByTagName("div"),(function(c){c.style.color = '#dfd';}));
        } else if (e.textContent.match('Abandoned')) {
            // black with red text
            e.style.backgroundColor = '#666';
            [].map.call(e.getElementsByTagName("div"),(function(c){c.style.color = '#f88';}));
        } else {
            // info
            e.style.backgroundColor = '#eeecff';
        }
  });
  highlightPoller();
};

// HACK: don't know how to make this fire on url update for spa,
// so just polling every second to update button status.
var highlightPoller = function() {
  if (document.getElementsByClassName('topmenuMenuLeft').length) {
    //update every x milliseconds if we change location.
    timer2 = setTimeout(checkChanges, pollFrequency);
  } else {
    timer2 = setTimeout(highlightPoller, pollFrequency);
  }
};

highlightPoller();
