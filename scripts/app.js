"use strict";

// Build app
var mcgApp = angular.module('mcgApp',
    [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'angularSpectrumColorpicker',
        'ngMdIcons',
        'angular-toArrayFilter',
        'ngSanitize',
        'ngCookies'
    ]
);

// Configure
mcgApp.config(function ($routeProvider, $mdThemingProvider, $sceDelegateProvider, $provide)
{
    // Configure routes.
   	$routeProvider.when('/', {
        templateUrl: 'templates/color_generator.html',
        controller: 'ColorGeneratorCtrl'
    });

    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://www.colourlovers.com/api/**'
    ]);

    // Watch for theme updates to dynamically change the theme.
    $mdThemingProvider.generateThemesOnDemand(true);

    // Configure themes.
    $mdThemingProvider.definePalette('clear', { "50": "#FFFFFF", "100": "#FFFFFF", "200": "#FFFFFF", "300": "#FFFFFF", "400": "#FFFFFF", "500": "#FFFFFF", "600": "#cbcaca", "700": "#aeadad", "800": "#919090", "900": "#747474", "A100": "#f8f8f8", "A200": "#f4f3f3", "A400": "#ecebeb", "A700": "#aeadad" } );
    $mdThemingProvider.theme('default').primaryPalette('red').accentPalette('clear');
    $mdThemingProvider.theme('dark').primaryPalette('red').accentPalette( 'clear' ).dark();

    // Set default palettes as themes for use in UI.
    $mdThemingProvider.theme('red').primaryPalette('red').accentPalette('clear').backgroundPalette('red');
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

    // Save the theming provider for later use
    $provide.value('mdThemingProvider', $mdThemingProvider);
}).run(function($rootScope, $location, $window, $mdTheming)
{
    // initialise google analytics
    $window.ga('create', 'UA-62237624-1', 'auto');

    // track index view
    $window.ga('send', 'pageview', 'mcg_index');

    // track pageview on state change
    $rootScope.$on('$stateChangeSuccess', function (event) {
        $window.ga('send', 'pageview', $location.path());
    });

    $mdTheming.generateTheme('default');
    $mdTheming.generateTheme('dark');
    $mdTheming.generateTheme('red');
    $mdTheming.generateTheme('pink');
    $mdTheming.generateTheme('purple');
    $mdTheming.generateTheme('deep-purple');
    $mdTheming.generateTheme('indigo');
    $mdTheming.generateTheme('blue');
    $mdTheming.generateTheme('light-blue');
    $mdTheming.generateTheme('cyan');
    $mdTheming.generateTheme('teal');
    $mdTheming.generateTheme('green');
    $mdTheming.generateTheme('light-green');
    $mdTheming.generateTheme('lime');
    $mdTheming.generateTheme('yellow');
    $mdTheming.generateTheme('amber');
    $mdTheming.generateTheme('orange');
    $mdTheming.generateTheme('deep-orange');
    $mdTheming.generateTheme('brown');
    $mdTheming.generateTheme('grey');
    $mdTheming.generateTheme('blue-grey');
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

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}