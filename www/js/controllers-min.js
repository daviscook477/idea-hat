angular.module("ideas.controllers",[]).controller("MainCtrl",function($scope){$scope.ref=new Firebase("https://idea0.firebaseio.com")}).controller("IdeasCtrl",["$scope","Convert","$ionicModal","$ionicPopup",function($scope,Convert,$ionicModal,$ionicPopup){$scope.ideas=[];$scope.search={text:""};$scope.ref.child("ideas").on("child_added",function(snapshot){var post=Convert.toNormal(snapshot.val());$scope.ideas.push(post);$scope.$apply()});$scope.post={name:null,description:null};$scope.postModalIsClicked=
false;$ionicModal.fromTemplateUrl("templates/tab-ideas-postModal.html",{scope:$scope,animation:"slide-in-up"}).then(function(modal){$scope.postModal=modal});$scope.showPost=function(){$scope.postModal.show()};$scope.hidePost=function(){$scope.postModal.hide()};$scope.doPost=function(){var auth=$scope.ref.getAuth();var toPost;if(auth!==null)toPost=new Convert.toFirebase({name:$scope.post.name,description:$scope.post.description,user:$scope.ref.getAuth().uid});else toPost=new Convert.toFirebase({name:$scope.post.name,
description:$scope.post.description,user:null});$scope.ref.child("ideas").push(toPost,function(error){if(error)$ionicPopup.alert({title:"Post failed!"});else{$scope.post.name=null;$scope.post.description=null;$scope.hidePost()}})};$scope.doSearch=function(){$scope.ideas=[];var searchTerm=$scope.search.text.toLowerCase();$scope.ref.off();if(searchTerm==="")$scope.ref.child("ideas").on("child_added",function(snapshot){var post=Convert.toNormal(snapshot.val());$scope.ideas.push(post)});else $scope.ref.child("ideas").orderByChild(searchTerm).on("child_added",
function(snapshot){if(snapshot.val().hasOwnProperty(searchTerm)){var post=Convert.toNormal(snapshot.val());console.log(post.name);$scope.ideas.push(post)}})}}]).controller("AccountCtrl",["$scope","$state","$ionicPopup","$ionicModal","Login",function($scope,$state,$ionicPopup,$ionicModal,Login){$scope.loginText={email:null,password:null};$scope.signupText={email:null,password:null};$scope.loginModalIsClicked=false;$ionicModal.fromTemplateUrl("templates/tab-account-loginModal.html",{scope:$scope,animation:"slide-in-up"}).then(function(modal){$scope.loginModal=
modal});$scope.goIdeas=function(){$state.go("ideas")};$scope.showLogin=function(){$scope.loginModal.show()};$scope.hideLogin=function(){$scope.loginModal.hide()};$scope.doLogin=function(){if(!$scope.loginModalIsClicked)Login.login($scope.loginText,$scope.ref).then(function(authData){$ionicPopup.alert({title:"Login succeeded!"}).then(function(){$scope.hideLogin();$scope.loginText.email=null;$scope.loginText.password=null;$scope.loginModalIsClicked=false},function(error){$ionicPopup.alert({title:"Login failed!"});
$scope.loginModalIsClicked=false});$scope.loginModalIsClicked=true})};$scope.signupModalIsClicked=false;$ionicModal.fromTemplateUrl("templates/tab-account-signupModal.html",{scope:$scope,animation:"slide-in-up"}).then(function(modal){$scope.signupModal=modal});$scope.showSignup=function(){$scope.signupModal.show()};$scope.hideSignup=function(){$scope.signupModal.hide()};$scope.doSignup=function(){if(!$scope.signupModalIsClicked){Login.signup($scope.signupText,$scope.ref).then(function(){Login.login($scope.signupText,
$scope.ref).then(function(authData){$ionicPopup.alert({title:"Sign up succeeded!"}).then(function(){$scope.hideSignup();$scope.signupText.email=null;$scope.signupText.password=null;$scope.signupModalIsClicked=false})},function(err){$ionicPopup.alert({title:"Sign up succeeded but login failed!"}).then(function(){$scope.hideSignup();$scope.signupText.email=null;$scope.signupText.password=null;$scope.signupModalIsClicked=false})})},function(err){$ionicPopup.alert({title:"Sign up failed!"});$scope.signupModalIsClicked=
false});$scope.signupModalIsClicked=true}};$scope.logout=function(){$ionicPopup.confirm({title:"Are you sure you want to logout?"}).then(function(resolution){if(resolution)$scope.ref.unauth();else;})}}]);

