'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The inboxJamesMailRepositoryEmailSelection service', function() {
  var inboxJamesMailRepositoryEmailSelection;

  beforeEach(module('esn.inbox-james'));

  beforeEach(inject(function(_inboxJamesMailRepositoryEmailSelection_) {
    inboxJamesMailRepositoryEmailSelection = _inboxJamesMailRepositoryEmailSelection_;
  }));

  describe('toggleSelection function', function() {
    var email;

    beforeEach(function() {
      email = { id: '1' };
      inboxJamesMailRepositoryEmailSelection.toggleSelection(email);
    });

    it('should toggle selected status of email', function() {
      var email = { id: '1' };

      inboxJamesMailRepositoryEmailSelection.toggleSelection(email);

      expect(email.selected).to.be.true;
    });

    it('should add email to selectedEmails list if email is selected', function() {
      var list = inboxJamesMailRepositoryEmailSelection.getSelected();

      expect(list).to.include(email);
      expect(list).to.have.length(1);
    });

    it('should remove email from selectedEmails if email is not selected', function() {
      var list = inboxJamesMailRepositoryEmailSelection.getSelected();

      expect(list).to.include(email);
      expect(list).to.have.length(1);

      inboxJamesMailRepositoryEmailSelection.toggleSelection(email);

      list = inboxJamesMailRepositoryEmailSelection.getSelected();

      expect(list).to.be.empty;
    });

    it('should change selecting status to true if there are selected emails', function() {
      expect(inboxJamesMailRepositoryEmailSelection.isSelecting()).to.be.true;
    });

    it('should change selecting status to false if there are no selected emails', function() {
      expect(inboxJamesMailRepositoryEmailSelection.isSelecting()).to.be.true;

      inboxJamesMailRepositoryEmailSelection.toggleSelection(email);

      expect(inboxJamesMailRepositoryEmailSelection.isSelecting()).to.be.false;
    });
  });

  describe('unSelectAll function', function() {
    it('should unselect all emails then set the selecting status to false', function() {
      inboxJamesMailRepositoryEmailSelection.toggleSelection({ id: '1' });
      inboxJamesMailRepositoryEmailSelection.toggleSelection({ id: '2' });

      var list = inboxJamesMailRepositoryEmailSelection.getSelected();

      expect(list).to.have.length(2);
      expect(inboxJamesMailRepositoryEmailSelection.isSelecting()).to.be.true;

      inboxJamesMailRepositoryEmailSelection.unSelectAll();

      list = inboxJamesMailRepositoryEmailSelection.getSelected();

      expect(list).to.be.empty;
      expect(inboxJamesMailRepositoryEmailSelection.isSelecting()).to.be.false;
    });
  });
});
