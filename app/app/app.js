'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'firebase',
  'ngMaterial',
  'myApp.view1',
  'myApp.view2',
    'myApp.empresas',
    'myApp.habitaciones',
    'myApp.facturaPorCobrar',

]).
config(['$locationProvider', '$routeProvider',
    function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');


        var validateUser = function() {
            var data;
            for ( var i = 0, len = localStorage.length; i < len; ++i ) {
                var str = localStorage.key(i);
                var patt = new RegExp('firebase:authUser:');
                if(patt.test(str)){
                    window.currenUser = JSON.parse(localStorage.getItem(str));
                    return true;
                }
            }
            return false;
        }

        if(validateUser()) {
          $routeProvider.otherwise({redirectTo: '/view1'});
        } else {
            window.location.href = '/';
            alert("AUN NO INICIAS SECIÓN ")
        }

        var signOutButton = document.getElementById('sign-out-button');

        signOutButton.addEventListener('click', function() {
            firebase.auth().signOut();

            window.location.href = '/';
        });



}]);
