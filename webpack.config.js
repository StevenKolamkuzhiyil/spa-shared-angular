const ImportMapPlugin = require('webpack-import-map-plugin');
const packageJson = require('./package.json');

const allDeps = Object.keys(packageJson.dependencies);
const allDevDeps = Object.keys(packageJson.devDependencies);
const angularDeps = allDeps.filter(s => s.startsWith('@angular/'))

function createDepsMap(keys) {
    const result = {};
    for (let key of keys) {
        const [scope, baseName] = key.split('/', 2);
        result[`${scope}__${baseName}`] = `./node_modules/${scope}/${baseName}/fesm2015/${baseName}.js`;
        if (key === '@angular/platform-browser') {
            result[`${scope}__${baseName}__animations`] = `./node_modules/${scope}/${baseName}/fesm2015/animations.js`;
        } else if (key === '@angular/animations') {
            result[`${scope}__${baseName}__browser`] = `./node_modules/${scope}/${baseName}/fesm2015/browser.js`;
        }
    }
    return result;
}

module.exports = {
    mode: 'production',
    entry: {
        ...createDepsMap(angularDeps),
        'single-spa-angular': './node_modules/single-spa-angular/fesm2015/single-spa-angular.js',
    },
    output: {
        libraryTarget: 'system',
    },
    module: {
        rules: [
            {
                // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
                // Removing this will cause deprecation warnings to appear.
                // Can be removed when using Angular v13.
                test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                parser: {system: true},  // enable SystemJS
            }
        ]
    },
    externals: [
        'rxjs',
        'rxjs/operators',
        ...allDeps,
        ...allDevDeps,
    ],
    plugins: [
        new ImportMapPlugin({
            transformKeys: (filename) => {
                return filename.replaceAll('__', '/').replace(/\.js$/, '');
            },
            fileName: 'angular-import-map.json',
            baseUrl: './',
        }),
    ],
    optimization: {
        minimize: true,
    },
    devServer: {
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        port: 4201,
        allowedHosts: 'all',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
};
