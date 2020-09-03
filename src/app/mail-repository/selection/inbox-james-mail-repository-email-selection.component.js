'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesMailRepositoryEmailSelection', {
    template: require('./inbox-james-mail-repository-email-selection.pug'),
    controller: 'inboxJamesMailRepositoryEmailSelectionController',
    bindings: {
      email: '<'
    }
  });
