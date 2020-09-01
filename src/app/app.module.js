'use strict';

const MODULE_NAME = 'esn.inbox-james';

angular.module(MODULE_NAME, [
  'ui.router',
  'op.dynamicDirective',
  'restangular',
  'uuid4',
  'ngFileSaver',
  'esn.session',
  'esn.configuration',
  'esn.async-action',
  'esn.lodash-wrapper',
  'esn.user',
  'esn.session',
  'esn.infinite-list',
  'esn.i18n',
  'esn.scroll',
  'mgcrea.ngStrap.modal',
  'linagora.esn.james',
  'linagora.esn.unifiedinbox'
]);

require('./dlp/inbox-james-dlp.constants.js');
require('./dlp/inbox-james-dlp.component.js');
require('./dlp/inbox-james-dlp.run.js');
require('./dlp/quarantine/inbox-james-dlp-quarantine.controller.js');
require('./dlp/quarantine/inbox-james-dlp-quarantine.component.js');
require('./dlp/quarantine/subheader/inbox-james-dlp-quarantine-subheader.component.js');
require('./dlp/quarantine/actions/inbox-james-dlp-quarantine-actions.controller.js');
require('./dlp/quarantine/actions/inbox-james-dlp-quarantine-actions.component.js');
require('./dlp/quarantine/actions/inbox-james-dlp-quarantine-actions.run.js');