/*
 * The module for the comments view
 * It requires the firebase module
 */
angular.module('ideas.comments', [])

//The controller that handles the comments view
.controller('CommentsCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
	$scope.comment = $stateParams.ideaId; //Figure out which idea we are looking at
	console.log($scope.comment);
}])