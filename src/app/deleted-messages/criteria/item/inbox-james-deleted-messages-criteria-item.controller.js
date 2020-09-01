'use strict';

angular.module('esn.inbox-james')
  .controller('InboxJamesDeletedMessagesCriteriaItemController', InboxJamesDeletedMessagesCriteriaItemController);

function InboxJamesDeletedMessagesCriteriaItemController(inboxJamesDeletedMessageCriteriaService, INBOX_JAMES_DELETED_MESSAGES) {
  var self = this;

  self.types = INBOX_JAMES_DELETED_MESSAGES.CRITERIA.FIELD_NAMES;

  self.getCriterionSummary = getCriterionSummary;
  self.resetCriterion = resetCriterion;

  function getCriterionSummary() {
    return inboxJamesDeletedMessageCriteriaService.getCriterionSummary(self.criterion);
  }

  function resetCriterion() {
    self.criterion.value = '';
    self.criterion.operator = '';
  }
}
