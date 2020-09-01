'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDlpRejectedActions', {
    templateUrl: '/unifiedinbox.james/app/dlp/rejected/actions/inbox-james-dlp-rejected-actions.html',
    controller: 'inboxJamesDlpRejectedActionsController',
    bindings: {
      bulkAction: '<',
      email: '<',
      onClick: '&',
      repository: '<'
    }
  });
