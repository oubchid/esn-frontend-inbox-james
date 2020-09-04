'use strict';

/* global chai, sinon: false */

var expect = chai.expect;

describe('The inboxJamesMailRepositoryEmailDeleteDialogController controller', function() {
  var $controller, $rootScope;
  var inboxJamesMailRepository, asyncAction; //eslint-disable-line no-unused-vars

  beforeEach(module('esn.inbox-james'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _inboxJamesMailRepository_, _asyncAction_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    inboxJamesMailRepository = _inboxJamesMailRepository_;
    asyncAction = _asyncAction_;
  }));

  function initController(context) {
    var $scope = $rootScope.$new();
    var controller = $controller('inboxJamesMailRepositoryEmailDeleteDialogController', {
      $scope: $scope,
      context: context
    });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  describe('The $onInit function', function() {
    it('should get the correct target for single mail deletion', function() {
      var controller = initController({
        target: 'single',
        data: { name: '123' }
      });

      expect(controller.target).to.equal('single');
    });

    it('should get the correct target for single mail deletion when selected list contains only one email', function() {
      var controller = initController({
        target: 'multiple',
        data: [{ name: '123' }]
      });

      expect(controller.target).to.equal('single');
    });

    it('should get the correct target for multiple mails deletion', function() {
      var controller = initController({
        target: 'multiple',
        data: [{ name: '123' }, { name: '234' }]
      });

      expect(controller.target).to.equal('multiple');
    });

    it('should get the correct target for all mails deletion', function() {
      var controller = initController({
        target: 'all',
        data: 'mail-repo'
      });

      expect(controller.target).to.equal('all');
    });
  });

  describe('The onDeleteBtnClick function', function() {
    var expectedMessages;

    beforeEach(function() {
      asyncAction = function(messages, action) {
        expect(messages).to.deep.equal(expectedMessages);

        return action();
      };
    });

    it('should use correct messages and call inboxJamesMailRepository.deleteAllMails to delete all mail', function() {
      var context = {
        target: 'all',
        data: '/var/mail/test'
      };
      var controller = initController(context);

      inboxJamesMailRepository.deleteAllMails = sinon.spy();
      expectedMessages = {
        progressing: 'Deleting all mails...',
        success: 'All mails deleted',
        failure: 'Failed to delete mails'
      };

      controller.onDeleteBtnClick();

      expect(inboxJamesMailRepository.deleteAllMails).to.have.been.calledWith(context.data);
    });

    it('should use correct messages and call inboxJamesMailRepository.deleteMails to delete multiple mails', function() {
      var context = {
        target: 'multiple',
        data: [{ name: 'mail1' }, { name: 'mail2' }]
      };
      var controller = initController(context);

      inboxJamesMailRepository.deleteMails = sinon.spy();
      expectedMessages = {
        progressing: 'Deleting %s mails...',
        success: '%s mails deleted',
        failure: 'Failed to delete mails'
      };

      controller.onDeleteBtnClick();

      expect(inboxJamesMailRepository.deleteMails).to.have.been.calledWith(context.data);
    });

    it('should use correct messages and call inboxJamesMailRepository.deleteMails to delete a single mail', function() {
      var context = {
        target: 'single',
        data: { name: 'mail1' }
      };
      var controller = initController(context);

      inboxJamesMailRepository.deleteMails = sinon.spy();
      expectedMessages = {
        progressing: 'Deleting mail...',
        success: 'Mail deleted',
        failure: 'Failed to delete mail'
      };

      controller.onDeleteBtnClick();

      expect(inboxJamesMailRepository.deleteMails).to.have.been.calledWith([context.data]);
    });
  });
});
