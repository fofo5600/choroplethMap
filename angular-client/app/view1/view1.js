'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope' ,'$http', function($scope, $http) {

  // INICIO DE VARIABLES

  $scope.geoJsonBasic = {};
  $scope.geoJson = {};
  $scope.data = {
    sex: "",
    edadMayorQ: 15,
    edadMenorQ: 30,
    min: 15,
    max: 30
  };


  // Carga de mapa basico con leaflet
  var mymap = L.map('map-canvas').setView([51.505, -0.09], 13),
  accessToken = 'pk.eyJ1IjoiZm9mbzU2MDAiLCJhIjoiY2pnbGVsMGgxMW5sZjJxbDFlc2o0YzBjdSJ9.RgU88N4uzWd5YJok-5PKWQ'; // TOKN DEL MAPA

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 3,
    id: 'mapbox.streets',
    accessToken: accessToken
  }).addTo(mymap);

  //Carga del geoJson basico
  $http.get('json/geoJson.json').success(function (data){
    $scope.geoJsonBasic = data;
    $scope.geoJson = actulizarGeoJson(data);
    L.geoJson($scope.geoJson, {style: style}
    ).addTo(mymap);
  });

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 10, 50, 100, 200, 300, 500],
          labels = [];

      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(mymap);



  // FUNCIONES DE PROGRAMA
  function actulizarGeoJson (dataFiltrada) {

      var geoJson = $scope.geoJsonBasic;

      for (var i = 0, len = geoJson.features.length; i < len; i++) {

        if(geoJson.features[i].id in dataFiltrada) {
          geoJson.features[i].properties.usuarios = dataFiltrada[geoJson.features[i].id];
        } else {
          geoJson.features[i].properties.usuarios = 0;
        }

      }

      return geoJson;

  }

  function style(feature) {
    return {
        fillColor: getColor(feature.properties.usuarios),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }


  function getColor(d) {
    return d > 500 ? '#800026' :
           d > 300  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 10  ? '#FEB24C' :
           d > 1   ? '#FED976' :
                      '#FFEDA0';
      }


    // LLAMADO AL SERVICIO API

    $scope.filtroPaises = function () {

      var req = {
           method: 'POST',
           url: 'http://localhost:3301/paisesFiltro',
           headers: {
             'Content-Type': 'application/json',
             'X-PINGOTHER': 'pingpong',
             'Access-Control-Allow-Origin': '*'
           },
           data:  {
             "sex": $scope.data.sex,
             "edadMayor": $scope.data.edadMayorQ,
             "edadMenor": $scope.data.edadMenorQ
          }
       }

      $http(req).success(function (data){
        var geoJson = actulizarGeoJson(data);
        L.geoJson(geoJson, {style: style}
        ).addTo(mymap);
      });
    }
}]);
