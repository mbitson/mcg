mcgApp.service('MaterialUiInterpreter', function () {
    this.export = function(exportObj, theme, single)
    {
        this.code = '';
        this.exportObj = exportObj;
        this.theme = theme;
        this.single = single;
        this.buildExport();
        return this.code;
    };

    this.import = function(code)
    {
        // @TODO - Implement a method which generates the MCG standard object from the code string passed in.
    }

    /**
     * Checks for the presence of a string that is only found in this interpreter.
     * @param code string
     * @returns {boolean}
     */
    this.isApplicable = function(code)
    {
        // Checks for line: `export const <PALETTECOLORNAME> = '#<PALETTECOLORHEX>';`
        return !!(code.match(/export const(.*)= ?'#[0-9A-Za-z]{3,6}';/g));
    };

    /*
     * Material UI (React) Formatting Functions
     */
    this.buildExport = function () {
        var themeCodeString = '/* For use in app/styles/color-palette.scss */\n';
        if (this.single === true) {
            // Generate palette's code
            themeCodeString = this.createMaterialUIPaletteCode(this.exportObj);
        } else {
            // For each palette, add it's declaration
            for (var i = 0; i < this.exportObj.length; i++) {
                themeCodeString = themeCodeString + this.createMaterialUIPaletteCode(this.exportObj[i]);
            }
        }

        this.code = themeCodeString;
    };

    this.createMaterialUIPaletteCode = function (palette) {
        var code = '\n';

        // Generate base colors
        angular.forEach(palette.colors, function (value, key) {
            code += "export const " + palette.name + value.name + " = '" + tinycolor(value.hex).toHexString() + '\';\n';
        });

        return code;
    };

});