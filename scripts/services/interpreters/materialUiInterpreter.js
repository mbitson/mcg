mcgApp.service('MaterialUiInterpreter', function () {

    /**
     * Generates a string of Material UI code from the MCG Palettes
     * @param exportObj
     * @param theme
     * @param single
     * @returns {*}
     */
    this.export = function (exportObj, theme, single) {
        let themeCodeString = '/* For use in app/styles/color-palette.scss */\n';
        if (single === true) {
            themeCodeString += this.createMaterialUIPaletteCode(exportObj);
        } else {
            for (let i = 0; i < exportObj.length; i++) {
                themeCodeString += this.createMaterialUIPaletteCode(exportObj[i]);
            }
        }
        return themeCodeString;
    };

    /**
     * Attempts to generate a Palettes object that MCG will recognize from a string of Material UI (React) code.
     * @param code
     * @returns {[]}
     */
    this.import = function (code) {
        let palettes = [];
        for (const paletteData of code.split(/;\n\nexport /g)) {
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
        // Checks for line: `export const <PALETTECOLORNAME> = '#<PALETTECOLORHEX>';`
        return !!(code.match(/export const(.*)= ?'#[0-9A-Za-z]{3,6}';/g));
    };

    /**
     * Generates a string of Material UI code from a single MCG palette.
     * @param palette
     * @returns {string}
     */
    this.createMaterialUIPaletteCode = function (palette) {
        let code = '\n';
        angular.forEach(palette.colors, function (value) {
            code += "export const " + palette.name + value.name + " = '" + tinycolor(value.hex).toHexString() + '\';\n';
        });
        return code;
    };

    /**
     * Builds a palette object for MCG from regex-extracted data
     * @param paletteData
     * @returns {{orig: [], name: *, json: string, colors: [], base: string}}
     */
    this.buildPalette = function (paletteData) {
        let palette = {"colors": [], "orig": [], "base": "", "json": "", "name": ""}
        let colorsAdded = [];
        for (const color of [...paletteData.matchAll(/const (.*)([1-9]00|50) ?= ?'#([A-Za-z0-9]{3,6})'/g)]) {
            let colorName = color[2];
            let colorHex = '#' + color[3];
            let c = tinycolor(colorHex);

            if (palette.name === '') palette.name = color[1];
            if (colorName === "500") palette.base = colorHex;
            if (colorsAdded.includes(colorName)) colorName = "A" + colorName;

            let colorObj = {
                "name": colorName,
                "hex": colorHex,
                "darkContrast": c.isLight()
            };
            palette.colors.push(colorObj);
            palette.orig.push(colorObj);
            colorsAdded.push(colorName);
        }
        return palette;
    }

});