'use strict';

/* global chai, sinon: false */

var expect = chai.expect;

describe('The inboxJamesDlpRuleDisplayerController', function() {
  var $rootScope, $controller;
  var session;
  var jamesApiClientMock;
  var INBOX_JAMES_DLP_MAIL_REPOSITORIES;
  var DOMAIN_ID = '1';

  beforeEach(function() {
    angular.mock.module('esn.inbox-james');

    jamesApiClientMock = { getDlpRule: function() {} };

    angular.mock.module(function($provide) {
      $provide.value('jamesApiClient', jamesApiClientMock);
    });

    inject(function(
      _$rootScope_,
      _$controller_,
      _session_,
      _INBOX_JAMES_DLP_MAIL_REPOSITORIES_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      session = _session_;
      INBOX_JAMES_DLP_MAIL_REPOSITORIES = _INBOX_JAMES_DLP_MAIL_REPOSITORIES_;
    });

    session.domain._id = DOMAIN_ID;
  });

  function initController(email) {
    var $scope = $rootScope.$new();

    var controller = $controller('inboxJamesDlpRuleDisplayerController', { $scope: $scope });

    controller.email = email;
    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  describe('The $onInit function', function() {
    it('should not display rule details if mail is not from quarantine or rejected repository', function() {
      var controller = initController({
        repository: 'a',
        attributes: { DlpMatchedRule: '123' }
      });

      expect(controller.shouldDisplay).to.be.false;
    });

    it('should not display rule details if mail object does not contain dlp matched rule', function() {
      var controller = initController({
        repository: INBOX_JAMES_DLP_MAIL_REPOSITORIES.QUARANTINE,
        attributes: {}
      });

      expect(controller.shouldDisplay).to.be.false;
    });

    it('should get rule details for valid mail that contains matched rule and in correct repository', function() {
      jamesApiClientMock.getDlpRule = sinon.stub().returns($q.when({
        targetsSender: true,
        targetsContent: true,
        targetsRecipients: true
      }));

      var controller = initController({
        repository: INBOX_JAMES_DLP_MAIL_REPOSITORIES.QUARANTINE,
        attributes: { DlpMatchedRule: '123' }
      });

      expect(controller.shouldDisplay).to.be.true;
      expect(jamesApiClientMock.getDlpRule).to.have.been.called;
    });

    it('should display rule details with matching source based on the rule details', function() {
      jamesApiClientMock.getDlpRule = sinon.stub().returns($q.when({
        targetsSender: true,
        targetsContent: true,
        targetsRecipients: false
      }));

      var controller = initController({
        repository: INBOX_JAMES_DLP_MAIL_REPOSITORIES.QUARANTINE,
        attributes: { DlpMatchedRule: '123' }
      });

      expect(controller.shouldDisplay).to.be.true;
      expect(jamesApiClientMock.getDlpRule).to.have.been.called;
      expect(controller.rule.source).to.equal('message content, sender');
    });
  });
});
