(function ()
{
    'use strict';

    angular
        .module('app.chat', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider)
    {

        // State
        $stateProvider.state('app.chat', {
            url    : '/chat',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/chat/chat.html',
                    controller : 'ChatController as vm'
                }
            },
            resolve: {
                Clients: function(Client)
                {
                    return Client.find();
                },
                User: function(Client)
                {
                    return Client.getCurrent();
                },
                urlBase: function(LoopBackResource){
                    return LoopBackResource.getUrlBase();
                }
            },
            controller: function (Client, $state) {
                if (Client.isAuthenticated() === false)
                    $state.go('app.login');
            }
        });

        msApiProvider.register('chat.chats', ['app/data/chat/chats/:id.json']);
    }

})();