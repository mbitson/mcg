mcgApp.service('McgInterpreter', function () {

    /**
     * Generates a string of code from the MCG Palettes
     * @param exportObj
     * @returns {string}
     */
    this.export = function(exportObj) {
        return JSON.stringify(angular.copy(exportObj), null, 2);
    };

    /**
     * Attempts to generate the MCG Palette object from the provided code.
     * @param code
     * @returns {boolean|{}}
     */
    this.import = function(code) {
        try{
            return JSON.parse(code);
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks for the presence of a string that is only found in this interpreter.
     * @param code string
     * @returns {boolean}
     */
    this.isApplicable = function(code)
    {
        // Checks for the following nodes:
        // - `colors` key with an array
        // - `orig` key with an array
        // - `base` key with a color of some kind passed in
        // - `darkContrast` key, which is saved per-color currently in MCG
        return !!(
            code.match(/"colors": ?\[/g) &&
            code.match(/"orig": ?\[/g) &&
            code.match(/"base": "(.*)",/g) &&
            code.match(/"darkContrast":/g)
        );
    };

});