'use strict';

angular.module('esn.inbox-james')

.component('inboxJamesDlpSettingsSubheader', {
  template: require('./inbox-james-dlp-settings-subheader.pug'),
  bindings: {
    onFormSubmit: '&',
    form: '<'
  }
});
