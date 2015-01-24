/* This module is the actual application
 * It is named 'ideas'
 * The things within the [] are the requirements
 *   The module requires the 
 */
angular.module('ideas', ['ionic', 'ideas.main', 'ideas.account', 'ideas.ideas'])

//I don't know what this does-it was in the template
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

//Configure the state provider
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  //Set up the states for the application
  $stateProvider

  /*
   * Set up an abstract state for the main view
   * To tell the truth-I don't understand why I'm doing this, it was just in the template
   */
  .state('main', {
    url: "/main",
    abstract: true,
    templateUrl: "modules/main/main-view.html"
  })

  /*
   * The state for viewing different ideas
   */
  .state('main.ideas', {
    url: '/ideas',
    views: {
      'mainContent': {
        templateUrl: 'modules/ideas/ideas-view.html'
      }
    }
  })

  /*
   * The state for viewing an individual idea + the comments on it
   * It accepts an ideaId as a parameter in the URL
   * The ideaId is the id of the idea to look at
   */
  .state('main.comments', {
    url: '/comments:ideaId',
    views: {
      'mainContent': {
        templateUrl: 'modules/comments/comments-view.html'
      }
    }
  });

  //Configure the idea browsing state to be the default
  $urlRouterProvider.otherwise('/main/ideas');

}])

//The application wide controller
.controller('RootCtrl', ['$scope', function($scope, $ionicSideMenuDelegate) {
  $scope.ref = new Firebase("https://idea0.firebaseio.com"); //Create the applications reference the firebase
}]);