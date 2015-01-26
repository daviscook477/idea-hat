/*
 * The module for the ideas view
 * It requires the firebase module and the ionic module
 */
angular.module('ideas.ideas', ['ideas.firebase', 'ionic'])

//This controller handles the ideas view
.controller('IdeasCtrl', ['$scope', 'Firebase', '$ionicModal', '$ionicPopup', '$state', '$timeout', '$ionicPopover', function($scope, Firebase, $ionicModal, $ionicPopup, $state, $timeout, $ionicPopover) {
  $scope.ideas = []; //An array of all the ideas

  $scope.search = { //Initialize the variable to store the search text
    text: ""
  };

  //This method should be called for each idea that needs to be processed to the list
  $scope.processIdea = function(snapshot) {
    $timeout(function() { //Force angularjs to get updated with the data
      var objToAdd = Firebase.ideaIntoIdeaVersion(snapshot);
      $scope.ideas.push(objToAdd);
    });
  };

  $scope.processRemove = function(snapshot) {
    $timeout(function() {
      var index = null;
      for (var i = 0; i < $scope.ideas.length; i++) {
        if ($scope.ideas[i].name === snapshot.key()) {
          index = i;
          break;
        }
      }
      if (index !== null) {
        $scope.ideas.splice(index, 1);
      }
    });
  }

  //This literally  just loads every idea in the firebase (TODO: something smarter)
  $scope.ref.child('ideas').orderByChild('stamp').on("child_added", $scope.processIdea);
  $scope.ref.child('ideas').on("child_removed", $scope.processRemove);

  $scope.goComments = function(idea) {
    $state.go('main.comments', {ideaId: idea.name});
  };

  $scope.post = { //The text of the post that is posted
    name: null,
    description: null
  };

  //Initialize the post modal and related properties
  $scope.postModalIsClicked = false;
  $ionicModal.fromTemplateUrl("modules/ideas/postModal.html", {
    scope: $scope,
    focusFirstInput: true,
    animation: "slide-in-up"
  }).then(function(modal) {
    $scope.postModal = modal;
  });

  $scope.popover = {};
  $ionicPopover.fromTemplateUrl("modules/ideas/options.html", {scope: $scope}).then(function(popover) {
    $scope.popover = popover;
  })

  $scope.showOptions = function($event, obj) {
    $scope.popover.show($event);
    $scope.obj = obj;
  }

  $scope.options = [ //These get passed to the permissions directive
    {name: 'Edit', do: function(popover, obj) {
      //TODO: edit modal
    }},
    {name: 'Delete', do: function(popover, obj) {
      //Show a confirm popup in the case people accidentally hit delete
      $ionicPopup.confirm({
        title: 'Are you sure you want to delete your idea?'
      }).then(function(resolution) {
        if (resolution) { //If they confirmed
          $scope.ref.child('ideas').child(obj.name).remove();
        } else {
          //Do nothing because they don't want to logout
        }
      }).then(function() {
        popover.hide();
      });
      console.log("delete")
    }}
  ];

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