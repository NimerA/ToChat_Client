(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [
            'app.core',
            'app.toolbar',
            'app.quick-panel',
            'app.sample',
            'app.chat',
            'app.login'
        ]);
})();