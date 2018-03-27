// ==UserScript==
// @name         Add demo buttons
// @namespace    http://wundes.com/
// @version      2.0.7
// @description  makes buttons
// @author       John Wundes
// @include https://gerrit.nexgen.neustar.biz/*
// @grant        none
// ==/UserScript==

var $$ = document.querySelector.bind(document);
var $$all = document.querySelectorAll.bind(document);
var pollFrequency = 1000; //milliseconds
var timer1;
var loadButtonFunc = function() {
  var menu = document.getElementsByClassName('topmenuTDglue')[0];
  var oldButtonNode = document.getElementById('ns-demo-button-div');
  var projectTitleNode = document.querySelectorAll('#change_infoTable > tbody > tr:nth-child(5) > td > a.gwt-InlineHyperlink');
  var projectTitle = projectTitleNode.length ? projectTitleNode[0].text : '';
  var changeDescriptionDiv = document.getElementsByClassName('com-google-gerrit-client-change-CommitBox_BinderImpl_GenCss_style-text')[0];
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

  var miiBtn = document.createElement('BUTTON');
  miiBtn.style.color = 'white';
  miiBtn.id = 'ns-mii-button';

  var urlMatch = window.location.href.toString().match(/\/(\d+)\/*/);

  if (urlMatch && urlMatch.length === 2) {
    var changeNumber = urlMatch[1];
    var htmlText = document.documentElement.innerHTML;
    var lastStartedIndex = htmlText.lastIndexOf('Build Started');
    var lastSuccessIndex = htmlText.lastIndexOf('SUCCESS');
    var lastMergedIndex = htmlText.lastIndexOf('successfully merged');
    var lastAbandonedIndex = htmlText.lastIndexOf('Abandoned');
    var lastUploadedIndex = htmlText.lastIndexOf('Uploaded');
    var lastUnstableIndex = htmlText.lastIndexOf('Unstable');
    var lastFailureIndex = htmlText.lastIndexOf('FAILURE');
    var devTextNode;
    var gpTextNode;
    var miiTextNode;
    var subSiteFolder = '';

    var devUrl;
    var gpUrl;
    var miiUrl;
    var prefix;
    /*  // NERFing because new structure ignores the /manage prefix...
    // extract a suffix if it exists from the project (distinguish between eng-neuak-ui and eng-neuak-ui-manage) assuming other projects will follow suit.
    var projectStringMatch = document.querySelector('#change_infoTable > tbody > tr:nth-child(5) > td > a.gwt-InlineHyperlink').text.match(/eng-neuak-ui[-]?(\w+)?/);

    if(projectStringMatch && projectStringMatch.length > 1){
        var projectString = projectStringMatch[1];
        subSiteFolder = '/' + projectString;
    }
    */
    devTextNode = document.createTextNode(changeNumber + ' Dev');
    gpTextNode = document.createTextNode(changeNumber + ' GP');
    miiTextNode = document.createTextNode(changeNumber + ' MII');
    gpBtn.style.display = 'none';
    miiBtn.style.display = 'none';
    prefix = projectTitle.indexOf('app-onboarding-portal') !== -1 ? 'onboarding-dev' : 'mip';

    devUrl = 'https://' + prefix + '.dev.agkn.net/gerrit' + changeNumber.toString() + subSiteFolder;
    gpUrl = 'https://' + prefix + '.gp.agkn.net/gerrit' + changeNumber.toString() + subSiteFolder;
    miiUrl = 'https://' + prefix + '.mii.agkn.net/gerrit' + changeNumber.toString() + subSiteFolder;


      var openDevPage = function() {
      window.open(devUrl, '_blank');
    };
    var openGpPage = function() {
      window.open(gpUrl, '_blank');
    };
    var openMiiPage = function() {
      window.open(miiUrl, '_blank');
    };


    if (lastMergedIndex != -1) {
    // no onclick
    devTextNode = document.createTextNode(changeNumber + ' was Merged!');
    devBtn.style.backgroundColor = '#f00';

    } else
    if(lastFailureIndex > lastUploadedIndex && lastStartedIndex < lastFailureIndex){
      devTextNode = document.createTextNode(changeNumber + '  Build FAILURE!');
      devBtn.style.backgroundColor = '#f00';
    } else
    // if a new build is in process, or hasn't been triggered yet.
    if (lastSuccessIndex < lastStartedIndex || lastSuccessIndex === -1) {
      node.opacity = 0.5;
      devBtn.disabled = 'disabled';
      devBtn.style.backgroundColor = '#aaa';
      if(lastUnstableIndex > lastStartedIndex ){
         devTextNode = document.createTextNode('Build Unstable');
      }else{
          devTextNode = document.createTextNode('Building ' + changeNumber);
      }

    } else {
      var commonStyles = {
          border: '2px solid rgba(0, 0, 0, 0.2)',
          borderRadius: '2px',
          backgroundColor: '#5A5',
          cursor: 'pointer',
          boxSizing: 'content-box',
          fontWeight: 'bold',
          margin: '1px 1px 0 0'
      };
      devBtn.onclick = openDevPage;
      Object.assign(devBtn.style, commonStyles);

      gpBtn.onclick = openGpPage;
      Object.assign(gpBtn.style, commonStyles);
      gpBtn.style.display = 'inline';

      miiBtn.onclick = openMiiPage;
      Object.assign(miiBtn.style, commonStyles);
      miiBtn.style.display = 'inline';
    }

      if(lastUploadedIndex != -1 ){
        devBtn.appendChild(devTextNode);
        gpBtn.appendChild(gpTextNode);
        miiBtn.appendChild(miiTextNode);

        devBtn.title = devUrl;
        gpBtn.title = gpUrl;
        miiBtn.title = miiUrl;

        node.appendChild(devBtn);
        node.appendChild(gpBtn);
        node.appendChild(miiBtn);
        menu.appendChild(node);
    }
    var linkedTicketDescription = changeDescriptionDiv.innerHTML
       // replaces any 'XX-NNN' style unless followed by " or < which is how they are replaced in the regex, preventing infinite recursion.
      .replace(/([A-Z]+[-_][0-9]+(?![<"0-9]))/g, '<a style="color:green;text-decoration:underline" href="https://jira.nexgen.neustar.biz/browse/$1" target="_blank">$1</a>')
    ;
    changeDescriptionDiv.innerHTML = linkedTicketDescription;
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
