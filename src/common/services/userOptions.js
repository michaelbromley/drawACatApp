/**
 * Created by Michael on 06/04/14.
 */
angular.module('drawACat.common.services')

.service('userOptions', function() {
        var renderQuality = 10;

        this.setRenderQuality = function(value) {
            if (0 <= value && value <= 10) {
                renderQuality = value;
            }
        };

        this.getRenderQuality = function() {
            return renderQuality;
        };
    })
;