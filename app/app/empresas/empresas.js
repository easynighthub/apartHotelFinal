'use strict';

angular.module('myApp.empresas', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/empresas', {
            templateUrl: 'empresas/empresas.html',
            controller: 'viewempresas'
        });
    }])

    .controller('viewempresas', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope','$mdDialog',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope,$mdDialog) {


            var editarEmpresaSelect = [];
            // obtener trabajadores
            var empresasER = firebase.database().ref().child('company');
            $scope.empresasER = $firebaseArray(empresasER);
            $scope.empresasER.$loaded().then(function(){
                console.log($scope.empresasER);
                $scope.todasLasEmpresas = $scope.empresasER;
                $scope.empresas = $scope.todasLasEmpresas;
            });



            $scope.validar = function (empresa) {
                console.log(empresa);
                var ref = firebase.database().ref().child("/company/").child(empresa.$id);
                ref.update({
                    visible : !empresa.visible
                });
            };

            $scope.editarEmpresa = function (empresa) {
                var editarEmpresaSelect = empresa;
                $scope.titulo =" Editar Empresa";

                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'agregarEmpresa',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        empresaSelect : editarEmpresaSelect,
                        titulo : $scope.titulo
                    }
                })



            };

            $scope.agregarEmpresa = function () {
                $scope.titulo =" Agregar Empresa";
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'agregarEmpresa',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {
                        empresaSelect : "",
                        titulo : $scope.titulo
                    }
                })
            };


            function DialogController($scope, $mdDialog, empresaSelect,titulo) {
                $scope.titulo = titulo;
                console.log(empresaSelect);
                var idSelectEmpresa = "";


                if(empresaSelect != ""){
                    $scope.name =  empresaSelect.name;
                    $scope.cellPhone =  empresaSelect.cellPhone;
                    $scope.email =  empresaSelect.email;
                    $scope.rut =  empresaSelect.rut;
                    $scope.address = empresaSelect.address;
                    idSelectEmpresa = empresaSelect.$id;
                }


                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();

                };


                $scope.guardarEmpresa = function() {

                    $scope.name = document.getElementById('name').value;
                    $scope.cellPhone = parseInt(document.getElementById('cellPhone').value);
                    $scope.email = document.getElementById('email').value;
                    $scope.rut = document.getElementById('rut').value;
                    $scope.address = document.getElementById('address').value;

                    if (!$scope.name) {

                        return;
                    }
                    if (!$scope.cellPhone) {

                        return;
                    }
                    if (!$scope.email) {

                        return;
                    }
                    if (!$scope.rut) {
                        return;
                    }
                    if (!$scope.address) {
                        return;
                    }



                    var empresa = {

                        name: $scope.name,
                        cellPhone: $scope.cellPhone,
                        email:$scope.email,
                        rut:$scope.rut,
                        address:$scope.address,
                        visible:true,

                    };

                    saveToFIrebase(empresa,idSelectEmpresa);

                };
            }



            var saveToFIrebase = function(empresa,idSelectEmpresa) {
                var  idEmpresaParaGuardar = "";
                if(idSelectEmpresa != ""){
                    idEmpresaParaGuardar = idSelectEmpresa;
                    console.log(idEmpresaParaGuardar + "id existente");
                    firebase.database().ref('company/'+idEmpresaParaGuardar).update(empresa).then(
                        function(s){
                            $mdDialog.hide();

                        }, function(e) {
                            alert('Error, Intente de Nuevo');
                            console.log('Se guardo mal ', e);
                        }
                    );

                }else
                {

                    console.log($scope.empresas);
                    var existe = false;
                    $scope.empresas.forEach(function (empresaFor) {
                        if(empresaFor.rut == empresa.rut){
                            alert('Este rut ya existe en el sistema.');
                            existe = true;
                        }

                    });

                      if(existe == false){
                            var idEmpresaParaGuardar = firebase.database().ref().child('company').push().key;
                            firebase.database().ref('company/'+idEmpresaParaGuardar).update(empresa).then(
                                function(s){
                                    $mdDialog.hide();

                                }, function(e) {
                                    alert('Error, Intente de Nuevo');
                                    console.log('Se guardo mal ', e);
                                }
                            );
                        }

                }



            };
}]);
