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
            this.code = this.createAjsPaletteCode(this.exportObj);
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
        exportable = this.createAjsPaletteJsonObject(colors);
        return angular.toJson(exportable, 2).replace(/"/g, "'");
    };

    this.createAjsPaletteJsonObject = function(colors){
        var exportable = {};
        var darkColors = [];
        var lightColors = [];
        angular.forEach(colors, function (value, key) {
            exportable[value.name] = value.hex.replace('#', '');
            if (value.darkContrast) {
                darkColors.push(value.name);
            }else{
                lightColors.push(value.name);
            }
        });
        exportable.contrastDefaultColor = 'light';
        exportable.contrastDarkColors = darkColors;
        exportable.contrastLightColors = lightColors;
        return exportable;
    };

    this.createAjsPaletteForUse = function (colors) {
        var exportable = {};
        var darkContrast = [0, 0, 0, 0.87];
        var lightContrast = [255, 255, 255, 0.87];
        angular.forEach(colors, function (value, key) {
            if(value.darkContrast){
                contrastArray = darkContrast;
            }else{
                contrastArray = lightContrast;
            }
            var rgb = tinycolor(value.hex).toRgb();
            exportable[value.name] = {
                contrast: contrastArray,
                value: [rgb.r, rgb.g, rgb.b]
            };
        });
        return exportable;
    };

});