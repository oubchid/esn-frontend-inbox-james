'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDeletedMessagesRestoreRequestSubheader', {
    template: require('./inbox-james-deleted-messages-restore-request-subheader.pug'),
    bindings: {
      onRequestSubmit: '&',
      form: '<',
      criteria: '<'
    }
  });

