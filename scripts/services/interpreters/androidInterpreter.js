mcgApp.service('AndroidInterpreter', function () {

    /**
     * Generates a string of Android code from the MCG Palettes
     * @param exportObj
     * @param theme
     * @param single
     * @returns {string}
     */
    this.export = function (exportObj, theme, single) {
        let themeCodeString = '';
        if (single === true) {
            themeCodeString += this.createAndroidPaletteCode(exportObj);
        } else {
            for (let i = 0; i < exportObj.length; i++) {
                themeCodeString += this.createAndroidPaletteCode(exportObj[i]);
            }
        }
        return escapeHtml('<resources>\n' + themeCodeString + '<resources>');
    };

    /**
     * Attempts to generate a Palettes object that MCG will recognize from a string of Android code.
     * @param code
     * @returns {[]}
     */
    this.import = function (code) {
        let colors = this.determineColors(code);
        return this.determinePalettes(colors);
    }

    /**
     * Checks for the presence of a string that is only found in this interpreter.
     * @param code string
     * @returns {boolean}
     */
    this.isApplicable = function (code) {
        // Checks for line: `<resources>`
        // Checks for line: `<color name="<PALETTECOLORNAME>">#<PALETTECOLORHEX></color>
        return !!(code.match(/<resources>/g) && code.match(/<color name="(.*)">#[a-zA-Z0-9]{3,6}<\/color>/g));
    };

    /**
     * Creates the android XML for a particular palette
     * @param palette
     * @returns {string}
     */
    this.createAndroidPaletteCode = function (palette) {
        let code = '';
        angular.forEach(palette.colors, function (value) {
            code += '     <color name="' + palette.name + '_' + value.name + '">' + value.hex + '</color>\n';
        });
        return code;
    };

    /**
     * Takes AndroidXML and determines the palettes, color names, and color values.
     * @param code
     * @returns {{}}
     */
    this.determineColors = function (code) {
        let colors = {};
        for (const line of [...code.matchAll(/<color name="(.*)">#([a-zA-Z0-9]{3,6})<\/color>/g)]) {
            let paletteNamePieces = line[1].split('_');
            let paletteName = paletteNamePieces[0];
            let paletteColorKey = paletteNamePieces[1];
            let paletteColor = line[2];

            if (typeof colors[paletteName] === "undefined") {
                colors[paletteName] = {};
            }
            colors[paletteName][paletteColorKey] = paletteColor;
        }
        return colors;
    }

    /**
     * Generates the necessary MCG Palette objects from the palettes, color names, and color values.
     * @param colors {{}}
     * @returns {[]}
     */
    this.determinePalettes = function (colors) {
        let palettes = [];
        angular.forEach(colors, function (paletteColors, paletteName) {
            let palette = {"colors": [], "orig": [], "base": "", "json": "", "name": paletteName}
            angular.forEach(paletteColors, function (colorValue, colorName) {
                let color = {
                    "name": colorName,
                    "hex": '#' + colorValue,
                    "darkContrast": true
                };
                palette.colors.push(color);
                palette.orig.push(color);

                if (colorName === "500") {
                    palette.base = '#' + colorValue;
                }
            });
            palettes.push(palette);
        });
        return palettes;
    }

});