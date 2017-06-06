// ==UserScript==
// @name         Indicate Prod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  visual indicator for when on a prod page
// @author       John Wundes
// @match        https://classic.p1.neustar.biz/*
// @match        https://dashboard.p1.neustar.biz/*
// @match        https://management-api.p1.neustar.biz/*
// @match        https://ui-api.p1.neustar.biz/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var borderColor='rgba(170,50,0,0.5)';
    var borderSize=50;
    document.getElementsByTagName('body')[0].setAttribute("style","box-shadow: inset 0 0 0 "+borderSize+"px "+borderColor+";");
})();
