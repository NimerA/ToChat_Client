(function ()
{
    'use strict';

    angular
        .module('app.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($state, Client)
    {
        var vm = this;
        vm.register = register;
        vm.form = {};

        function register() {
            Client.create({ username: vm.form.username, email:vm.form.email , password: vm.form.password }).$promise.then(function(response) {
                $state.go("app.login");
            });  
        }
    }    

})();