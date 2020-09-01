'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesMailRepository', {
    templateUrl: '/unifiedinbox.james/app/mail-repository/inbox-james-mail-repository.html',
    controller: 'inboxJamesMailRepositoryController',
    bindings: {
      repository: '<'
    }
  });
