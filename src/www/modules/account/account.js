angular.module('ideas.account', ['ideas.firebase', 'ideas.firebase', 'ionic'])

//The controller for the account side menu
.controller('AccountCtrl', ['$scope', '$state', '$ionicPopup', '$ionicModal', 'Firebase', function($scope, $state, $ionicPopup, $ionicModal, Firebase) {
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
  $ionicModal.fromTemplateUrl("modules/account/loginModal.html", { //Initialize the login modal
    scope: $scope,
    focusFirstInput: true,
    animation: "slide-in-up"
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

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
      Firebase.login($scope.loginText, $scope.ref).then( //Do the login
      function(authData) { //The function for sucess
        $ionicPopup.alert({title: 'Login succeeded!'}).then( //Popup that it suceeded
        function() { //After the popup finishes
          $scope.hideLogin(); //Hide the login modal
          $scope.loginText.email = null; //rest the fields
          $scope.loginText.password = null;
          $scope.loginModalIsClicked = false; //the button is no longer clicked
        });
      }, function(error) { //The function for failure
        $ionicPopup.alert({title: 'Login failed!'}).then( //Popup that it failed
        function() { //After the popup finishes
          $scope.loginModalIsClicked = false; //the button is no longer clicked
        });
      });
      //Set it such that the button has been clicked
      $scope.loginModalIsClicked = true;
    }
  };

  //Initialize the signup modal and associated properties
  $scope.signupModalIsClicked = false;
  $ionicModal.fromTemplateUrl("modules/account/signupModal.html", { //Initialize the signup modal
    scope: $scope,
    focusFirstInput: true,
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
      Firebase.signup($scope.signupText, $scope.ref).then( //Obtain the signup promise and tell it what to do when it resolves or errs
      function() { //On sucess in signup
        Firebase.login($scope.signupText, $scope.ref).then( //They signed up so now we automatically log them in
        function(authData) { //sucess at login
          $ionicPopup.alert({title: 'Sign up succeeded!'}).then( //Display a popup that says they were signed up and logged in
          function() { //After the popup finishes
            $scope.hideSignup(); //When the sucess finishes close the signup popup
            $scope.signupText.email = null; //Reset the email and password signup fields
            $scope.signupText.password = null;
            $scope.signupModalIsClicked = false;
          });
        }, function(err) { //They were not logged in but they did sign up
          $ionicPopup.alert({title: 'Sign up succeeded but login failed!'}).then( //Display a popup to tell them that it failed at login
          function() { //After the popup finishes
            $scope.hideSignup(); //when the popup finishes close out of the signup popup
            $scope.signupText.email = null; //Reset the email and password signup fields
            $scope.signupText.password = null;
            $scope.signupModalIsClicked = false;
          });
        });
      }, function(err) { //The sign up failed
        //Alert the user that the sign up failed
        $ionicPopup.alert({title: 'Sign up failed!'});
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