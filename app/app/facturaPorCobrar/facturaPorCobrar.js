/**
 * Created by andro on 05-06-2017.
 */
'use strict';

angular.module('myApp.facturaPorCobrar', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/facturaPorCobrar', {
            templateUrl: 'facturaPorCobrar/facturaPorCobrar.html',
            controller: 'viewfacturaPorCobrar'
        });
    }])

    .controller('viewfacturaPorCobrar', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope','$mdDialog',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope,$mdDialog) {


            var recepcionista = window.currenUser;
            console.log(recepcionista);
            var buscarEmpresas = firebase.database().ref().child('company');
            var buscarEmpresasER = $firebaseArray(buscarEmpresas);


            $scope.facturas = [];



            var buscarReservas = firebase.database().ref().child('reservas');
            var buscarReservasER = $firebaseArray(buscarReservas);
            buscarReservasER.$loaded().then(function () {
                $scope.Allfacturas = buscarReservasER;
                console.log($scope.Allfacturas);
                $scope.facturas = $scope.Allfacturas;
            });

            $scope.getEmpresa = function (empresaId) {
                if (empresaId) {
                    var empresaKey = empresaId;
                    return $filter('filter')(buscarEmpresasER, {$id: empresaKey})[0].name;
                }
            };


            $scope.dialogPagarFactura = function (factura) {
                var facturaSelect1 = factura;
                $mdDialog.show({
                    controller: DialogControllerPagarFactura,
                    templateUrl: 'dialogPagarFacturaHTML',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        facturaSelect : facturaSelect1,
                    }
                })
            }


            function DialogControllerPagarFactura($scope, $mdDialog,$timeout, $q, $log, facturaSelect) {
                $scope.factura = facturaSelect;

                $scope.Anular = function (descripcionAnular) {


                    /**    var buscarUsers = firebase.database().ref().child('users');
                     var buscarUsersER = $firebaseArray(buscarUsers);
                     buscarUsersER.$loaded().then(function () {
                        $scope.userEncontrados = buscarUsersER;
                        $scope.userEncontrados.forEach(function (x) {
                            console.log(x.reservas);
                    if(x.reservas.$id == reservaSelect.$id){
                        console.log("asdsadsadasd");

                    }


                        });
                    }); **/ //dejalo aqui lo hare llegando a mi casa voy saliendo para alla dale



                    var ref = firebase.database().ref().child("/reservas/").child(reservaSelect.$id);
                    ref.update({
                        anulada : !reservaSelect.visible,
                        recepcionistaIdAnular: recepcionista.uid,
                        descripcionAnular : descripcionAnular,
                        fechaAnulacion : new Date().getTime()
                    });
                    //location.reload();
                    $mdDialog.hide();
                }

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };

                $scope.getEmpresa = function (empresaId) {
                    if (empresaId) {
                        var empresaKey = empresaId;
                        return $filter('filter')(buscarEmpresasER, {$id: empresaKey})[0].name;
                    }
                };
            }


        }]);
