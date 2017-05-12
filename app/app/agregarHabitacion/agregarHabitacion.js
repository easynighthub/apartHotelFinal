/**
 * Created by celis on 11-05-2017.
 */
'use strict';

angular.module('myApp.agregarHabitacion', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/agregarHabitacion', {
            templateUrl: 'agregarHabitacion/agregarHabitacion.html',
            controller: 'viewagregarHabitacion'
        });
    }])

    .controller('viewagregarHabitacion', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope) {



            $scope.guardarHabitacion = function() {

                $scope.numeroHabitacion = document.getElementById('numeroHabitacion').value;
                $scope.valor = document.getElementById('valor').value;


                if (!$scope.numeroHabitacion) {
                    alert('Debe ingresar un Nombre');
                    return;
                }
                if (!$scope.valor) {
                    alert('Debe ingresar un numero Celular');
                    return;
                }


                var habitacion = {

                    numeroHabitacion: $scope.numeroHabitacion,
                    valor: parseInt($scope.valor),
                    visible:true,

                };
                var newPostKey = firebase.database().ref().child('posts').push().key;
                saveToFIrebase(habitacion);

            }

            var saveToFIrebase = function(habitacion) {
                var newPostKey = firebase.database().ref().child('habitaciones').push().key;
                firebase.database().ref('habitaciones/'+newPostKey).set(habitacion).then(
                    function(s){

                        alert('Se Agrego la Empresa Correctamente');
                        console.log('se guardo bien ', s);
                        document.location.href = '#!/habitaciones';
                    }, function(e) {
                        alert('Error, intente de nuevo');
                        console.log('se guardo mal ', e);
                    }
                );
            };

        }]);
