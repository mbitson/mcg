mcgApp.service('FlutterInterpreter', function () {

    /**
     * Generates a string of Flutter Material Color code from the MCG Palettes
     * @param exportObj
     * @param theme
     * @param single
     * @returns {*|string}
     */
    this.export = function (exportObj, theme, single) {
        if (single) {
            return this.generateFlutterPaletteCode(exportObj);
        }
        return exportObj.map(
            obj => this.generateFlutterPaletteCode(obj)
        ).join('\n\n');
    };

    /**
     * Attempts to generate a Palettes object that MCG will recognize from a string of Flutter Material Color code.
     * @param code
     * @returns {[]}
     */
    this.import = function (code) {
        let colors = this.determineColors(code);
        return this.buildPalettes(colors);
    }

    /**
     * Checks for the presence of a string that is only found in this interpreter.
     * @param code string
     * @returns {boolean}
     */
    this.isApplicable = function (code) {
        // Checks for line: `static const MaterialColor <PALETTENAME> = MaterialColor(_<PALETTENAME>PrimaryValue, <int, Color>{`
        return !!(code.match(/static const MaterialColor(.*)= ?MaterialColor\(_(.*)PrimaryValue, ?<int, ?Color>{/g));
    };

    /**
     * Generates a string of code for Flutter Material Design from a MCG Palette
     * @param palette
     * @returns {string}
     */
    this.generateFlutterPaletteCode = function (palette) {
        const varMap = {
            primary: {
                code: [],
                mainColorShade: '500',
                mainColor: '',
                varName: palette.name,
                privateVarName: `_${palette.name}PrimaryValue`
            },
            accent: {
                code: [],
                mainColorShade: '200',
                mainColor: '',
                varName: `${palette.name}Accent`,
                privateVarName: `_${palette.name}AccentValue`
            },
            codeString: function () {
                return escapeHtml([this.primary.code.join('\n'), this.accent.code.join('\n')].join('\n\n'));
            }
        }

        this.addPalettesToVarMap(palette, varMap)
        varMap.primary.code.push('});');
        varMap.primary.code.push(`static const int ${varMap.primary.privateVarName} = ${varMap.primary.mainColor};`);
        varMap.accent.code.push('});');
        varMap.accent.code.push(`static const int ${varMap.accent.privateVarName} = ${varMap.accent.mainColor};`);

        return varMap.codeString();
    };

    /**
     * Populates the varmap used in Flutter Material Design generation as necessary from our palette data
     * @param palette
     * @param varMap
     */
    this.addPalettesToVarMap = function (palette, varMap) {
        function hexValue(value) {
            return '0xFF' + value.hex.substring(1).toUpperCase()
        }

        palette.colors.forEach(value => {
            let isAccent = value.name.startsWith('A');
            let vars = varMap[isAccent ? 'accent' : 'primary'];
            let valueName = isAccent ? value.name.substring(1) : value.name;

            if (valueName === vars.mainColorShade) {
                vars.mainColor = hexValue(value);
                vars.code.unshift(`static const MaterialColor ${vars.varName} = MaterialColor(${vars.privateVarName}, <int, Color>{`);
                vars.code.push(`  ${valueName}: Color(${vars.privateVarName}),`);
                return;
            }
            vars.code.push(`  ${valueName}: Color(${hexValue(value)}),`);
        });
    }

    /**
     * Takes Flutter Material Design and determines the palettes, color names, and color values.
     * @param code
     * @returns {{}}
     */
    this.determineColors = function (code) {
        let colors = {};
        let codeColorBlocks = code.split(/static const MaterialColor/g);
        angular.forEach(codeColorBlocks, function (codeColorBlock) {
            let paletteMeta = [...codeColorBlock.matchAll(/MaterialColor\(_(.*)(Primary|Accent)Value, ?<int/g)];
            if (0 in paletteMeta) {
                let paletteName = paletteMeta[0][1];
                let paletteType = paletteMeta[0][2];

                let paletteBaseValue = codeColorBlock.match(/[Primay|Acent]Value = 0xFF([A-Za-z0-9]{3,6});/)[1];
                let baseNumber = "500";
                if (paletteType === "Accent") baseNumber = "A200";

                if (!(paletteName in colors)) colors[paletteName] = {};
                let paletteColors = [...codeColorBlock.matchAll(/ ?([0-9]{2,3}) ?: ?Color\((?:0xFF|.*)([A-Za-z0-9]{3,6})\) ?,/g)];
                for (const colorData of paletteColors) {
                    let colorName = colorData[1];
                    let colorValue = colorData[2];

                    if (paletteType === "Accent") colorName = "A" + colorName;
                    if (colorName === baseNumber) {
                        colorValue = paletteBaseValue;
                    }
                    colors[paletteName][colorName] = '#' + colorValue;
                }

            }
        });
        return colors;
    }

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
                let c = tinycolor(colorValue);
                let color = {
                    "name": colorName,
                    "hex": colorValue,
                    "darkContrast": c.isLight()
                };
                palette.colors.push(color);
                palette.orig.push(color);
                if (colorName === "500") {
                    palette.base = colorValue;
                }
            });
            palettes.push(palette);
        });
        return palettes;
    }

});