'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesMailRepositoryEmailDisplay', {
    templateUrl: '/unifiedinbox.james/app/mail-repository/email/inbox-james-mail-repository-email-display.html',
    bindings: {
      email: '<',
      download: '&',
      delete: '&'
    }
  });
