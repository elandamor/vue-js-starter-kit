#!/usr/bin/env node

const fs = require('fs');
const CleanCSS = require('clean-css');
const files = [
    'static/css/inline.css',
    'static/css/app.css',
    'static/css/home.css'
];
const opts = {
    keepSpecialComments: 1
};

files.forEach(f => {
    fs.writeFileSync(f, new CleanCSS(opts).minify([f]).styles, 'utf8');
});
