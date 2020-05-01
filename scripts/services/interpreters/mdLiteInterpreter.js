mcgApp.service('MdLiteInterpreter', function () {
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
        // Checks for line: `$palette-<PALETTENAME>:`
        // Checks for line: `$palette-<PALETTENAME>: nth($palette-<PALETTENAME>, <PALETTENUMBER>);`
        return !!(code.match(/\$palette-(.*): ?\n/g) && code.match(/\$palette-(.*): ?nth\(\$palette-(.*)\);/g));
    };

    /*
     * Material Design Lite (SCSS)
     */
    this.buildExport = function () {
        var themeCodeString = '/* For use in _color-definitions.scss */\n';
        if (this.single === true) {
            // Generate palette's code
            themeCodeString = this.createMdLitePaletteCode(this.exportObj);
        } else {
            // For each palette, add it's declaration
            for (var i = 0; i < this.exportObj.length; i++) {
                themeCodeString = themeCodeString + this.createMdLitePaletteCode(this.exportObj[i]);
            }
        }

        this.code = themeCodeString;
    };

    this.createMdLitePaletteCode = function (palette) {
        var code = '';

        // Generate the palette container for scss
        code += '$palette-' + palette.name + ':\n';
        angular.forEach(palette.colors, function (value, key) {
            code += tinycolor(value.hex).toRgbString() + '\n';
        });
        code += ';';

        // Generate the scss variables
        code += '\n\n';
        angular.forEach(palette.colors, function (value, key) {
            code += '$palette-' + palette.name + '-' + value.name + ': nth($palette-' + palette.name + ', ' + (key + 1) + ');\n';
        });
        code += '\n\n';

        return code;
    };

});