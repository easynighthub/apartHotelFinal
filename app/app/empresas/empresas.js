'use strict';

angular.module('myApp.empresas', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/empresas', {
            templateUrl: 'empresas/empresas.html',
            controller: 'viewempresas'
        });
    }])

    .controller('viewempresas', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope','$mdDialog',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope,$mdDialog) {



            // obtener trabajadores
            var empresasER = firebase.database().ref().child('company');
            $scope.empresasER = $firebaseArray(empresasER);
            $scope.empresasER.$loaded().then(function(){
                console.log($scope.empresasER);
                $scope.todasLasEmpresas = $scope.empresasER;
                $scope.empresas = $scope.todasLasEmpresas;
            });



            $scope.validar = function (empresa) {
                console.log(empresa);
                var ref = firebase.database().ref().child("/company/").child(empresa.$id);
                ref.update({
                    visible : !empresa.visible
                });
            };

            $scope.agregarEmpresa = function () {

                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'agregarEmpresa',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true
                })
            };


            function DialogController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };


                $scope.guardarEmpresa = function() {

                    $scope.name = document.getElementById('name').value;
                    $scope.cellPhone = document.getElementById('cellPhone').value;
                    $scope.email = document.getElementById('email').value;
                    $scope.rut = document.getElementById('rut').value;
                    $scope.address = document.getElementById('address').value;

                    if (!$scope.name) {

                        return;
                    }
                    if (!$scope.cellPhone) {

                        return;
                    }
                    if (!$scope.email) {

                        return;
                    }
                    if (!$scope.rut) {
                        return;
                    } if (!$scope.address) {
                        return;
                    }


                    var empresa = {

                        name: $scope.name,
                        cellPhone: $scope.cellPhone,
                        email:$scope.email,
                        rut:$scope.rut,
                        address:$scope.address,
                        visible:true,

                    };
                    var newPostKey = firebase.database().ref().child('posts').push().key;
                    saveToFIrebase(empresa);

                };
            }



            var saveToFIrebase = function(empresa) {
                var newPostKey = firebase.database().ref().child('company').push().key;
                firebase.database().ref('company/'+newPostKey).set(empresa).then(
                    function(s){
                        $mdDialog.hide();

                    }, function(e) {
                        alert('Error, Intente de Nuevo');
                        console.log('Se guardo mal ', e);
                    }
                );
            };
}]);
