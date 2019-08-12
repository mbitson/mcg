mcgApp.service('FlutterInterpreter', function () {
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
     * Flutter formatting functions
     */
    this.buildExport = function () {
        if (this.single === true) {
            // Generate palette's code
            themeCodeString = this.createFlutterPaletteCode(this.exportObj);
        } else {
            // Init return string
            var themeCodeString = '';

            // For each palette, add it's declaration
            for (var i = 0; i < this.exportObj.length; i++) {
                themeCodeString = themeCodeString + this.createFlutterPaletteCode(this.exportObj[i]) + '\n\n';
            }
        }

        this.code = themeCodeString;
    };

    this.createFlutterPaletteCode = function (palette) {
        code = this.createStandartPaletteCode(palette);
        code += '\n\n';
        code += this.createAccentPaletteCode(palette);

        return code;
    };

    this.createStandartPaletteCode = function (palette) {
        code = '';

        angular.forEach(palette.colors, function (value, key) {
            // Extract main color (500)
            if (value.name === "500") {
                code = escapeHtml('// Standart Colors\nMaterialColor(0xff' + value.hex.substring(1) + ', <int, Color>{\n' + code);
            }

            // Skip Accent Colors
            if (value.name.startsWith("A")) {
                return;
            }

            code += '  ' + value.name + ': Color(0xff' + value.hex.substring(1) + '),\n';
        });

        code += '}';
        return code;
    };

    this.createAccentPaletteCode = function (palette) {
        code = '';

        angular.forEach(palette.colors, function (value, key) {
            // Extract main color (500)
            if (value.name === "500") {
                code = escapeHtml('// Accent Colors\nMaterialColor(0xff' + value.hex.substring(1) + ', <int, Color>{\n' + code);
            }
            // Skip Non-Accent Colors
            if (!value.name.startsWith("A")) {
                return;
            }

            code += '  ' + value.name.substring(1) + ': Color(0xff' + value.hex.substring(1) + '),\n';
        });

        code += '}';
        return code;
    };

});