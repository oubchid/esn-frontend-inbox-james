'use strict';

angular.module('esn.inbox-james')
  .controller('inboxJamesMailRepositoryHeaderController', inboxJamesMailRepositoryHeaderController);

function inboxJamesMailRepositoryHeaderController(
  $scope,
  inboxJamesMailRepository,
  inboxJamesMailRepositoryEmailSelection,
  INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET
) {
  var self = this;

  self.$onInit = $onInit;
  self.getNumberOfSelectedEmails = getNumberOfSelectedEmails;
  self.isSelecting = isSelecting;
  self.onDeleteBtnClick = onDeleteBtnClick;
  self.selectAllMails = selectAllMails;
  self.selectRepository = selectRepository;

  function $onInit() {
    $scope.$watch(function() {
      return self.emails.length === inboxJamesMailRepositoryEmailSelection.getSelected().length;
    }, function(selectedAllEmails) {
      if (!selectedAllEmails && self.selectedAllEmails && self.repositorySelected) {
        self.repositorySelected = false;
      }

      self.selectedAllEmails = !!selectedAllEmails;
    });
  }

  function selectAllMails(selection) {
    self.repositorySelected = false;

    if (selection) {
      self.selectedAllEmails = selection;
    }

    _toggleSelectAll(self.selectedAllEmails);
  }

  function selectRepository() {
    self.repositorySelected = true;
    self.bulkAction = true;

    _toggleSelectAll(self.repositorySelected);
  }

  function getNumberOfSelectedEmails() {
    return inboxJamesMailRepositoryEmailSelection.getSelected().length;
  }

  function isSelecting() {
    return inboxJamesMailRepositoryEmailSelection.isSelecting();
  }

  function onDeleteBtnClick() {
    var context = {
      target: INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET.MULTIPLE,
      data: inboxJamesMailRepositoryEmailSelection.getSelected()
    };

    if (self.repositorySelected) {
      context = {
        target: INBOX_JAMES_MAIL_REPOSITORY_MAIL_DELETION_TARGET.ALL,
        data: self.repository
      };
    }

    inboxJamesMailRepository.openMailsDeletingModal(context);
  }

  function _toggleSelectAll(isSelectAll) {
    if (!isSelectAll) {
      inboxJamesMailRepositoryEmailSelection.unSelectAll();
    } else {
      self.emails.forEach(function(email) {
        inboxJamesMailRepositoryEmailSelection.toggleSelection(email, true);
      });
    }
  }
}
