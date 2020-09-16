'use strict';

angular.module('esn.inbox-james')
  .run(injectRejectedActionsDirective);

function injectRejectedActionsDirective(
  session,
  dynamicDirectiveService,
  INBOX_JAMES_DLP_MAIL_REPOSITORIES
) {
  session.ready.then(function() {
    var mailRepository = INBOX_JAMES_DLP_MAIL_REPOSITORIES.REJECTED;
    var rejectedActionsDirective = new dynamicDirectiveService.DynamicDirective(true, 'inbox-james-dlp-rejected-actions', {
      attributes: [
        { name: 'ng-if', value: '$ctrl.repository==="' + mailRepository + '"' },
        { name: 'ng-show', value: '$ctrl.getNumberOfSelectedEmails() || $ctrl.bulkAction' },
        { name: 'repository', value: '$ctrl.repository' },
        { name: 'bulk-action', value: '$ctrl.bulkAction' }
      ]
    });

    dynamicDirectiveService.addInjection('mail-repository-extra-actions', rejectedActionsDirective);

    var rejectedEmailExtraActionsDirective = new dynamicDirectiveService.DynamicDirective(true, 'inbox-james-dlp-rejected-actions', {
      attributes: [
        { name: 'ng-if', value: '$ctrl.email.repository==="' + mailRepository + '"' },
        { name: 'email', value: '$ctrl.email' },
        { name: 'on-click', value: '$hide()' }
      ]
    });

    dynamicDirectiveService.addInjection('email-extra-actions', rejectedEmailExtraActionsDirective);
  });
}
