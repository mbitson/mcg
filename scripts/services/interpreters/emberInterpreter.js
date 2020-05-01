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

    /**
     * Attempts to generate a Palettes object that MCG will recognize from a string of Ember Paper code.
     * @param code
     * @returns {[]}
     */
    this.import = function(code) {
        let palettes = [];
        for (const paletteData of [...code.matchAll(/\$color-(.*): ?([\n:a-zA-z0-9 ('#,)]*) ?!default;/g)]) {
            let palette = this.buildPalette(paletteData);
            palettes.push(palette);
        }
        return palettes;
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

    /**
     * Generate a string of code for use in Ember Paper from the MCG palette
     * @param palette
     * @returns {string}
     */
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

    /**
     * Builds a palette object for MCG from regex-extracted data
     * @param paletteData
     * @returns {{orig: [], name: *, json: string, colors: [], base: string}}
     */
    this.buildPalette = function (paletteData) {
        let palette = {"colors": [], "orig": [], "base": "", "json": "", "name": paletteData[1]}

        for (const color of [...paletteData[2].matchAll(/'(A?[0-9]{1,3})' ?: ?'?#([a-zA-Z0-9]{3,6})'?,/g)]) {
            let colorName = color[1];
            let colorHex = color[2];

            let colorObj = {
                "name": colorName,
                "hex": '#' + colorHex,
                "darkContrast": true
            };
            palette.colors.push(colorObj);
            palette.orig.push(colorObj);

            if (colorName === "500") {
                palette.base = '#' + colorHex;
            }
        }
        return palette;
    }

});