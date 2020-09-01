'use strict';

angular.module('esn.inbox-james')
  .service('inboxJamesDeletedMessagesService', inboxJamesDeletedMessagesService);

function inboxJamesDeletedMessagesService(inboxJamesRestangular) {
  return {
    submitRestoringRequest: submitRestoringRequest
  };

  function submitRestoringRequest(targetUser, content) {
    return inboxJamesRestangular.all('restoringDeletedMessagesRequest').customPOST({
      targetUser: targetUser,
      content: content
    });
  }
}
