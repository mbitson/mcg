// Define our default color generator controller!
function DemoCtrl($scope, $mdDialog, mdThemingProvider, $mdTheming, AngularJsInterpreter, palettes )
{
	$scope.theme = '';

	$scope.init = function(){

		var demoThemeNames = [];
		angular.forEach(palettes, function(palette, key){
			var jsonObj = AngularJsInterpreter.createAjsPaletteForUse(palette.colors);
			mdThemingProvider.definePalette(palette.name, jsonObj);
			demoThemeNames.push(palette.name);
		});

		//create new theme
		var timestamp = new Date().getUTCMilliseconds();
		var themeName = 'demo' + timestamp;
		mdThemingProvider.theme(themeName)
			.primaryPalette(demoThemeNames[0])
			.accentPalette(demoThemeNames[1]);

		//reload the theme
		$mdTheming.generateTheme(themeName);
		$scope.theme = themeName;

		// Set defaults and demo content
		$scope.menuIcon = 'menu';
		$scope.menuOpen = true;
		$scope.imagePath = 'https://material.angularjs.org/latest/img/list/60.jpeg?0';
		$scope.todos = [
			{
				face: $scope.imagePath,
				what: 'Brunch this weekend?',
				who: 'Min Li Chan',
				when: '3:08PM',
				notes: " I'll be in your neighborhood doing errands"
			},
			{
				face: $scope.imagePath,
				what: 'Brunch this weekend?',
				who: 'Min Li Chan',
				when: '3:08PM',
				notes: " I'll be in your neighborhood doing errands"
			},
			{
				face: $scope.imagePath,
				what: 'Brunch this weekend?',
				who: 'Min Li Chan',
				when: '3:08PM',
				notes: " I'll be in your neighborhood doing errands"
			},
			{
				face: $scope.imagePath,
				what: 'Brunch this weekend?',
				who: 'Min Li Chan',
				when: '3:08PM',
				notes: " I'll be in your neighborhood doing errands"
			},
			{
				face: $scope.imagePath,
				what: 'Brunch this weekend?',
				who: 'Min Li Chan',
				when: '3:08PM',
				notes: " I'll be in your neighborhood doing errands"
			}
		];
	};

	$scope.openSidenavDemo = function(){
		if($scope.menuOpen) {
			$scope.menuIcon = 'menu';
			$scope.menuOpen = false;
		}else {
			$scope.menuOpen = true;
			$scope.menuIcon = 'close';
		}
	};

	$scope.closeDialog = function () {
		$mdDialog.hide();
	};

	$scope.import = function ( code ) {
		$mdDialog.hide( code );
	};

	$scope.init();
}
