/**
 * Created by Michael on 06/04/14.
 */

angular.module('drawACat.cat.services')

/**
 * This service takes a cat object and simplifies its path by removing points. How many points
 * get removed depends on the shape of the lines and also the quality setting. Quality ranges between
 * 0 and 1, with 1 being best quality.
 */
    .service('catSimplifier', function(catFactory, primitives) {

        this.simplifyCat = function(cat, quality) {
            var simplifiedCat;
            simplifiedCat = catFactory.newCat();

            angular.forEach(cat.bodyParts, function(bodyPart, partName) {
                var partPath = bodyPart.part.getPath();
                var simplifiedPath = simplifyPath(partPath, quality);

                var newPart = primitives.Part();
                newPart.createFromPath(partName, simplifiedPath);
                simplifiedCat.bodyParts[partName].part = newPart;

                simplifiedCat.bodyParts[partName].behaviour = cat.bodyParts[partName].behaviour;
            });

            // now we need to loop through the bodyParts once more to resolve the parent/child relationships
            angular.forEach(simplifiedCat.bodyParts, function(bodyPart, partName) {
                var partShouldHaveParent = cat.bodyParts[partName].part.getParent();
                if(partShouldHaveParent) {
                    var parentName = cat.bodyParts[partName].part.getParent().getName();
                    var partParent = simplifiedCat.bodyParts[parentName].part;
                    simplifiedCat.bodyParts[partName].part.setParent(partParent);
                }
            });

            return simplifiedCat;
        };

        var simplifyPath = function(path, quality) {
            return path.map(function(line) {
                return removeRedundantPoints(line, quality);
            });
        };

        var removeRedundantPoints = function(line, quality) {
            var tolerance = 1 - quality + 0.01; // angle in radians
            var pointsToRemove = [];
            var keepAngle1 = false;
            var angle1;
            var angle2;
            var dX, dY;
            // start with the second point (the first point in the line should never be removed)
            for (var i = 1; i < line.length - 2; i ++) { // -2 in order to always preserve the last point of the line
                // calculate the angle between x-axis and the line formed from line[0] - line[1]
                if (!keepAngle1) {
                    dX= line[i][0] - line[i - 1][0];
                    dY= line[i][1] - line[i - 1][1];
                    angle1 = Math.atan2(dY, dX);
                }
                // move to the next point and get the angle for line[1] - line[2]
                dX= line[i + 1][0] - line[i][0];
                dY= line[i + 1][1] - line[i][1];
                angle2 = Math.atan2(dY, dX);
                // compare angle 2 to angle 1.
                if (Math.abs(angle2 - angle1) < tolerance) {
                    // if the difference between the two angles is less than a specified delta, remove point line[1] and keep angle 1
                    pointsToRemove.push(i);
                    keepAngle1 = true;
                } else {
                    // if it is more, angle 2 becomes angle 1 and we move to the next point to calculate a new angle 2
                    keepAngle1 = false;
                }
            }

            return line.filter(function(point, i) {
                return pointsToRemove.indexOf(i) === -1; // return true if index not in the pointsToRemove array.
            });
        };
    })
;