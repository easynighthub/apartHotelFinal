/**
 * Created by celis on 11-05-2017.
 */

'use strict';

angular.module('myApp.agregarEmpresa', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/agregarEmpresa', {
            templateUrl: 'agregarEmpresa/agregarEmpresa.html',
            controller: 'viewagregarEmpresa'
        });
    }])

    .controller('viewagregarEmpresa', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope) {

            $scope.guardarEmpresa = function() {

                $scope.name = document.getElementById('name').value;
                $scope.cellPhone = document.getElementById('cellPhone').value;
                $scope.email = document.getElementById('email').value;
                $scope.rut = document.getElementById('rut').value;
                $scope.address = document.getElementById('address').value;

                if (!$scope.name) {
                    alert('Debe ingresar un Nombre');
                    return;
                }
                if (!$scope.cellPhone) {
                    alert('Debe ingresar un numero Celular');
                    return;
                }
                if (!$scope.email) {
                    alert('Debe ingresar un Email');
                    return;
                }
                if (!$scope.rut) {
                    alert('Debe ingresar un Rut');
                    return;
                } if (!$scope.address) {
                    alert('Debe ingresar una Direccion');
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

            }

            var saveToFIrebase = function(empresa) {
                var newPostKey = firebase.database().ref().child('company').push().key;
                firebase.database().ref('company/'+newPostKey).set(empresa).then(
                    function(s){

                        alert('Se Agrego la Empresa Correctamente');
                        console.log('se guardo bien ', s);
                        document.location.href = '#!/company';
                    }, function(e) {
                        alert('Error, intente de nuevo');
                        console.log('se guardo mal ', e);
                    }
                );
            };

        }]);