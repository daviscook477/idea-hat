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

angular.module('ideas.permissions', ['ideas.firebase'])

/*
 * This directive is awfully confusing so let me explain
 * It needs options and ref which are just passed as objects so no {{}}
 * options are the options that will be displayed in a popover if their is permission
 * ref is the firebase reference
 * It needs owner and text which are passed with {{}}
 * owner is the owner of the thing we are checking for permissions on
 * text is the text to display to the left of this because this is actually a mock list element not just a button
 */
.directive('permissions', ['Firebase', function(Firebase) {
	var link = function(scope, element, attrs) {
		var owner;
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
				if (auth == owner) {
					scope.sameOwner = true;
				} else {
					scope.sameOwner = false;
				}
			} else {
				scope.sameOwner = false;
			}
		}
		attrs.$observe('owner', function(value) {
			owner = value;
			updateData();
		});
	}
	return {
		link: link,
		scope: false
	}
}]);