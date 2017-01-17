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