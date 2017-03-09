'use strict';

import {loadCSS,loadJS} from './_utils';
import * as App from './app';

function loadPageCSS () {
    // Only load the styles if they've not been added already.
    if (document.querySelector('link[href="static/css/app.css"]')) {
        return;
    }
    loadCSS('static/css/app.css');
}

(function () {
    loadPageCSS();
    App.init();
})();
