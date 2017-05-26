/**
 * Created by Andro Ostoic on 27-10-2016.
 */
'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'view2Ctrl'
        });
    }])

    .controller('view2Ctrl', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope','$mdDialog','$timeout', '$q', '$log',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope, $mdDialog,$timeout, $q, $log) {

            $scope.checkIn = [];
            cargarCheckIn();

            var buscarHabitaciones = firebase.database().ref().child('habitaciones');
            var buscarHabitacionesER = $firebaseArray(buscarHabitaciones);

            var buscarRecepcionistas = firebase.database().ref().child('recepcionistas');
            var buscarRecepcionistasER = $firebaseArray(buscarRecepcionistas);

            var buscarEmpresas = firebase.database().ref().child('company');
            var buscarEmpresasER = $firebaseArray(buscarEmpresas);

            function cargarCheckIn() {
                var currentDay = new Date().getTime();
                var buscarReservas = firebase.database().ref().child('reservas').orderByChild('fechaFin').startAt(currentDay);
                var buscarReservasER = $firebaseArray(buscarReservas);
                buscarReservasER.$loaded().then(function () {
                    $scope.allCheckIn = buscarReservasER;
                    console.log($scope.allCheckIn);
                    $scope.checkIn = $filter('filter')($scope.allCheckIn, getCheckIn);
                    $scope.checkInFiltrados =   $scope.checkIn;
                 //   document.getElementById('BarraCargando').style.display = 'none';
                });
            }


            var getCheckIn = function (value, index, array) {
                // var currentDay = new Date().getTime();
                var checkIn = true;
                // if (currentDay < value.toHour){
                if (checkIn == value.checkIn) {
                    return true;
                }
                else{
                    return false;
                }
            }

            $scope.buscarPorNombre = function () {
                $scope.checkIn = $filter('filter')($scope.checkInFiltrados, {nameCliente: $scope.filterNameInput});
            }
            $scope.buscarPorHabitacion = function () {
                $scope.checkIn = $filter('filter')($scope.checkInFiltrados, {dni: $scope.filterNameDniInput});
                console.log($scope.filterNameDniInput);
                if($scope.filterNameDniInput == null){
                    $scope.checkIn =    $scope.checkInFiltrados;
                }
            }

            $scope.getHabitacion = function (habitacionId) {
                if (habitacionId) {
                    var habitacionKey = Object.keys(habitacionId)[0];
                    return $filter('filter')(buscarHabitacionesER, {$id: habitacionKey})[0].numeroHabitacion;
                }
            };

}]);