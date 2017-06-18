(function ()
{
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($state, Client, $rootScope, $cookies)
    {
        var vm = this;
        vm.login = login;

        function login(){
            Client.login({email: vm.user.email,password: vm.user.password}).$promise.then(function(response) {
                console.log("Logged In!");
                $state.go("app.chat");
            });
        }
        // Methods

        //////////
    }
})();