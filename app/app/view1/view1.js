/**
 * Created by Andro Ostoic on 27-10-2016.
 */
'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'view1Ctrl'
        });
    }])

    .controller('view1Ctrl', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope','$mdDialog',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope, $mdDialog) {



            $scope.goReserva = function() {
                location.href = "#!/agregarReserva";
            }


            $scope.goEmpresa = function() {
                location.href = "#!/empresas";
            }

            $scope.goHabitacion = function() {
                location.href = "#!/habitaciones";
            }






            $scope.dialogAgregarReserva = function () {

                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'dialogAgregarReserva',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true
                })



            };


            function DialogController($scope, $mdDialog) {
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




                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };


            }


            }]);





