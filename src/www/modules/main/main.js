//The module for the main view
angular.module('ideas.main', ['ionic'])

//The controller for the main view
.controller('MainCtrl', ['$scope', '$ionicSideMenuDelegate', function($scope, $ionicSideMenuDelegate) {
	$scope.toggleSide = function() {
		$ionicSideMenuDelegate.toggleLeft();
	}
}]);