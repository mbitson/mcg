"use strict";

mcgApp.controller('ColorGeneratorCtrl',
function ($scope, $mdDialog)
{
	$scope.init = function ()
	{
		// Define base palette
		$scope.palette = {
			colors: [],
			orig  : [],
			base  : '#26a69a',
			json  : '',
			name  : 'PaletteName'
		};

		// Define palettes
		$scope.palettes = [];

		// Add base palette
		$scope.addBasePalette();

		// Define theme defaults
		$scope.theme = {
			name: 'My Theme'
		};
	};

	// Function to add a palette to palettes.
	$scope.addBasePalette = function(){
		$scope.palettes.push(angular.copy($scope.palette));
		$scope.calcPalette($scope.palettes.length-1);
	};

	// Function to calculate all colors for all palettes
	$scope.calcPalettes = function(){
		for(var i = 0; i < $scope.palettes.length; i++){
			$scope.calcPalette(i);
		}
	};

	// Function to delete a palette when passed it's key.
	$scope.deletePalette = function(key){
		delete $scope.palettes[key];
	};

	// Function to assign watchers to all bases
	$scope.calcPalette = function(key){
		$scope.palettes[key].orig = $scope.computeColors($scope.palettes[key].base);
		$scope.palettes[key].colors = $scope.palettes[key].orig;
	};

	// Function to make the definePalette code for a palette.
	$scope.createDefinePalette = function(palette){
		return '$mdThemingProvider.definePalette(\'' + palette.name + '\', ' + $scope.makeColorsJson(palette.colors) + ');';
	};

	// Function to make an exportable json array for themes.
	$scope.makeColorsJson = function(colors){
		var exportable = {};
		angular.forEach(colors, function(value, key){
			exportable[value.name] = value.hex;
		});
		return JSON.stringify(exportable, null, 4);
	};

	// Function to calculate all colors from base
	$scope.computeColors = function(color)
	{
		// Return array of color objects.
		return [
			{
				hex: shadeColor(color, 0.9),
				name : '50'
			},
			{
				hex: shadeColor(color, 0.7),
				name : '100'
			},
			{
				hex: shadeColor(color, 0.5),
				name : '200'
			},
			{
				hex: shadeColor(color, 0.333),
				name : '300'
			},
			{
				hex: shadeColor(color, 0.166),
				name : '400'
			},
			{
				hex: shadeColor(color, 0),
				name : '500'
			},
			{
				hex : shadeColor(color, -0.125),
				name: '600'
			},
			{
				hex : shadeColor(color, -0.25),
				name: '700'
			},
			{
				hex : shadeColor(color, -0.375),
				name: '800'
			},
			{
				hex : shadeColor(color, -0.5),
				name: '900'
			},
			{
				hex : shadeColor(color, 0.333),
				name: 'A100'
			},
			{
				hex : shadeColor(color, 0.333),
				name: 'A200'
			},
			{
				hex : shadeColor(color, 0.333),
				name: 'A400'
			},
			{
				hex : shadeColor(color, 0.333),
				name: 'A700'
			}
		];
	};

	// Function to regenerate json and show dialog for palette.
	$scope.showPaletteCode = function(palette){
		palette.json = $scope.createDefinePalette(palette);
		$scope.showClipboard(palette.json);
	};

	// Function to show generic clipboard alert dialog
	$scope.showClipboard = function(code){
		$mdDialog.show({
			template   : '<md-dialog aria-label="Clipboard dialog">' +
			'  <md-content>' +
			'    <pre>{{code}}' +
			'    </pre>' +
			'  </md-content>' +
			'  <div class="md-actions">' +
			'    <md-button ng-click="closeDialog()">' +
			'      Close' +
			'    </md-button>' +
			'  </div>' +
			'</md-dialog>',
			locals     : {
				code: code
			},
			controller : ClipboardDialogController
		});
		function ClipboardDialogController(scope, $mdDialog, code) {
			scope.code = code;
			scope.closeDialog = function () {
				$mdDialog.hide();
			}
		}
	};

	/*
	 * Color utility functions
	 * Source: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
	 */
	function shadeColor(color, percent) {
		var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
		return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
	}
	function darken(color){
		shadeColor(color,-0.1);
	}
	function lighten(color) {
		shadeColor(color,0.1);
	}

	// Init controller
	$scope.init();
});