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

            $scope.reservas = [];

            var buscarReservas = firebase.database().ref().child('reservas');
            var buscarReservasER = $firebaseArray(buscarReservas);
            buscarReservasER.$loaded().then(function () {
                $scope.Allreservas = buscarReservasER;
                console.log($scope.Allreservas);
                $scope.reservas = $filter('filter')($scope.Allreservas, getReservas);
                document.getElementById('BarraCargando').style.display = 'none';

            });

            var getReservas = function (value, index, array) {
                // var currentDay = new Date().getTime();
                var checkIn = false;
                // if (currentDay < value.toHour){
                if (checkIn == value.checkIn) {
                    return true;
                }
                //}
                else{
                    firebase.database().ref('reservas/'+value.$id).update({
                        anulada:true,
                        }

                    )
                    return false;

                }

            }




            var buscarHabitaciones = firebase.database().ref().child('habitaciones');
            var buscarHabitacionesER = $firebaseArray(buscarHabitaciones);
            buscarHabitacionesER.$loaded().then(function () {
                $scope.habitaciones = buscarHabitacionesER;
                console.log($scope.habitaciones);


            });

            var buscarRecepcionistas = firebase.database().ref().child('recepcionistas');
            var buscarRecepcionistasER = $firebaseArray(buscarRecepcionistas);
            buscarRecepcionistasER.$loaded().then(function () {
                $scope.recepcionistas = buscarRecepcionistasER;
                console.log($scope.recepcionistas);


            });


            $scope.getHabitacion = function (habitacionId) {
                if (habitacionId) {
                    var habitacionKey = Object.keys(habitacionId)[0];
                    return $filter('filter')(buscarHabitacionesER, {$id: habitacionKey})[0].numeroHabitacion;
                }
            };




            $scope.goReserva = function() {
                location.href = "#!/agregarReserva";
            }


            $scope.goEmpresa = function() {
                location.href = "#!/empresas";
            }

            $scope.goHabitacion = function() {
                location.href = "#!/habitaciones";
            }



            $scope.dialogCheckIn = function (reserva) {
                $mdDialog.show({
                    controller: DialogControllerCheckIn,
                    templateUrl: 'dialogCheckIn',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        reservaSelect : reserva,
                    }
                })
            };

            function DialogControllerCheckIn($scope, $mdDialog,reservaSelect) {
                $scope.reservaSelect = reservaSelect;
                console.log( $scope.reservaSelect);

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };
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
                $scope.userEncontrados = [];


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

                        if (!$scope.fechaInicio) {
                            return;
                        }
                        if (!$scope.fechaFin) {
                            return;
                        }
                        if (!$scope.reserva.habitacionId) {
                            return;
                        }
                        if (!$scope.reserva.empresaId) {
                            return;
                        }
                        if (!$scope.reserva.price) {
                            return;
                        }
                        if (!$scope.totalDias) {
                            return;
                        }
                        if (!$scope.totalAPagar) {
                            return;
                        }
                        if (!$scope.reserva.nameCliente) {
                            return;
                        }
                        if (!$scope.reserva.correoCliente) {
                            return;
                        }
                        if (!$scope.reserva.celularCliente) {
                            return;
                        }
                        if (!$scope.reserva.paxCliente) {
                            return;
                        }
                        if (!$scope.reserva.dni) {
                            return;
                        }
                        if (!$scope.reserva.detalle) {
                            return;
                        }
                        if (!$scope.reserva.dni) {
                            return;
                        }






                        var user = [];
                        var contador = 0;
                        var finConsultas = false;

                        var buscarUsers = firebase.database().ref().child('users');
                        var buscarUsersER = $firebaseArray(buscarUsers);
                        buscarUsersER.$loaded().then(function () {
                            $scope.userEncontrados = buscarUsersER;
                            $scope.userEncontrados.forEach(function (x) {
                                console.log(x);
                                if(x.correo == reserva.correoCliente){
                                    user.id = x.$id;
                                    contador = 1;
                                    console.log("funciono");
                                    console.log(user.id);
                                }


                            });
                            if(contador == 1){
                                console.log("id ya ingresado");
                                console.log(user.id+"id rescatado para update");
                                finConsultas = true;
                                $scope.finConsultaFunction();

                            }else
                            {
                                finConsultas = true;
                                user.id =  firebase.database().ref().child('users/').push().key;
                                $scope.finConsultaFunction();

                            }


                        });
                        $scope.finConsultaFunction = function(){
                            console.log("se ejecuto la consulta final");
    reserva.checkIn = false;
    reserva.checkOut = false;
    reserva.fechaInicio = new Date(fechaInicio).getTime();
    reserva.fechaFin = new Date(fechaFin).getTime();
    reserva.totalDias = parseInt((reserva.fechaFin - reserva.fechaInicio  )/86400000);
    reserva.totalAPagar = reserva.totalDias * reserva.price;
    reserva.recepcionistaId = "H9mF3gjuzsb81kNhHjiP6NULfRB3";
    reserva.dateIn = parseInt(new Date().getTime());
    reserva.userId = user.id;

    console.log(reserva);
    reserva.id = firebase.database().ref().child('reservas/').push().key; //esto es solo para probar rapido;

    user.name = reserva.nameCliente;
    user.correo = reserva.correoCliente;
    user.celular = reserva.celularCliente;
    user.dni = reserva.dni;

    firebase.database().ref('reservas/'+reserva.id).set(reserva);

    firebase.database().ref('users/'+user.id).update({
        id:user.id,
        celular:user.celular,
        correo:user.correo,
        dni:user.dni,
        name:user.name,

    }).then(

        function(s){
            firebase.database().ref('users/' + user.id + '/reservas/' + reserva.id).set(true);
            $mdDialog.hide();

        }, function(e) {
            alert('Error, Intente de Nuevo');
            console.log('Se guardo mal ', e);
        }
    );

}

                    }else
                    {
                        alert("LA FECHA DE INICIO TIENE QUE SER MENOR A LA FECHA DE FIN")
                    }
                }


                $scope.goPrice = function(habitacion,fechaInicio, fechaFin) {
                    console.log(habitacion);
                    $scope.reserva.price = habitacion.valor;
                    var fechaInicio = new Date(fechaInicio).getTime();
                    var fechaFin = new Date(fechaFin).getTime();
                    $scope.totalDias = parseInt((fechaFin - fechaInicio  )/86400000);
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





