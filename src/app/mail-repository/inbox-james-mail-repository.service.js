'use strict';

const _ = require('lodash');

angular.module('esn.inbox-james')
  .factory('inboxJamesMailRepository', inboxJamesMailRepository);

function inboxJamesMailRepository(
  $q,
  $modal,
  $rootScope,
  InboxJamesMailRepositoryEmail,
  jamesApiClient,
  session,
  userAPI,
  userUtils,
  INBOX_JAMES_MAIL_REPOSITORY_EMAIL_FIELDS,
  INBOX_JAMES_MAIL_REPOSITORY_EVENTS
) {
  var DOMAIN_ID = session.domain._id;

  return {
    deleteAllMails: deleteAllMails,
    deleteMails: deleteMails,
    downloadEmlFile: downloadEmlFile,
    list: list,
    openMailsDeletingModal: openMailsDeletingModal
  };

  function downloadEmlFile(mailRepository, emailKey) {
    jamesApiClient.downloadEmlFileFromMailRepository(DOMAIN_ID, mailRepository, emailKey);
  }

  function deleteMails(emails) {
    return $q.all(emails.map(function(email) {
      return jamesApiClient.removeMailFromMailRepository(DOMAIN_ID, email.repository, email.name);
    })).then(function() {
      $rootScope.$broadcast(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.MAILS_REMOVED, {
        emails: emails
      });
    });
  }

  function deleteAllMails(repository) {
    return jamesApiClient.removeAllMailsFromMailRepository(DOMAIN_ID, repository)
      .then(function() {
        $rootScope.$broadcast(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.ALL_MAILS_REMOVED);
      });
  }

  function openMailsDeletingModal(context) {
    $modal({
      templateUrl: '/unifiedinbox.james/app/mail-repository/email/delete/inbox-james-mail-repository-email-delete-dialog.html',
      backdrop: 'static',
      placement: 'center',
      controller: 'inboxJamesMailRepositoryEmailDeleteDialogController',
      controllerAs: '$ctrl',
      locals: {
        context: context
      }
    });
  }

  function list(mailRepository, options) {
    return jamesApiClient.listMailsFromMailRepository(DOMAIN_ID, mailRepository, options)
      .then(function(emailKeys) {
        var gettingAllMails = emailKeys.map(function(key) {
          return _getMailDetails(DOMAIN_ID, mailRepository, key);
        });

        return $q.all(gettingAllMails);
      });
  }

  function _getMailDetails(domainId, mailRepository, emailKey) {
    return jamesApiClient.getMailFromMailRepository(domainId, mailRepository, emailKey, {
      additionalFields: INBOX_JAMES_MAIL_REPOSITORY_EMAIL_FIELDS.join(',')
    }).then(_includeRepository)
      .then(_populateSender)
      .then(function(email) {
        return new InboxJamesMailRepositoryEmail(email);
      });

    function _includeRepository(email) {
      email.repository = mailRepository;

      return email;
    }

    function _populateSender(email) {
      if (!email.sender) {
        return $q.when(email);
      }

      return userAPI.getUsersByEmail(email.sender)
        .then(function(response) {
          var foundUser = response.data && response.data[0] || {};

          email.sender = _.assign({}, foundUser, {
            email: email.sender,
            name: userUtils.displayNameOf(foundUser) || email.sender
          });

          return email;
        })
        .catch(function() {
          return email;
        });
    }
  }
}
