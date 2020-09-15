'use strict';

angular.module('esn.inbox-james')

  .constant('INBOX_JAMES_DLP_MAIL_REPOSITORIES', {
    QUARANTINE: 'dlpQuarantine',
    REJECTED: 'dlpRejected'
  });
