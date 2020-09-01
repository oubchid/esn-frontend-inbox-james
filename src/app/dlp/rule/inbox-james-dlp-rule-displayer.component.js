'use strict';

angular.module('esn.inbox-james')

.component('inboxJamesDlpRuleDisplayer', {
  templateUrl: '/unifiedinbox.james/app/dlp/rule/inbox-james-dlp-rule-displayer.html',
  controller: 'inboxJamesDlpRuleDisplayerController',
  bindings: {
    email: '<'
  }
});
