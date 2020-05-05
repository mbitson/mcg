mcgApp.service('TopInterpreter',
    [
        'AngularJsInterpreter',
        'AngularJs2Interpreter',
        'FlutterInterpreter',
        'MaterialUiInterpreter',
        'MaterialUiNextInterpreter',
        'AndroidInterpreter',
        'MdLiteInterpreter',
        'EmberInterpreter',
        'McgInterpreter',
        'VueInterpreter',
        function (
            AngularJsInterpreter,
            AngularJs2Interpreter,
            FlutterInterpreter,
            MaterialUiInterpreter,
            MaterialUiNextInterpreter,
            AndroidInterpreter,
            MdLiteInterpreter,
            EmberInterpreter,
            McgInterpreter,
            VueInterpreter
        ) {

            /**
             * This object houses each supported language type for imports and exports.
             * To add a new type, please see https://github.com/mbitson/mcg/pull/90/files
             * Please note that in addition to the above changes, you'll need to support the following two methods:
             * - isApplicable
             * - import
             * For examples of these methods and the proper code style, see the `scripts/services/interpreters` folder.
             * @type {{}}
             */
            this.interpreters = {
                "angularjs": AngularJsInterpreter,
                "angularjs2": AngularJs2Interpreter,
                "flutter": FlutterInterpreter,
                "materialui": MaterialUiInterpreter,
                "materialuinext": MaterialUiNextInterpreter,
                "android": AndroidInterpreter,
                "md-lite": MdLiteInterpreter,
                "ember": EmberInterpreter,
                "mcg": McgInterpreter,
                "vue": VueInterpreter,
            };

            /**
             * Takes the interpreter name and returns the appropriate object.
             * @param name
             * @returns {boolean|*}
             */
            this.getInterpreter = function (name) {
                if (name in this.interpreters) {
                    return this.interpreters[name];
                }
                return false;
            };

            /**
             * Returns all available interpreters
             * @returns {*}
             */
            this.getInterpreters = function () {
                return this.interpreters;
            }
        }
    ]
);