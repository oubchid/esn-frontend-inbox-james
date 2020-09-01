'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDeletedMessagesCriteriaDateForm', {
    templateUrl: '/unifiedinbox.james/app/deleted-messages/criteria/date/inbox-james-deleted-messages-criteria-date-form.html',
    controller: 'inboxJamesDeletedMessagesCriteriaDateFormController',
    bindings: {
      criterion: '<'
    }
  });
