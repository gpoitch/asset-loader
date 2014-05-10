/**
 * @class PodLoader
 * @namespace Ember
 * @uses AssetLoader
 * Ember-ized version of AssetLoader using RSVP promises, and namespace refreshing.
 */

(function(exports, Ember, AssetLoader){

  'use strict';

  Ember.PodLoader = {
    application: null,
    load: function(options) {
      var application = this.application;
      return AssetLoader.load(options).then(function() {
        // Need to register any new Ember classes just loaded
        exports[application].nameClasses();
      });
    }
  };

  Ember.Application.initializer({
    name: 'PodLoader',
    initialize: function(container, application) {
      // Configure Promise library to use
      AssetLoader.Promise = Ember.RSVP.Promise;
      // Store Ember App Namespace
      Ember.PodLoader.application = application;
    }
  });

})(this, Ember, AssetLoader);
