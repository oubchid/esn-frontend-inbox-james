'use strict';

angular.module('esn.inbox-james')
  .run(injectQuarantineActionsDirective);

function injectQuarantineActionsDirective(
  session,
  dynamicDirectiveService,
  INBOX_JAMES_DLP_MAIL_REPOSITORIES
) {
  session.ready.then(function() {
    var mailRepository = INBOX_JAMES_DLP_MAIL_REPOSITORIES.QUARANTINE;
    var quarantineRepositoryExtraActionsDirective = new dynamicDirectiveService.DynamicDirective(true, 'inbox-james-dlp-quarantine-actions', {
      attributes: [
        { name: 'ng-if', value: '$ctrl.repository==="' + mailRepository + '"' },
        { name: 'ng-show', value: '$ctrl.getNumberOfSelectedEmails() || $ctrl.bulkAction' },
        { name: 'repository', value: '$ctrl.repository'},
        { name: 'bulk-action', value: '$ctrl.bulkAction' }
      ]
    });

    dynamicDirectiveService.addInjection('mail-repository-extra-actions', quarantineRepositoryExtraActionsDirective);

    var quarantineEmailExtraActionsDirective = new dynamicDirectiveService.DynamicDirective(true, 'inbox-james-dlp-quarantine-actions', {
      attributes: [
        { name: 'ng-if', value: '$ctrl.email.repository==="' + mailRepository + '"' },
        { name: 'email', value: '$ctrl.email' },
        { name: 'on-click', value: '$hide()' }
      ]
    });

    dynamicDirectiveService.addInjection('email-extra-actions', quarantineEmailExtraActionsDirective);
  });
}
