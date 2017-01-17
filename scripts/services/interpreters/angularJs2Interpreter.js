mcgApp.service('AngularJs2Interpreter', function () {
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
        var themeCodeString = '/* For use in src/lib/core/theming/_palette.scss */\n';
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
        code += '$md-' + palette.name + ': (\n';
        angular.forEach(palette.colors, function (value, key) {
            code += "    " + value.name + " : " + tinycolor(value.hex).toHexString() + ',\n';
        });

        // Generate the contrast variables
        code += '    contrast: (\n';
        angular.forEach(palette.colors, function (value, key) {
            if (value.darkContrast) {
                var contrast = '#000000';
            } else {
                var contrast = '#ffffff';
            }
            code += "        " + value.name + " : " + contrast + ',\n';
        });
        code += '    )\n';

        code += ');\n\n';

        return code;
    };

});