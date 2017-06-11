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
        vm.user = {};

        function login(){
            
            Client.login({email: vm.user.email,password: vm.user.password}).$promise.then(function(response) {
                var data = {
                    id: response.user.id,
                    tokenId: response.id,
                    username: response.user.username  
                }
                //var date = Date.now();
                //date.setHours(date.getHours()+4);
                //console.log(date);

                $cookies.putObject("user",data);
                $state.go("app.chat");
            });
        }

        // Password RegExp: "/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}/"
        // Data

        // Methods

        //////////
    }
})();