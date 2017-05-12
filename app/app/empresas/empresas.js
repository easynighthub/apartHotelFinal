'use strict';

angular.module('myApp.empresas', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/empresas', {
            templateUrl: 'empresas/empresas.html',
            controller: 'viewempresas'
        });
    }])

    .controller('empresas', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope) {



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
                    activo : !empresa.activo
                });
            };




        }]);
