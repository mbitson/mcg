"use strict";

var mcgApp = angular.module('mcgApp', ['ngRoute', 'ngMaterial', 'ngAnimate', 'angularSpectrumColorpicker', 'ngMdIcons', 'angular-toArrayFilter']);
mcgApp.config(function ($routeProvider, $mdThemingProvider) {
   	$routeProvider.when('/', {
        templateUrl: 'templates/color_generator.html',
        controller: 'ColorGeneratorCtrl'
    });
    $mdThemingProvider.definePalette('clear', {
        "50"  : "#FFFFFF",
        "100" : "#FFFFFF",
        "200" : "#FFFFFF",
        "300" : "#FFFFFF",
        "400" : "#FFFFFF",
        "500" : "#FFFFFF",
        "600" : "#cbcaca",
        "700" : "#aeadad",
        "800" : "#919090",
        "900" : "#747474",
        "A100": "#f8f8f8",
        "A200": "#f4f3f3",
        "A400": "#ecebeb",
        "A700": "#aeadad"
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('clear');
    $mdThemingProvider.theme('dark')
        .primaryPalette('red')
        .accentPalette( 'clear' )
        .dark();
    $mdThemingProvider.theme('red').primaryPalette('red').accentPalette('clear');
    $mdThemingProvider.theme('pink').primaryPalette('pink').accentPalette('clear');
    $mdThemingProvider.theme('purple').primaryPalette('purple').accentPalette('clear');
    $mdThemingProvider.theme('deep-purple').primaryPalette('deep-purple').accentPalette('clear');
    $mdThemingProvider.theme('indigo').primaryPalette('indigo').accentPalette('clear');
    $mdThemingProvider.theme('blue').primaryPalette('blue').accentPalette('clear');
    $mdThemingProvider.theme('light-blue').primaryPalette('light-blue').accentPalette('clear');
    $mdThemingProvider.theme('cyan').primaryPalette('cyan').accentPalette('clear');
    $mdThemingProvider.theme('teal').primaryPalette('teal').accentPalette('clear');
    $mdThemingProvider.theme('green').primaryPalette('green').accentPalette('clear');
    $mdThemingProvider.theme('light-green').primaryPalette('light-green').accentPalette('clear');
    $mdThemingProvider.theme('lime').primaryPalette('lime').accentPalette('clear');
    $mdThemingProvider.theme('yellow').primaryPalette('yellow').accentPalette('clear');
    $mdThemingProvider.theme('amber').primaryPalette('amber').accentPalette('clear');
    $mdThemingProvider.theme('orange').primaryPalette('orange').accentPalette('clear');
    $mdThemingProvider.theme('deep-orange').primaryPalette('deep-orange').accentPalette('clear');
    $mdThemingProvider.theme('brown').primaryPalette('brown').accentPalette('clear');
    $mdThemingProvider.theme('grey').primaryPalette('grey').accentPalette('clear');
    $mdThemingProvider.theme('blue-grey').primaryPalette('blue-grey').accentPalette('clear');
});

/**
 * Filters for modifying colors
 */
mcgApp.filter('darken', function(){
    return function(color){
        return tinycolor( color ).darken( 5 );
    };
});
mcgApp.filter('lighten', function(){
    return function(color){
        return tinycolor( color ).lighten( 5 );
    };
});

// Utility functions
// TODO: Refactor into some sort of helper
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// Configure Zero Clipboard
ZeroClipboard.config({swfPath: "/bower_components/zeroclipboard/dist/ZeroClipboard.swf"});