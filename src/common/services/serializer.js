/**
 * Created by Michael on 08/03/14.
 */
angular.module('drawACat.common.services')

    .factory('serializer', function(catFactory, primitives, behaviourFactory) {

        return {
            /**
             * Converts a Cat object into a JSON string containing all of its properties, so it can be
             * stored in a datastore.
             * @param cat
             * @returns {*}
             */
            serializeCat: function(cat) {
                var serializable = {};

                angular.forEach(cat.bodyParts, function(bodyPart, key) {
                    serializable[key] = {
                        part: {},
                        behaviour: {}
                    };
                    if (bodyPart.part) {
                        serializable[key].part.path = bodyPart.part.getPath();
                        serializable[key].part.name = bodyPart.part.getName();
                        if (bodyPart.part.getParent()) {
                            serializable[key].part.parentName = bodyPart.part.getParent().getName();
                        }
                    }
                    if (bodyPart.behaviour) {
                        serializable[key].behaviour = bodyPart.behaviour.toSerializable();
                    }
                });

                return serializable;
            },

            /**
             * Converts a JSON representation of the cat (as stored in the datastore) back into a Cat() object,
             * complete with Part() and Behaviour() objects for each bodyPart.
             * @param dataObject
             * @returns {*}
             */
            unserializeCat: function(dataObject) {
                var cat = catFactory.newCat();

                angular.forEach(dataObject, function(bodyPart, key) {
                    if (bodyPart.part) {
                        var newPart = primitives.Part();

                        if (bodyPart.part.path) {
                            newPart.createFromPath(bodyPart.part.name, bodyPart.part.path);
                        }
                        cat.bodyParts[key].part = newPart;
                    }
                    if (bodyPart.behaviour) {
                        var newBehaviour = behaviourFactory.newBehaviour();
                        newBehaviour.sensitivity = bodyPart.behaviour.sensitivity;
                        newBehaviour.range = bodyPart.behaviour.range;
                        cat.bodyParts[key].behaviour = newBehaviour;
                    }
                });

                // now we need to loop through the bodyParts once more to resolve the parent/child relationships
                angular.forEach(dataObject, function(bodyPart, key) {
                    if (bodyPart.part) {
                        if(bodyPart.part.parentName) {
                            var parentName = bodyPart.part.parentName;
                            cat.bodyParts[key].part.setParent(cat.bodyParts[parentName].part);
                        }
                    }
                });

                return cat;
            }
        };
    }
);