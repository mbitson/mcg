"use strict";

var mcgApp = angular.module('mcgApp', ['ngRoute', 'ngMaterial', 'ngAnimate', 'angularSpectrumColorpicker', 'ngMdIcons']);
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
        .accentPalette('clear')
        .dark();
});

/*
 * Color utility functions
 * Source: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 */
function shadeColor(color, percent) {
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}
mcgApp.filter('darken', function(){
    return function(color){
        return shadeColor(color,-0.1);
    };
});
mcgApp.filter('lighten', function(){
    return function(color){
        return shadeColor(color,0.1);
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