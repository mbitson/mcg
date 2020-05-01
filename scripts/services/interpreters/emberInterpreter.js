mcgApp.service('EmberInterpreter', function () {

    /**
     * Generates a string of Ember Paper code from the MCG Palettes
     * @param exportObj
     * @param theme
     * @param single
     * @returns {*}
     */
    this.export = function(exportObj, theme, single) {
        let themeCodeString = '/* For use in app/styles/color-palette.scss */\n';
        if (single === true) {
            themeCodeString += this.createEmberPaletteCode(exportObj);
        } else {
            for (let i = 0; i < exportObj.length; i++) {
                themeCodeString += this.createEmberPaletteCode(exportObj[i]);
            }
        }
        return themeCodeString;
    };

    this.import = function(code) {
        // @TODO - Implement a method which generates the MCG standard object from the code string passed in.
    };

    /**
     * Checks for the presence of a string that is only found in this interpreter.
     * @param code string
     * @returns {boolean}
     */
    this.isApplicable = function(code) {
        // Checks for line: `$color-<PALETTENAME>: (`
        // Checks for line: `'contrast': #<PALETTECONTRASTHEX>`
        return !!(code.match(/\$color-(.*): ?\(/g) && code.match(/'contrast': ?#[a-zA-z0-9]{3,6}/g));
    };

    this.createEmberPaletteCode = function (palette) {
        let code = '';
        code += '$color-' + palette.name + ': (\n';
        angular.forEach(palette.colors, function (value) {
            code += "    '" + value.name + "' : " + tinycolor(value.hex).toHexString() + ',\n';
        });

        let contrast = '#ffffff';
        if (palette.colors[5].darkContrast) {
            contrast = '#000000';
        }
        code += '    \'contrast\': ' + contrast + '\n';
        code += ') !default;\n\n';

        return code;
    };

});