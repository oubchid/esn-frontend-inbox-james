'use strict';

/* global chai, sinon: false */

var expect = chai.expect;

describe('The inboxJamesDlpRejectedActionsController', function() {
  var $rootScope, $controller;
  var inboxJamesMailRepositoryEmailSelection, session;
  var jamesApiClientMock;
  var INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS, INBOX_JAMES_MAIL_REPOSITORY_EVENTS;
  var DOMAIN_ID = '1';

  beforeEach(function() {
    module('esn.inbox-james');

    jamesApiClientMock = {
      reprocessAllMailsFromMailRepository: function() {},
      reprocessMailFromMailRepository: function() {}
    };

    module(function($provide) {
      $provide.value('jamesApiClient', jamesApiClientMock);
    });

    inject(function(
      _$rootScope_,
      _$controller_,
      _inboxJamesMailRepositoryEmailSelection_,
      _session_,
      _INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS_,
      _INBOX_JAMES_MAIL_REPOSITORY_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      inboxJamesMailRepositoryEmailSelection = _inboxJamesMailRepositoryEmailSelection_;
      session = _session_;
      INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS = _INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS_;
      INBOX_JAMES_MAIL_REPOSITORY_EVENTS = _INBOX_JAMES_MAIL_REPOSITORY_EVENTS_;
    });

    session.domain._id = DOMAIN_ID;
  });

  function initController(options) {
    options = options || {};
    var $scope = $rootScope.$new();
    var controller = $controller(
      'inboxJamesDlpRejectedActionsController',
      { $scope: $scope },
      {
        email: options.email,
        onClick: options.onClick,
        repository: options.repository
      }
    );

    $scope.$digest();

    return controller;
  }

  describe('The onQuarantineBtnClick function', function() {
    describe('Single email', function() {
      it('should call onClick function', function(done) {
        var onClickMock = sinon.spy();
        var controller = initController({
          onClick: onClickMock,
          email: {}
        });

        jamesApiClientMock.reprocessMailFromMailRepository = function() {
          return $q.when();
        };

        controller.onQuarantineBtnClick()
          .then(function() {
            expect(onClickMock).to.have.been.calledOnce;
            done();
          });

        $rootScope.$digest();
      });

      it('should reject if failed to quarantine quarantined email', function(done) {
        var email = { repository: 'a', name: 'b' };
        var controller = initController({
          onClick: function() {},
          email: email
        });

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.reject());

        controller.onQuarantineBtnClick()
          .catch(function() {
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              email.repository,
              email.name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.QUARANTINE }
            );
            done();
          });

        $rootScope.$digest();
      });

      it('should resolve if success to quarantine quarantined email', function(done) {
        var email = { name: '1234567' };
        var controller = initController({
          onClick: function() {},
          email: email
        });

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.when());
        $rootScope.$broadcast = sinon.spy();

        controller.onQuarantineBtnClick()
          .then(function() {
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              email.repository,
              email.name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.QUARANTINE }
            );
            expect($rootScope.$broadcast).to.have.been.calledWith(
              INBOX_JAMES_MAIL_REPOSITORY_EVENTS.MAILS_REMOVED,
              { emails: [email] }
            );
            done();
          });

        $rootScope.$digest();
      });
    });

    describe('Multiple emails', function() {
      it('should reject if failed to quarantine quarantined emails', function(done) {
        var emails = [
          { repository: 'a1', name: 'b1' },
          { repository: 'a2', name: 'b2' }
        ];
        var controller = initController();

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.reject());
        inboxJamesMailRepositoryEmailSelection.getSelected = sinon.stub().returns(emails);

        controller.onQuarantineBtnClick()
          .catch(function() {
            expect(inboxJamesMailRepositoryEmailSelection.getSelected).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledTwice;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[0].repository,
              emails[0].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.QUARANTINE }
            );
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[1].repository,
              emails[1].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.QUARANTINE }
            );
            done();
          });

        $rootScope.$digest();
      });

      it('should resolve if success to quarantine quarantined emails', function(done) {
        var emails = [
          { repository: 'a1', name: 'b1' },
          { repository: 'a2', name: 'b2' }
        ];
        var controller = initController();

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.when());
        inboxJamesMailRepositoryEmailSelection.getSelected = sinon.stub().returns(emails);
        $rootScope.$broadcast = sinon.spy();

        controller.onQuarantineBtnClick()
          .then(function() {
            expect(inboxJamesMailRepositoryEmailSelection.getSelected).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledTwice;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[0].repository,
              emails[0].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.QUARANTINE }
            );
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[1].repository,
              emails[1].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.QUARANTINE }
            );
            expect($rootScope.$broadcast).to.have.been.calledWith(
              INBOX_JAMES_MAIL_REPOSITORY_EVENTS.MAILS_REMOVED,
              { emails: emails }
            );
            done();
          });

        $rootScope.$digest();
      });
    });

    describe('All emails', function() {
      it('should reject if failed to quarantine all quarantined emails', function(done) {
        var repository = 'a';

        var controller = initController({
          onClick: function() {},
          repository: repository
        });

        jamesApiClientMock.reprocessAllMailsFromMailRepository = sinon.stub().returns($q.reject());

        controller.bulkAction = true;
        controller.onQuarantineBtnClick()
          .catch(function() {
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              repository,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.QUARANTINE }
            );
            done();
          });

        $rootScope.$digest();
      });

      it('should resolve if success to quarantine all quarantined emails', function(done) {
        var repository = 'a';

        var controller = initController({
          onClick: function() {},
          repository: repository
        });

        jamesApiClientMock.reprocessAllMailsFromMailRepository = sinon.stub().returns($q.when());
        $rootScope.$broadcast = sinon.spy();

        controller.bulkAction = true;
        controller.onQuarantineBtnClick()
          .then(function() {
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              repository,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.QUARANTINE }
            );
            expect($rootScope.$broadcast).to.have.been.calledWith(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.ALL_MAILS_REMOVED);
            done();
          });

        $rootScope.$digest();
      });
    });
  });
});
