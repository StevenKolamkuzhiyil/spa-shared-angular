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


## Issues:
For some reason the externals don't have access to Class Instances provided in the AppModule. The provided workaround in the example doesn't solve the underlying issue and doesn't guarantee a working `@angular/material` library.

####Example:
```
ERROR Error: Could not find HttpClient provider for use with Angular Material icons. Please include the HttpClientModule from @angular/common/http in your app imports.
    at p (@angular__material__icon.js:727:3216)
    at g._fetchIcon (@angular__material__icon.js:727:8373)
    at g._loadSvgIconFromConfig (@angular__material__icon.js:727:6880)
    at g._getSvgFromConfig (@angular__material__icon.js:727:6022)
    at getNamedSvgIcon (@angular__material__icon.js:727:5573)
    at O._updateSvgIcon (@angular__material__icon.js:734:4965)
    at O.set svgIcon [as svgIcon] (@angular__material__icon.js:734:2070)
    at yc (@angular__core.js:572:21212)
    at @angular__core.js:572:12339
    at Ka (@angular__core.js:572:12381)
```

Workaround:
Provide the HttpClientModule to the MatIconRegistry by manually injecting it.
```
{
  provide: MatIconRegistry,
  useFactory: (httpClient: HttpClient, domSanitizer: DomSanitizer, document: Document, errorHandler: ErrorHandler) =>
    new MatIconRegistry(httpClient, domSanitizer, document, errorHandler),
  deps: [HttpClient, DomSanitizer, DOCUMENT, ErrorHandler]
}
```


## Credits:
https://github.com/lqc/spa-test

