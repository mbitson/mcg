mcgApp.service('MdLiteInterpreter', function () {

    /**
     * Generates a string of MD Lite code from the MCG Palettes
     * @param exportObj
     * @param theme
     * @param single
     * @returns {*}
     */
    this.export = function (exportObj, theme, single) {
        let themeCodeString = '/* For use in _color-definitions.scss */\n';
        if (single === true) {
            themeCodeString += this.createMdLitePaletteCode(exportObj);
        } else {
            for (let i = 0; i < exportObj.length; i++) {
                themeCodeString += this.createMdLitePaletteCode(exportObj[i]);
            }
        }
        return themeCodeString;
    };

    /**
     * Attempts to generate a Palettes object that MCG will recognize from a string of MD Lite (SCSS) code.
     * @param code
     * @returns {[]}
     */
    this.import = function (code) {
        let palettes = [];
        for (const paletteData of code.split(/\n\n\n/g)) {
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
        // Checks for line: `$palette-<PALETTENAME>:`
        // Checks for line: `$palette-<PALETTENAME>: nth($palette-<PALETTENAME>, <PALETTENUMBER>);`
        return !!(code.match(/\$palette-(.*): ?\n/g) && code.match(/\$palette-(.*): ?nth\(\$palette-(.*)\);/g));
    };

    /**
     * Generates a string of MD Lite code from a single MCG palette.
     * @param palette
     * @returns {string}
     */
    this.createMdLitePaletteCode = function (palette) {
        let code = '';
        code += '$palette-' + palette.name + ':\n';
        angular.forEach(palette.colors, function (value) {
            code += tinycolor(value.hex).toRgbString() + '\n';
        });
        code += ';\n\n';
        angular.forEach(palette.colors, function (value, key) {
            code += '$palette-' + palette.name + '-' + value.name + ': nth($palette-' + palette.name + ', ' + (key + 1) + ');\n';
        });
        code += '\n\n';
        return code;
    };

    /**
     * Builds a palette object for MCG from regex-extracted data
     * @param paletteData
     * @returns {{orig: [], name: *, json: string, colors: [], base: string}}
     */
    this.buildPalette = function (paletteData) {
        let palette = {"colors": [], "orig": [], "base": "", "json": "", "name": ""}
        let paletteComponents = paletteData.split(/\n\n/g);
        let [paletteNames] = paletteComponents[0].matchAll(/\$palette-(.[^-]*):/gi);
        palette.name = paletteNames[1];

        let rgbDefinitions = this.determineColorDefinitions(paletteComponents[0]);
        for (const paletteMeta of [...paletteComponents[1].matchAll(
            /\$palette-(?:.*)-(A?[0-9]{2,3}): ?nth\(\$palette-(?:.*), ?([0-9]*)\);/g
        )]) {
            let colorName = paletteMeta[1];
            let colorIndex = paletteMeta[2];
            let color = {
                "name": colorName,
                "hex": rgbDefinitions[colorIndex-1].toHexString(),
                "darkContrast": rgbDefinitions[colorIndex-1].isLight()
            };
            palette.colors.push(color);
            palette.orig.push(color);
            if (colorName === "500") {
                palette.base = color.hex;
            }
        }
        return palette;
    };

    /**
     * Takes a string of rgb() values, separated by new lines, and returns an array of tinycolor objects.
     * @param colorsString
     * @returns {[]}
     */
    this.determineColorDefinitions = function (colorsString) {
        let colors = [];
        for (const colorRgbString of colorsString.match(/rgb\([0-9]{1,3}, ?[0-9]{1,3}, ?[0-9]{1,3}\)/g)) {
            colors.push(tinycolor(colorRgbString));
        }
        return colors;
    };

});