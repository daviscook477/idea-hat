/*
 * The module for the comments view
 * It requires the firebase module
 */
angular.module('ideas.comments', [])

//The controller that handles the comments view
.controller('CommentsCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.comment = $routeParams.ideaId; //Figure out which idea we are looking at
}])