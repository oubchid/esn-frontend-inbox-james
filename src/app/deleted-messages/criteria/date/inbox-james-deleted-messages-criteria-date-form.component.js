'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDeletedMessagesCriteriaDateForm', {
    template: require('./inbox-james-deleted-messages-criteria-date-form.pug'),
    controller: 'inboxJamesDeletedMessagesCriteriaDateFormController',
    bindings: {
      criterion: '<'
    }
  });
