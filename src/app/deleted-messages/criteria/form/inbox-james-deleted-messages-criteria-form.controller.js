'use strict';

const _ = require('lodash');

angular.module('esn.inbox-james')
  .controller('InboxJamesDeletedMessagesCriteriaFormController', InboxJamesDeletedMessagesCriteriaFormController);

function InboxJamesDeletedMessagesCriteriaFormController($timeout, $element, elementScrollService, INBOX_JAMES_DELETED_MESSAGES) {
  var self = this;

  self.$onInit = $onInit;
  self.addCriterion = addCriterion;
  self.deleteCriterion = deleteCriterion;

  function $onInit() {
    self.criteria = self.criteria || [];
  }

  function addCriterion() {
    self.criteria.push(_.clone(INBOX_JAMES_DELETED_MESSAGES.CRITERIA.DEFAULT_CRITERION));

    $timeout(function() {
      elementScrollService.scrollDownToElement($(_.last($element.find('inbox-james-deleted-messages-criteria-item'))));
    }, 0);
  }

  function deleteCriterion(index) {
    self.criteria.splice(index, 1);
  }
}
