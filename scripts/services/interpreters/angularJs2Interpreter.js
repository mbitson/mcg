mcgApp.service('AngularJs2Interpreter', function () {

    /**
     * Generates a string of AngularJS 2 code from the MCG Palettes
     * @param exportObj
     * @param theme
     * @param single
     * @returns {string}
     */
    this.export = function (exportObj, theme, single) {
        let themeCodeString = '/* For use in src/lib/core/theming/_palette.scss */\n';
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
     * Attempts to generate a Palettes object that MCG will recognize from a string of AngularJS 2 code.
     * @param code
     * @returns {[]}
     */
    this.import = function (code) {
        let palettes = [];
        for (const paletteData of [...code.matchAll(/\$md-(.*): ?([\n:a-zA-z0-9 ('#,)]*)\);/g)]) {
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
        // Checks for line: `$md-<PALETTENAME>: (`
        // Checks for line: `contrast: (`
        return !!(code.match(/\$md-(.*): ?\(/g) && code.match(/contrast: ?\(/g));
    };

    /**
     * Creates the android XML for a particular palette
     * @param palette
     * @returns {string}
     */
    this.createMTwoPaletteCode = function (palette) {
        let code = '';
        code += '$md-' + palette.name + ': (\n';
        angular.forEach(palette.colors, function (value) {
            code += "    " + value.name + " : " + tinycolor(value.hex).toHexString() + ',\n';
        });
        code += '    contrast: (\n';
        angular.forEach(palette.colors, function (value) {
            let contrast = '#ffffff';
            if (value.darkContrast) contrast = '#000000';
            code += "        " + value.name + " : " + contrast + ',\n';
        });
        code += '    )\n';
        code += ');\n\n';
        return code;
    };

    /**
     * Builds a palette object for MCG from regex-extracted data
     * @param paletteData
     * @returns {{orig: [], name: *, json: string, colors: [], base: string}}
     */
    this.buildPalette = function (paletteData) {
        let palette = {"colors": [], "orig": [], "base": "", "json": "", "name": paletteData[1], "tmpColors": {}}

        for (const color of [...paletteData[2].matchAll(/\n[\t ]*(.*) ?: ?#(.*),/g)]) {
            let colorName = color[1];
            let colorHex = color[2];
            if (!(colorName in palette.tmpColors)) {
                palette.tmpColors[colorName] = {
                    "name": colorName,
                    "hex": '#' + colorHex,
                    "darkContrast": true
                };
            } else {
                if (colorHex.toLowerCase() === 'ffffff') {
                    palette.tmpColors[colorName].darkContrast = false;
                }
            }
            if (colorName === "500" && (colorHex.toLowerCase() !== 'ffffff' || colorHex !== '000000')) {
                palette.base = '#' + colorHex;
            }
        }

        angular.forEach(palette.tmpColors, function (color) {
            palette.colors.push(color);
            palette.orig.push(color);
        });
        delete (palette.tmpColors);
        return palette;
    }

});