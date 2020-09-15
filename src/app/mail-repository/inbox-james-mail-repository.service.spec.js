'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The inboxJamesMailRepository service', function() {
  var $rootScope;
  var inboxJamesMailRepository, InboxJamesMailRepositoryEmail;
  var jamesApiClientMock, sessionMock;
  var userAPI, userUtils;
  var INBOX_JAMES_MAIL_REPOSITORY_EMAIL_FIELDS, INBOX_JAMES_MAIL_REPOSITORY_EVENTS;
  var DOMAIN_ID = '1';

  beforeEach(function() {
    angular.mock.module('esn.inbox-james');

    jamesApiClientMock = {
      listMailsFromMailRepository: function() {},
      getMailFromMailRepository: function() {},
      downloadEmlFileFromMailRepository: function() {},
      removeMailFromMailRepository: function() {},
      removeAllMailsFromMailRepository: function() {}
    };

    sessionMock = {
      domain: { _id: DOMAIN_ID },
      ready: { then: () => $q.when() }
    };

    angular.mock.module(function($provide) {
      $provide.value('jamesApiClient', jamesApiClientMock);
      $provide.value('session', sessionMock);
    });

    inject(function(
      _$rootScope_,
      _inboxJamesMailRepository_,
      _InboxJamesMailRepositoryEmail_,
      _userAPI_,
      _userUtils_,
      _INBOX_JAMES_MAIL_REPOSITORY_EMAIL_FIELDS_,
      _INBOX_JAMES_MAIL_REPOSITORY_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      inboxJamesMailRepository = _inboxJamesMailRepository_;
      InboxJamesMailRepositoryEmail = _InboxJamesMailRepositoryEmail_;
      userAPI = _userAPI_;
      userUtils = _userUtils_;
      INBOX_JAMES_MAIL_REPOSITORY_EMAIL_FIELDS = _INBOX_JAMES_MAIL_REPOSITORY_EMAIL_FIELDS_;
      INBOX_JAMES_MAIL_REPOSITORY_EVENTS = _INBOX_JAMES_MAIL_REPOSITORY_EVENTS_;

      userAPI.getUsersByEmail = function() {
        return $q.when([{
          _id: 'user1'
        }]);
      };
      userUtils.displayNameOf = function() {
        return 'User 1';
      };
    });
  });

  describe('The list function', function() {
    it('should get the mailkeys from email repository then populate email sender details', function(done) {
      var repository = 'a';
      var emailKeys = ['email-key-1', 'email-key-2'];
      var mailSample = {
        sender: 'user1@op.co',
        recipients: []
      };

      jamesApiClientMock.listMailsFromMailRepository = sinon.stub().returns($q.when(emailKeys));
      jamesApiClientMock.getMailFromMailRepository = sinon.stub().returns($q.when(mailSample));

      inboxJamesMailRepository.list(repository).then(function(results) {
        expect(jamesApiClientMock.listMailsFromMailRepository).to.have.been.calledOnce;
        expect(jamesApiClientMock.listMailsFromMailRepository).to.have.been.calledWith(DOMAIN_ID, repository);
        expect(jamesApiClientMock.getMailFromMailRepository).to.have.been.calledTwice;
        expect(jamesApiClientMock.getMailFromMailRepository).to.have.been.calledWith(DOMAIN_ID, repository, emailKeys[0], {
          additionalFields: INBOX_JAMES_MAIL_REPOSITORY_EMAIL_FIELDS.join(',')
        });
        expect(jamesApiClientMock.getMailFromMailRepository).to.have.been.calledWith(DOMAIN_ID, repository, emailKeys[1], {
          additionalFields: INBOX_JAMES_MAIL_REPOSITORY_EMAIL_FIELDS.join(',')
        });
        expect(results[0]).to.be.an.instanceof(InboxJamesMailRepositoryEmail);
        expect(results[1]).to.be.an.instanceof(InboxJamesMailRepositoryEmail);
        expect(results[0].repository).to.equal(repository);
        expect(results[1].repository).to.equal(repository);
        expect(results[0].sender.name).to.equal('User 1');
        expect(results[1].sender.name).to.equal('User 1');

        done();
      });

      $rootScope.$digest();
    });
  });

  describe('The downloadEmlFile function', function() {
    it('should call downloadEmlFileFromMailRepository with email repository', function() {
      var repository = 'a';
      var mailKey = 'b';

      jamesApiClientMock.downloadEmlFileFromMailRepository = sinon.spy();

      inboxJamesMailRepository.downloadEmlFile(repository, mailKey);

      expect(jamesApiClientMock.downloadEmlFileFromMailRepository).to.have.been.calledOnce;
      expect(jamesApiClientMock.downloadEmlFileFromMailRepository).to.have.been.calledWith(DOMAIN_ID, repository, mailKey);
    });
  });

  describe('The deleteMails function', function() {
    it('should call jamesApiClientMock.removeMailFromMailRepository to delete emails', function() {
      var emails = [
        { repository: 'a1', name: 'b1' },
        { repository: 'a2', name: 'b2' }
      ];

      jamesApiClientMock.removeMailFromMailRepository = sinon.stub().returns($q.when());

      inboxJamesMailRepository.deleteMails(emails);

      $rootScope.$digest();
      expect(jamesApiClientMock.removeMailFromMailRepository).to.have.been.calledTwice;
      expect(jamesApiClientMock.removeMailFromMailRepository).to.have.been.calledWith(DOMAIN_ID, emails[0].repository, emails[0].name);
      expect(jamesApiClientMock.removeMailFromMailRepository).to.have.been.calledWith(DOMAIN_ID, emails[1].repository, emails[1].name);
    });

    it('should broadcast remove-mails event after deleted emails successfully', function() {
      var emails = [
        { repository: 'a1', name: 'b1' },
        { repository: 'a2', name: 'b2' }
      ];

      jamesApiClientMock.removeMailFromMailRepository = function() { return $q.when(); };
      $rootScope.$broadcast = sinon.spy();

      inboxJamesMailRepository.deleteMails(emails);

      $rootScope.$digest();

      expect($rootScope.$broadcast).to.have.been.calledWith(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.MAILS_REMOVED, { emails: emails });
    });
  });

  describe('The deleteAllMails function', function() {
    it('should call jamesApiClientMock.removeAllMailsFromMailRepository to delete all mails in mail repository', function() {
      var repository = 'a';

      jamesApiClientMock.removeAllMailsFromMailRepository = sinon.stub().returns($q.when());

      inboxJamesMailRepository.deleteAllMails(repository);

      $rootScope.$digest();
      expect(jamesApiClientMock.removeAllMailsFromMailRepository).to.have.been.calledWith(DOMAIN_ID, repository);
    });

    it('should broadcast remove-all-mails event after deleted all mails successfully', function() {
      jamesApiClientMock.removeAllMailsFromMailRepository = function() { return $q.when(); };
      $rootScope.$broadcast = sinon.spy();

      inboxJamesMailRepository.deleteAllMails('var/mail/test');

      $rootScope.$digest();

      expect($rootScope.$broadcast).to.have.been.calledWith(INBOX_JAMES_MAIL_REPOSITORY_EVENTS.ALL_MAILS_REMOVED);
    });
  });
});
