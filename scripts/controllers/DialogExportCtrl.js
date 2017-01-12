// Define our default color generator controller!
function DialogExportCtrl($scope, $mdDialog, $timeout, exportObj, single, theme)
{
	$scope.formats = [
		{
			name: "Android XML",
			key: 'android'
		},
		{
			name: "Angular JS (Material)",
			key: 'angularjs'
		},
		{
			name: "Angular JS 2 (Material 2)",
			key: 'angularjs2'
		},
		{
			name: "Ember Paper",
			key: 'ember'
		},
		{
			name: "Material Design Lite (SCSS)",
			key: 'md-lite'
		},
		{
			name: "Material UI (React)",
			key: 'materialui'
		},
		{
			name: "MCG Reimport",
			key: 'mcg'
		}
	];
	$scope.format = "angularjs";
	$scope.theme = theme;
	$scope.exportObj = exportObj;
	$scope.single = single;
	$scope.code = '';

	$scope.init = function() {
		$scope.setInitialCode();
	};

	$scope.setInitialCode = function(){
		$scope.setCodeTo($scope.format);
	};

	$scope.setCodeTo = function(format){

		// Depending on the format desired, fire the appropriate formater or return a coming soon message
		switch(format){
			case "angularjs":
				$scope.setCodeToAngularJS();
				break;
			case "angularjs2":
				$scope.setCodeToAngularTwo();
				break;
			case "materialui":
				$scope.setCodeToMaterialUI();
				break;
			case "android":
				$scope.setCodeToAndroid();
				break;
			case "md-lite":
				$scope.setCodeToMdLite();
				break;
			case "ember":
				$scope.setCodeToEmber();
				break;
			case "mcg":
				$scope.setCodeToMcg();
				break;
			default:
				$scope.code = "This format is coming soon!";
		}

		$scope.code = '<pre class="language-none"><code class="code-toolbar line-numbers">'+ $scope.code +'</code></pre>';

		$timeout(function () {
			Prism.highlightAll();
		}, 100);
	};

	/*
	 * MCG Formatting functions
	 */
	$scope.setCodeToMcg = function () {
		$scope.code = JSON.stringify(angular.copy($scope.exportObj), null, 2);
	};

	/*
	 * Angular JS formatting functions
	 */
	$scope.setCodeToAngularJS = function(){
		if($scope.single === true) {
			// Generate palette's code
			$scope.exportObj.json = $scope.createAjsPaletteCode($scope.exportObj);
			$scope.code = $scope.exportObj.json;
		}else{
			// Init return string
			var themeCodeString = '';

			// For each palette, add it's declaration
			for(var i = 0; i < $scope.exportObj.length; i++){
				themeCodeString = themeCodeString+$scope.createAjsPaletteCode($scope.exportObj[i])+'\n';
			}

			// Add theme configuration
			$scope.code = themeCodeString +
				'$mdThemingProvider.theme(\'' + $scope.theme.name + '\')\n'+
				'    .primaryPalette(\''+$scope.exportObj[0].name+'\')\n'+
				'    .accentPalette(\''+$scope.exportObj[1].name+'\');';
		}
	};
	
	// Function to make the definePalette code for a palette.
	$scope.createAjsPaletteCode = function(palette){
		return '$mdThemingProvider.definePalette(\'' + palette.name + '\', ' + $scope.createAjsPaletteJson(palette.colors) + ');';
	};

	// Function to make an exportable json array for themes.
	$scope.createAjsPaletteJson = function(colors){
		var exportable = {};
		var darkColors = [];
		angular.forEach(colors, function(value, key){
			exportable[value.name] = value.hex;
			if (value.darkContrast) {
				darkColors.push(value.name);
			}
		});
		exportable.contrastDefaultColor = 'light';
		exportable.contrastDarkColors = darkColors.join(' ');
		return angular.toJson(exportable, 2).replace(/"/g, "'");
	};

	/*
	 * AngularJS 2
	 * Material 2 Formatting Functions
	 */
	$scope.setCodeToAngularTwo = function () {
		var themeCodeString = '/* For use in src/lib/core/theming/_palette.scss */\n';
		if ($scope.single === true) {
			// Generate palette's code
			themeCodeString = $scope.createMTwoPaletteCode($scope.exportObj);
		} else {
			// For each palette, add it's declaration
			for (var i = 0; i < $scope.exportObj.length; i++) {
				themeCodeString = themeCodeString + $scope.createMTwoPaletteCode($scope.exportObj[i]);
			}
		}

		$scope.code = themeCodeString;
	};

	$scope.createMTwoPaletteCode = function (palette) {
		var code = '';

		// Generate base colors
		code += '$md-' + palette.name + ': (\n';
		angular.forEach(palette.colors, function (value, key) {
			code += "    '"+value.name+"' : " + tinycolor(value.hex).toHexString() + ',\n';
		});

		// Generate the contrast variables
		code += '    \'contrast\': (\n';
		angular.forEach(palette.colors, function (value, key) {
			if(value.darkContrast) {
				var contrast = '#000000';
			}else{
				var contrast = '#ffffff';
			}
			code += "        '" + value.name + "' : " + contrast + ',\n';
		});
		code += '    )\n';

		code += ');\n\n';

		return code;
	};

	/*
	 * Android formatting functions
	 */
	$scope.setCodeToAndroid = function(){
		if($scope.single === true) {
			// Generate palette's code
			themeCodeString = $scope.createAndroidPaletteCode($scope.exportObj);
		}else{
			// Init return string
			var themeCodeString = '';

			// For each palette, add it's declaration
			for(var i = 0; i < $scope.exportObj.length; i++){
				themeCodeString = themeCodeString + $scope.createAndroidPaletteCode($scope.exportObj[i]);
			}
		}

		// Add XML parent node
		$scope.code = escapeHtml('<resources>\n'+themeCodeString+'<resources>');
	};

	$scope.createAndroidPaletteCode = function(palette){
		var code = '';
		angular.forEach(palette.colors, function(value, key){
			code += '     <color name="'+palette.name+'_'+value.name+'">'+value.hex+'</color>\n';
		});
		return code;
	};

	/*
	 * Material Design Lite (SCSS)
	 */
	$scope.setCodeToMdLite = function () {
		var themeCodeString = '/* For use in _color-definitions.scss */\n';
		if ($scope.single === true) {
			// Generate palette's code
			themeCodeString = $scope.createMdLitePaletteCode($scope.exportObj);
		} else {
			// For each palette, add it's declaration
			for (var i = 0; i < $scope.exportObj.length; i++) {
				themeCodeString = themeCodeString + $scope.createMdLitePaletteCode($scope.exportObj[i]);
			}
		}

		$scope.code = themeCodeString;
	};

	$scope.createMdLitePaletteCode = function (palette) {
		var code = '';

		// Generate the palette container for scss
		code += '$palette-' + palette.name + ':\n';
		angular.forEach(palette.colors, function (value, key) {
			code += tinycolor(value.hex).toRgbString() + '\n';
		});
		code += ';';

		// Generate the scss variables
		code += '\n\n';
		angular.forEach(palette.colors, function (value, key) {
			code += '$palette-' + palette.name + '-' + value.name + ': nth($palette-' + palette.name + ', ' + (key + 1) + ');\n';
		});
		code += '\n\n';

		return code;
	};

	/*
	 * Ember Paper Formatting Functions
	 */
	$scope.setCodeToEmber = function () {
		var themeCodeString = '/* For use in app/styles/color-palette.scss */\n';
		if ($scope.single === true) {
			// Generate palette's code
			themeCodeString = $scope.createEmberPaletteCode($scope.exportObj);
		} else {
			// For each palette, add it's declaration
			for (var i = 0; i < $scope.exportObj.length; i++) {
				themeCodeString = themeCodeString + $scope.createEmberPaletteCode($scope.exportObj[i]);
			}
		}

		$scope.code = themeCodeString;
	};

	$scope.createEmberPaletteCode = function (palette) {
		var code = '';

		// Generate base colors
		code += '$color-' + palette.name + ': (\n';
		angular.forEach(palette.colors, function (value, key) {
			code += "    '" + value.name + "' : " + tinycolor(value.hex).toHexString() + ',\n';
		});

		if (palette.colors[5].darkContrast) {
			var contrast = '#000000';
		} else {
			var contrast = '#ffffff';
		}

		// Generate the contrast variables
		code += '    \'contrast\': ' + contrast + '\n';

		code += ') !default;\n\n';

		return code;
	};

	/*
	 * Material UI (React) Formatting Functions
	 */
	$scope.setCodeToMaterialUI = function () {
		var themeCodeString = '/* For use in app/styles/color-palette.scss */\n';
		if ($scope.single === true) {
			// Generate palette's code
			themeCodeString = $scope.createMaterialUIPaletteCode($scope.exportObj);
		} else {
			// For each palette, add it's declaration
			for (var i = 0; i < $scope.exportObj.length; i++) {
				themeCodeString = themeCodeString + $scope.createMaterialUIPaletteCode($scope.exportObj[i]);
			}
		}

		$scope.code = themeCodeString;
	};

	$scope.createMaterialUIPaletteCode = function (palette) {
		var code = '\n';

		// Generate base colors
		angular.forEach(palette.colors, function (value, key) {
			code += "export const " + palette.name + value.name + " = '" + tinycolor(value.hex).toHexString() + '\';\n';
		});

		return code;
	};
	
	$scope.closeDialog = function () {
		$mdDialog.hide();
	};

	$scope.init();
}
