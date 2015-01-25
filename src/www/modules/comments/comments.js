/*
 * The module for the comments view
 * It requires the firebase module
 */
angular.module('ideas.comments', ['ideas.firebase'])

//The controller that handles the comments view
.controller('CommentsCtrl', ['$scope', '$stateParams', 'Firebase', '$timeout', function($scope, $stateParams, Firebase, $timeout) {
	$scope.comment = $stateParams.ideaId; //Figure out which idea we are looking at
	$scope.state  = "load"; //The states of this page: "load" means that the things are loading from the firebase, "ready" means we are ready to display to the user, "invalid" means the data could not be obtained
	var cbSuccess = function(snapshot) {
		$timeout(function() { //Make sure that the page is updated with these changes to it
			$scope.idea = Firebase.intoIdeaVersion(snapshot); //Convert the snapshot to the idea format
			console.log($scope.idea.idea.name);
			$scope.state = "ready"; //We are ready to display to the user
		});
	};
	var cbError = function(error) {
		$timeout(function() { //Make sure that the page is updated with these changes to it
			console.log("Something went wrong!"); //Something went wrong with the operation
			$scope.state = "invalid"; //This url does not lead to a valid idea
		});
	}
	$scope.ref.child("ideas").child($scope.comment).on("value", cbSuccess, cbError); //Set up an event listener for the idea of this page
}])