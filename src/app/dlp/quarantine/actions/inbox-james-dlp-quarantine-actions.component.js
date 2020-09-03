'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDlpQuarantineActions', {
    template: require('./inbox-james-dlp-quarantine-actions.pug'),
    controller: 'inboxJamesDlpQuarantineActionsController',
    bindings: {
      bulkAction: '<',
      email: '<',
      onClick: '&',
      repository: '<'
    }
  });
