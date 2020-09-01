'use strict';

angular.module('esn.inbox-james')
  .run(injectAdminUserQuotaDirective);

function injectAdminUserQuotaDirective(dynamicDirectiveService) {
  var dlpAdminItem = new dynamicDirectiveService.DynamicDirective(true, 'inbox-james-dlp', {
    attributes: [
      { name: 'display-in', value: '$ctrl.displayIn' }
    ]
  });

  dynamicDirectiveService.addInjection('admin-sidebar', dlpAdminItem);
}
