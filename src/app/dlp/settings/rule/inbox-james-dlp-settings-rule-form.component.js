'use strict';

angular.module('esn.inbox-james')

.component('inboxJamesDlpSettingsRuleForm', {
  template: require('./inbox-james-dlp-settings-rule-form.pug'),
  controller: 'InboxJamesDlpSettingsRuleFormController',
  bindings: {
    rule: '='
  }
});
