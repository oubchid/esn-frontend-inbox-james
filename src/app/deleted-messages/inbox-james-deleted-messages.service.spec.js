'use strict';

describe('The inboxJamesDeletedMessagesService service', function() {
  var $httpBackend, inboxJamesDeletedMessagesService;

  beforeEach(function() {
    angular.mock.module('esn.inbox-james');

    inject(function(
      _$httpBackend_,
      _inboxJamesDeletedMessagesService_
    ) {
      $httpBackend = _$httpBackend_;
      inboxJamesDeletedMessagesService = _inboxJamesDeletedMessagesService_;
    });
  });

  describe('The submitRestoringRequest method', function() {
    it('should send POST request to the right endpoint to submit restoring request', function() {
      var content = { foo: 'bar' };
      var targetUser = '123';

      $httpBackend.expectPOST('/unifiedinbox.james/api/restoringDeletedMessagesRequest', {
        targetUser: targetUser,
        content: content
      }).respond(201);

      inboxJamesDeletedMessagesService.submitRestoringRequest(targetUser, content);
      $httpBackend.flush();
    });
  });
});
