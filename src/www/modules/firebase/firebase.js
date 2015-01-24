/*
 * The module for the firebase service
 */
angular.module('ideas.firebase', [])

//The service that handles frebase transactions
.factory('Firebase', ['$q', function($q) {
  var theFirebaseService = {
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
    },

    //Posts an idea to the firebase
    postIdea: function(idea, ref) {
      var promise = $q.defer();
      var auth = ref.getAuth();
      var owner; //Set the owner of this comment
      if (auth == null) {
        owner = "anonymous";
      } else {
        owner = auth.uid;
      }
      var toPost = { //Create the idea to post
        data: {
          name: idea.name,
          description: idea.description,
          owner: owner
        },
        stamp: -Firebase.ServerValue.TIMESTAMP //Allow the server to generate a timestamp for the object
      };
      ref.child("ideas").push(toPost, function(error) {
        if (error === null)
        {
          promise.resolve(); //Resolves the promise
        } else {
          promise.reject(error);
        }
      }); //Actually do the post
      return promise.promise;
    },

    //Gets an idea from the firebase
    getIdea: function(snapshot) {
      var obj = snapshot.val();
      var toReturn = {
        name: obj.data.name,
        description: obj.data.description,
        owner: obj.data.owner,
        stamp: obj.stamp,
        comments: []
      };
      if ('comments' in obj)
      {
        for (prop in obj.comments) {
          toReturn.comments.push(obj.comments[prop]);
        }
      }
      return toReturn;
    },

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
  return theFirebaseService;
}])