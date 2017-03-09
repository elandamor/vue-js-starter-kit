'use strict';

export function loadJS (url, async) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = url;
        if (typeof async !== 'undefined') {
            script.async = async;
        }

        script.onerror = reject;
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

export function loadCSS (url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.returnType = 'text';
        xhr.onload = function () {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            document.head.appendChild(link);
            resolve();
        };
        xhr.onerror = reject;
        xhr.open('get', url);
        xhr.send();
    });
}

export function lazyloadImage (el) {
    return new Promise(function(resolve) {
        let img = new Image(),
            src = el.getAttribute('data-src');

        img.onload = function() {
            if (el.parent)
                el.parent.replaceChild(img, el);
            else
                el.src = src;

            resolve(el);
        };

        img.src = src;
    });
}

/**
 * Gets the parameters from a url and stores them as an object.
 * @param {String} url
 * @return {Object} object
 * @credits Yaphi Berhanu - https://simplestepscode.com/
 * @source https://www.sitepoint.com/get-url-parameters-with-javascript/
 */
export function _getParams (url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i=0; i<arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function(v) {
                paramNum = v.slice(1,-1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof(a[1])==='undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}

/**
 * Generates a formatted parameter string for XHR/Fetch.
 * @param {Object} data - XHR event
 * @return {String} params - string of parameters
 */
export function _setParams(data) {
    let params = new Array();

    for(let obj in data) {
        if(!data.hasOwnProperty(obj))
            continue;

        params.push(`${obj}=${data[obj]}`);
    }

    return params.join('&');
}
