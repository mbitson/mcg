"use strict";

var mcgApp = angular.module('mcgApp', ['ngRoute', 'ngMaterial', 'ngAnimate', 'angularSpectrumColorpicker', 'ngMdIcons']);

mcgApp.config(function ($routeProvider, $mdThemingProvider) {
   	$routeProvider.when('/', {
        templateUrl: 'templates/color_generator.html',
        controller: 'ColorGeneratorCtrl'
    });
    $mdThemingProvider.definePalette('PaletteName', {
        "50"  : "#ffffe6",
        "100" : "#ffffb3",
        "200" : "#ffff80",
        "300" : "#ffff55",
        "400" : "#ffff2a",
        "500" : "#ffff00",
        "600" : "#dfdf00",
        "700" : "#bfbf00",
        "800" : "#9f9f00",
        "900" : "#808000",
        "A100": "#ffff55",
        "A200": "#ffff55",
        "A400": "#ffff55",
        "A700": "#ffff55"
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('PaletteName');
});