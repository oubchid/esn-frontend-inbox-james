'use strict';

angular.module('esn.inbox-james')
  .controller('inboxJamesDlpRejectedActionsController', inboxJamesDlpRejectedActionsController);

function inboxJamesDlpRejectedActionsController(
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
  var REVISE_MESSAGES = {
    progressing: 'Moving mails...',
    success: 'Emails moved to quarantined repository',
    failure: 'Failed to move mails'
  };

  self.onQuarantineBtnClick = onQuarantineBtnClick;

  function onQuarantineBtnClick() {
    return asyncAction(REVISE_MESSAGES, function() {
      return _quarantineMails();
    });
  }

  function _quarantineMails() {
    var processor = INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.QUARANTINE;

    if (self.bulkAction) {
      return jamesApiClient.reprocessAllMailsFromMailRepository(
        DOMAIN_ID,
        self.repository,
        { processor: processor }
      ).then(function() {
        $rootScope.$broadcast(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.ALL_MAILS_REMOVED);
      });
    }

    if (self.email) {
      self.onClick();

      return jamesApiClient.reprocessMailFromMailRepository(
        DOMAIN_ID,
        self.email.repository,
        self.email.name,
        { processor: processor }
      ).then(function() {
        $rootScope.$broadcast(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.MAILS_REMOVED, {
          emails: [self.email]
        });
      });
    }

    var selectedEmails = inboxJamesMailRepositoryEmailSelection.getSelected();

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
