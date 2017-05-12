/**
 * Created by celis on 09-05-2017.
 */

'use strict';

angular.module('myApp.agregarReserva', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/agregarReserva', {
            templateUrl: 'agregarReserva/agregarReserva.html',
            controller: 'viewagregarReserva'
        });
    }])

    .controller('viewagregarReserva', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope) {

            $scope.reserva =[];
            $scope.habitaciones = [];
            $scope.totalDias = 0;
            $scope.reserva.price = 0;
            $scope.fechaHoy = new Date();


            var buscarHabitaciones = firebase.database().ref().child('habitaciones');
            var buscarHabitacionesER = $firebaseArray(buscarHabitaciones);
            buscarHabitacionesER.$loaded().then(function () {
                $scope.habitaciones = buscarHabitacionesER;
                console.log($scope.habitaciones);


            });

            $scope.empresas = [];
            var buscarEmpresas = firebase.database().ref().child('company');
            var buscarEmpresasER = $firebaseArray(buscarEmpresas);
            buscarEmpresasER.$loaded().then(function () {
                $scope.empresas = buscarEmpresasER;
                console.log($scope.empresas);

            });
            $scope.guardarReserva = function(reserva,fechaInicio, fechaFin){
               if(fechaInicio<fechaFin){

                   var user = [];
                   user.id =  firebase.database().ref().child('users/').push().key;

                    reserva.checkIn = false;
                    reserva.checkOut = false;
                    reserva.fechaInicio = new Date(fechaInicio).getTime()/1000;
                    reserva.fechaFin = new Date(fechaFin).getTime()/1000;
                    reserva.totalDias = parseInt((reserva.fechaFin - reserva.fechaInicio  )/86400);
                    reserva.totalAPagar = reserva.totalDias * reserva.price;
                    reserva.recepcionistaId = "H9mF3gjuzsb81kNhHjiP6NULfRB3";
                    reserva.dateIn = parseInt(new Date().getTime()/1000);
                    reserva.userId = user.id;

                    console.log(reserva);
                     reserva.id = firebase.database().ref().child('reservas/').push().key; //esto es solo para probar rapido;

                   user.name = reserva.nameCliente;
                   user.correo = "androstoic@gmail.com";
                   user.celular = "+56971576339";
                   user.dni = 18246773;

                   firebase.database().ref('reservas/'+reserva.id ).set(reserva);
                   firebase.database().ref('users/'+user.id ).set(user);
               }else
                {
                    alert("LA FECHA DE INICIO TIENE QUE SER MENOR A LA FECHA DE FIN")
                }
            }


            $scope.goPrice = function(habitacion,fechaInicio, fechaFin) {
            console.log(habitacion);
            $scope.reserva.price = habitacion.valor;
                var fechaInicio = new Date(fechaInicio).getTime()/1000;
                var fechaFin = new Date(fechaFin).getTime()/1000;
              $scope.totalDias = parseInt((fechaFin - fechaInicio  )/86400);
                console.log($scope.totalDias);
                $scope.totalAPagar = habitacion.valor* $scope.totalDias;



            }




        }]);