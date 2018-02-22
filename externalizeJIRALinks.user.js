// ==UserScript==
// @name         Make all board links (in detail pane) external
// @namespace    http://wundes.com/
// @version      0.0.2
// @description  makes all openable ticket links appear green, and open in new tab.
// @author       John Wundes
// @match        https://jira.nexgen.neustar.biz/secure/RapidBoard.jspa*
// @grant        none
// ==/UserScript==
var $$ = document.querySelector.bind(document);
var $$all = document.querySelectorAll.bind(document);
var pollFrequency = 1000; //milliseconds
var timer2;
var checkChanges = function() {
  [].filter.call($$all('#ghx-detail-contents a'), (e) => {
      return e.href && (e.href.match(/browse/) || e.href.match('confluence'));
  }).filter((e) => {
      return typeof e === 'object';}).map((e) => {
        if(1){
            // medium green
            e.style.color = '#090';
            e.target='_blank';
        }
  });
  highlightPoller();
};

// HACK: don't know how to make this fire on url update for spa,
// so just polling every second to update button status.
var highlightPoller = function() {
  if (true) {
    //update every x milliseconds if we change location.
    timer2 = setTimeout(checkChanges, pollFrequency);
  } else {
    timer2 = setTimeout(highlightPoller, pollFrequency);
  }
};

highlightPoller();

