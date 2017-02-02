mcgApp.service('MaterialUiNextInterpreter', function () {
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
     * AngularJS 2
     * Material 2 Formatting Functions
     */
    this.buildExport = function () {
        var themeCodeString = '/* For use in material-ui/src/styles/colors.js */\n';
        if (this.single === true) {
            // Generate palette's code
            themeCodeString = this.createMTwoPaletteCode(this.exportObj);
        } else {
            // For each palette, add it's declaration
            for (var i = 0; i < this.exportObj.length; i++) {
                themeCodeString = themeCodeString + this.createMTwoPaletteCode(this.exportObj[i]);
            }
        }

        this.code = themeCodeString;
    };

    this.createMTwoPaletteCode = function (palette) {
        var code = '';

        // Generate base colors
        code += 'export const ' + palette.name + ' = {\n';
        angular.forEach(palette.colors, function (value, key) {
            code += "    " + value.name + ": '" + tinycolor(value.hex).toHexString() + '\',\n';
        });

        if (palette.colors[5].darkContrast) {
            var contrast = 'dark';
        } else {
            var contrast = 'light';
        }

        // Generate the contrast variables
        code += '    \'constrastDefaultColor\': \'' + contrast + '\',\n';

        code += '};\n\n';

        return code;
    };

});