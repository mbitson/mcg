// Define our default color generator controller!
function AboutCtrl($scope, $mdDialog )
{
	$scope.closeDialog = function () {
		$mdDialog.hide();
	};
}
