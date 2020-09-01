'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDeletedMessagesRestoreRequestSubheader', {
    templateUrl: '/unifiedinbox.james/app/deleted-messages/restore-request/inbox-james-deleted-messages-restore-request-subheader.html',
    bindings: {
      onRequestSubmit: '&',
      form: '<',
      criteria: '<'
    }
  });

