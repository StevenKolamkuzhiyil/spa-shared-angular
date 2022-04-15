# spa-shared-angular
Angular CDNs with Angular Material for Single-Spa

## Usage:

```
npm install
npm run start
```

Import the angular import map in your root-config.
```
<script type="systemjs-importmap" src="http://localhost:4201/angular-import-map.json"></script>
<script type="systemjs-importmap">
  {
    "imports": {
      "rxjs": "https://cdn.jsdelivr.net/npm/@esm-bundle/rxjs/system/es2015/rxjs.min.js",
      "rxjs/operators": "https://cdn.jsdelivr.net/npm/@esm-bundle/rxjs/system/es2015/rxjs-operators.min.js",
      "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js"
    }
  }
</script>
```

Add the angular dependencies as externals to your Single-Spa Angular application.
```
singleSpaWebpackConfig.externals.push(
  "rxjs",
  "rxjs/operators",
  'single-spa',
  'single-spa-angular',
  /^@angular\/.*/,
);
```

## Warnings:

### Performance:
@angular/core, @angular/compiler and @angular/material dependencies  exceed the recommended size limit (244 KiB).


### System.import() deprecation warning:
```
WARNING in ./node_modules/@angular/core/fesm2015/core.js 29758:15-36
System.import() is deprecated and will be removed soon. Use import() instead.
For more info visit https://webpack.js.org/guides/code-splitting/

WARNING in ./node_modules/@angular/core/fesm2015/core.js 29770:15-102
System.import() is deprecated and will be removed soon. Use import() instead.
For more info visit https://webpack.js.org/guides/code-splitting/

```
Ignore since feature was added in Angular v13 (https://github.com/angular/angular/issues/21560):
```
{
    // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
    // Removing this will cause deprecation warnings to appear.
    test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
    parser: {system: true},  // enable SystemJS
}

```

### Other:
```
WARNING in ./node_modules/@angular/core/fesm2015/core.js 29758:15-36
Critical dependency: the request of a dependency is an expression

WARNING in ./node_modules/@angular/core/fesm2015/core.js 29770:15-102
Critical dependency: the request of a dependency is an expression

```
"Fixed" in Angular v13 since `ContextReplacementPlugin` isn't used (https://github.com/angular/angular/issues/43092#issuecomment-895848535).  


### Credits:
https://github.com/lqc/spa-test

