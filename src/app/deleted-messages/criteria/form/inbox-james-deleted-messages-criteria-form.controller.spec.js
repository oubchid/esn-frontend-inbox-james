'use strict';

/* global chai, sinon: false */

var expect = chai.expect;

describe('The InboxJamesDeletedMessagesCriteriaForm controller', function() {
  var $controller,
      controller,
      $scope,
      $rootScope,
      $timeout,
      elementScrollService,
      INBOX_JAMES_DELETED_MESSAGES;

  function initController() {
    controller = $controller('InboxJamesDeletedMessagesCriteriaFormController', { $scope: $scope });

    $scope.$digest();

    controller.$onInit();
  }

  beforeEach(function() {
    angular.mock.module('esn.inbox-james', function($provide) {
      $provide.value('$element', {
        find: angular.noop
      });
    });

    inject(function(_$rootScope_, _$controller_, _$timeout_, _elementScrollService_, _INBOX_JAMES_DELETED_MESSAGES_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $timeout = _$timeout_;
      elementScrollService = _elementScrollService_;
      INBOX_JAMES_DELETED_MESSAGES = _INBOX_JAMES_DELETED_MESSAGES_;
    });

    initController();
  });

  describe('addCriterion function', function() {
    it('should add a default criterion then call elementScrollService.scrollDownToElement', function() {
      elementScrollService.scrollDownToElement = sinon.spy();

      controller.addCriterion();
      $timeout.flush();

      expect(controller.criteria[0]).to.eql(INBOX_JAMES_DELETED_MESSAGES.CRITERIA.DEFAULT_CRITERION);
      expect(elementScrollService.scrollDownToElement).to.have.been.called;
    });
  });

  describe('deleteCriterion function', function() {
    it('should remove a criterion with the given index', function() {
      controller.criteria = [
        { fieldName: 'fieldName0', operator: 'operator0' },
        { fieldName: 'fieldName1', operator: 'operator1' },
        { fieldName: 'fieldName2', operator: 'operator2' }
      ];
      var originalCriteria = angular.copy(controller.criteria);

      controller.deleteCriterion(1);

      expect(controller.criteria).to.be.have.lengthOf(2);
      expect(controller.criteria).to.not.include(originalCriteria[1]);
    });
  });
});
