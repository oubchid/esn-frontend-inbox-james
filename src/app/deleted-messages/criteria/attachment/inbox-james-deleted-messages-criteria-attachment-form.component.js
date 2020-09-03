'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDeletedMessagesCriteriaAttachmentForm', {
    template: require('./inbox-james-deleted-messages-criteria-attachment-form.pug'),
    bindings: {
      criterion: '<'
    }
  });
