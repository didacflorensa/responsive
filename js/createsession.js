'use strict';

/**
 * @ngdoc function
 * @name sposApp.controller:CreatesessionCtrl
 * @description
 * # CreatesessionCtrl
 * Controller of the sposApp
 */

angular.module('sposApp')
  .controller('CreateSessionCtrl', function ($scope, $q, $state, $http, Session, $rootScope, $location ) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma']

    $(document).ready(function () {

        $("#add_newFarmForm").hide();

      /* Manage the creation of a new farm */
      $("#addFarm").click(function (e) {
        e.preventDefault();
        $("#add_newFarmForm").show();
        })

      $("#storeFarm").click(function () {
        var config = {
          headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
        }

        var data = $.param({
          farm: $("#newFarm").val(),
          email: $rootScope.globals.currentUser.username
        });
        $http.post('http://192.168.101.100:8000/CreateFarm', data, config).success (function (response) {
          console.log("Debug: " +response)
        })

        $("#add_newFarmForm").hide();

        var x = document.getElementById("select_farm");
        x.add($("#newFarm").val());
        x.value = ($("#newFarm").val());
      })

      /* End the creation of a new farm */


      /*Get farms from the user*/

      var farms;
      var x = document.getElementById("select_farm");
      $("#select_farm").empty();

      var config = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
      }

      var data = $.param({
        email: $rootScope.globals.currentUser.username
      });

      $http.post('http://192.168.101.100:8000/GetFarms', data,config).success(function (response) {
        console.log("Debug:  "+response)
        farms = JSON.parse( response );
        //var optionBlank = document.createElement("option");
        //optionBlank.text = "- - -";
        //x.add(optionBlank);

        for (var  farm in farms){
          console.log("d:  "+ farms[farm])
          var option = document.createElement("option");
          option.text = farms[farm];
          x.add(option);
        }

      })

      })


    /*Controlling the MultiStep Form*/

    //jQuery time
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    $(".next").click(function(){


      current_fs = $(this).parent().parent();
      console.log(current_fs)
      next_fs = $(this).parent().parent().next();
      console.log(next_fs)

      //activate next step on progressbar using the index of next_fs
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();

      //hide the current fieldset
      current_fs.hide();

    });

    $(".previous").click(function(){


      current_fs = $(this).parent().parent();
      previous_fs = $(this).parent().parent().prev();

      //de-activate current step on progressbar
      $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

      //show the previous fieldset
      previous_fs.show();

      //hide the current fieldset
      current_fs.hide();

    });

    /* Store the information into the DB */


    $(".submit").click(function(){
      return false;
    })

    //Insert new farm with all params
    $("#terminar").click(function (event) {

      var config = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
      }

      $scope.session = {};
      var data = $.param({
        //email: "test@gmail.com",
        // (1) Using the rootScope (2) Use the session username
        email: $rootScope.globals.currentUser.username,
        farm: "testFarm1",
        maxCiclos: $("#num_ciclos").val(),
        maxCubriciones: $("#maxCubriciones").val(),
        minCubriciones: $("#minCubriciones").val(),
        maxSemLactacion: $("#maxLactacion").val(),
        minSemLactacion:$("#minLactacion").val(),
        kgConsumoInseminacion: $("#inseminación").val(),
        kgConsumoGestacion1: $("#gest1-4").val(),
        kgConsumoGestacion5:$("#gest5-12").val(),
        kgConsumoGestacion13:$("#gest13-16").val(),
        ConsumoGestacion2AntesParto: $("#antesParto").val(),
        kgConsumoLechonSem3: $("#lechon3").val(),
        kgConsumoLechonSem4:$("#lechon4").val(),
        kgConsumoLechonSem5: $("#lechon5").val(),
        precioKgPiensoCubricion: $("#Cubricion").val(),
        precioKgPiensoLactacion: $("#Lactacion").val(),
        precioKgPiensoGestacion: $("#Gestacion").val(),
        precioKgPiensoLechones:$("#Lechones").val(),
        precioLechonVendido: $("#lechon").val(),
        precioCerdaReposicion: $("#reposicion_cerda").val(),
        precioCerdaVendida: $("#vendida").val(),
        precioInseminacionArtificial: $("#inseminacion_artificial").val()
      });


      $http.post('http://192.168.101.100:8000/InsertOrUpdateFarm', data,config).success(function (response) {
        console.log("Debug: "+response)

      })
    })


      /*Other stuff*/



    $scope.vmConfig = {virtualCPUs:0, realCPUs:0, ram:0};
    $scope.parameters = {isClustered: false, files: []};
    $scope.session = {};

    $scope.CreateState = {
      FIRSTSTEP: 1,
      SECONDSTEP: 2,
      CREATING: 3,
      CREATED: 4,
      ERROR: 5
    };

    $scope.CreateStep = {
      CREATING_SESSION: 1,
      UPLOADING_FILE: 2
    };

    $scope.MethodLoadState = {
      NONLOADED: 1,
      LOADING: 2,
      LOADED: 3,
      ERROR: 4
    };

    $scope.location = $location;
    $scope.predefinedVM = "";
    $scope.createStep = $scope.CreateStep.CREATING_SESSION;
    $scope.state = $scope.CreateState.FIRSTSTEP;
    $scope.methodLoadState = $scope.MethodLoadState.NONLOADED;
    $scope.uploadMessage = "";
    $scope.selectedModel = "";
    $scope.selectedMethod = "";
    $scope.errorFile = "";
    $scope.problemType = "";

    $scope.sessionKey = "";
    $scope.sessionId = "";

    $scope.clearPredefinedVM = function () {
      $scope.predefinedVM = "";
    };

    $scope.clearVMConfig = function () {
      $scope.vmConfig = {virtualCPUs:0, realCPUs:0, ram:0};
    };

    $scope.getCompatibleMethods = function () {
      $scope.methodLoadState = $scope.MethodLoadState.LOADING;
      ModelInfo.query({action: 'search', search: 'findByModel', modelName: $scope.selectedModel})
        .$promise.then(function (modelResponse) {
        $scope.parameters.model = modelResponse._embedded.models[0];
        $scope.methodLoadState = $scope.MethodLoadState.LOADED;
      }).catch(function (error) {
        $scope.methodLoadState = $scope.MethodLoadState.ERROR;
      });
    };

    $scope.loadMethod = function () {
      if ($state.current.name == "createSession") {
        SetSimpleVM();
        $scope.state = $scope.CreateState.SECONDSTEP;
      }
      MethodInfo.query({action: 'search', search: 'findByMethod', methodName: $scope.selectedMethod})
        .$promise.then(function (methodResponse) {
        $scope.parameters.method = methodResponse._embedded.methods[0];
      });
    };

    $scope.createSession = function () {
      $scope.state = $scope.CreateState.CREATING;
      createSession();
    };

    $scope.completeFirstStep = function () {
      $scope.state = $scope.CreateState.SECONDSTEP;
      createVMConfig();
    };

    var uploadFileToUrl = function(files, uploadUrl, success, error){
      var fd = new FormData();

      for (var i=0; i < files.length; i++)
      {
        fd.append('file' + i, files[i]);
      }

      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
        .success(function(){
          success();
        })
        .error(function(){
          error();
        });
    };

    $scope.uploadFiles = function (url, success, error) {
      var files = [$scope.file1];
      if ($scope.file2)
        files.push($scope.file2);
      uploadFileToUrl(files, url, success, error);
    };

    var getPredefinedVM = function () {
      var id = -1;
      switch ($scope.predefinedVM) {
        case "High":
          id = 3;
          break;
        case "Medium":
          id = 2;
          break;
        case "Low":
          id = 1;
          break;
      }
      $scope.session.vmConfig = VirtualMachine.query({id: id});
    };

    var createVMConfig = function () {
      if ($scope.predefinedVM === "") {

        $http.post('http://127.0.0.1:8080/virtualmachine', $scope.vmConfig)
          .success(function (data, status, headers, config) {
            VirtualMachine.get({id: headers('Location').split('/').pop()}).$promise.then(function (vm) {
              $scope.session.vmConfig = vm;
            });

          });
        $scope.clearVMConfig();
      } else {
        getPredefinedVM();
      }
    };

    var createSession = function () {
      CreateSession();
    };

    var SetSimpleVM = function() {
      $scope.session.vmConfig = VirtualMachine.query({id: 3});
    };

    var CreateSession = function() {
      $scope.session.info = $scope.parameters;
      if ($scope.session.type == 'Optimal') {
        $scope.session.maximumDuration = -1;
      }

      Session.save($scope.session).$promise.then(function (session) {
        $scope.sessionId = session.id;
        $scope.sessionKey = session.key;

        $scope.uploadFiles("http://127.0.0.1:8080/session/" + $scope.sessionId + "/uploadFiles?key=" + $scope.sessionKey, function () {
          $scope.state = $scope.CreateState.CREATED;
        }, function() {
          $scope.state = $scope.CreateState.ERROR;
        });
      }).catch(function (error) {
        $scope.state = $scope.CreateState.ERROR;
        if (error.data.message.substring(0, 7) == "VMERROR")
        {
          $scope.errorType = "VM";
        }
      });
    };

    $scope.activateInput = function (format) {
      $scope.fileType = format;
      $scope.parameters.files = [];
      $('#input-mps').fileinput('reset');
      $('#input-lp').fileinput('reset');
      $('#input-dat').fileinput('reset');
      $('#input-mod').fileinput('reset');
      $('#input-problem').fileinput('reset');
      $('#input-block').fileinput('reset');

      $('#input-mps').fileinput('enable');
      $('#input-lp').fileinput('enable');
      $('#input-dat').fileinput('enable');
      $('#input-mod').fileinput('enable');
      $('#input-problem').fileinput('enable');
      $('#input-block').fileinput('enable');

      $('#input-mps').fileinput('clear');
      $('#input-lp').fileinput('clear');
      $('#input-dat').fileinput('clear');
      $('#input-mod').fileinput('clear');
      $('#input-problem').fileinput('clear');
      $('#input-block').fileinput('clear');
    }

    $scope.validateFiles = function () {

      if (!$scope.file1)
        return false;

      if (($scope.file1.name.split('.').pop() == "dat" || $scope.file1.name.split('.').pop() == "mod") && !$scope.file2)
        return false;

      return true;
    };

    $scope.setDeterminist = function () {
      if ($scope.problemType == "Determinist") {
        $scope.methodLoadState = $scope.MethodLoadState.LOADING;
        ModelInfo.query({action: 'search', search: 'findByModel', modelName: "Determinist"})
          .$promise.then(function (modelResponse) {
          $scope.parameters.model = modelResponse._embedded.models[0];
          $scope.methodLoadState = $scope.MethodLoadState.LOADED;
        }).catch(function (error) {
          $scope.methodLoadState = $scope.MethodLoadState.ERROR;
        });
      }
    }

    $scope.vCpuSlider = {
      options: {
        floor: 1,
        ceil: 10,
        showTicks: true,
        onChange: function(id) {
          $scope.clearPredefinedVM();
        },
        translate: function(value) {
          return value + " vCPUs";
        }
      }
    };

    $scope.rCpuSlider = {
      options: {
        floor: 0.5,
        ceil: 10,
        step: 0.5,
        precision: 1,
        showTicks: 1,
        onChange: function(id) {
          $scope.clearPredefinedVM();
        },
        translate: function(value) {
          return value + " CPUs";
        }
      }
    };

    $scope.memSlider = {
      options: {
        floor: 512,
        ceil: 10240,
        step:  256,
        precision: 0,
        showTicks: 1024,
        onChange: function(id) {
          $scope.clearPredefinedVM();
        },
        translate: function(value) {
          return value + " Mb";
        }
      }
    };



    $scope.stepsForm = function () {
      var count = 0; // To Count Blank Fields
      /*------------ Validation Function-----------------*/
      $(".submit_btn").click(function (event) {
        var radio_check = $('.rad'); // Fetching Radio Button By Class Name
        var input_field = $('.text_field'); // Fetching All Inputs With Same Class Name text_field & An HTML Tag textarea
        var text_area = $('textarea');
// Validating Radio Button
        if (radio_check[0].checked == false && radio_check[1].checked == false) {
          var y = 0;
        } else {
          var y = 1;
        }
// For Loop To Count Blank Inputs
        for (var i = input_field.length; i > count; i--) {
          if (input_field[i - 1].value == '' || text_area.value == '') {
            count = count + 1;
          } else {
            count = 0;
          }
        }
// Notifying Validation
        if (count != 0 || y == 0) {
          alert("*All Fields are mandatory*");
          event.preventDefault();
        } else {
          return true;
        }
      });
      /*---------------------------------------------------------*/
      $(".next_btn").click(function () { // Function Runs On NEXT Button Click
        $(this).parent().next().fadeIn('slow');
        $(this).parent().css({
          'display': 'none'
        });
// Adding Class Active To Show Steps Forward;
        $('.active').next().addClass('active');
      });
      $(".pre_btn").click(function () { // Function Runs On PREVIOUS Button Click
        $(this).parent().prev().fadeIn('slow');
        $(this).parent().css({
          'display': 'none'
        });
// Removing Class Active To Show Steps Backward;
        $('.active:last').removeClass('active');
      });
// Validating All Input And Textarea Fields
      $(".submit_btn").click(function (e) {
        if ($('input').val() == "" || $('textarea').val() == "") {
          alert("*All Fields are mandatory*");
          return false;
        } else {
          return true;
        }
      });
    }

  });
