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
		$scope.imagePath = 'https://avatars3.githubusercontent.com/u/7337773?v=3&s=60';
		$scope.todos = [
			{
				face: $scope.imagePath,
				what: 'Lunch this weekend?',
				who: 'A Famous Person',
				when: '4:22PM',
				notes: "Want to meet up for some grub?"
			},
			{
				face: $scope.imagePath,
				what: 'Lunch this weekend?',
				who: 'A Famous Person',
				when: '4:22PM',
				notes: "Want to meet up for some grub?"
			},
			{
				face: $scope.imagePath,
				what: 'Lunch this weekend?',
				who: 'A Famous Person',
				when: '4:22PM',
				notes: "Want to meet up for some grub?"
			},
			{
				face: $scope.imagePath,
				what: 'Lunch this weekend?',
				who: 'A Famous Person',
				when: '4:22PM',
				notes: "Want to meet up for some grub?"
			},
			{
				face: $scope.imagePath,
				what: 'Lunch this weekend?',
				who: 'A Famous Person',
				when: '4:22PM',
				notes: "Want to meet up for some grub?"
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
