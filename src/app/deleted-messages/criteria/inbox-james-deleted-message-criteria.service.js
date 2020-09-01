'use strict';

angular.module('esn.inbox-james')
  .factory('inboxJamesDeletedMessageCriteriaService', inboxJamesDeletedMessageCriteriaService);

function inboxJamesDeletedMessageCriteriaService(esnI18nService, esnDatetimeService, INBOX_JAMES_DELETED_MESSAGES) {
  return {
    getCriterionSummary: getCriterionSummary
  };

  function getCriterionSummary(criterion) {
    switch (criterion.fieldName) {
      case INBOX_JAMES_DELETED_MESSAGES.CRITERIA.SUBJECT:
        return _getSubjectCriterionSummary(criterion);

      case INBOX_JAMES_DELETED_MESSAGES.CRITERIA.ATTACHMENT:
        return _getAttachmentCriterionSummary(criterion);

      case INBOX_JAMES_DELETED_MESSAGES.CRITERIA.RECIPIENTS:
        return _getRecipientsCriterionSummary(criterion);

      case INBOX_JAMES_DELETED_MESSAGES.CRITERIA.SENDER:
        return _getSenderCriterionSummary(criterion);

      case INBOX_JAMES_DELETED_MESSAGES.CRITERIA.DELIVERY_DATE:
        return _getDateCriterionSummary(criterion);

      case INBOX_JAMES_DELETED_MESSAGES.CRITERIA.DELETION_DATE:
        return _getDateCriterionSummary(criterion);

      default:
        return '';
    }
  }

  function _getSubjectCriterionSummary(criterion) {
    var summary;

    switch (criterion.operator) {
      case 'contains':
        summary = 'Messages whose subjects contain exactly <b>%s</b>';
        break;

      case 'containsIgnoreCase':
        summary = 'Messages whose subjects contain <b>%s</b>';
        break;

      case 'equals':
        summary = 'Messages whose subjects match exactly <b>%s</b>';
        break;

      case 'equalsIgnoreCase':
        summary = 'Messages whose subjects match <b>%s</b>';
        break;

      default:
        summary = '';
    }

    return esnI18nService.translate(summary, criterion.value || '').toString();
  }

  function _getAttachmentCriterionSummary(criterion) {
    var summary = 'Messages have attachment';

    if (!criterion.value) {
      summary = 'Messages do not have attachment';
    }

    return esnI18nService.translate(summary).toString();
  }

  function _getRecipientsCriterionSummary(criterion) {
    return esnI18nService.translate('Messages whose recipients contain <b>%s</b>', criterion.value || '').toString();
  }

  function _getSenderCriterionSummary(criterion) {
    return esnI18nService.translate('Messages whose sender is <b>%s</b>', criterion.value || '').toString();
  }

  function _getDateCriterionSummary(criterion) {
    var fieldNameSummaryMapping = {
      deliveryDate: 'Messages whose delivery date is',
      deletionDate: 'Messages whose deletion date is'
    };
    var operatorSummaryMapping = {
      beforeOrEquals: ' before or on <b>%s</b>',
      afterOrEquals: ' after or on <b>%s</b>'
    };

    var summary = !operatorSummaryMapping[criterion.operator] ? '' :
      fieldNameSummaryMapping[criterion.fieldName] + operatorSummaryMapping[criterion.operator];

    return esnI18nService.translate(summary, esnDatetimeService.formatShortDate(criterion.value)).toString();
  }

}
