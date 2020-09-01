'use strict';

angular.module('esn.inbox-james')
  .run(function(inboxCustomRoleMailboxService, INBOX_RESTORED_MESSAGES_MAILBOX) {
    inboxCustomRoleMailboxService.add(INBOX_RESTORED_MESSAGES_MAILBOX);
  });
