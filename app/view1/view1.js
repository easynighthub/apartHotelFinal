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

    .controller('view1Ctrl', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', '$rootScope',
        function($scope, $firebaseObject, $firebaseArray, $filter, $rootScope) {



            $scope.goReserva = function() {
                location.href = "#!/agregarReserva";
            }




        }]);