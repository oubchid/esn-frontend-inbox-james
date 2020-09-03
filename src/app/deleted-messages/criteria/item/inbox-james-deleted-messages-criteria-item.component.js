'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDeletedMessagesCriteriaItem', {
    template: require('./inbox-james-deleted-messages-criteria-item.pug'),
    controller: 'InboxJamesDeletedMessagesCriteriaItemController',
    bindings: {
      criterion: '<',
      deleteCriterion: '&'
    }
  });
