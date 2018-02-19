Pushwoosh = {}

Pushwoosh.initPushwoosh = function(appId) {
  return true;
}

/*
 * createMessage({
 *   query: { _id: Meteor.user()._id },
 *   message: "YAS"
 * });
 */
Pushwoosh.createMessage = function(notifications) {
  if(notifications instanceof Array) {
  } else {
    notifications = [notifications];
  }

  var request = Npm.require('request');

  console.log("lpender:pushwoosh : sending notifications")
  console.log(notifications)

  // map devices onto notification
  notifications = notifications.map(function(notification) {
    var devices = [];

    // Find the users that match the included query
    var users = Meteor.users.find(notification.query).fetch().filter(function(user) {
      return user.services.pushwoosh && typeof user.services.pushwoosh.deviceTokens == 'object'
    });

    console.log("lpender:pushwoosh : pushing to users");
    console.log(users);

    users.forEach(function(user) {
      Array.prototype.push.apply(
        devices,
        user.services.pushwoosh.deviceTokens
      );
    });

    console.log("lpender:pushwoosh : pushing to devices")
    console.log(devices)

    notification.devices = devices;

    return notification;
  });

  var data = {
    request: {
      application: Meteor.settings.public.pushwoosh.appId,
      auth: Meteor.settings.pushwoosh.token,
      notifications: notifications
    }
  };

  // for each notification, do it up right
  request({
    uri: 'https://cp.pushwoosh.com/json/1.3/createMessage',
    body: data,
    json: true,
    method: 'post'
  }, function(error, response) {
    if (error) {
      console.log("lpender:pushwoosh:");
      console.error(error);
    } else {
      console.log("lpender:pushwoosh: request completed successfully");
    }
  });
};
