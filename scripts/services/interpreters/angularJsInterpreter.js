mcgApp.service('AngularJsInterpreter', function () {

    /**
     * Generates a string of AngularJS code from the MCG Palettes
     * @param exportObj
     * @param theme
     * @param single
     * @returns {string}
     */
    this.export = function (exportObj, theme, single) {
        let themeCodeString = '';
        if (single === true) {
            themeCodeString += this.createAjsPaletteCode(exportObj);
        } else {
            for (let i = 0; i < exportObj.length; i++) {
                themeCodeString += this.createAjsPaletteCode(exportObj[i]) + '\n';
            }
            if (typeof exportObj[0] !== "undefined" && typeof exportObj[1] !== "undefined") {
                themeCodeString +=
                    '$mdThemingProvider.theme(\'' + theme.name + '\')\n' +
                    '    .primaryPalette(\'' + exportObj[0].name + '\')\n' +
                    '    .accentPalette(\'' + exportObj[1].name + '\');';
            }
        }
        return themeCodeString;
    };

    /**
     * Attempts to generate a Palettes object that MCG will recognize from a string of AngularJS code.
     * @param code
     * @returns {[]}
     */
    this.import = function (code) {
        let themeDivider = "$mdThemingProvider.theme('";
        let themeSplit = code.split(themeDivider);
        let paletteDefinitions = code;
        if (1 in themeSplit) {
            paletteDefinitions = code.split(themeDivider)[0];
        }
        let paletteCodes = paletteDefinitions.split('$mdThemingProvider.definePalette(');
        return this.generateMcgPalettes(paletteCodes);
    }

    /**
     * Checks for the presence of a string that is only found in this interpreter.
     * @param code string
     * @returns {boolean}
     */
    this.isApplicable = function (code) {
        // Checks for line: `$mdThemingProvider.definePalette('<PALETTENAME>', {`
        // Checks for line: `'contrastDefaultColor': '<PALETTEPRIMARY>',`
        return !!(code.match(/\$mdThemingProvider\.definePalette\('(.*)', ?{/g) && code.match(/'contrastDefaultColor': ?'(.*)',/g));
    };

    /**
     * Wraps our palette name and colors in the appropriate "definePalette" AngularJS method
     * @param palette
     * @returns {string}
     */
    this.createAjsPaletteCode = function (palette) {
        return '$mdThemingProvider.definePalette(\'' + palette.name + '\', ' + this.createAjsPaletteJson(palette.colors) + ');';
    };

    /**
     * Generates an AngularJS definition object and then exports that as a string.
     * @param colors
     * @returns {string}
     */
    this.createAjsPaletteJson = function (colors) {
        let exportable = this.createAjsPaletteJsonObject(colors);
        return angular.toJson(exportable, 2).replace(/"/g, "'");
    };

    /**
     * Generates the appropriate object for AngularJS's Material definition
     * @param colors
     * @returns {{}}
     */
    this.createAjsPaletteJsonObject = function (colors) {
        let exportable = {}, darkColors = [], lightColors = [];
        angular.forEach(colors, function (value) {
            exportable[value.name] = value.hex.replace('#', '');
            if (value.darkContrast) {
                darkColors.push(value.name);
            } else {
                lightColors.push(value.name);
            }
        });
        exportable.contrastDefaultColor = 'light';
        exportable.contrastDarkColors = darkColors;
        exportable.contrastLightColors = lightColors;
        return exportable;
    };

    /**
     * Generates the correct JS object for use in MCG's Demo functionality.
     * @param colors
     * @returns {{}}
     */
    this.createAjsPaletteForUse = function (colors) {
        let exportable = {};
        let darkContrast = [0, 0, 0, 0.87];
        let lightContrast = [255, 255, 255, 0.87];
        angular.forEach(colors, function (value) {
            let contrastArray = lightContrast;
            if (value.darkContrast) {
                contrastArray = darkContrast;
            }
            let rgb = tinycolor(value.hex).toRgb();
            exportable[value.name] = {
                contrast: contrastArray,
                value: [rgb.r, rgb.g, rgb.b]
            };
        });
        return exportable;
    };

    /**
     * Generates an array of MCG palette objects from AngularJS Palette Code
     * @param paletteCodes
     * @returns {[]}
     */
    this.generateMcgPalettes = function (paletteCodes) {
        let palettes = [];
        angular.forEach(paletteCodes, function (paletteCode) {
            let nameSplit = paletteCode.split(/'(.*), ?{/g);
            if (1 in nameSplit) {
                let paletteName = nameSplit[1].replace('\'', '');
                let paletteJson = '{' + nameSplit[2].replace('});', '') + '}';
                paletteJson = paletteJson.replace(/'/g, '"');
                let paletteObj = JSON.parse(paletteJson);

                let darkContrastColors = paletteObj.contrastDarkColors;
                delete (paletteObj.contrastDarkColors);
                delete (paletteObj.contrastDefaultColor);
                delete (paletteObj.contrastLightColors);

                palettes.push(this.generateMcgPalette(paletteObj, paletteName, darkContrastColors));
            }
        }.bind(this));

        return palettes;
    };

    /**
     * Generates an MCG Palette object from some AngularJS Palette data
     * @param paletteObj
     * @param paletteName
     * @param darkContrastColors
     * @returns {{orig: [], name: *, json: string, colors: [], base: string}}
     */
    this.generateMcgPalette = function (paletteObj, paletteName, darkContrastColors) {
        let palette = {"colors": [], "orig": [], "base": "", "json": "", "name": paletteName};
        angular.forEach(paletteObj, function (hex, key) {
            let color = {
                "name": key,
                "hex": '#' + hex,
                "darkContrast": darkContrastColors.includes(key)
            };

            palette.colors.push(color);
            palette.orig.push(color);

            if (key === "500") {
                palette.base = '#' + hex;
            }
        });
        return palette;
    }

});