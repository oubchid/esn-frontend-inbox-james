'use strict';

angular.module('esn.inbox-james')
  .controller('InboxJamesDlpSettingsRuleFormController', InboxJamesDlpSettingsRuleFormController);

function InboxJamesDlpSettingsRuleFormController() {
  var self = this;

  self.onDeleteBtnClick = onDeleteBtnClick;
  self.onUndoBtnClick = onUndoBtnClick;

  function onDeleteBtnClick(form) {
    self.rule.deleted = true;
    form.$setDirty();
  }

  function onUndoBtnClick() {
    self.rule.deleted = false;
  }
}
