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

    .controller('view1Ctrl', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope','$mdDialog','$timeout', '$q', '$log',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope, $mdDialog,$timeout, $q, $log) {

            cargarReservas();

            $scope.reservas = [];

            var buscarHabitaciones = firebase.database().ref().child('habitaciones');
            var buscarHabitacionesER = $firebaseArray(buscarHabitaciones);
            var buscarRecepcionistas = firebase.database().ref().child('recepcionistas');
            var buscarRecepcionistasER = $firebaseArray(buscarRecepcionistas);
            var buscarEmpresas = firebase.database().ref().child('company');
            var buscarEmpresasER = $firebaseArray(buscarEmpresas);
            function cargarReservas() {
    var buscarReservas = firebase.database().ref().child('reservas');
    var buscarReservasER = $firebaseArray(buscarReservas);
    buscarReservasER.$loaded().then(function () {
        $scope.Allreservas = buscarReservasER;
        console.log($scope.Allreservas);
        $scope.reservas = $filter('filter')($scope.Allreservas, getReservas);
        $scope.reservasFiltradas =   $scope.reservas;
        document.getElementById('BarraCargando').style.display = 'none';
    });
}


            var getReservas = function (value, index, array) {
                // var currentDay = new Date().getTime();
                var checkIn = false;
                var anulada = false;
                // if (currentDay < value.toHour){
                if (checkIn == value.checkIn && anulada == value.anulada) {
                    return true;
                }
                else{
                    return false;
                }
            }

            $scope.buscarPorNombre = function () {
                $scope.reservas = $filter('filter')($scope.reservasFiltradas, {nameCliente: $scope.filterNameInput});
            }
            $scope.buscarPorHabitacion = function () {
                $scope.reservas = $filter('filter')($scope.reservasFiltradas, {dni: $scope.filterNameDniInput});
                console.log($scope.filterNameDniInput);
                if($scope.filterNameDniInput == null){
                    $scope.reservas =    $scope.reservasFiltradas;
                }
            }

            buscarRecepcionistasER.$loaded().then(function () {
                $scope.recepcionistas = buscarRecepcionistasER;
                console.log($scope.recepcionistas);


            });
            buscarHabitacionesER.$loaded().then(function () {
                $scope.habitaciones = buscarHabitacionesER;
                console.log($scope.habitaciones);


            });
            buscarEmpresasER.$loaded().then(function () {
                $scope.empresas = buscarEmpresasER;
                console.log($scope.empresas);
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
            $scope.dialogAgregarReserva = function () {
                $scope.titulo ="Agregar Reserva";
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'dialogAgregarReserva',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        reservaSelect : "",
                        titulo : $scope.titulo
                    }
                })



            };
            $scope.dialogEditarReserva = function (reserva) {
                $scope.titulo ="Editar Reserva";
                var editarReservaSelect = reserva;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'dialogAgregarReserva',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        reservaSelect : editarReservaSelect,
                        titulo : $scope.titulo
                    }
                })



            };
            $scope.dialogAnularReserva = function (reserva) {
                var reservaSelect = reserva;
                $mdDialog.show({
                    controller: DialogControllerAnularReserva,
                    templateUrl: 'dialogAnularReserva',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        reservaSelect : reservaSelect,
                    }
                })
            }

            function DialogControllerCheckIn($scope, $mdDialog,reservaSelect) {
                $scope.reservaSelect = reservaSelect;

                console.log( $scope.reservaSelect);

                $scope.getHabitacion = function (habitacionId) {
                    if (habitacionId) {
                        var habitacionKey = Object.keys(habitacionId)[0];
                        return $filter('filter')(buscarHabitacionesER, {$id: habitacionKey})[0].numeroHabitacion;
                    }
                };
                $scope.getEmpresa = function (empresaId) {
                    if (empresaId) {
                        var empresaKey = Object.keys(empresaId)[0];
                        return $filter('filter')(buscarEmpresasER, {$id: empresaKey})[0].name;
                    }
                };

                $scope.confirmarCheckIn = function () {
                    var ref = firebase.database().ref().child("/reservas/").child(reservaSelect.$id);
                    ref.update({
                        checkIn : !reservaSelect.checkIn,
                        recepcionistaIdCheckIn: "H9mF3gjuzsb81kNhHjiP6NULfRB3",
                        fechaCheckIn : new Date().getTime()
                    });
                    console.log(new Date());
                    cargarReservas();
                    $mdDialog.hide();
                }


                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };
            }
            function DialogControllerAnularReserva($scope, $mdDialog,$timeout, $q, $log, reservaSelect) {
                var reservaSelect = reservaSelect;

                $scope.Anular = function (descripcionAnular) {
                    var ref = firebase.database().ref().child("/reservas/").child(reservaSelect.$id);
                    ref.update({
                        anulada : !reservaSelect.visible,
                        recepcionistaIdAnular: "H9mF3gjuzsb81kNhHjiP6NULfRB3",
                        descripcionAnular : descripcionAnular,
                        fechaAnulacion : new Date().getTime()
                    });
                    cargarReservas();
                    $mdDialog.hide();
                }

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };

            }
            function DialogController($scope, $mdDialog,$timeout, $q, $log, reservaSelect,titulo) {
                $scope.titulo = titulo;
                console.log(reservaSelect);

                if(reservaSelect == ""){
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
                        $scope.simulateQuery = false;
                        $scope.isDisabled    = false;
                        $scope.repos         = loadAll();
                        $scope.querySearch   = querySearch;
                        $scope.selectedItemChange = selectedItemChange;
                        $scope.searchTextChange   = searchTextChange;
                        function querySearch (query) {
                            var results = query ? $scope.repos.filter( createFilterFor(query) ) : $scope.repos,
                                deferred;
                            if ($scope.simulateQuery) {
                                deferred = $q.defer();
                                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                                return deferred.promise;
                            } else {
                                return results;
                            }
                        }

                        function searchTextChange(text) {
                            $log.info('Text changed to ' + text);
                        }

                        function selectedItemChange(item) {
                            $log.info('Item changed to ' + JSON.stringify(item));
                            $scope.reserva.habitacionId = item;

                        }

                        /**
                         * Build `components` list of key/value pairs
                         */
                        function loadAll() {
                            var repos = $scope.habitaciones;
                            return repos.map( function (repo) {
                                repo.value = repo.numeroHabitacion.toLowerCase();
                                return repo;
                            });
                        }

                        /**
                         * Create filter function for a query string
                         */
                        function createFilterFor(query) {
                            var lowercaseQuery = angular.lowercase(query);

                            return function filterFn(item) {
                                return (item.value.indexOf(lowercaseQuery) === 0);
                            };

                        }



                    });

                    $scope.empresas = [];
                    var buscarEmpresas = firebase.database().ref().child('company');
                    var buscarEmpresasER = $firebaseArray(buscarEmpresas);
                    buscarEmpresasER.$loaded().then(function () {
                        $scope.empresas = buscarEmpresasER;

                        $scope.simulateQueryEmpresa = false;
                        $scope.isDisabledEmpresa    = false;
                        $scope.reposEmpresa         = loadAllEmpresa();
                        $scope.querySearchEmpresa   = querySearchEmpresa;
                        $scope.selectedItemChangeEmpresa = selectedItemChangeEmpresa;
                        $scope.searchTextChangeEmpresa   = searchTextChangeEmpresa;
                        function querySearchEmpresa (queryEmpresa) {
                            var resultsEmpresa = queryEmpresa ? $scope.reposEmpresa.filter( createFilterForEmpresa(queryEmpresa) ) : $scope.reposEmpresa,
                                deferredEmpresa;
                            if ($scope.simulateQueryEmpresa) {
                                deferredEmpresa = $q.defer();
                                $timeout(function () { deferredEmpresa.resolve( results ); }, Math.random() * 1000, false);
                                return deferredEmpresa.promise;
                            } else {
                                return resultsEmpresa;
                            }
                        }

                        function searchTextChangeEmpresa(textEmpresa) {
                            $log.info('Text changed to ' + textEmpresa);
                        }

                        function selectedItemChangeEmpresa(itemEmpresa) {
                            $log.info('Item changed to ' + JSON.stringify(itemEmpresa));
                            $scope.reserva.empresaId = itemEmpresa;
                        }

                        /**
                         * Build `components` list of key/value pairs
                         */
                        function loadAllEmpresa() {
                            var reposEmpresa = $scope.empresas;

                            return reposEmpresa.map( function (repoEmpresa) {
                                repoEmpresa.value = repoEmpresa.name.toLowerCase();
                                return repoEmpresa;
                            });
                        }

                        /**
                         * Create filter function for a query string
                         */
                        function createFilterForEmpresa(queryEmpresa) {
                            var lowercaseQueryEmpresa = angular.lowercase(queryEmpresa);

                            return function filterFnEmpresa(itemEmpresa) {
                                return (itemEmpresa.value.indexOf(lowercaseQueryEmpresa) === 0);
                            };

                        }


                    });


                }
                else{

                    $scope.fechaInicio = new Date(reservaSelect.fechaInicio);
                    $scope.fechaFin = new Date(reservaSelect.fechaFin);
                    $scope.totalDias = reservaSelect.totalDias;
                    console.log("codigo para poder editar");


                }



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
    reserva.anulada = false;
    reserva.fechaInicio = new Date(fechaInicio).getTime();
    reserva.fechaFin = new Date(fechaFin).getTime();
    reserva.totalDias = $scope.totalDias;
        //parseInt((reserva.fechaFin - reserva.fechaInicio  )/86400000);
    reserva.totalAPagar = reserva.totalDias * reserva.price;
    reserva.recepcionistaId = "H9mF3gjuzsb81kNhHjiP6NULfRB3";  //colocar id logeado
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

                $scope.CalcularDiasTotales = function (fechaInicio, fechaFin) {
                    console.log("calculando");
                    var fechaInicio = new Date(fechaInicio).getTime();
                    var fechaFin = new Date(fechaFin).getTime();
                    $scope.totalDias = parseInt((fechaFin - fechaInicio)/86400000);
                    console.log($scope.totalDias);
                };

                $scope.goPrice = function() {
                    console.log($scope.totalDias);
                    $scope.totalAPagar = $scope.reserva.price * $scope.totalDias;

                }




                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };


            }


            }]);





