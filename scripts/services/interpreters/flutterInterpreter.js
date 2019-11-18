mcgApp.service('FlutterInterpreter', function () {
    this.export = function (exportObj, theme, single) {
        this.code = '';
        this.exportObj = exportObj;
        this.theme = theme;
        this.single = single;
        this.buildExport();
        return this.code;
    };

    this.buildExport = function () {
        if (this.single) {
            // Generate palette's code
            this.code = this.generateFlutterPaletteCode(this.exportObj);
            return;
        }

        // Generate code for each palette
        this.code = this.exportObj.map(
            obj => this.generateFlutterPaletteCode(obj)
        ).join('\n\n');
    };

    this.generateFlutterPaletteCode = function (palette) {
        function hexValue(value) {
            return `0xFF${value.hex.substring(1).toUpperCase()}`;
        }

        const varMap = {
            primary: {
                code: [],
                mainColorShade: '500',
                mainColor: '',
                varName: palette.name,
                privateVarName: `_${palette.name}PrimaryValue`
            },
            accent: {
                code: [],
                mainColorShade: '200',
                mainColor: '',
                varName: `${palette.name}Accent`,
                privateVarName: `_${palette.name}AccentValue`
            },
            codeString: function () {
                return escapeHtml([
                    this.primary.code.join('\n'),
                    this.accent.code.join('\n')
                ].join('\n\n'));
            }
        }

        palette.colors.forEach(value => {
            let isAccent = value.name.startsWith('A');

            let vars = varMap[isAccent ? 'accent' : 'primary'];
            let valueName = isAccent ? value.name.substring(1) : value.name;

            // Extract code for the main color
            if (valueName == vars.mainColorShade) {
                vars.mainColor = hexValue(value);
                vars.code.unshift(`static const MaterialColor ${vars.varName} = MaterialColor(${vars.privateVarName}, <int, Color>{`);
                vars.code.push(`  ${valueName}: Color(${vars.privateVarName}),`);
                return;
            }

            vars.code.push(`  ${valueName}: Color(${hexValue(value)}),`);
        });

        varMap.primary.code.push('});');
        varMap.primary.code.push(`static const int ${varMap.primary.privateVarName} = ${varMap.primary.mainColor};`);

        varMap.accent.code.push('});');
        varMap.accent.code.push(`static const int ${varMap.accent.privateVarName} = ${varMap.accent.mainColor};`);

        return varMap.codeString();
    };

});