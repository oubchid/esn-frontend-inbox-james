'use strict';

angular.module('esn.inbox-james')
  .controller('inboxJamesDeletedMessagesCriteriaParticipantFormController', inboxJamesDeletedMessagesCriteriaParticipantFormController);

function inboxJamesDeletedMessagesCriteriaParticipantFormController(INBOX_JAMES_DELETED_MESSAGES) {
  var self = this;

  self.$onInit = $onInit;
  self.onTagAdded = onTagAdded;
  self.onTagRemoved = onTagRemoved;

  function $onInit() {
    if (self.participantType === INBOX_JAMES_DELETED_MESSAGES.CRITERIA.RECIPIENTS) {
      self.criterion.operator = INBOX_JAMES_DELETED_MESSAGES.CRITERIA.RECIPIENTS_OPERATOR;
    }

    if (self.participantType === INBOX_JAMES_DELETED_MESSAGES.CRITERIA.SENDER) {
      self.criterion.operator = INBOX_JAMES_DELETED_MESSAGES.CRITERIA.SENDER_OPERATOR;
    }

    self.paritipants = self.criterion.value ? [{ email: self.criterion.value }] : [];
  }

  function onTagAdded(tag) {
    self.criterion.value = tag.email;
  }

  function onTagRemoved() {
    self.criterion.value = '';
  }
}
