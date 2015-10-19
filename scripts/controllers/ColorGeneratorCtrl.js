"use strict";

// Define our default color generator controller!
mcgApp.controller('ColorGeneratorCtrl',
function ($scope, $mdDialog, ColourLovers, $rootScope, $mdColorPalette )
{
	// Init function.
	// This is placed into a function
	// for ease-of-use in the future.
	// Often times an app needs to be
	// "Restarted" without a reload.
	$scope.init = function ()
	{
		// Reset palette to default color
		$scope.setDefaultPalette();

		// Define palettes
		$scope.palettes = [];
		$scope.colourlovers = [];

		// Toolbar is hidden by default.
		$scope.initSpeedDial();

		// Add a default palette
		$scope.addPaletteFromObject( $mdColorPalette.indigo );

		// Define theme defaults
		$scope.theme = {
			name: '',
            palettes: $scope.palettes
		};
	};

	$scope.initSpeedDial = function(){
		$scope.dialOpen = false;
	};

	// Function to replace all current palettes with an array of hex values.
	$rootScope.setPalettesByColors = function(colors){
		$scope.palettes = [];
		angular.forEach(colors, function( value ){
			$scope.palette.base = $scope.getLightestBase( '#' + value );
			$scope.addBasePalette();
		});
		$scope.setDefaultPalette();
	};

	// Function to add a palette from import code
	$scope.addPaletteFromJSON = function ( code )
	{
		// Break code into chunks to find JSON
		var chunks = code.split( /[{}]/ );
		var colorsObj = JSON.parse( '{' + chunks[ 1 ] + '}' );

		// Add this palette!
		$scope.addPaletteFromObject(colorsObj);
	};

	// Function to add a palette from
	// a JSON object (angularjs material
	// design format)
	$scope.addPaletteFromObject = function ( objectRef )
	{
		// First, clone object to clean it.
		var paletteObj = angular.copy( objectRef );

		// Init our customized palette values.
		var colors = [];
		var base = $scope.palette.base;

		// Build palette color json format
		angular.forEach( paletteObj, function ( value, key )
		{
			// If this is an object with RGB/Contrast values (Default angularjs palettes)
			if(typeof value == "object")
			{
				// Format it for tinycolor
				value = "rgb(" + value.value[ 0 ] + ", " + value.value[ 1 ] + ", " + value.value[ 2 ] + ")";
			}

			// Regardless, push this color to the colors using tinycolor!
			colors.push( { hex: tinycolor( value ).toHexString(), name: key } );

			// If this key is the base (500), set as base
			if ( key == 500 || key == "500" ) {
				base = value;
			}
		} );

		// Copy the base palette & add our customizations
		var palette = angular.copy( $scope.palette );
		palette.colors = colors;
		palette.base = base;

		// Push to the palette repository.
		$scope.palettes.push( palette );
	};


	// Function to add a palette to palettes.
	$scope.addBasePalette = function()
	{
		// Push on the default and then calculate it's values from it's base.
		$scope.palettes.push(angular.copy($scope.palette));
		$scope.calcPalette($scope.palettes.length-1);

		// Google Analytics Event Track
		ga('send', 'event', 'mcg', 'add_palette');
	};

	// Function to reset palette back to default.
	$scope.setDefaultPalette = function () {
		// Define base palette
		$scope.palette = {
			colors: [],
			orig:   [],
			base:   '#26a69a',
			json:   '',
			name:   ''
		};
	};

	// Function to calculate all colors for all palettes
	$scope.calcPalettes = function(){
		for(var i = 0; i < $scope.palettes.length; i++){
			$scope.calcPalette(i);
		}
	};

	// Function to delete a palette when passed it's key.
	$scope.deletePalette = function(key){
		$scope.palettes.remove(key);
		// Google Analytics Event Track
		ga('send', 'event', 'mcg', 'remove_palette');
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
		return angular.toJson(exportable, null, 4);
	};

	// Function to calculate all colors from base
	$scope.computeColors = function(hex)
	{
		// Return array of color objects.
		return [
			{ hex : tinycolor( hex ).lighten( 52 ).toHexString(), name : '50' },
			{ hex : tinycolor( hex ).lighten( 37 ).toHexString(), name : '100' },
			{ hex : tinycolor( hex ).lighten( 26 ).toHexString(), name : '200' },
			{ hex : tinycolor( hex ).lighten( 12 ).toHexString(), name : '300' },
			{ hex : tinycolor( hex ).lighten( 6 ).toHexString(), name : '400' },
			{ hex : hex, name : '500' },
			{ hex : tinycolor( hex ).darken( 6 ).toHexString(), name: '600' },
			{ hex : tinycolor( hex ).darken( 12 ).toHexString(), name: '700' },
			{ hex : tinycolor( hex ).darken( 18 ).toHexString(), name: '800' },
			{ hex : tinycolor( hex ).darken( 24 ).toHexString(), name: '900' },
			{ hex : tinycolor( hex ).lighten( 52 ).toHexString(), name: 'A100' },
			{ hex : tinycolor( hex ).lighten( 37 ).toHexString(), name: 'A200' },
			{ hex : tinycolor( hex ).lighten( 6 ).toHexString(), name: 'A400' },
			{ hex : tinycolor( hex ).darken( 12 ).toHexString(), name: 'A700' }
		];
	};

	// Function to prevent lightest
	// colors from turning into white.
	// Done by darkening base until the
	// brightest color is no longer #fff.
	$scope.getLightestBase = function(base)
	{
		console.log( "Get lighter base called." );
		console.log( base );
		console.log( tinycolor( base ).lighten( 37 ).toHexString() );
		if( tinycolor( base ).lighten( 52 ).toHexString().toLowerCase() == "#ffffff" ){
			return $scope.getLightestBase( tinycolor( base ).darken( 5 ).toHexString() );
		}else{
			console.log(base);
			console.log("Color determined! Selecting!");
			return base;
		}
	};

    // Function to show theme's full code
    $scope.showThemeCode = function()
    {
	    // Check to see that a theme name and palette names are set.
	    if(
		    typeof $scope.theme.name === 'undefined' || $scope.theme.name.length < 1 ||
		    typeof $scope.palettes[0] === 'undefined' || typeof $scope.palettes[0].name === 'undefined' || $scope.palettes[0].name.length < 1 ||
		    typeof $scope.palettes[1] === 'undefined' || typeof $scope.palettes[1].name === 'undefined' || $scope.palettes[1].name.length < 1
	    ){
		    alert('To generate the code for a theme you must provide a theme name and at least two palettes with names.');
		    return false;
	    }

        // Init return string
        var themeCodeString = '';

        // For each palette, add it's declaration
        for(var i = 0; i < $scope.palettes.length; i++){
            themeCodeString = themeCodeString+$scope.createDefinePalette($scope.palettes[i])+'\n\r';
        }

        // Add theme configuration
        themeCodeString = themeCodeString +
        '$mdThemingProvider.theme(\'' + $scope.theme.name + '\')\n\r\t'+
        '.primaryPalette(\''+$scope.palettes[0].name+'\')\n\r\t'+
        '.accentPalette(\''+$scope.palettes[1].name+'\');'
        +'\n\r';

        // Show clipboard with theme code
        $scope.showClipboard(themeCodeString);

	    // Google Analytics Event Track
	    ga('send', 'event', 'mcg', 'copy_code_theme');
    };

	// Function to regenerate json and show dialog for palette.
	$scope.showPaletteCode = function(palette)
	{
		// Check to see that this palette has a name
		if (
			typeof palette === 'undefined' ||
			typeof palette.name === 'undefined' ||
			palette.name.length < 1
		) {
			alert('To generate the code for a palette the palette must have a name.');
			return false;
		}

		// Generate palette's code
		palette.json = $scope.createDefinePalette(palette);

		// Show code
		$scope.showClipboard(palette.json);

		// Google Analytics Event Track
		ga('send', 'event', 'mcg', 'copy_code_palette');
	};

    // Function to show export json for loading carts later
    $scope.showImport = function()
	{
		$mdDialog
			// Show the dialog to allow import
			.show( {
				templateUrl: 'templates/dialogs/import.html',
				controller: DialogImportCtrl
			} )
			// Once the user clicks import...
			.then( function ( code )
			{
				// ...add the palette!
				if ( typeof code == "object" ) {
					$scope.addPaletteFromObject( code );
				}else{
					$scope.addPaletteFromJSON( code );
				}
			}, function () { } );

		// Google Analytics Event Track
		ga( 'send', 'event', 'mcg', 'import_code' );
    };

	// Function to show generic clipboard alert dialog
	$scope.showClipboard = function(code)
	{
		// TODO: Move these controllers and templates to their own files.
		$mdDialog.show({
			template   : '<md-dialog aria-label="Clipboard dialog">' +
			'  <md-content>' +
			'    <pre>{{code}}</pre>' +
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

		// Google Analytics Event Track
		ga('send', 'event', 'mcg', 'copy_code');

		// TODO: Move these controllers and templates to their own files.
		function ClipboardDialogController($scope, $mdDialog, code)
		{
			$scope.code = code;
			$scope.closeDialog = function () {
				$mdDialog.hide();
			};

			// Configure Zero Clipboard
			var client = new ZeroClipboard(document.getElementById('copy-to-clipboard'));
			client.on('ready', function (event) {
				client.on('copy', function (event) {
					$scope.closeDialog();
				});
			});
		}
	};

	// Function to show generic clipboard alert dialog
	$scope.showColourLovers = function () {
		$mdDialog.show( {
			templateUrl: '/templates/dialogs/colourlovers.html',
			controller: ColourLoversDialogController
		} );

		// Google Analytics Event Track
		ga( 'send', 'event', 'mcg', 'view_colourlovers' );

		function ColourLoversDialogController( $scope, $mdDialog, ColourLovers )
		{
			$scope.init = function(){
				$scope.colourlovers = [];
				$scope.setColors = $rootScope.setPalettesByColors;
				$scope.getTop();
			};

			// Get top colourlover palettes.
			$scope.getTop = function(){
				ColourLovers.getTop().success( function ( data ) {
					$scope.colourlovers = data;
				} );
			};

			// Get new colourlover palettes.
			$scope.getNew = function () {
				ColourLovers.getNew().success( function ( data ) {
					$scope.colourlovers = data;
				} );
			};

			// Get random colourlover palettes.
			$scope.getRandom = function () {
				ColourLovers.getRandom().success( function ( data ) {
					$scope.colourlovers = data;
				} );
			};

			// Function to close dialog
			$scope.closeDialog = function () {
				$mdDialog.hide();
			};

			$scope.init();
		}
	};

    // Function to darken a palette's color.
    $scope.darkenPaletteItem = function(color){
        color.hex = shadeColor(color.hex, -0.1);
    };

    // Function to lighten a palette's color.
    $scope.lightenPaletteItem = function(color){
        color.hex = shadeColor(color.hex, 0.1);
    };

	// Init controller
	$scope.init();
});
