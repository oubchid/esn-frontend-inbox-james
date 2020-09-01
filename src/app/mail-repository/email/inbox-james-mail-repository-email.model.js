'use strict';

const _ = require('lodash');

angular.module('esn.inbox-james')
  .factory('InboxJamesMailRepositoryEmail', InboxJamesMailRepositoryEmailFactory);

function InboxJamesMailRepositoryEmailFactory() {
  function InboxJamesMailRepositoryEmail(email) {
    _.assign(this, _.pick(email, ['name', 'sender', 'recipients', 'headers', 'lastUpdated', 'htmlBody', 'textBody', 'attributes', 'repository']));

    // For reusing inbox component
    this.to = this.recipients.map(function(recipient) {
      return {
        email: recipient,
        name: recipient
      };
    });
    this.date = this.lastUpdated;
    this.from = this.sender;
  }

  return InboxJamesMailRepositoryEmail;
}
