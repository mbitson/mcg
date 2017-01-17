mcgApp.service('AndroidInterpreter', function () {
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
     * Android formatting functions
     */
    this.buildExport = function () {
        if (this.single === true) {
            // Generate palette's code
            themeCodeString = this.createAndroidPaletteCode(this.exportObj);
        } else {
            // Init return string
            var themeCodeString = '';

            // For each palette, add it's declaration
            for (var i = 0; i < this.exportObj.length; i++) {
                themeCodeString = themeCodeString + this.createAndroidPaletteCode(this.exportObj[i]);
            }
        }

        // Add XML parent node
        this.code = escapeHtml('<resources>\n' + themeCodeString + '<resources>');
    };

    this.createAndroidPaletteCode = function (palette) {
        var code = '';
        angular.forEach(palette.colors, function (value, key) {
            code += '     <color name="' + palette.name + '_' + value.name + '">' + value.hex + '</color>\n';
        });
        return code;
    };

});