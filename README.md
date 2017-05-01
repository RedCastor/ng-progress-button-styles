# ng-progress-button-styles
AngularJS version of <a href="https://github.com/codrops/ProgressButtonStyles" target="_blank">Codrops progress buttons</a>.
I've also made less and sass versions of it besides css.

Source code from https://github.com/akveo/angular-progress-button-styles.
with little change for directive progress-button not take a function with return promise but only take the promise.
The directive watch change of the expression.
Why, the original project not work with ng-submit in form.

**[Demo][]**

Basic usage
---------------
Install bower package:
```bash
bower install --save angular-progress-button-styles
```
Include scripts and styles (I use FontAwesome for success and error icons, but you can override it):
```html
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="bower_components/ng-progress-button-styles/dist/ng-progress-button-styles.min.css">
<script type="text/javascript" src="bower_components/ng-progress-button-styles/dist/ng-progress-button-styles.min.js"></script>
```
Add angular module dependency:
```javascript
var app = angular.module('app', ['ng-progress-button-styles']);
```
Add directive to the button element!
```html
<button ng-progress-button="promise" data-ng-click="someFunction()">Submit</button>
```

That's it! Enjoy the plugin!

Configuration
-------------
The directive itself takes as a parameter promise. If promise returns value progress completes instantly.
You can configure plugin using two different ways:
* Using html attributes
* Using javascript

##### HTML configuration
Here is a list of supported HTML attributes and their meaning:

| Attribute | Available values | Meaning |
|---|---|---------|
| pb-style | <ul><li>fill</li><li>shrink</li><li>rotate-angle-bottom</li><li>rotate-angle-top</li><li>rotate-angle-left</li><li>rotate-angle-right</li><li>rotate-side-down</li><li>rotate-side-up</li><li>rotate-side-left</li><li>rotate-side-right</li><li>rotate-back</li><li>slide-down</li><li>top-line</li><li>move-up</li><li>lateral-lines</li><li>flip-open</li></ul> | Defines button appearance. Default value is <b>fill</b>. |
| pb-direction | <ul><li>horizontal</li><li>vertical</li></ul> | To be used with pb-style=(fill or shrink). Defines the direction of the progress bar.<br/> Default value is <b>horizontal</b>. |
| pb-random-progress | <ul><li>true</li><li>false</li></ul> | Runs random fill function from the moment button is clicked till promise is resolved.<br/> Default value is <b>true</b>. |
| pb-profile | _String value_ | The profile from which to fetch configuration during the button initialization.<br/> For more information look JS configuration section |
 
##### Javascript configuration
For those ones, who don't like to have a lot of configuration in HTML as well to prevent the copy-paste there also is possibility to define configuration in Javascript using profiles.
To do this, you need to inject `ngProgressButtonConfigProvider` during the app configuration:
```javascript
mdl.config(function(ngProgressButtonConfigProvider) {
  ngProgressButtonConfigProvider.profile('testProfile', {
    style: 'shrink',
    direction: 'vertical'
  });
});
```
In this example new profile called 'testProfile' created. You can then apply it to you button like this:
```html
<button ng-progress-button="promise" data-ng-click="someFunction()" pb-profile="testProfile">Submit</button>
```
This would create new button with style _shrink_ and _vertical_ direction.

You can as well define <b>default profile</b>, that will be applied to all the buttons across your application:
```javascript
ngProgressButtonConfigProvider.profile({
  style: 'shrink',
  direction: 'vertical'
});
```


[Demo]: http://redcastor.github.io/ng-progress-button-styles/demo/
