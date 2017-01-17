mcgApp.service('AngularJsInterpreter', function () {
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
     * Angular JS formatting functions
     */
    this.buildExport = function () {
        if (this.single === true) {
            // Generate palette's code
            this.exportObj.json = this.createAjsPaletteCode(this.exportObj);
            this.code = this.exportObj.json;
        } else {
            // Init return string
            var themeCodeString = '';

            // For each palette, add it's declaration
            for (var i = 0; i < this.exportObj.length; i++) {
                themeCodeString = themeCodeString + this.createAjsPaletteCode(this.exportObj[i]) + '\n';
            }
            this.code = themeCodeString;

            // Add theme configuration
            if(typeof this.exportObj[0] !== "undefined" && typeof this.exportObj[1] !== "undefined"){
                this.code +=
                    '$mdThemingProvider.theme(\'' + this.theme.name + '\')\n' +
                    '    .primaryPalette(\'' + this.exportObj[0].name + '\')\n' +
                    '    .accentPalette(\'' + this.exportObj[1].name + '\');';
            }
        }
    };

    // Function to make the definePalette code for a palette.
    this.createAjsPaletteCode = function (palette) {
        return '$mdThemingProvider.definePalette(\'' + palette.name + '\', ' + this.createAjsPaletteJson(palette.colors) + ');';
    };

    // Function to make an exportable json array for themes.
    this.createAjsPaletteJson = function (colors) {
        var exportable = {};
        var darkColors = [];
        angular.forEach(colors, function (value, key) {
            exportable[value.name] = value.hex;
            if (value.darkContrast) {
                darkColors.push(value.name);
            }
        });
        exportable.contrastDefaultColor = 'light';
        exportable.contrastDarkColors = darkColors.join(' ');
        return angular.toJson(exportable, 2).replace(/"/g, "'");
    };

});