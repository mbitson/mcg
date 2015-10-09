// Define our default color generator controller!
function DialogImportCtrl($scope, $mdDialog, $mdColorPalette )
{
	$scope.code = '';
	$scope.defaultPalettes = $mdColorPalette;
	$scope.closeDialog = function () {
		$mdDialog.hide();
	};
	$scope.import = function ( code ) {
		$mdDialog.hide( code );
	};
}
