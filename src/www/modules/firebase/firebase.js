/*
 * The module for the firebase service
 */
angular.module('ideas.firebase', [])

//The service that handles frebase transactions
.factory('Firebase', ['$q', function($q) {
  var anonymousPostName = "anonymous"; //The owner given to anonymous posts

  var theFirebaseService = {
    //Quick solution to issues with syncing the current auth
    callbacks: [],

    registerCallback: function(callback) {
      theFirebaseService.callbacks.push(callback);
    },

    notify: function(ref) {
      for (var i = 0; i < theFirebaseService.callbacks.length; i++) {
        theFirebaseService.callbacks[i](ref.getAuth());
      }
    },

    //Logins a user into the firebase. Returns a promise that will give the authData
    login: function(user, ref) {
      var promise = $q.defer(); //Promises. Woot! We have to return a promise because we don't know when the firebase will finish authenticating the user.
      ref.authWithPassword(user, function(error, authData) { //Login to the firebase
        if (error) { //They couldn't login
          promise.reject(error);
        } else { //They logged in sucessfully
          promise.resolve(authData);
          theFirebaseService.notify(ref); //Auth could have changed!
        }
      });
      return promise.promise;
    },

    logout: function(ref) {
      ref.unauth();
      theFirebaseService.notify(ref); //Auth could have changed!
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

    //Gets an idea from the firebase
    ideaIntoIdeaVersion: function(snapshot) {
      var obj = snapshot.val();
      var toReturn = {
        idea: {
          name: obj.data.name,
          description: obj.data.description,
          owner: obj.data.owner,
          stamp: obj.stamp,
          comments: {}
        },
        name: snapshot.key() //The name of the key that goes to this idea
      };
      if ('comments' in obj)
      {
        for (prop in obj.comments) {
          toReturn.comments[prop] = obj.comments[prop];
        }
      }
      return toReturn;
    },

    /*
     * Turns an idea in the format of {name: , description: } into the correct format for sending to the firebase
     */
    ideaIntoFirebaseVersion: function(idea, owner) {
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
      var post = theFirebaseService.ideaIntoFirebaseVersion(idea, theFirebaseService.getOwner(ref));
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

    commentIntoIdeaVersion: function(snapshot) {
      var obj = snapshot.val();
      return {
        comment: {
          text: obj.data.text,
          owner: obj.data.owner
        },
        name: snapshot.key()
      }
    },

    commentIntoFirebaseVersion: function(comment, owner) {
      return {
        data: {
          text: comment.text,
          owner: owner
        },
        stamp: Firebase.ServerValue.TIMESTAMP
      }
    },

    //Posts a comment
    postComment: function(idea, comment, ref) {
      var promise = $q.defer();
      ref.child("ideas").child(idea.name).child("data").child("comments").push(this.commentIntoFirebaseVersion(comment, this.getOwner(ref)), function(error) {
        if (error === null) {
          promise.resolve();
        } else {
          promise.reject(error);
        }
      });
      return promise.promise;
    }
  };
  return theFirebaseService;
}])