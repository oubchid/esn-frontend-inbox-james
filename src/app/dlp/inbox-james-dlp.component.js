'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDlp', {
    template: require('./inbox-james-dlp.pug'),
    bindings: {
      displayIn: '<'
    }
  });
