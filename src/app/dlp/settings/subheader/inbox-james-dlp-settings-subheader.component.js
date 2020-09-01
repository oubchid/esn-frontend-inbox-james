'use strict';

angular.module('esn.inbox-james')

.component('inboxJamesDlpSettingsSubheader', {
  templateUrl: '/unifiedinbox.james/app/dlp/settings/subheader/inbox-james-dlp-settings-subheader.html',
  bindings: {
    onFormSubmit: '&',
    form: '<'
  }
});
