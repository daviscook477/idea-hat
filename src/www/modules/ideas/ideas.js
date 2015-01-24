/*
 * The module for the ideas view
 * It requires the firebase module and the ionic module
 */
angular.module('ideas.ideas', ['ideas.firebase', 'ionic'])

//This controller handles the ideas view
.controller('IdeasCtrl', ['$scope', 'Firebase', '$ionicModal', '$ionicPopup', '$state', function($scope, Firebase, $ionicModal, $ionicPopup, $state) {
  $scope.ideas = []; //An array of all the ideas

  $scope.search = { //Initialize the variable to store the search text
    text: ""
  };

  $scope.lastIdea = null;

  //This method should be called for each idea that needs to be processed to the list
  $scope.processIdea = function(snapshot) {
    console.log("we are processing an idea now");
      $scope.$apply(function() { //Make sure that angular gets updated with the new data
        var objToAdd = Firebase.getIdea(snapshot);
        $scope.ideas.push(objToAdd);
        $scope.lastIdea = objToAdd; //Set this as the last processed idea
      });
  };
  //TODO: firebase stuff
  //something i hacked together real fast (it loads all of the ideas)
  var numPerLoad = 2;
  var currentLoad = 0;
  $scope.ref.child('ideas').orderByChild('stamp').startAt(0).limitToFirst(numPerLoad).on("child_added", $scope.processIdea);
  currentLoad += numPerLoad;

  $scope.goComments = function(idea) {
    $scope.currentIdea = idea;
    console.log($scope.currentIdea);
    console.log($scope.currentIdea.name);
    $state.go('main.comments');
  };

  //Loads the next set of data
  $scope.loadNext = function() {
    $scope.ref.child('ideas').orderByChild('stamp').startAt(currentLoad).limitToFirst(numPerLoad).on("child_added", $scope.processIdea);
    currentLoad += numPerLoad;
  };

  $scope.post = { //The text of the post that is posted
    name: null,
    description: null
  };

  //Initialize the post modal and related properties
  $scope.postModalIsClicked = false;
  $ionicModal.fromTemplateUrl("modules/ideas/postModal.html", {
    scope: $scope,
    animation: "slide-in-up"
  }).then(function(modal) {
    $scope.postModal = modal;
  });

  //Show the post modal
  $scope.showPost = function() {
    $scope.postModal.show();
  };

  //Hide the post modal
  $scope.hidePost = function() {
    $scope.postModal.hide();
  };

  //Perform the actual posting of the idea
  $scope.doPost = function() {
    if (!$scope.postModalIsClicked) {
      Firebase.postIdea({name: $scope.post.name, description: $scope.post.description}, $scope.ref).then( //Post an idea to the firebase
        function() { //On sucess
        $ionicPopup.alert({title: 'Idea posted!'}).then( //Display a popup that tells the user that the idea was posted
        function () { //What to do when the popup finishes
          $scope.post.name = null; //Reset the forum inputs
          $scope.post.description = null;
          $scope.hidePost(); //Hide the modal
          $scope.postModalIsClicked = false; //the thing is clickable again
        });
      }, function(error) {
        $ionicPopup.alert({title: 'Idea could not be posted!'}).then( //Display a popup that tells failure
        function() { //do stuff when it finishes popup
          $scope.postModalIsClicked = false; //its clickable again
        });
      });
      $scope.postModalIsClicked = true; //it should not be clicked because it is processing
    }
  };

  $scope.doSearch = function() {
    //TODO: search for things
  };
}])