'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesMailRepositoryEmailDisplay', {
    template: require('./inbox-james-mail-repository-email-display.pug'),
    bindings: {
      email: '<',
      download: '&',
      delete: '&'
    }
  });
