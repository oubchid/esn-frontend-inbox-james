'use strict';

angular.module('esn.inbox-james')

.component('inboxJamesDlpRuleDisplayer', {
  template: require('./inbox-james-dlp-rule-displayer.pug'),
  controller: 'inboxJamesDlpRuleDisplayerController',
  bindings: {
    email: '<'
  }
});
