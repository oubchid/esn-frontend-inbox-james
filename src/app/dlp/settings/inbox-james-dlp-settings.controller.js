'use strict';

angular.module('esn.inbox-james')
  .controller('inboxJamesDlpSettingsController', inboxJamesDlpSettingsController);

function inboxJamesDlpSettingsController(
  uuid4,
  session,
  asyncAction,
  jamesApiClient
) {
  var self = this;
  var notificationMessages = {
    progressing: 'Storing rules...',
    success: 'Rules stored',
    failure: 'Failed to store rules'
  };
  var DOMAIN_ID = session.domain._id;

  self.$onInit = $onInit;
  self.addForm = addForm;
  self.onFormSubmit = onFormSubmit;

  function $onInit() {
    self.status = 'loading';

    jamesApiClient.listDlpRules(DOMAIN_ID)
      .then(function(rules) {
        self.rules = rules;
        self.status = 'loaded';
      })
      .catch(function() {
        self.status = 'error';
      });
  }

  function addForm() {
    self.rules.unshift({
      id: uuid4.generate()
    });
  }

  function onFormSubmit() {
    self.rules = _qualifyRules(self.rules);

    return asyncAction(notificationMessages, function() {
      return jamesApiClient.storeDlpRules(DOMAIN_ID, self.rules);
    });
  }

  function _qualifyRules(rules) {
    return rules.map(function(rule) {
      if (!rule.deleted) {
        delete rule.deleted;

        return rule;
      }
    }).filter(Boolean);
  }
}
