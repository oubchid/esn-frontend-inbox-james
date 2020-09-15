'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The inboxJamesMailRepositoryController', function() {
  var $rootScope, $controller, $scope;
  var $modalMock, infiniteScrollHelperMock, ELEMENTS_PER_REQUEST_MOCK;

  beforeEach(function() {
    infiniteScrollHelperMock = sinon.stub().returns();
    $modalMock = sinon.spy();

    angular.mock.module('esn.inbox-james');
    angular.mock.module(function($provide) {
      $provide.value('infiniteScrollHelper', infiniteScrollHelperMock);
      $provide.constant('ELEMENTS_PER_REQUEST', ELEMENTS_PER_REQUEST_MOCK);
      $provide.constant('$modal', $modalMock);
    });

    inject(function(_$rootScope_, _$controller_) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
    });
  });

  function initController() {
    $scope = $rootScope.$new();

    var controller = $controller('inboxJamesMailRepositoryController', { $scope: $scope });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  describe('when ELEMENTS_PER_REQUEST constant is not defined', function() {
    before(function() {
      ELEMENTS_PER_REQUEST_MOCK = undefined;
    });

    it('should call infiniteScrollHelper with specific number', function() {
      initController();

      expect(infiniteScrollHelperMock).to.have.been.called;
      expect(infiniteScrollHelperMock.getCall(0).args[3] === 20).to.be.true;
    });
  });

  describe('when ELEMENTS_PER_REQUEST constant is defined', function() {
    before(function() {
      ELEMENTS_PER_REQUEST_MOCK = 1;
    });

    it('should call infiniteScrollHelper with ELEMENTS_PER_REQUEST', function() {
      initController();

      expect(infiniteScrollHelperMock).to.have.been.called;
      expect(infiniteScrollHelperMock.getCall(0).args[3] === ELEMENTS_PER_REQUEST_MOCK).to.be.true;
    });
  });
});
