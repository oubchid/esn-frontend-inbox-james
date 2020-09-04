'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDeletedMessagesCriteriaSubjectForm', {
    template: require('./inbox-james-deleted-messages-criteria-subject-form.pug'),
    bindings: {
      criterion: '<'
    }
  });
