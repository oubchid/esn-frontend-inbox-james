'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesMailRepositoryHeader', {
    template: require('./inbox-james-mail-repository-header.pug'),
    controller: 'inboxJamesMailRepositoryHeaderController',
    bindings: {
      emails: '<',
      repository: '@'
    }
  });
