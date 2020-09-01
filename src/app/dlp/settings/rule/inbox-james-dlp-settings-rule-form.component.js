'use strict';

angular.module('esn.inbox-james')

.component('inboxJamesDlpSettingsRuleForm', {
  templateUrl: '/unifiedinbox.james/app/dlp/settings/rule/inbox-james-dlp-settings-rule-form.html',
  controller: 'InboxJamesDlpSettingsRuleFormController',
  bindings: {
    rule: '='
  }
});
