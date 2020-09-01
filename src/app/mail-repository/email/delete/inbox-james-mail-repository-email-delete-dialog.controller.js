'use strict';

const _ = require('lodash');

angular.module('esn.inbox-james')
  .controller('inboxJamesMailRepositoryEmailDeleteDialogController', inboxJamesMailRepositoryEmailDeleteDialogController);

function inboxJamesMailRepositoryEmailDeleteDialogController(
  $q,
  context,
  asyncAction,
  esnI18nService,
  inboxJamesMailRepository,
  INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET
) {
  var self = this;

  self.$onInit = $onInit;

  function $onInit() {
    self.target = context.data.length === 1 ? INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET.SINGLE : context.target;

    self.onDeleteBtnClick = function() {
      return asyncAction(
        _buildNotificationMessage(),
        _delete
      );
    };
  }

  function _delete() {
    if (context.target === INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET.ALL) {
      return inboxJamesMailRepository.deleteAllMails(context.data);
    }

    if (context.target === INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET.MULTIPLE) {
      return inboxJamesMailRepository.deleteMails(context.data);
    }

    if (context.target === INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET.SINGLE) {
      return inboxJamesMailRepository.deleteMails([context.data]);
    }
  }

  function _buildNotificationMessage() {
    if (self.target === INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET.ALL) {
      return {
        progressing: 'Deleting all mails...',
        success: 'All mails deleted',
        failure: 'Failed to delete mails'
      };
    }

    if (self.target === INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET.SINGLE) {
      return {
        progressing: 'Deleting mail...',
        success: 'Mail deleted',
        failure: 'Failed to delete mail'
      };
    }

    if (self.target === INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET.MULTIPLE) {
      return {
        progressing: esnI18nService.translate('Deleting %s mails...', context.data.length),
        success: esnI18nService.translate('%s mails deleted', context.data.length),
        failure: 'Failed to delete mails'
      };
    }
  }
}
