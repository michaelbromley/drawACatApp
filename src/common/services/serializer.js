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
                for (var key in cat.bodyParts) {
                    if (cat.bodyParts.hasOwnProperty(key)) {
                        serializable[key] = {};
                        if (cat.bodyParts[key].part) {
                            serializable[key].part = cat.bodyParts[key].part.getPath();
                        }
                        if (cat.bodyParts[key].behaviour) {
                            serializable[key].behaviour = cat.bodyParts[key].behaviour.toSerializable();
                        }
                    }
                }
                return serializable;
            },

            /**
             * Converts a JSON representation of the cat (as stored in the datastore) back into a Cat() object,
             * complete with Part() and Behaviour() objects for each bodyPart.
             * @param dataObject
             * @returns {*}
             */
            unserializeCat: function(dataObject) {
                cat = catFactory.newCat();

                for (var key in dataObject) {
                    if (dataObject.hasOwnProperty(key)) {
                        if (dataObject[key].part) {
                            var newPart = primitives.Part();
                            newPart.createFromPath(key, dataObject[key].part);
                            cat.bodyParts[key].part = newPart;

                        }
                        if (dataObject[key].behaviour) {
                            var newBehaviour = behaviourFactory.newBehaviour();
                            newBehaviour.sensitivity = dataObject[key].behaviour.sensitivity;
                            newBehaviour.range = dataObject[key].behaviour.range;
                            cat.bodyParts[key].behaviour = newBehaviour;
                        }
                    }
                }

                return cat;
            }
        };
    }
);