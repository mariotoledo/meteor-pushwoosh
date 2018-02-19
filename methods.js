(function (root) {
  Meteor.methods({
    registerToken: function (token, userId) {
      console.log("Pushwoosh: Listening for user with token: " + token);

      console.log("Pushwoosh: Registering token: " + token);
      console.log("Pushwoosh: UserId: " + userId);

      Meteor.users.update(
        { _id: userId },
        { $addToSet: { 'services.pushwoosh.deviceTokens': token }}
      );
    }
  });
})(this)

