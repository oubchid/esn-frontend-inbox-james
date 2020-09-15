'use strict';

/* global chai, sinon: false */

var expect = chai.expect;

describe('The inboxJamesDlpQuarantineActionsController', function() {
  var $rootScope, $controller;
  var inboxJamesMailRepositoryEmailSelection, session;
  var jamesApiClientMock;
  var INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS, INBOX_JAMES_MAIL_REPOSITORY_EVENTS;
  var DOMAIN_ID = '1';

  beforeEach(function() {
    angular.mock.module('esn.inbox-james');

    jamesApiClientMock = {
      reprocessAllMailsFromMailRepository: function() {},
      reprocessMailFromMailRepository: function() {}
    };

    angular.mock.module(function($provide) {
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
      'inboxJamesDlpQuarantineActionsController',
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

  describe('The onDenyBtnClick function', function() {
    describe('Single email', function() {
      it('should call onClick function', function(done) {
        var onClickMock = sinon.spy();
        var controller = initController({
          onClick: onClickMock,
          email: {}
        });

        jamesApiClientMock.reprocessAllMailsFromMailRepository = function() {
          return $q.when();
        };

        controller.onDenyBtnClick()
          .then(function() {
            expect(onClickMock).to.have.been.calledOnce;
            done();
          });

        $rootScope.$digest();
      });

      it('should reject if failed to deny quarantined email', function(done) {
        var email = { repository: 'a', name: 'b' };
        var controller = initController({
          onClick: function() {},
          email: email
        });

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.reject());

        controller.onDenyBtnClick()
          .catch(function() {
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              email.repository,
              email.name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.REJECT }
            );
            done();
          });

        $rootScope.$digest();
      });

      it('should resolve if success to deny quarantined email', function(done) {
        var email = { repository: 'a', name: 'b' };
        var controller = initController({
          onClick: function() {},
          email: email
        });

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.when());
        $rootScope.$broadcast = sinon.spy();

        controller.onDenyBtnClick()
          .then(function() {
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              email.repository,
              email.name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.REJECT }
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
      it('should reject if failed to deny quarantined emails', function(done) {
        var emails = [
          { repository: 'a1', name: 'b1' },
          { repository: 'a2', name: 'b2' }
        ];

        var controller = initController();

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.reject());
        inboxJamesMailRepositoryEmailSelection.getSelected = sinon.stub().returns(emails);

        controller.onDenyBtnClick()
          .catch(function() {
            expect(inboxJamesMailRepositoryEmailSelection.getSelected).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledTwice;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[0].repository,
              emails[0].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.REJECT }
            );
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[1].repository,
              emails[1].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.REJECT }
            );
            done();
          });

        $rootScope.$digest();
      });

      it('should resolve if success to deny quarantined emails', function(done) {
        var emails = [
          { repository: 'a1', name: 'b1' },
          { repository: 'a2', name: 'b2' }
        ];

        var controller = initController();

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.when());
        inboxJamesMailRepositoryEmailSelection.getSelected = sinon.stub().returns(emails);
        $rootScope.$broadcast = sinon.spy();

        controller.onDenyBtnClick()
          .then(function() {
            expect(inboxJamesMailRepositoryEmailSelection.getSelected).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledTwice;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[0].repository,
              emails[0].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.REJECT }
            );
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[1].repository,
              emails[1].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.REJECT }
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
      it('should reject if failed to deny all quarantined emails', function(done) {
        var repository = 'a';
        var controller = initController({
          onClick: function() {},
          repository: repository
        });

        jamesApiClientMock.reprocessAllMailsFromMailRepository = sinon.stub().returns($q.reject());

        controller.bulkAction = true;
        controller.onDenyBtnClick()
          .catch(function() {
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              repository,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.REJECT }
            );
            done();
          });

        $rootScope.$digest();
      });

      it('should resolve if success to deny all quarantined emails', function(done) {
        var repository = 'a';
        var controller = initController({
          onClick: function() {},
          repository: repository
        });

        jamesApiClientMock.reprocessAllMailsFromMailRepository = sinon.stub().returns($q.when());
        $rootScope.$broadcast = sinon.spy();

        controller.bulkAction = true;
        controller.onDenyBtnClick()
          .then(function() {
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              repository,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.REJECT }
            );
            expect($rootScope.$broadcast).to.have.been.calledWith(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.ALL_MAILS_REMOVED);
            done();
          });

        $rootScope.$digest();
      });
    });
  });

  describe('The onAllowBtnClick function', function() {
    describe('Single email', function() {
      it('should call onClick function', function(done) {
        var onClickMock = sinon.spy();
        var controller = initController({
          onClick: onClickMock,
          email: {}
        });

        jamesApiClientMock.reprocessAllMailsFromMailRepository = function() {
          return $q.when();
        };

        controller.onAllowBtnClick()
          .then(function() {
            expect(onClickMock).to.have.been.calledOnce;
            done();
          });

        $rootScope.$digest();
      });

      it('should reject if failed to allow quarantined email', function(done) {
        var email = { repository: 'a', name: 'b' };
        var controller = initController({
          onClick: function() {},
          email: email
        });

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.reject());

        controller.onAllowBtnClick()
          .catch(function() {
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              email.repository,
              email.name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.TRANSPORT }
            );
            done();
          });

        $rootScope.$digest();
      });

      it('should resolve if success to allow quarantined email', function(done) {
        var email = { repository: 'a', name: 'b' };
        var controller = initController({
          onClick: function() {},
          email: email
        });

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.when());
        $rootScope.$broadcast = sinon.spy();

        controller.onAllowBtnClick()
          .then(function() {
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              email.repository,
              email.name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.TRANSPORT }
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
      it('should reject if failed to allow quarantined emails', function(done) {
        var emails = [
          { repository: 'a1', name: 'b1' },
          { repository: 'a2', name: 'b2' }
        ];

        var controller = initController();

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.reject());
        inboxJamesMailRepositoryEmailSelection.getSelected = sinon.stub().returns(emails);

        controller.onAllowBtnClick()
          .catch(function() {
            expect(inboxJamesMailRepositoryEmailSelection.getSelected).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledTwice;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[0].repository,
              emails[0].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.TRANSPORT }
            );
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[1].repository,
              emails[1].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.TRANSPORT }
            );
            done();
          });

        $rootScope.$digest();
      });

      it('should resolve if success to allow quarantined emails', function(done) {
        var emails = [
          { repository: 'a1', name: 'b1' },
          { repository: 'a2', name: 'b2' }
        ];

        var controller = initController();

        jamesApiClientMock.reprocessMailFromMailRepository = sinon.stub().returns($q.when());
        inboxJamesMailRepositoryEmailSelection.getSelected = sinon.stub().returns(emails);
        $rootScope.$broadcast = sinon.spy();

        controller.onAllowBtnClick()
          .then(function() {
            expect(inboxJamesMailRepositoryEmailSelection.getSelected).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledTwice;
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[0].repository,
              emails[0].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.TRANSPORT }
            );
            expect(jamesApiClientMock.reprocessMailFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              emails[1].repository,
              emails[1].name,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.TRANSPORT }
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
      it('should reject if failed to allow all quarantined emails', function(done) {
        var repository = 'a';
        var controller = initController({
          onClick: function() {},
          repository: repository
        });

        jamesApiClientMock.reprocessAllMailsFromMailRepository = sinon.stub().returns($q.reject());

        controller.bulkAction = true;
        controller.onAllowBtnClick()
          .catch(function() {
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              repository,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.TRANSPORT }
            );
            done();
          });

        $rootScope.$digest();
      });

      it('should resolve if success to allow all quarantined emails', function(done) {
        var repository = 'a';
        var controller = initController({
          onClick: function() {},
          repository: repository
        });

        jamesApiClientMock.reprocessAllMailsFromMailRepository = sinon.stub().returns($q.when());
        $rootScope.$broadcast = sinon.spy();

        controller.bulkAction = true;
        controller.onAllowBtnClick()
          .then(function() {
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledOnce;
            expect(jamesApiClientMock.reprocessAllMailsFromMailRepository).to.have.been.calledWith(
              DOMAIN_ID,
              repository,
              { processor: INBOX_JAMES_MAIL_REPOSITORY_PROCESSORS.TRANSPORT }
            );
            expect($rootScope.$broadcast).to.have.been.calledWith(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.ALL_MAILS_REMOVED);
            done();
          });

        $rootScope.$digest();
      });
    });
  });
});
