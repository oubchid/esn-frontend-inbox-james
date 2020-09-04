'use strict';

/* global chai, sinon: false */

var expect = chai.expect;

describe('The InboxJamesDlpSettingsRuleFormController', function() {
  var $rootScope, $controller;

  beforeEach(function() {
    module('esn.inbox-james');

    inject(function(
      _$rootScope_,
      _$controller_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
    });
  });

  function initController($scope, rule) {
    $scope = $scope || $rootScope.$new();

    var controller = $controller('InboxJamesDlpSettingsRuleFormController', { $scope: $scope }, { rule: rule || {} });

    $scope.$digest();

    return controller;
  }

  describe('The onDeleteBtnClick function', function() {
    it('should set #rule.deleted to true', function() {
      var form = {
        $setDirty: sinon.spy()
      };
      var controller = initController();

      controller.onDeleteBtnClick(form);

      expect(controller.rule.deleted).to.be.true;
      expect(form.$setDirty).to.have.been.calledOnce;
    });
  });

  describe('The onUndoBtnClick function', function() {
    it('should set #rule.deleted to false', function() {
      var controller = initController();

      controller.onUndoBtnClick();

      expect(controller.rule.deleted).to.be.false;
    });
  });
});
