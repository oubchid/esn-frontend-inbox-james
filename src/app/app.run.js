'use strict';

angular.module('esn.inbox-james')
  .run(function(inboxCustomRoleMailboxService, INBOX_RESTORED_MESSAGES_MAILBOX) {
    inboxCustomRoleMailboxService.add(INBOX_RESTORED_MESSAGES_MAILBOX);
  })

  .run(addTemplateCache);

function addTemplateCache($templateCache) {
  $templateCache.put('/unifiedinbox.james/app/mail-repository/email/inbox-james-mail-repository-email-dialog.html', require('./mail-repository/email/inbox-james-mail-repository-email-dialog.pug'));
  $templateCache.put('/unifiedinbox.james/app/mail-repository/email/delete/inbox-james-mail-repository-email-delete-dialog.html', require('./mail-repository/email/delete/inbox-james-mail-repository-email-delete-dialog.pug'));
}
