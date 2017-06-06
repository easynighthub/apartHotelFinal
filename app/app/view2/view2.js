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

            var recepcionista = window.currenUser;

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
                var checkOut = false;
                // if (currentDay < value.toHour){
                if (checkIn == value.checkIn) {
                    if (checkOut == value.checkOut) {
                        return true;
                    }
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
                    var habitacionKey = habitacionId;
                    return $filter('filter')(buscarHabitacionesER, {$id: habitacionKey})[0].numeroHabitacion;
                }
            };

            $scope.dialogDescuento = function (reserva) {
                $mdDialog.show({
                    controller: DialogControllerDescuento,
                    templateUrl: 'dialogDescuento',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        reservaSelect : reserva,
                    }
                })
            };

            function DialogControllerDescuento($scope, $mdDialog,reservaSelect) {
                $scope.reservaSelect = reservaSelect;

                console.log( $scope.reservaSelect);

                $scope.confirmarDescuento = function () {

                 var   idDescuento = firebase.database().ref().child('reservas/'+reservaSelect.$id+'/descuentos').push().key;

                    var ref = firebase.database().ref().child("/reservas/"+reservaSelect.$id+"/descuentos").child(idDescuento);
                    ref.update({
                        descuento : parseInt($scope.descuentoIngresado),
                        recepcionistaIdDescuento: recepcionista.uid,
                        motivoDescuento: $scope.motivoDescuento,
                        aceptado :true,
                        fechaDescuento : new Date().getTime()
                    });
                    console.log(new Date());
                    //location.reload();
                    $mdDialog.hide();
                }


                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };
            }

            $scope. dialogAbono = function (reserva) {
                $mdDialog.show({
                    controller: DialogControllerAbono,
                    templateUrl: 'dialogAbono',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        reservaSelect : reserva,
                    }
                })
            };

            function DialogControllerAbono($scope, $mdDialog,reservaSelect) {
                $scope.reservaSelect = reservaSelect;
                var pago = "";

                console.log( $scope.reservaSelect);

                $scope.confirmarAbono = function () {

                    var   idAbono = firebase.database().ref().child('reservas/'+reservaSelect.$id+'/abonos').push().key;

                    var ref = firebase.database().ref().child("/reservas/"+reservaSelect.$id+"/abonos").child(idAbono);
                    ref.update({
                        abono : parseInt($scope.abonoIngresado),
                        recepcionistaIdDescuento: recepcionista.uid,
                        motivoAbono: $scope.motivoAbono,
                        habilitado :true,
                        fechaAbono : new Date().getTime(),
                        medioDePago: pago
                    });
                    console.log(new Date());
                   // location.reload();
                    $mdDialog.hide();
                };


                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };

                $scope.obtenerPago = function (pagoSelecionado) {
                    if(pago == pagoSelecionado){
                        pago = "";

                    }else
                    {
                        pago = pagoSelecionado;
                    }

                    console.log(pago);

                };
            }

            $scope. dialogCheckOut = function (reserva) {
                $mdDialog.show({
                    controller: DialogControllerCheckOut,
                    templateUrl: 'dialogCheckOut',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        reservaSelect : reserva,
                    }
                })
            };

            function DialogControllerCheckOut($scope, $mdDialog,reservaSelect) {
                $scope.reservaSelect = reservaSelect;
                var pago = "";
                var tipoDePago ="";
                $scope.totalDias = parseInt((reservaSelect.fechaFin - reservaSelect.fechaInicio)/86400000);
                console.log("total Dias " + $scope.totalDias);
                $scope.valorTotal = $scope.totalDias * reservaSelect.price;
                $scope.totalAbonos =0;
                $scope.totalDescuentos =0;
                $scope.totalDocumento = 0;
                $scope.numeroDeDocumento = 0;
                $scope.documentoPagado = true;
                $scope.pagoFuturo = false;
                $scope.abonos = [];
                $scope.descuentos= [];
                //if($scope.reservaSelect.abonos){
                    var buscarAbonos = firebase.database().ref('reservas/'+$scope.reservaSelect.$id).child('abonos');
                    var buscarAbonosER = $firebaseArray(buscarAbonos);
                    buscarAbonosER.$loaded().then(function () {
                        $scope.abonos = buscarAbonosER;
                        console.log($scope.abonos);
                        $scope.abonos.forEach(function (x) {
                            if(x.habilitado){
                                $scope.totalAbonos += x.abono;
                            }
                        });
                   //   $scope.totalAPagar =  $scope.valorTotal -$scope.totalAbonos;
                });
                //};
              // if($scope.reservaSelect.descuentos){
                    var buscarDescuentos = firebase.database().ref('reservas/'+$scope.reservaSelect.$id).child('descuentos');
                    var buscarDescuentosER = $firebaseArray(buscarDescuentos);
                    buscarDescuentosER.$loaded().then(function () {
                        $scope.descuentos= buscarDescuentosER;
                        console.log($scope.descuentos);
                        $scope.descuentos.forEach(function (j) {
                            if(j.aceptado){
                                $scope.totalDescuentos += j.descuento;
                            }
                        });
                     //   $scope.totalAPagar =  $scope.valorTotal - $scope.totalDescuentos;

                    });
              // };


           /*     if(!$scope.reservaSelect.descuentos && !$scope.reservaSelect.abonos){
                    $scope.totalAPagar =  $scope.valorTotal;
                }else
                {

                }*/

                console.log( $scope.reservaSelect);

                $scope.confirmarCheckOut = function () {

                        if(tipoDePago == 'exportacion' || 'electronica'){
                            firebase.database().ref('reservas/'+$scope.reservaSelect.$id).update({
                                checkOut: true,
                                recepcionistaIdCheckOut:recepcionista.uid,
                                dateInCheckOut: new Date().getTime(),
                                tipoDeDocumento : tipoDePago,
                                documentoPagado :!$scope.pagoFuturo,
                                modoDePago : pago,
                                numeroDeDocumento :  $scope.numeroDeDocumento,
                                totalDocumentoPorPagar :$scope.totalAPagar,
                                totalFactura :$scope.totalFactura,
                            });
                        }else
                        {  firebase.database().ref('reservas/'+$scope.reservaSelect.$id).update({
                            checkOut: true,
                            recepcionistaIdCheckOut:recepcionista.uid,
                            dateInCheckOut: new Date().getTime(),
                            documentoPagado :!$scope.pagoFuturo,
                            modoDePago : pago,
                            tipoDeDocumento : tipoDePago,
                            numeroDexDocumento : $scope.numeroDeDocumento,
                            totalDocumentoPorPagar :$scope.totalAPagar,
                            totalFactura :$scope.totalFactura,

                        });
                        }
                    $mdDialog.hide();
                                        };


                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };

                $scope.obtenerPago = function (pagoSelecionado) {
                    if(pago == pagoSelecionado){
                        pago = "";

                    }else
                    {
                        pago = pagoSelecionado;
                    }

                    console.log(pago);

                };
                $scope.obtenerTipoDePago = function (tipoPagoSelecionado) {
                    if(tipoDePago == tipoPagoSelecionado){
                        tipoDePago = "";
                        $scope.totalFactura = 0;

                    }else
                    {
                        tipoDePago = tipoPagoSelecionado;
                        if(tipoDePago == 'sinDocumento'){
                            $scope.totalFactura = $scope.valorTotal;
                            $scope.totalAPagar =  $scope.totalFactura  - $scope.totalDescuentos- $scope.totalAbonos;
                            $scope.pagoFuturo = false;
                        }
                        if(tipoDePago == 'electronica'){
                            $scope.totalFactura = $scope.valorTotal*1.19;
                            $scope.totalAPagar =  $scope.totalFactura  - $scope.totalDescuentos- $scope.totalAbonos;
                            $scope.pagoFuturo = false;
                        }
                        if(tipoDePago == 'exportacion'){
                            $scope.totalFactura = $scope.valorTotal*1.19;
                            $scope.totalAPagar =  $scope.totalFactura  - $scope.totalDescuentos- $scope.totalAbonos;
                            $scope.pagoFuturo = false;

                        }

                    }

                    console.log(tipoDePago);

                };

                $scope.getHabitacion = function (habitacionId) {
                    if (habitacionId) {
                        var habitacionKey = habitacionId;
                        return $filter('filter')(buscarHabitacionesER, {$id: habitacionKey})[0].numeroHabitacion;
                    }
                };
                $scope.getEmpresa = function (empresaId) {
                    if (empresaId) {
                        var empresaKey = empresaId;
                        return $filter('filter')(buscarEmpresasER, {$id: empresaKey})[0].name;
                    }
                };


            }



}]);