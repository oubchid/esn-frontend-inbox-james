'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDeletedMessagesCriteriaForm', {
    template: require('./inbox-james-deleted-messages-criteria-form.pug'),
    controller: 'InboxJamesDeletedMessagesCriteriaFormController',
    bindings: {
      criteria: '='
    }
  });
