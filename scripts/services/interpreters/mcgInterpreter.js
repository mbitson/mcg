mcgApp.service('McgInterpreter', function () {
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
     * MCG Formatting functions
     */
    this.buildExport = function () {
        this.code = JSON.stringify(angular.copy(this.exportObj), null, 2);
    };

});