mcgApp.service('McgInterpreter', function () {
    this.export = function(exportObj, theme)
    {
        this.code = '';
        this.exportObj = exportObj;
        this.theme = theme;
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