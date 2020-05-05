mcgApp.service('MaterialUiNextInterpreter', function () {

    /**
     * Generates a string of Material UI (Next) code from the MCG Palettes
     * @param exportObj
     * @param theme
     * @param single
     * @returns {*}
     */
    this.export = function (exportObj, theme, single) {
        let themeCodeString = '/* For use in material-ui/src/styles/colors.js */\n';
        if (single === true) {
            themeCodeString += this.createMTwoPaletteCode(exportObj);
        } else {
            for (let i = 0; i < exportObj.length; i++) {
                themeCodeString += this.createMTwoPaletteCode(exportObj[i]);
            }
        }
        return themeCodeString;
    };

    /**
     * Attempts to generate a Palettes object that MCG will recognize from a string of Material UI Next (React) code.
     * @param code
     * @returns {[]}
     */
    this.import = function (code) {
        let palettes = [];
        for (const paletteData of [...code.matchAll(/export const (.*) ?= ?{([\n:a-zA-z0-9 ('#,)]*)};/g)]) {
            let palette = this.buildPalette(paletteData);
            palettes.push(palette);
        }
        return palettes;
    }

    /**
     * Checks for the presence of a string that is only found in this interpreter.
     * @param code string
     * @returns {boolean}
     */
    this.isApplicable = function (code) {
        // Checks for line: `export const <PALETTENAME> = {`
        // Checks for line: `'contrastDefaultColor': '<PALETTECONTRAST>',`
        return !!(code.match(/export const(.*)= ?{/g) && code.match(/'contrastDefaultColor': ?'(.*)',/g));
    };

    /**
     * Generates a string of Material UI (Next) code from a single MCG palette.
     * @param palette
     * @returns {string}
     */
    this.createMTwoPaletteCode = function (palette) {
        let code = '';
        code += 'export const ' + palette.name + ' = {\n';
        angular.forEach(palette.colors, function (value) {
            code += "    " + value.name + ": '" + tinycolor(value.hex).toHexString() + '\',\n';
        });

        let contrast = 'light';
        if (palette.colors[5].darkContrast) {
            contrast = 'dark';
        }
        code += '    \'contrastDefaultColor\': \'' + contrast + '\',\n';
        code += '};\n\n';

        return code;
    };

    /**
     * Builds a palette object for MCG from regex-extracted data
     * @param paletteData
     * @returns {{orig: [], name: *, json: string, colors: [], base: string}}
     */
    this.buildPalette = function (paletteData) {
        let palette = {"colors": [], "orig": [], "base": "", "json": "", "name": paletteData[1]}

        for (const color of [...paletteData[2].matchAll(/(A?[0-9]{1,3}) ?: ?'?#([a-zA-Z0-9]{3,6})'?,/g)]) {
            let colorName = color[1];
            let colorHex = '#' + color[2];
            let c = tinycolor(colorHex);
            let colorObj = {
                "name": colorName,
                "hex": colorHex,
                "darkContrast": c.isLight()
            };
            palette.colors.push(colorObj);
            palette.orig.push(colorObj);

            if (colorName === "500") {
                palette.base = colorHex;
            }
        }
        return palette;
    }

});
