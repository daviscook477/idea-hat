var injector;
var ref;
var mockOwner;
var firebaseModule;

//The QUnit module for testing the AngularJS firebase module
module("Firebase Module", {
	beforeEach: function() {
		injector = angular.injector(['ng', 'ideas.firebase']);
		ref = new Firebase("https://idea0.firebaseio.com/"); //Obtain a reference to the firebase
		mockOwner = "Davis Cook"; //Set up the mock owner
		firebaseModule = injector.get('Firebase'); //Obtain the service
	},
	afterEach: function() {
		//Clean up
	}
});

//This test makes sure that the services correctly converts ideas to the firebase format
test("converter from idea to firebase idea", function(assert) {
	var objTest = firebaseModule.intoFirebaseVersion({name: "Test", description: "This is a test!"}, ref, mockOwner);
	var knowTest = {data: {name: "Test", description: "This is a test!", owner: mockOwner}, stamp: Firebase.ServerValue.TIMESTAMP};
	assert.deepEqual(objTest, knowTest);
});