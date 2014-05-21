/**
 * Created by Michael on 06/04/14.
 */
angular.module('drawACat.common.services')

.service('userOptions', function(ipCookie) {
        var options = angular.fromJson(ipCookie('options')) || {};
        options.renderQuality = typeof options.renderQuality !== 'undefined' ? options.renderQuality : 10;
        options.audioSetting = typeof options.audioSetting !== 'undefined' ? options.audioSetting : true;
        options.helpHasBeenSeen = typeof options.helpHasBeenSeen !== 'undefined' ? options.helpHasBeenSeen : false;

        this.setRenderQuality = function(value) {
            if (0 <= value && value <= 10) {
                options.renderQuality = value;
            }
            save();
        };

        this.getRenderQuality = function() {
            return options.renderQuality;
        };

        this.setAudioSetting = function(val) {
            if (val !== true) {
                options.audioSetting = false;
            } else {
                options.audioSetting = true;
            }
            save();
        };

        this.getAudioSetting = function() {
            return options.audioSetting;
        };

        this.getHelpHasBeenSeen = function() {
            return options.helpHasBeenSeen;
        };

        this.setHelpHasBeenSeen = function() {
            options.helpHasBeenSeen = true;
            save();
        };

        function save() {
            ipCookie('options', angular.toJson(options), { expires: 365 } );
        }
    })
;