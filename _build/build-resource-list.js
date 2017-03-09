#!/usr/bin/env node
/*eslint-env node*/
const walk   = require('walk');
const crypto = require('crypto');
const fs     = require('fs');
// Files to ignore.
const ignore = [
    'vue.js',
    'sw.js',
    'cache-manifest.js',
    '.DS_Store',
    'inline.css',
    'home.css',
    '404.css'
];
// List of resources.
const resourceList = [
    '/'
];

const walkStaticFiles = () => {
    return new Promise((resolve) => {
        const walker = walk.walk('./static');
        const staticFiles = [];

        walker.on('file', (root, fileStats, next) => {
            const name = fileStats.name;
            const path = `${root}/${name}`;

            if (ignore.indexOf(name) !== -1) {
                return next();
            }

            if (name.endsWith('@1x.jpg')) {
                const possibleHigherResVersion =
                    root + '/' + name.replace(/@1x\.jpg/, '@1.5x.jpg');
                try {
                    fs.statSync(possibleHigherResVersion);

                    // Skip this, as there is a higher res version.
                    return next();
                } catch (e) {
                // No worries, just keep on truckin'...
                }
            }

            root = root.replace(/^\./, '');

            if (name.endsWith('.js') || name.endsWith('.css') ||
                                        name.endsWith('.json')) {
                const hash = crypto.createHash('sha256')
                                    .update(fs.readFileSync(path))
                                    .digest('hex');

                const hashedName = name.replace(/\.(.*)$/, `.${hash}.$1`);

                staticFiles.push(`${root}/${hashedName}`);
            } else {
                staticFiles.push(`${root}/${name}`);
            }

            next();
        });

        walker.on('end', () => resolve(staticFiles));
    });
};

Promise.all([
    walkStaticFiles()
]).then(resources => {
    resourceList.push(...resources[0]);

    const manifest = `const cacheManifest = ${JSON.stringify(resourceList, null, 4)}`;
    fs.writeFile('./static/js/cache-manifest.js', manifest);
});
