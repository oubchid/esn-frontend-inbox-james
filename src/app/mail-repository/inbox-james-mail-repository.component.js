'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesMailRepository', {
    template: require('./inbox-james-mail-repository.pug'),
    controller: 'inboxJamesMailRepositoryController',
    bindings: {
      repository: '<'
    }
  });
