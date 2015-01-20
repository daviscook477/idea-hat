angular.module('ideas.services', [])

//The service that handles logins, it provides a promise that will eventually return the authentication
.factory('Login', ['$q', function($q) {
  var theLoginCheckerService = {
    //Logins a user into the firebase. Returns a promise that will give the authData
    login: function(user, ref) {
      var promise = $q.defer(); //Promises. Woot! We have to return a promise because we don't know when the firebase will finish authenticating the user.
      ref.authWithPassword(user, function(error, authData) { //Login to the firebase
        if (error) { //They couldn't login
          promise.reject(error);
        } else { //They logged in sucessfully
          promise.resolve(authData);
        }
      });
      return promise.promise;
    },

    //Signs a user into the firebase. Returns a promise that tells when it completes and if it was sucessful or not
    signup: function(user, ref) {
      var promise = $q.defer(); //Create a promise that will be returned to the user when we know if the firebase created the user
      ref.createUser(user, function(error) { //Create the user
        if (error === null) { //The user was successfully created
          promise.resolve(); //Resolve the promise
        } else { //They did not sucessfully signup
          promise.reject(error); //Reject the promise with an error
        }
      });
      return promise.promise;
    }
  };
  return theLoginCheckerService;
}])

//The structure things are stored in the firebase is as follows:
/*
ideas {
  ideaID: { //ideaID is just the id of the posted idea
    random: { //Each attribute that isn't description is simply one of their search terms
      id: 0
    }
    idea: {
      id: 1
    },
    description: {
      id: null,
      description: "This is a random idea."
    }
  },

  ideaID: {
    ...
  }
}


*/

//The service that converts my formats for storing data
.factory('Convert', function() {
  var theConverterService = {
    toFirebase: function(object) { //this converts an object in the form {name: "NAME", description: "DESCRIPTION"} into the format used by the firebase
      var toReturn = new Object();
      var nameTags = object.name.split(" "); //Tokenize the name into its parts
      for (tag in nameTags) { //Create keys for each token in the name in the object to be posted to the firebase
        toReturn[nameTags[tag].toLowerCase()] = {id: tag} //I want all the tags in the firebase put into lowercase. This method does stuff that I should document
      }
      //Add the description to the object
      if (toReturn.hasOwnProperty('description')) {
        toReturn.description = {id: toReturn.description.id, description: object.description}; //this allows description to be used as a word in the title and actually work correct
      } else {
        toReturn.description = {description: object.description};
      }
      //add the user to the object
      if (toReturn.hasOwnProperty('user')) {
        toReturn.user = {id: toReturn.user.id, user: object.user}; //this allows description to be used as a word in the title and actually work correct
      } else {
        toReturn.user = {user: object.user};
      }
      return toReturn;
    },

    toNormal: function(object) { //this converts an object from the firebase to the form {name: "NAME", description: "DESCRIPTION"}
      var name = "";
      var parts = []; //an array to store the parts we reconstruct
      for (prop in object) { //Look at all the properties
        if (object[prop].id !== null) { //If its value is true
          parts[object[prop].id] = (prop.charAt(0).toUpperCase() + prop.slice(1) + " ");
        }
      }
      for (var i = 0; i < parts.length; i++) {
        name += parts[i];
      }
      return {name: name, description: object.description.description};
    }
  };
  return theConverterService;
});