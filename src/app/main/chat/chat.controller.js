(function ()
{
    'use strict';

    angular
        .module('app.chat')
        .directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }])
        .factory('socket', function (socketFactory) {
            var myIoSocket = io.connect('http://localhost:3002');
            var socket = socketFactory({ ioSocket: myIoSocket });
            return socket;
        })
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController(ChatsService, $mdSidenav, User, $timeout, $document, $mdMedia, Client, $http, Container, Clients, urlBase, socket)
    {
        
        var vm = this;

        // Data
        vm.contacts = ChatsService.contacts = Clients;
        vm.chats = ChatsService.chats;
        vm.user = User;
        vm.leftSidenavView = false;
        vm.chat = undefined;
        vm.upload = false;
        vm.urlBase = urlBase;
        
        // Methods
        vm.logout = logout;
        vm.getChat = getChat;
        vm.toggleSidenav = toggleSidenav;
        vm.toggleLeftSidenavView = toggleLeftSidenavView;
        vm.reply = reply;
        vm.setUserStatus = setUserStatus;
        vm.clearMessages = clearMessages;
        vm.sendMessage = sendMessage;
        //////////
        

        //Socket.io


        ///////////
        /**
         * Logout Function
         */
        function logout()
        {
            Client.logout().$promise.then(function() {
                $state.go("app.login");
            }); 
        }

        

        /**
         * Get Chat by Contact id
         * @param contactId
         */
        function getChat(contactId)
        {
            ChatsService.getContactChat(contactId).then(function (response)
            {
                vm.chatContactId = contactId;
                vm.chat = response;

                // Reset the reply textarea
                resetReplyTextarea();

                // Scroll to the last message
                scrollToBottomOfChat();

                if ( !$mdMedia('gt-md') )
                {
                    $mdSidenav('left-sidenav').close();
                }

                // Reset Left Sidenav View
                vm.toggleLeftSidenavView(false);

            });
        }

        /**
         * Reply
         */
        function reply($event)
        {
            // If "shift + enter" pressed, grow the reply textarea
            if ( $event && $event.keyCode === 13 && $event.shiftKey )
            {
                vm.textareaGrow = true;
                return;
            }

            // Prevent the reply() for key presses rather than the"enter" key.
            if ( $event && $event.keyCode !== 13 )
            {
                return;
            }

            // Check for empty messages
            if ( vm.replyMessage === '' )
            {
                resetReplyTextarea();
                return;
            }

            // Message
            var message = {
                who    : 'user',
                message: vm.replyMessage,
                time   : new Date().toISOString(),
                isAttachment : false
            };

            // Add the message to the chat
            vm.chat.push(message);
            socket.emit('sendMessage', 1, vm.user, message.message);

            // Update Contact's lastMessage
            vm.contacts.getById(vm.chatContactId).lastMessage = message;

            // Reset the reply textarea
            resetReplyTextarea();

            // Scroll to the new message
            scrollToBottomOfChat();

        }

        /**
         * Clear Chat Messages
         */
        function clearMessages()
        {
            vm.chats[vm.chatContactId] = vm.chat = [];
            vm.contacts.getById(vm.chatContactId).lastMessage = null;
        }

        /**
         * Reset reply textarea
         */
        function resetReplyTextarea()
        {
            vm.replyMessage = '';
            vm.textareaGrow = false;
        }

        /**
         * Scroll Chat Content to the bottom
         * @param speed
         */
        function scrollToBottomOfChat()
        {
            $timeout(function ()
            {
                var chatContent = angular.element($document.find('#chat-content'));

                chatContent.animate({
                    scrollTop: chatContent[0].scrollHeight
                }, 400);
            }, 0);

        }

        /**
         * Set User Status
         */
        function setUserStatus(status)
        {
            vm.user.status = status;
        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Toggle Left Sidenav View
         *
         * @param view id
         */
        function toggleLeftSidenavView(id)
        {
            vm.leftSidenavView = id;
        }

        /**
         * Array prototype
         *
         * Get by id
         *
         * @param value
         * @returns {T}
         */
        Array.prototype.getById = function (value)
        {
            return this.filter(function (x)
            {
                return x.id === value;
            })[0];
        };

        function sendMessage( $event ) {
            if( vm.upload ){
                var file = vm.myFile;
                var reg = /^image\/[a-z]*$/;
                var regex = new RegExp(reg);

                console.log("Sending Message");
                
                var fd = new FormData();
                fd.append('file', file);
                
                $http.post(vm.urlBase + "/containers/files/upload", fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function( data ){
                    var image = data.result.files.file[0]; //base file :v 
                    // Message
                    var message = {
                        who    : 'user',
                        message: vm.urlBase + "/containers/files/download/" + image.name,
                        time   : new Date().toISOString(),
                        isAttachment : true,
                        isImage: regex.test(image.type)
                    };

                    // Add the message to the chat
                    vm.chat.push(message);

                    // Update Contact's lastMessage
                    vm.contacts.getById(vm.chatContactId).lastMessage = message;

                    // Reset the reply textarea
                    resetReplyTextarea();

                    // Scroll to the new message
                    scrollToBottomOfChat();

                })
                .error(function( err ){
                    console.log(err);
                });
                
            }else{
                vm.reply($event);
            }
        }
    }
})();