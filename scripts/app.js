"use strict";

var mcgApp = angular.module('mcgApp', ['ngRoute', 'ngMaterial', 'ngAnimate']);

mcgApp.config(function ($routeProvider) {
   	$routeProvider.when('/', {
        templateUrl: 'templates/color_generator.html',
        controller: 'ColorGeneratorCtrl'
    })
});

