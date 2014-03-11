/**
 * The purpose of this file is to instantiate a new Angular module for all the common services. It is named with and underscore so that the
 * Grunt task that automatically includes all the .js during dev builds will include it first, before any of the services that depend on it.
 * Created by Michael on 11/03/14.
 */
angular.module('drawACat.common.services', []);