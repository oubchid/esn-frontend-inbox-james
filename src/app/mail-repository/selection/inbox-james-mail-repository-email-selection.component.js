'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesMailRepositoryEmailSelection', {
    templateUrl: '/unifiedinbox.james/app/mail-repository/selection/inbox-james-mail-repository-email-selection.html',
    controller: 'inboxJamesMailRepositoryEmailSelectionController',
    bindings: {
      email: '<'
    }
  });
