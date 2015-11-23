(function(angular) {

  'use strict';

  function ShellController($scope, $log, $q, $mdSidenav, $notification, $mdToast, modulesProvider) {

    var remote = require('remote');
    var app = remote.require('app');
    var appCfg = app.sysConfig();

    this.appName = `${appCfg.app.name} v${appCfg.app.version}`;
    this.modules = [];
    this.isBusy = false;
    this.statusMessage = '';
    this.isDirty = false;

    $scope.setBusy = (msg) => {
      $q.when(true).then(() => {
        this.isBusy = true;
        this.statusMessage = msg;
        this.isDirty = false;
      });
    };

    $scope.setReady = (dirty) => {
      $q.when(true).then(() => {
        this.isBusy = false;
        this.statusMessage = '';
        this.isDirty = dirty;
      });
    };

    $scope.notify = (title, message) => {

      if (process.platform === 'win32') {
        $mdToast.show(
          $mdToast.simple().content(message).position('bottom right').hideDelay(2000));
      } else {
        $notification(title, {
          body: message,
          delay: 2000
        });
      }
    };

    $scope.setError = (template, icon, error) => {
      $scope.notify('An error occured!', error.message);
    };

    this.initialize = function() {
      this.modules = modulesProvider.modules;
      return Promise.all([
        $notification.requestPermission()
      ]);
    };

    this.toggleFullscreen = function() {
      app.toggleFullscreen();
    };

    this.platform = function() {
      return appCfg.platform;
    };

    this.minimizeApp = function() {
      app.minimizeAppToSysTray();
    };

    this.closeApp = function() {
      app.close();
    };

    this.sendEvent = (event, arg) => {
      $q.when(true).then(() => {
        $scope.$broadcast(event, arg);
      });
    };

    this.toggleSidebar = function() {
      var pending = $q.when(true);
      pending.then(() => {
        $mdSidenav('sidebar').toggle();
      });
    };
  }

  module.exports = ShellController;

})(global.angular);