'use strict';

angular.module('esn.inbox-james')
  .controller('inboxJamesMailRepositoryController', inboxJamesMailRepositoryController);

function inboxJamesMailRepositoryController(
  $scope,
  _,
  infiniteScrollHelper,
  inboxJamesMailRepository,
  inboxJamesMailRepositoryEmailSelection,
  ELEMENTS_PER_REQUEST,
  INBOX_JAMES_MAIL_REPOSITORY_EVENTS,
  INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET
) {
  var self = this;
  var DEFAULT_LIMIT = ELEMENTS_PER_REQUEST || 20;

  var options = {
    offset: 0,
    limit: DEFAULT_LIMIT
  };

  self.$onInit = $onInit;
  self.$onDestroy = $onDestroy;
  self.downloadMail = downloadMail;
  self.deleteMail = deleteMail;

  function $onInit() {
    self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems, null, DEFAULT_LIMIT);

    $scope.$on(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.MAILS_REMOVED, _removeMailsFromList);
    $scope.$on(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.ALL_MAILS_REMOVED, _removeAllMailsFromList);
  }

  function $onDestroy() {
    inboxJamesMailRepositoryEmailSelection.unSelectAll();
  }

  function downloadMail(email) {
    inboxJamesMailRepository.downloadEmlFile(self.repository, email.name);
  }

  function deleteMail(email) {
    inboxJamesMailRepository.openMailsDeletingModal({
      target: INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET.SINGLE,
      data: email
    });
  }

  function _removeMailsFromList(event, data) {
    if (data.emails) {
      data.emails.forEach(function(email) {
        self.elements = self.elements.filter(function(e) {
          return e.name !== email.name;
        });
      });
      inboxJamesMailRepositoryEmailSelection.unSelectAll();
    }
  }

  function _removeAllMailsFromList() {
    self.elements.length = 0;
    inboxJamesMailRepositoryEmailSelection.unSelectAll();
  }

  function _loadNextItems() {
    options.offset = self.elements.length;

    return inboxJamesMailRepository.list(self.repository, options);
  }
}
