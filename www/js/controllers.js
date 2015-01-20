angular.module('ideas.controllers', [])

.controller('MainCtrl', function($scope) {
  //TODO: logic at the application level
  $scope.ref = new Firebase("https://idea0.firebaseio.com");
})

.controller('IdeasCtrl', ['$scope', 'Convert', '$ionicModal', '$ionicPopup', function($scope, Convert, $ionicModal, $ionicPopup) {
  $scope.ideas = []; //The list of ideas that are displayed. This will be updated by other things in the app
  $scope.search = { //Initialize the variable to store the search text
    text: ""
  };
  //Set up some firebase triggers
  //We order it by the search term. the search term must be in lower case
  //When the app is first booted up show everything
  $scope.ref.child("ideas").on("child_added", function(snapshot) { //The on recieving an object trigger
    var post = Convert.toNormal(snapshot.val()); //Convert the data from the firebase to the human readable stuff
    $scope.ideas.push(post);
    //TODO: figure out why I had to do this band-aid
    $scope.$apply(); //Refresh the page. Looks like the is automatically called when I add data. But when it first loads data, it wouldn't actually refresh the page without me manually doing this
  });
  $scope.post = { //The text of the ost that is posted
    name: null,
    description: null
  };
  //Initialize the post modal and related properties
  $scope.postModalIsClicked = false;
  $ionicModal.fromTemplateUrl("templates/tab-ideas-postModal.html", {
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
  $scope.doPost = function() {
    var auth = $scope.ref.getAuth();
    var toPost;
    if (auth !== null) {
      toPost = new Convert.toFirebase( {name: $scope.post.name, description: $scope.post.description, user: $scope.ref.getAuth().uid} );
    }
    else {
      toPost = new Convert.toFirebase( {name: $scope.post.name, description: $scope.post.description, user: null} );
    }
    $scope.ref.child("ideas").push(toPost, function(error) { //Post the data
      if (error) {
        $ionicPopup.alert({ //Tell the user that it had an error
            title: 'Post failed!'
          });
      } else { //No error, posted sucess
        $scope.post.name = null; //reset the thingies
        $scope.post.description = null;
        $scope.hidePost();
      }
    });
  };
  $scope.doSearch = function() {
    //reset the list of ideas
    $scope.ideas = [];
    var searchTerm = $scope.search.text.toLowerCase(); //Put the search term in lower case because the firebase is all in lowercase
    //TODO: make sure the search term is valid
    //Now we will set up the firebase stuff
    $scope.ref.off();
    if (searchTerm === "") { //search everything
      $scope.ref.child("ideas").on("child_added", function(snapshot) {
        var post = Convert.toNormal(snapshot.val()); //Convert the data from the firebase to the human readable stuff
        $scope.ideas.push(post);
      });
    } else {
      $scope.ref.child("ideas").orderByChild(searchTerm).on("child_added", function(snapshot) {
        if (snapshot.val().hasOwnProperty(searchTerm)) {
          var post = Convert.toNormal(snapshot.val()); //Convert the data from the firebase to the human readable stuff
          console.log(post.name);
          $scope.ideas.push(post);
        }
      });
    }
  };
}])

//Another note: I think using a side menu for the account stuff would be very cool. That way its more easily accessable and you always have view over the ideas portion of the app

.controller('AccountCtrl', ['$scope', '$state', '$ionicPopup', '$ionicModal', 'Login', function($scope, $state, $ionicPopup, $ionicModal, Login) {
  $scope.loginText = { //The login data that is altered by the text input fields
    email: null,
    password: null
  };
  $scope.signupText = { //The signup data that is altered by the text fields
    email: null,
    password: null
  };
  //Initialize the login modal and associated properties
  $scope.loginModalIsClicked = false;
  $ionicModal.fromTemplateUrl("templates/tab-account-loginModal.html", { //Initialize the login modal
    scope: $scope,
    animation: "slide-in-up"
  }).then(function(modal) {
    $scope.loginModal = modal;
  });
  $scope.goIdeas = function() {
    $state.go('ideas');
  }
  //Show the modal
  $scope.showLogin = function() {
      $scope.loginModal.show();
  };
    //Hide the modal
  $scope.hideLogin = function() {
      $scope.loginModal.hide();
  };
    //Do an actual login
  $scope.doLogin = function() {
    //TODO: check input formatting
    if (!$scope.loginModalIsClicked) { //Don't let the user click to login multiple times
      Login.login($scope.loginText, $scope.ref).then(function(authData) {
        $ionicPopup.alert({
          title: 'Login succeeded!'
        }).then(function() {
          $scope.hideLogin(); //Hide the login modal
          $scope.loginText.email = null; //rest the fields
          $scope.loginText.password = null;
          $scope.loginModalIsClicked = false;
        }, function(error) {
          $ionicPopup.alert({
            title: 'Login failed!'
          });
          $scope.loginModalIsClicked = false;
        });
        $scope.loginModalIsClicked = true;
      });
    }
  };
  //Initialize the signup modal and associated properties
  $scope.signupModalIsClicked = false;
  $ionicModal.fromTemplateUrl("templates/tab-account-signupModal.html", { //Initialize the signup modal
    scope: $scope,
    animation: "slide-in-up"
  }).then(function(modal) {
    $scope.signupModal = modal;
  });
  //Show the modal
  $scope.showSignup = function() {
      $scope.signupModal.show();
  };
    //Hide the modal
  $scope.hideSignup = function() {
      $scope.signupModal.hide();
  };
    //Do an actual signup
  $scope.doSignup = function() {
    //TODO: check input formatting
    if (!$scope.signupModalIsClicked) { //Don't let the user send multiple signup requests if they click tons of times
      Login.signup($scope.signupText, $scope.ref).then(function() { //Obtain the signup promise and tell it what to do when it resolves or errs
        //They signed up so now we automatically log them in
        Login.login($scope.signupText, $scope.ref).then(function(authData) {
          $ionicPopup.alert({
            title: 'Sign up succeeded!'
          }).then(function() { //Display a popup that says they were signed up and logged in
            $scope.hideSignup(); //When the sucess finishes close the signup popup
            $scope.signupText.email = null; //Reset the email and password signup fields
            $scope.signupText.password = null;
            $scope.signupModalIsClicked = false;
          });
        }, function(err) { //They were not logged in but they did sign uo
          $ionicPopup.alert({
            title: 'Sign up succeeded but login failed!'
          }).then(function() { //Tell them that
            $scope.hideSignup(); //when the popup finishes close out of the signup popup
            $scope.signupText.email = null; //Reset the email and password signup fields
            $scope.signupText.password = null;
            $scope.signupModalIsClicked = false;
          });
        });

      }, function(err) { //The sign up failed
        //Alert the user that the sign up failed
        $ionicPopup.alert({
          title: 'Sign up failed!'
        });
        $scope.signupModalIsClicked = false; //The signup failed so let the user try again
      });
      $scope.signupModalIsClicked = true; //This button has been clicked
    }
  };
  //Logs the user out. It displays a confirmation popup to make sure the user really wants to logout
  $scope.logout = function() {
    //Show a confirm popup in the case people accidentally hit logout
    $ionicPopup.confirm({
      title: 'Are you sure you want to logout?'
    }).then(function(resolution) {
      if (resolution) { //If they confirmed
        $scope.ref.unauth(); //Logout by firebase
      } else {
        //Do nothing because they don't want to logout
      }
    })
  };
}]);