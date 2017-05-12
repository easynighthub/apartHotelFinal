'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'firebase',
  'ngMaterial',
  'myApp.view1',
  'myApp.view2',
    'myApp.agregarReserva',
    'myApp.agregarEmpresa',
    'myApp.empresas',
    'myApp.agregarHabitacion',
    'myApp.habitaciones',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});


}]);
