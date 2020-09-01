'use strict';

const MODULE_NAME = 'esn.inbox-james';
const MODULE_DIR_NAME = '/unifiedinbox.james';

angular.module(MODULE_NAME)
  .factory('inboxJamesRestangular', inboxJamesRestangular);

function inboxJamesRestangular(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl(MODULE_DIR_NAME + '/api');
    RestangularConfigurer.setFullResponse(true);
  });
}
