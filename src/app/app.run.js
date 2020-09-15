'use strict';

angular.module('esn.inbox-james')
  .run(addTemplateCache);

function addTemplateCache($templateCache) {
  $templateCache.put('/unifiedinbox.james/app/mail-repository/email/inbox-james-mail-repository-email-dialog.html', require('./mail-repository/email/inbox-james-mail-repository-email-dialog.pug'));
  $templateCache.put('/unifiedinbox.james/app/mail-repository/email/delete/inbox-james-mail-repository-email-delete-dialog.html', require('./mail-repository/email/delete/inbox-james-mail-repository-email-delete-dialog.pug'));
}
