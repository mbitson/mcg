"use strict";

mcgApp.controller('ColorGeneratorCtrl',
function ($scope) {
	$scope.mColors = [];
	$scope.baseColor = "#26a69a";
	$scope.mColorsExportable = [];
	$scope.$watch('baseColor', function(newValue, oldValue){
		if($scope.rgbColor !== null){
			$scope.mColorsCalculated = $scope.computeColors($scope.baseColor);
			$scope.mColors = $scope.mColorsCalculated;
			$scope.mColorsExportable = $scope.makeExportable($scope.mColors);
		}
	});

	// Function to make an exportable json array for themes.
	$scope.makeExportable = function(colors){
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
				hex: shadeColor(color, 0.25),
				name : '300'
			},
			{
				hex: shadeColor(color, 0.125),
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
			}
		];
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
});