mcgApp.service('VueInterpreter', function () {

    /**
     * Generates a string of Vue.js Material Design code from the MCG Palettes
     * @param exportObj
     * @param theme
     * @param single
     * @returns {*}
     */
    this.export = function (exportObj, theme, single) {
        let themeCodeString = '    /* src/core/components/mdTheme/palette.js */\n';
        if (single === true) {
            themeCodeString += this.createVueMdPaletteCode(exportObj);
        } else {
            for (let i = 0; i < exportObj.length; i++) {
                themeCodeString += this.createVueMdPaletteCode(exportObj[i]);
            }
        }
        return themeCodeString;
    };

    /**
     * Attempts to generate a Palettes object that MCG will recognize from a string of Vue.js code.
     * @param code
     * @returns {[]}
     */
    this.import = function (code) {
        let jsonString = '{' + code
            .replace(/(?:[\t ]|\/\*(?:.*)\*\/)/g, '')
            .replace(/\n[ ]*(.*):/g, '\n"$1":').replace(/: ?'(.*)',/g, ': "$1",') + '}';
        let colors = JSON.parse(jsonString.replace('},}', '}}'));
        return this.buildPalettes(colors);
    }

    /**
     * Checks for the presence of a string that is only found in this interpreter.
     * @param code string
     * @returns {boolean}
     */
    this.isApplicable = function (code) {
        // Checks for line: `darkText: [<PALETTEDARKNODES>]`
        return !!(code.match(/darkText: ?\[(.*)]/g));
    };

    /**
     * Generates a string of Vue.js Material Design code from a single MCG palette.
     * @param palette
     * @returns {string}
     */
    this.createVueMdPaletteCode = function (palette) {
        let code = '';
        code += '    ' + palette.name + ':{\n';
        angular.forEach(palette.colors, function (value) {
            code += '        ' + value.name + ': \'' + tinycolor(value.hex).toHexString() + '\',\n';
        });
        code += '        darkText: ';
        let darkTextArray = [];
        angular.forEach(palette.colors, function (value) {
            if (value.darkContrast !== true) return;
            let name = value.name;
            if (typeof value.name == "string" && value.name.indexOf('A') < 0) {
                name = parseInt(value.name);
            }
            darkTextArray.push(name);
        });
        code += JSON.stringify(darkTextArray);
        code += '\n';
        code += '    },\n';
        return code;
    };

    /**
     * Generates the necessary MCG Palette objects from the palettes, color names, and color values.
     * @param colors {{}}
     * @returns {[]}
     */
    this.buildPalettes = function (colors) {
        let palettes = [];
        angular.forEach(colors, function (paletteColors, paletteName) {
            let palette = {"colors": [], "orig": [], "base": "", "json": "", "name": paletteName}
            angular.forEach(paletteColors, function (colorValue, colorName) {
                if (colorName === "darkText") return;
                let color = {
                    "name": colorName,
                    "hex": colorValue,
                    "darkContrast": paletteColors['darkText'].map(String).includes(colorName)
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