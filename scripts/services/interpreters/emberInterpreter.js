mcgApp.service('EmberInterpreter', function () {
    this.export = function(exportObj, theme)
    {
        this.code = '';
        this.exportObj = exportObj;
        this.theme = theme;
        this.buildExport();
        return this.code;
    };

    /*
     * Ember Paper Formatting Functions
     */
    this.buildExport = function () {
        var themeCodeString = '/* For use in app/styles/color-palette.scss */\n';
        if (this.single === true) {
            // Generate palette's code
            themeCodeString = this.createEmberPaletteCode(this.exportObj);
        } else {
            // For each palette, add it's declaration
            for (var i = 0; i < this.exportObj.length; i++) {
                themeCodeString = themeCodeString + this.createEmberPaletteCode(this.exportObj[i]);
            }
        }

        this.code = themeCodeString;
    };

    this.createEmberPaletteCode = function (palette) {
        var code = '';

        // Generate base colors
        code += '$color-' + palette.name + ': (\n';
        angular.forEach(palette.colors, function (value, key) {
            code += "    '" + value.name + "' : " + tinycolor(value.hex).toHexString() + ',\n';
        });

        if (palette.colors[5].darkContrast) {
            var contrast = '#000000';
        } else {
            var contrast = '#ffffff';
        }

        // Generate the contrast variables
        code += '    \'contrast\': ' + contrast + '\n';

        code += ') !default;\n\n';

        return code;
    };

});