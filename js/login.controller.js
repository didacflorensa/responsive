(function () {
    'use strict';

    angular
        .module('sposApp')
        .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
  function LoginController($location, AuthenticationService, FlashService) {
    var vm = this;

    vm.login = login;

    (function initController() {
      // reset login status
      AuthenticationService.ClearCredentials();
    })();

    function login() {


      var working = false;
      $('.login').on('submit', function(e) {
        e.preventDefault();
        if (working) return;
        working = true;
        var $this = $(this),
          $state = $this.find('button > .state');
        $this.addClass('loading');
        $state.html('Authenticating');
        setTimeout(function() {
          $this.addClass('ok');
          $state.html('Welcome back!');
          setTimeout(function() {
            $state.html('Log in');
            $this.removeClass('ok loading');
            working = false;
          }, 4000);
        }, 3000);
      });

      vm.dataLoading = true;
      AuthenticationService.Login(vm.username, vm.password, function (response) {
        if (response.success) {
          AuthenticationService.SetCredentials(vm.username, vm.password);
          $location.path('/');
        } else {
          FlashService.Error(response.message);
          vm.dataLoading = false;
        }
      });
    };
  }

})();

