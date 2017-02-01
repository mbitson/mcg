mcgApp.controller('SettingsCtrl', function($scope, $rootScope, $mdSidenav, $cookies)
{
    // Get settings expire date, 5 years in the future.
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 365*5);

	$scope.settings = $rootScope.settings;

	$scope.$watch('settings.algorithm', function (algorithm) {
		$cookies.put('mcg.settings.algorithm', algorithm, {'expires': expireDate});
	}, true);

	$scope.close = function () {
		$mdSidenav('settings').close();
	};
});