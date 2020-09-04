'use strict';

angular.module('esn.inbox-james')
  .controller('inboxJamesMailRepositoryEmailSelectionController', inboxJamesMailRepositoryEmailSelectionController);

function inboxJamesMailRepositoryEmailSelectionController(inboxJamesMailRepositoryEmailSelection) {
  var self = this;

  self.select = select;

  function select() {
    inboxJamesMailRepositoryEmailSelection.toggleSelection(self.email);
  }
}
