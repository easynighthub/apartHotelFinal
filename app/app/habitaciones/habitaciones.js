/**
 * Created by celis on 11-05-2017.
 */
'use strict';

angular.module('myApp.habitaciones', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/habitaciones', {
            templateUrl: 'habitaciones/habitaciones.html',
            controller: 'viewhabitaciones'
        });
    }])

    .controller('viewhabitaciones', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope','$mdDialog',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope,$mdDialog) {

            var editarHabitacionSelect = [];
            // para obtener datos de firebase
            var habitacionesER = firebase.database().ref().child('habitaciones');
            $scope.habitacionesER = $firebaseArray(habitacionesER);
            $scope.habitacionesER.$loaded().then(function(){
                console.log($scope.habitacionesER);
                $scope.todasLasHabitaciones = $scope.habitacionesER;
                $scope.habitaciones = $scope.todasLasHabitaciones;
            });



            $scope.validar = function (habitacion) {
                console.log(habitacion);
                var ref = firebase.database().ref().child("/habitaciones/").child(habitacion.$id);
                ref.update({
                    visible : !habitacion.visible
                });
            };

            $scope.editarHabitacion = function (habitacion) {
                var editarHabitacionSelect = habitacion;
                $scope.titulo =" Editar Habitacion";

                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'agregarHabitacion',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        habitacionSelect : editarHabitacionSelect,
                        titulo : $scope.titulo
                    }
                })


            };

            $scope.agregarHabitacion = function () {
                $scope.titulo =" Agregar Habitacion";
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'agregarHabitacion',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        habitacionSelect : "",
                        titulo : $scope.titulo
                    }
                })
            };


            function DialogController($scope, $mdDialog, habitacionSelect,titulo) {
                $scope.titulo = titulo;
                console.log(habitacionSelect);
                var idSelectHabitacion = "";


                if(habitacionSelect != ""){
                    console.log(habitacionSelect.numeroHabitacion);
                    $scope.numeroHabitacion =  habitacionSelect.numeroHabitacion;
                    $scope.valor =  habitacionSelect.valor;
                    $scope.tipo = habitacionSelect.tipo;
                    idSelectHabitacion = habitacionSelect.$id;
                }


                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };


                $scope.guardarHabitacion = function() {

                    $scope.numeroHabitacion = document.getElementById('numeroHabitacion').value;
                    $scope.valor = parseInt(document.getElementById('valor').value);
                    $scope.tipo = document.getElementById('tipo').value;

                    if (!$scope.numeroHabitacion) {

                        return;
                    }
                    if (!$scope.valor) {

                        return;
                    }
                    if (!$scope.tipo) {

                        return;
                    }


                    var habitacion = {

                        numeroHabitacion: $scope.numeroHabitacion,
                        valor: $scope.valor,
                        tipo: $scope.tipo,
                        visible:true,

                    };

                    saveToFIrebase(habitacion,idSelectHabitacion);

                };
            }



            var saveToFIrebase = function(habitacion,idSelectHabitacion) {
                var  idHabitacionParaGuardar = "";
                if(idSelectHabitacion != ""){
                    idHabitacionParaGuardar = idSelectHabitacion;
                    console.log(idHabitacionParaGuardar + "id existente");
                    firebase.database().ref('habitaciones/'+idHabitacionParaGuardar).update(habitacion).then(
                        function(s){
                            $mdDialog.hide();

                        }, function(e) {
                            alert('Error, Intente de Nuevo');
                            console.log('Se guardo mal ', e);
                        }
                    );

                }
                else
                {

                    console.log($scope.habitaciones);
                    var existe = false;
                    $scope.habitaciones.forEach(function (habitacionFor) {
                        if(habitacionFor.numeroHabitacion == habitacion.numeroHabitacion){
                            alert('la Habitacion ya existe en el sistema.');
                            existe = true;
                        }

                    });

                    if(existe == false){
                        var idHabitacionParaGuardar = firebase.database().ref().child('habitaciones').push().key;
                        firebase.database().ref('habitaciones/'+idHabitacionParaGuardar).update(habitacion).then(
                            function(s){
                                $mdDialog.hide();

                            }, function(e) {
                                alert('Error, Intente de Nuevo.');
                                console.log('Se guardo mal ', e);
                            }
                        );
                    }

                }



            };
        }]);
