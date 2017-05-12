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

    .controller('viewhabitaciones', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope) {


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







        }]);
