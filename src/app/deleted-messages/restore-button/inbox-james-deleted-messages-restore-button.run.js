'use strict';

angular.module('esn.inbox-james')
  .run(runBlock);

function runBlock(esnConfig, dynamicDirectiveService) {
  return esnConfig('linagora.esn.james.deletedMessages', {}).then(function(deletedMessagesConfig) {
    if (!deletedMessagesConfig.restore || !deletedMessagesConfig.restore.isEnabled) {
      return;
    }

    var recoverDeletedMessages = new dynamicDirectiveService.DynamicDirective(true, 'inbox-james-deleted-messages-restore-button', {
      attributes: [
        { name: 'ng-if', value: 'ctrl.mailbox.role.value === "trash"' }
      ]
    });

    dynamicDirectiveService.addInjection('unifiedinbox-sidebar-folder-setting', recoverDeletedMessages);
  });
}
