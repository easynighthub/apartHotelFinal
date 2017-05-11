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
              //  if(fechaInicio<fechaFin){
                    reserva.checkIn = false;
                    reserva.checkOut = false;
                    reserva.fechaInicio = new Date(fechaInicio).getTime()/1000;
                    reserva.fechaFin = new Date(fechaFin).getTime()/1000;
                    reserva.totalDias = parseInt((reserva.fechaFin - reserva.fechaInicio  )/86400);
                    reserva.totalAPagar = reserva.totalDias * reserva.price;
                    reserva.recepcionistaId = "H9mF3gjuzsb81kNhHjiP6NULfRB3";
                    reserva.dateIn = parseInt(new Date().getTime()/1000);

                    console.log(reserva);
               // }else
                {
                    alert("LA FECHA DE INICIO TIENE QUE SER MENOR A LA FECHA DE FIN")
                }
            }


            $scope.goPrice = function(empresa,fechaInicio, fechaFin) {
            console.log(empresa);
            $scope.reserva.price = empresa.valor;
                var fechaInicio = new Date(fechaInicio).getTime()/1000;
                var fechaFin = new Date(fechaFin).getTime()/1000;
              $scope.totalDias = parseInt((fechaFin - fechaInicio  )/86400);
                console.log($scope.totalDias);



            }




        }]);