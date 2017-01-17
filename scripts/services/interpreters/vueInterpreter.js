mcgApp.service('VueInterpreter', function () {
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
     * Material Design Lite (SCSS)
     */
    this.buildExport = function () {
        var themeCodeString = '    /* src/core/components/mdTheme/palette.js */\n';
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
        code +=  '    ' + palette.name + ':{\n';
        angular.forEach(palette.colors, function (value, key) {
            code += '        ' + value.name + ': \'' + tinycolor(value.hex).toHexString() + '\',\n';
        });

        // Output darkText
        code += '        darkText: ';
        var darkTextArray = [];
        angular.forEach(palette.colors, function (value, key) {
            if(value.darkContrast == true) {
                if(
                    typeof value.name == "string" &&
                    value.name.indexOf('A') < 0
                ){
                    value.name = parseInt(value.name);
                }
                darkTextArray.push(value.name);
            }
        });
        code += JSON.stringify(darkTextArray);
        code += '\n';

        // Close out palette
        code += '    },\n';

        return code;
    };

});