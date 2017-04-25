(function () {
    'use strict';

    angular
        .module('sposApp')
        .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService', '$http'];
  function RegisterController(UserService, $location, $rootScope, FlashService, $http) {
    var vm = this;

    vm.register = register;

    function register() {
      vm.dataLoading = true;
      console.log(vm.user);


      var isValid =  grecaptcha.getResponse();


      if(isValid.length == 0){ //if string is empty
        vm.dataLoading=false;
        alert("Please resolve the captcha and submit!")
      }else {

        var type = "farmer";
        if (document.getElementById('Gestor').checked) {
          type = "manager";
        }
        console.log(type);


        var config = {
          headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
        }

        var data = $.param({
          email: vm.user.username,
          password: vm.user.password,
          type: type

        });


        $http.post('http://192.168.101.100:8000/CreateUser', data, config).then(handleSuccess, handleError);


      }

    }

    function handleSuccess() {

      var config = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
      }

      var data = $.param({
        email: vm.user.username
      });

      /*SPRING API (SESSION) */

      $http.post("http://localhost:8080/session", data, config)
        .success(function () {
          success();
        })
        .error(function () {
          error();
        });

      /*END SPRING API (SESSION) */


      FlashService.Success('Registration successful', true);
      $location.path('/login');
    }

    function handleError() {
      FlashService.Error(response.message);
      vm.dataLoading = false;
      alert("Error in the registraion, try again later.")
    }

  }

})();

