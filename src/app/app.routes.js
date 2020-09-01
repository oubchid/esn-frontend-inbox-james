'use strict';

angular.module('esn.inbox-james')

.config(function($stateProvider) {
  $stateProvider
    .state('admin.domain.dlp', {
      url: '/dlp',
      deepStateRedirect: {
        default: 'admin.domain.dlp.quarantine',
        params: true,
        fn: function() {
          return true;
        }
      }
    })
    .state('admin.domain.dlp.quarantine', {
      url: '/quarantine',
      views: {
        'root@admin': {
          template: '<inbox-james-dlp-quarantine />'
        }
      }
    })
    .state('admin.domain.dlp.rejected', {
      url: '/rejected',
      views: {
        'root@admin': {
          template: '<inbox-james-dlp-rejected />'
        }
      }
    })
    .state('admin.domain.dlp.settings', {
      url: '/settings',
      views: {
        'root@admin': {
          template: '<inbox-james-dlp-settings />'
        }
      }
    })
    .state('unifiedinbox.deleted-messages', {
      url: '/deleted-messages',
      views: {
        'main@unifiedinbox': {
          template: '<inbox-james-deleted-messages-restore-request />'
        }
      }
    });
});
