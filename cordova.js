(function (root) {
  Pushwoosh = {};

  Pushwoosh.initPushwoosh = function() {
    this.pushNotification =
      cordova.require("pushwoosh-cordova-plugin.PushNotification");

    if (device.platform === "Android") {
      this._initAndroid();
    } else if (device.platform === "iOS") {
      this._initIOs();
    }

    //reset badges on app start
    this.pushNotification.setApplicationIconBadgeNumber(0);
  }

  // This will trigger all pending push notifications on start.
  Pushwoosh._initAndroid = function() {
    var _this = this;

    this.pushNotification.onDeviceReady({
      projectid: Meteor.settings.public.pushwoosh.google.project_number,
      pw_appid : Meteor.settings.public.pushwoosh.appId
    });

    //register for pushes
    this.pushNotification.registerDevice(
      function(status) { _this._register(status.pushToken) },
      _this._registerFail
    );
  }

  // This will trigger all pending push notifications on start.
  Pushwoosh._initIOs = function() {
    var _this = this;

    this.pushNotification.onDeviceReady({
      pw_appid: Meteor.settings.public.pushwoosh.appId
    });

    //register for pushes
    this.pushNotification.registerDevice(
      function(status) { _this._register(status.pushToken)},
      _this._registerFail
    );
  }

  Pushwoosh._register = function(token) {
    console.log('calling registertoken')
    Tracker.autorun(function() {
      Meteor.call('registerToken', token, Meteor.userId())
    });
  };

  Pushwoosh._registerFail = function(status) {
    console.error('failed to register : ' + JSON.stringify(status));
  };

  Pushwoosh.createMessage = function(notification) {
    throw new Meteor.Error('302', 'Only supported on server');
  }

  Pushwoosh.unregisterDevice = function(notification) { 
    this.pushNotification.unregisterDevice(function (data) { 
    }, function (error) { 
      console.error('failed to unregister : ' + JSON.stringify(error)); 
    }); 
  }

  root.Pushwoosh = Pushwoosh;
})(this)