(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [
            'app.core',
            'app.chat',
            'app.login',
            'app.register'
        ]);
})();