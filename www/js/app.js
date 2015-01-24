//Create the application
//It requires ionic
//It uses the ideas.services module, which is defined in js/services.js
//It uses the ideas.controllers  module, which is defined in js/controllers.js
angular.module('ideas', ['ionic', 'ideas.controllers', 'ideas.services'])

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
//I changed something here for git

//Configure the state provider
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  //Set up the states for the application
  $stateProvider

  //Set up an abstract state for the main container - I don't really know what I'm doing with this
  .state('main', {
    url: "/main",
    abstract: true,
    templateUrl: "templates/main-view.html"
  })

  //Set up the state for searching and posting ideas and managing user accounts - its a side menu
  .state('main.ideas', {
    url: '/ideas',
    views: {
      'mainContent': {
        templateUrl: 'templates/ideas-view.html'
      }
    }
  })

  .state('main.comments', {
    url: '/comments',
    views: {
      'mainContent': {
        templateUrl: 'templates/comments-view.html'
      }

    }
  });

/*
  //Set up the state for managing user accounts
  .state('account', {
    url: '/account',
    templateUrl: 'templates/tab-account.html',
    controller: 'AccountCtrl'
  });
*/
  //This is the default state
  $urlRouterProvider.otherwise('/main/ideas');

}]);