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

.directive('permissions', ['Firebase', '$ionicPopover', function(Firebase, $ionicPopover) {
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
		})
		Firebase.registerCallback(updated); //Now we listen for changes in the auth
		scope.sameOwner = false; //Add to the scope a manner of listening for if the owner is the same
		var popover;
		$ionicPopover.fromTemplateUrl("modules/permissions/options.html", {
			scope: scope
		}).then(function(popover) {
			link.popover = popover;
		});
		scope.showOptions = function($event) {
			console.log("will show popover");
			link.popover.show($event);
		};
		scope.getPermissions = function() {
			if (scope.sameOwner) {
				return ['Edit', 'Delete'];
			} else {
				return [];
			}
		}
		scope.$on('destroy', function() {
			scope.popover.remove();
		})
	}
	return {
		link: link,
		scope: false
	}
}]);