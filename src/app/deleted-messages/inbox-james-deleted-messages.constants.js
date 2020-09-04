'use strict';

angular.module('esn.inbox-james')
  .constant('INBOX_JAMES_DELETED_MESSAGES', {
    COMBINATOR: 'and',
    CRITERIA: {
      DEFAULT_CRITERION: {
        fieldName: 'subject',
        operator: 'containsIgnoreCase'
      },
      FIELD_NAMES: [
        { value: 'subject', label: 'Subject' },
        { value: 'hasAttachment', label: 'Attachment'},
        { value: 'recipients', label: 'Recipients' },
        { value: 'sender', label: 'Sender' },
        { value: 'deliveryDate', label: 'Delivery date'},
        { value: 'deletionDate', label: 'Deletion date'}
      ],
      SUBJECT: 'subject',
      ATTACHMENT: 'hasAttachment',
      RECIPIENTS: 'recipients',
      SENDER: 'sender',
      RECIPIENTS_OPERATOR: 'contains',
      SENDER_OPERATOR: 'equals',
      DELIVERY_DATE: 'deliveryDate',
      DELETION_DATE: 'deletionDate'
    }
  })
  .constant('INBOX_RESTORED_MESSAGES_MAILBOX', {
    role: 'restored messages',
    icon: 'mdi mdi-backup-restore'
  });
