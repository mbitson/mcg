// Define our default color generator controller!
function DialogExportCtrl($scope, $mdDialog, $timeout, exportObj, single, theme, TopInterpreter)
{
	// Configure export formats
	$scope.formats = [
		{ name: "Android XML", key: 'android'},
		{ name: "Angular JS (Material)", key: 'angularjs'},
		{ name: "Angular JS 2 (Material 2)", key: 'angularjs2'},
		{ name: "Ember Paper", key: 'ember'},
		{ name: "Material Design Lite (SCSS)", key: 'md-lite'},
		{ name: "Material UI (React)", key: 'materialui'},
		{ name: "MCG Reimport", key: 'mcg'},
		{ name: "Vue.js Material Design", key: 'vue'}
	];

	// Set defaults and injected arguements
	$scope.format = "angularjs";
	$scope.theme = theme;
	$scope.exportObj = exportObj;
	$scope.single = single;
	$scope.code = '';

	// Initialize by setting the code to something
	$scope.init = function()
	{
		$scope.setInitialCode();
	};

	// Sets the code to the default format
	$scope.setInitialCode = function()
	{
		$scope.setCodeTo($scope.format);
	};

	// Sets the code to the specified format
	$scope.setCodeTo = function(format)
	{
		var interpretor = TopInterpreter.getInterpreter(format);

		if (interpretor !== false) {
			$scope.code = interpretor.export($scope.exportObj, $scope.theme);
		}else{
			$scope.code = "This format is coming soon!";
		}

		$scope.code = '<pre class="language-none"><code class="code-toolbar line-numbers">'+ $scope.code +'</code></pre>';

		$timeout(function () {
			Prism.highlightAll();
		}, 100);
	};

	// Hides the export dialog window
	$scope.closeDialog = function () {
		$mdDialog.hide();
	};

	// Now that functions are built, fire off export dialog code.
	$scope.init();
}