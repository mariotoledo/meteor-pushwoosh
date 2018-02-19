# Pushwoosh Atmosphere Package for Meteor

Pushwoosh is a service that makes it easy to send push notifications to your (mobile) app.

This package:

- Allows you to send (server) and receive (app) push notifications.
- Allows querying by user when creating a notification.
- Works for iOs and Android devices and includes `cordova-plugin-device` for
  device detection.

## Install

> meteor add lpender:pushwoosh

## Usage

### Add your Pushwoosh settings to a `settings.json` file

```json
{
  "public" : {
    "pushwoosh" : {
      "appId": "XXXXX-XXXXX",
      "google": {
        "project_number": "123456"
      }
    }
  },
  "pushwoosh": {
    "token": "sample_pushwoosh_token"
  }
}
```

And start your app using `meteor --settings settings.json`.

You can request the "token" in the Pushwoosh admin panel.

### Add this to your `mobile-config.js` file

```
App.accessRule('*');
```

You may also need to add the `cordova-whitelist` plugin.


### initPushwoosh

In a file that is run in mobile/cordova contexts, run the following code:

    Meteor.startup(function(){
      Pushwoosh.initPushwoosh();
    });

### Send a push notification:

    if (Meteor.isServer) {
      Pushwoosh.createMessage({
        "query": { _id: Meteor.userId() },
        "send_date": "now",
        "ignore_user_timezone": true,
        "content": "Your message"
      });
    }

You can pass this method an array of objects, if you'd like to send more than
one message.

[createMessage API](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/).

## Handling notifications in-app

Push notifications do not usually appear while the app is in-use.

However, there are JavaScript events that you can listen for, to handle
this scenario:

    if (Meteor.isClient) {
      Meteor.startup(function(){
        document.addEventListener('push-notification', function(event){
          if (device.platform === "iOS") {
            //get the notification payload
            var notification = event.notification;

            //display alert to the user for example
            alert(notification.aps.alert);
          } else if (device.platform === "Android") {
            var title = event.notification.title;
            var userData = event.notification.userdata;

            if(typeof(userData) != "undefined") {
              console.warn('user data: ' + JSON.stringify(userData));
            }

            alert(title);
          }
        });
      });
    }

[Cordova Pushwoosh API](http://docs.pushwoosh.com/docs/cordova-phonegap).

## Notes

Please be sure to use the sandbox key for development.

## Todo

Testing.
