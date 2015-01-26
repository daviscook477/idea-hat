function valueOf(string, scope) {
	var array = string.split(".");
	var curObj = scope;
	for (var i = 0; i < array.length; i++) {
		if (curObj === null) {
			break;
		}
		console.log(array[i]);
		curObj = curObj[array[i]];
	}
	return curObj;
}

angular.module('ideas.directives', ['ideas.firebase'])

.directive('editDelete', ['Firebase', function(Firebase) {
	var link = function(scope, element, attrs) {
		var model;
		var auth;
		if (scope.ref.getAuth() !== null) { //This here doesn't work with the way that firebase loads cookies (or something) to keep sessions alive
			auth = scope.ref.getAuth().uid;
		} else {
			auth = null
		}
		var updated = function(newAuth) {
			if (newAuth !== null) {
				auth = newAuth.uid;
			} else
			{
				auth = null;
			}
			updateData();
		};
		var updateData = function() {
			if (auth !== null) {
				if (auth == model) {
					scope.displayEditDelete = true;
				} else {
					scope.displayEditDelete = false;
				}
			} else {
				scope.displayEditDelete = false;
			}
			console.log("model: " + model + " auth: " + auth);
		}
		attrs.$observe('owner', function(value) {
			model = value;
			updateData();
		})
		Firebase.registerCallback(updated); //Now we listen for changes in the auth
		scope.displayEditDelete = false;
	}
	return {
		templateUrl: "modules/directives/edit-delete.html",
		link: link,
		scope: false
	}
}]);