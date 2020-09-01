'use strict';

angular.module('esn.inbox-james')
  .controller('inboxJamesDlpQuarantineActionsController', inboxJamesDlpQuarantineActionsController);

function inboxJamesDlpQuarantineActionsController(
  $q,
  $rootScope,
  asyncAction,
  jamesApiClient,
  inboxJamesMailRepositoryEmailSelection,
  session,
  INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS,
  INBOX_JAMES_MAIL_REPOSITORY_EVENTS
) {
  var self = this;
  var DOMAIN_ID = session.domain._id;
  var DENY_MESSAGES = {
    progressing: 'Moving mails...',
    success: 'Emails moved to rejected repository',
    failure: 'Failed to move mails'
  };
  var ALLOW_MESSAGES = {
    progressing: 'Scheduling mails delivery...',
    success: 'Delivery of mails scheduled',
    failure: 'Failed to schedule delivery'
  };

  self.onDenyBtnClick = onDenyBtnClick;
  self.onAllowBtnClick = onAllowBtnClick;

  function onDenyBtnClick() {
    return asyncAction(DENY_MESSAGES, function() {
      return _reprocessMails(INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.REJECT);
    });
  }

  function onAllowBtnClick() {
    return asyncAction(ALLOW_MESSAGES, function() {
      return _reprocessMails(INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.TRANSPORT);
    });
  }

  function _reprocessMails(processor) {
    if (self.onClick) self.onClick();

    if (self.bulkAction) {
      return jamesApiClient.reprocessAllMailsFromMailRepository(
        DOMAIN_ID,
        self.repository,
        { processor: processor }
      ).then(function() {
        $rootScope.$broadcast(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.ALL_MAILS_REMOVED);
      });
    }

    var selectedEmails = self.email ? [self.email] : inboxJamesMailRepositoryEmailSelection.getSelected();

    return $q.all(selectedEmails.map(function(email) {
      return jamesApiClient.reprocessMailFromMailRepository(
        DOMAIN_ID,
        email.repository,
        email.name,
        { processor: processor }
      );
    })).then(function() {
      $rootScope.$broadcast(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.MAILS_REMOVED, {
        emails: selectedEmails
      });
    });
  }
}
