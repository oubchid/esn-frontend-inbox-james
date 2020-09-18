'use strict';

/* global chai: false */
/* global sinon: false */

const { expect } = chai;

describe('The inboxJamesMailRepository service', function() {
  let $rootScope;
  let inboxJamesMailRepository, InboxJamesMailRepositoryEmail;
  let FileSaverMock, jamesApiClientMock, sessionMock;
  let userAPI, userUtils;
  let INBOX_JAMES_MAIL_REPOSITORY_EMAIL_FIELDS, INBOX_JAMES_MAIL_REPOSITORY_EVENTS;
  let sandbox;
  const DOMAIN_ID = '1';

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    angular.mock.module('esn.inbox-james');

    FileSaverMock = {
      saveAs: sinon.stub()
    };

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
      $provide.factory('jamesApiClient', function() { return jamesApiClientMock; });
      $provide.value('FileSaver', FileSaverMock);
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

  afterEach(function() {
    sandbox.restore();
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
    it('should call downloadEmlFileFromMailRepository with email repository and save the eml file', function(done) {
      const repository = 'a';
      const mailKey = 'b';
      const emlContent = '<h1>Some data</h1>';
      const emlData = { foo: emlContent };
      const BlobMock = sandbox.stub(global, 'Blob').returns(emlData);

      jamesApiClientMock.downloadEmlFileFromMailRepository = sandbox.stub().returns($q.when(emlContent));

      inboxJamesMailRepository.downloadEmlFile(repository, mailKey)
        .then(() => {
          expect(jamesApiClientMock.downloadEmlFileFromMailRepository).to.have.been.calledOnce;
          expect(jamesApiClientMock.downloadEmlFileFromMailRepository).to.have.been.calledWith(DOMAIN_ID, repository, mailKey);
          expect(BlobMock).to.have.been.calledWith([emlContent], { type: 'text/html' });
          expect(FileSaverMock.saveAs).to.have.been.calledWith(emlData, [mailKey, 'eml'].join('.'));
          done();
        })
        .catch(err => done(err || new Error('should resolve')));

      $rootScope.$digest();
    });

    it('should not try to save the eml file when the eml data fails to be fetched', function(done) {
      const repository = 'a';
      const mailKey = 'b';
      const BlobMock = sandbox.stub(global, 'Blob').returns({ foo: 'bar' });

      jamesApiClientMock.downloadEmlFileFromMailRepository = sandbox.stub().returns($q.reject());

      inboxJamesMailRepository.downloadEmlFile(repository, mailKey)
        .then(() => done(new Error('should not resolve')))
        .catch(() => {
          expect(jamesApiClientMock.downloadEmlFileFromMailRepository).to.have.been.calledOnce;
          expect(jamesApiClientMock.downloadEmlFileFromMailRepository).to.have.been.calledWith(DOMAIN_ID, repository, mailKey);
          expect(BlobMock).to.have.not.been.called;
          expect(FileSaverMock.saveAs).have.not.been.called;
          done();
        });

      $rootScope.$digest();
    });

    it('should reject when there is an error while saving the eml file', function(done) {
      const repository = 'a';
      const mailKey = 'b';
      const emlContent = '<h1>Some data</h1>';
      const emlData = { foo: emlContent };
      const BlobMock = sandbox.stub(global, 'Blob').returns(emlData);
      const saveFileError = new Error('Could not save file');

      FileSaverMock.saveAs = sandbox.stub().throws(saveFileError);

      jamesApiClientMock.downloadEmlFileFromMailRepository = sandbox.stub().returns($q.resolve(emlContent));

      inboxJamesMailRepository.downloadEmlFile(repository, mailKey)
        .then(() => done(new Error('should not resolve')))
        .catch(err => {
          expect(jamesApiClientMock.downloadEmlFileFromMailRepository).to.have.been.calledOnce;
          expect(jamesApiClientMock.downloadEmlFileFromMailRepository).to.have.been.calledWith(DOMAIN_ID, repository, mailKey);
          expect(BlobMock).to.have.been.calledWith([emlContent], { type: 'text/html' });
          expect(FileSaverMock.saveAs).to.have.been.calledWithExactly(emlData, [mailKey, 'eml'].join('.'));
          expect(err).to.equal(saveFileError);
          done();
        });

      $rootScope.$digest();
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
