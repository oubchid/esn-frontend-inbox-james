'use strict';

angular.module('esn.inbox-james')
  .component('inboxJamesDeletedMessagesCriteriaParticipantForm', {
    template: require('./inbox-james-deleted-messages-criteria-participant-form.pug'),
    controller: 'inboxJamesDeletedMessagesCriteriaParticipantFormController',
    bindings: {
      criterion: '<',
      participantType: '<'
    }
  });
