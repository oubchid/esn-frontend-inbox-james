'use strict';

angular.module('esn.inbox-james')
  .factory('inboxJamesMailRepositoryEmailSelection', inboxJamesMailRepositoryEmailSelection);

function inboxJamesMailRepositoryEmailSelection(_) {
  var selectedEmails = [];
  var selecting;

  return {
    isSelecting: function() { return selecting; },
    getSelected: function() { return _.clone(selectedEmails); },
    toggleSelection: toggleSelection,
    unSelectAll: unSelectAll
  };

  function toggleSelection(email, selected) {
    selected = angular.isDefined(selected) ? selected : !email.selected;

    if (email.selected === selected) {
      return;
    }

    email.selected = selected;

    if (email.selected) {
      selectedEmails.push(email);
    } else {
      _.pull(selectedEmails, email);
    }

    selecting = selectedEmails.length > 0;
  }

  function unSelectAll() {
    selectedEmails.forEach(function(email) {
      email.selected = false;
    });

    selectedEmails.length = 0;
    selecting = false;
  }
}
