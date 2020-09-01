'use strict';

angular.module('esn.inbox-james')
  .controller('InboxJamesDeletedMessagesRestoreRequestController', InboxJamesDeletedMessagesRestoreRequestController);

function InboxJamesDeletedMessagesRestoreRequestController(
  $state,
  session,
  asyncAction,
  inboxJamesDeletedMessagesService,
  INBOX_JAMES_DELETED_MESSAGES
) {
  var self = this;
  var SUBMIT_MESSAGES = {
    progressing: 'Submitting request...',
    success: 'Request is being processed',
    failure: 'Failed to submit request'
  };

  self.onSendButtonClick = onSendButtonClick;
  self.criteria = [];

  function onSendButtonClick() {
    return asyncAction(SUBMIT_MESSAGES, function() {
      return _submitRecoverRequest().then(function() {
        $state.go('unifiedinbox');
      });
    });
  }

  function _submitRecoverRequest() {
    return inboxJamesDeletedMessagesService.submitRestoringRequest(session.user._id, {
      combinator: INBOX_JAMES_DELETED_MESSAGES.COMBINATOR,
      criteria: self.criteria
    });
  }
}
