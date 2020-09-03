'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDlpRejectedActions', {
    template: require('./inbox-james-dlp-rejected-actions.pug'),
    controller: 'inboxJamesDlpRejectedActionsController',
    bindings: {
      bulkAction: '<',
      email: '<',
      onClick: '&',
      repository: '<'
    }
  });
