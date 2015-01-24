/*
 * The module for the firebase service
 */
angular.module('ideas.firebase', [])

//The service that handles frebase transactions
.factory('Firebase', ['$q', function($q) {
  var anonymousPostName = "anonymous"; //The owner given to anonymous posts

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

    /*
     * Turns an idea in the format of {name: , description: } into the correct format for sending to the firebase
     */
    intoFirebaseVersion: function(idea, ref, owner) {
      var firebaseIdea = {
        data: {
          name: idea['name'],
          description: idea['description'],
          owner: owner
        },
        stamp: Firebase.ServerValue.TIMESTAMP //Allow the server to generate a timestamp for the object
      }
      return firebaseIdea;
    },

    /*
     * Determines the owner of a firebase
     */
    getOwner: function(ref) {
      var auth = ref.getAuth();
      var owner; //The owner of the idea
      if (auth === null) {
        owner = anonymousPostName; //The idea is posted anonymous
      } else {
        owner = auth.uid; //Set the owner to be the current person logged into the firebase
      }
      return owner;
    },

    //Posts an idea to the firebase
    postIdea: function(idea, ref) {
      var promise = $q.defer();
      var post = this.intoFirebaseVersion(idea, ref, getOwner(ref));
      ref.child("ideas").push(post, function(error) {
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
        idea: {
          name: obj.data.name,
          description: obj.data.description,
          owner: obj.data.owner,
          stamp: obj.stamp,
          comments: []
        },
        name: snapshot.name() //The name of the key that goes to this idea
      };
      if ('comments' in obj)
      {
        for (prop in obj.comments) {
          toReturn.comments.push(obj.comments[prop]);
        }
      }
      return toReturn;
    }
  };
  return theFirebaseService;
}])