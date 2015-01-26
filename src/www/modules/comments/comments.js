/*
 * The module for the comments view
 * It requires the firebase module
 */
angular.module('ideas.comments', ['ideas.firebase'])

//The controller that handles the comments view
.controller('CommentsCtrl', ['$scope', '$stateParams', 'Firebase', '$timeout', function($scope, $stateParams, Firebase, $timeout) {
	$scope.commentId = $stateParams.ideaId; //Figure out which idea we are looking at
	$scope.comment = { //The input field for the comment
		text: null
	};
	$scope.state  = "load"; //The states of this page: "load" means that the things are loading from the firebase, "ready" means we are ready to display to the user, "invalid" means the data could not be obtained
	var doError = function() {
		console.log("Something went wrong! Most likely invalid URL!"); //Something went wrong with the operation
		$scope.state = "invalid"; //This url does not lead to a valid idea
	}
	var cbSuccess = function(snapshot) {
		$timeout(function() { //Make sure that the page is updated with these changes to it
			if (snapshot.val() !== null) {
				$scope.idea = Firebase.ideaIntoIdeaVersion(snapshot); //Convert the snapshot to the idea format
				$scope.state = "ready"; //We are ready to display to the user
			} else {
				doError();
			}
		});
	};
	var cbError = function(error) {
		$timeout(function() { //Make sure that the page is updated with these changes to it
			doError();
		});
	}
	$scope.ref.child("ideas").child($scope.commentId).on("value", cbSuccess, cbError); //Set up an event listener for the idea of this page
	$scope.comments = [];
	$scope.ref.child("ideas").child($scope.commentId).child("data").child("comments").on("child_added", function(snapshot) {
		$timeout(function() {
			$scope.comments.push(Firebase.commentIntoIdeaVersion(snapshot));
		});
	});

	$scope.doPost = function() {
		Firebase.postComment($scope.idea, $scope.comment, $scope.ref);
		$scope.comment = { //Reset the comment field after it has been posted
			text: null
		};
	};
}]);