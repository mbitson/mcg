"use strict";

var mcgApp = angular.module('mcgApp', ['ngRoute', 'ngMaterial', 'ngAnimate', 'angularSpectrumColorpicker', 'ngMdIcons']);
mcgApp.config(function ($routeProvider, $mdThemingProvider) {
   	$routeProvider.when('/', {
        templateUrl: 'templates/color_generator.html',
        controller: 'ColorGeneratorCtrl'
    });
    $mdThemingProvider.definePalette('darkest', {
        "50": "#e6e6e6",
        "100": "#b3b3b3",
        "200": "#808080",
        "300": "#555555",
        "400": "#2a2a2a",
        "500": "#000000",
        "600": "#000000",
        "700": "#000000",
        "800": "#000000",
        "900": "#000000",
        "A100": "#555555",
        "A200": "#555555",
        "A400": "#555555",
        "A700": "#555555"
    });
    $mdThemingProvider.definePalette('dark', {
        "50": "#e9e9e9",
        "100": "#bebebe",
        "200": "#939393",
        "300": "#6e6e6e",
        "400": "#4a4a4a",
        "500": "#262626",
        "600": "#212121",
        "700": "#1d1d1d",
        "800": "#181818",
        "900": "#131313",
        "A100": "#6e6e6e",
        "A200": "#6e6e6e",
        "A400": "#6e6e6e",
        "A700": "#6e6e6e"
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('darkest')
        .accentPalette('dark')
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