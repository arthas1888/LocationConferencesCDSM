var map;
var bounds;
var layer;
var boxText = document.createElement("div");
var marcador;
// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
var labelIndex = 0;
var infoWindow;
var input;
var searchBox;
var markers;
var googleMapsLoaded = false;
var msg;

setTimeout(function () {
    if (marcador != null) {
        if (marcador.getAnimation() !== null) {
            marcador.setAnimation(null);
        } else {
            marcador.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
}, 3000);

function toggleBounce() {
    infoWindow.setPosition(marcador.position);
    infoWindow.setContent(msg);
    //map.setCenter(marcador.position);
    //map.setZoom(16);
    infoWindow.setOptions({
        pixelOffset: new google.maps.Size(0, -40)
    });
    infoWindow.open(map);
    /*if (marcador.getAnimation() !== null) {
        marcador.setAnimation(null);
    } else {
        marcador.setAnimation(google.maps.Animation.BOUNCE);
    }*/
}

var app = angular.module('angularApp', ['ngMaterial'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('light-green');
    })
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }]);
app.directive('myMap', function ($rootScope, $http) {
    // directive link function
    var link = function (scope, element, attrs) {

        function initMap() {

            if (map === void 0) {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: 4.72, lng: -74.04 },
                    zoom: 8
                });
            }


            // Create the search box and link it to the UI element.
            input = document.getElementById('pac-input');
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            searchBox = new google.maps.places.Autocomplete(input);
            searchBox.bindTo('bounds', map);

            bounds = new google.maps.LatLngBounds();

            searchBox.addListener('place_changed', function () {
                infoWindow.close();
                if (marcador != null) {
                    marcador.setVisible(false);
                }

                var place = searchBox.getPlace();
                if (!place.geometry) {
                    window.alert("Autocomplete's returned place contains no geometry");
                    return;
                }

                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
                getData(place.geometry.location.lat(), place.geometry.location.lng())

                // Create a marker for each place.
                marcador = new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location,
                    animation: google.maps.Animation.DROP
                });
                marcador.setVisible(true);
                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }
                msg = '<div><strong>' + place.name + '</strong><br>' + address;
                marcador.addListener('click', toggleBounce);


                infoWindow.setPosition(place.geometry.location);
                infoWindow.setContent(msg);
                infoWindow.setOptions({
                    pixelOffset: new google.maps.Size(-5, -35)
                });
                infoWindow.open(map);

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    //bounds.union(place.geometry.viewport);
                    map.fitBounds(place.geometry.viewport);
                } else {
                    //bounds.extend(place.geometry.location);
                    map.panTo(place.geometry.location);
                    //map.setCenter(place.geometry.location);
                    map.setZoom(15);
                }
                //map.fitBounds(bounds);
            });


            infoWindow = new google.maps.InfoWindow({ map: map });

            /*var markers = locations.map(function (location, i) {
                return new google.maps.Marker({
                    position: location,
                    label: labels[i % labels.length]
                });
            });

            // Add a marker clusterer to manage the markers.
            var markerCluster = new MarkerClusterer(map, markers,
                { imagePath: 'http://localhost:3000/img/m' });*/
            var mcOptions = {
                imagePath: '/wp-content/uploads/2016/12/m',
                gridSize: 40, maxZoom: 16, zoomOnClick: false, minimumClusterSize: 2
            };
            //var markerClusterer = new MarkerClusterer(map, null ,mcOptions);
            var markerClusterer = new MarkerClusterer(map, null, { imagePath: '/wp-content/uploads/2016/12/m' });
            markerClusterer.setMap(map);

            google.maps.event.addListener(map.data, 'addfeature', function (e) {
                if (e.feature.getGeometry().getType() === 'Point') {
                    var marker = new google.maps.Marker({
                        position: e.feature.getGeometry().get(),
                        title: e.feature.getProperty('nombre'),
                        label: labels[labelIndex++ % labels.length],
                        map: map
                    });
                    google.maps.event.addListener(marker, 'click', function (marker, e) {
                        return function () {

                            var name = e.feature.getProperty('nombre');
                            var direccion = e.feature.getProperty('direccion');
                            var horarios = e.feature.getProperty('horarios');
                            var celular = e.feature.getProperty('celular');
                            var pais = e.feature.getProperty('pais');
                            var ciudad = e.feature.getProperty('ciudad');
                            var telefono = e.feature.getProperty('telefono');

                            boxText.innerHTML = "<div style='text-align: center;'><b>" + name + "</b></div>";
                            infoWindow.setPosition(e.feature.getGeometry().get());
                            infoWindow.setOptions({
                                pixelOffset: new google.maps.Size(0, -30)
                            });
							if (telefono !== null){
                                msg = '<div><h3><strong>' + name + '</strong></h3>Dirección: ' + direccion
                                    + '<br>Horarios: ' + horarios
                                    + '<br>Celular: ' + celular
                                    + '<br>Telefono: ' + telefono
                                    + '<br><br>' + ciudad + ', ' + pais;
                            }else{
                                msg = '<div><h3><strong>' + name + '</strong></h3>Dirección: ' + direccion
                                    + '<br>Horarios: ' + horarios
                                    + '<br>Celular: ' + celular
                                    + '<br><br>' + ciudad + ', ' + pais;
                            }							
                            
                            infoWindow.setContent(msg);
                            infoWindow.open(map);

                        };
                    } (marker, e));
                    markerClusterer.addMarker(marker);
                    bounds.extend(e.feature.getGeometry().get());
                    map.fitBounds(bounds);
                    //map.setCenter(e.feature.getGeometry().get());            
                }
            });

            /*google.maps.event.addListener(markerClusterer, 'clusterclick', function(cluster){
                //console.log('center of cluster: '+cluster.getCenter());
                map.setCenter(cluster.getCenter());
                map.setZoom(map.getZoom()+1);
            });*/


            layer = map.data.loadGeoJson('https://plataforma.visionsatelital.co:9050/points/');
            map.data.setMap(null);
            google.maps.event.addListener(map, "click", function () {
                infoWindow.close();
            });
        }
        initMap();

        var getData = function (lat, lon) {
            $http({
                method: 'GET',
                url: 'https://plataforma.visionsatelital.co:9050/points/get_distance?lat=' + lat + '&lon=' + lon
            }).then(function successCallback(response) {

                $rootScope.model = response["data"];
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };

    };
    return {
        restrict: 'A',
        template: '<div id="map"></div>',
        replace: true,
        link: link
    };
});

app.controller('LocationController', LocationController);
LocationController.$inject = ['$scope', '$http', '$rootScope', '$mdSidenav', '$log', '$mdMedia'];

function LocationController($scope, $http, $rootScope, $mdSidenav, $log, $mdMedia) {
    $scope.btnClassActive = false;
    $scope.$mdMedia = $mdMedia;
    $scope.closeSide = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('right').close()
            .then(function () {
                $log.debug("close RIGHT is done");
            });
    };

    $scope.openSide = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('right').open()
            .then(function () {
                $log.debug("close RIGHT is done");
            });
    };

    $scope.isOpenRight = function () {
        return $mdSidenav('right').isOpen();
    };

    $scope.toggleSideNav = function () {
        $scope.btnClassActive = !$scope.btnClassActive;
    }


    $scope.search = "";
    $rootScope.model = [];
    var getData = function (lat, lon) {
        $http({
            method: 'GET',
            url: 'https://plataforma.visionsatelital.co:9050/points/get_distance?lat=' + lat + '&lon=' + lon
        }).then(function successCallback(response) {
            //console.log(response["data"]);
            //$log.debug(response["data"]);
            $rootScope.model = response["data"];
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };
    $scope.location = function (item) {
        //console.log(item.lat, item.lon);
        var pos = {
            lat: item.lat,
            lng: item.lon
        };
        //map.panTo(pos);
        map.setCenter(pos);
        map.setZoom(15);
        infoWindow.setPosition(pos);
		if (item.telefono !== null){
            msg = '<div><h3><strong>' + item.nombre + '</strong></h3>Dirección: ' + item.direccion
                + '<br>Horarios: ' + item.horarios
                + '<br>Celular: ' + item.celular
                + '<br>Telefono: ' + item.telefono
                + '<br><br>' + item.ciudad + ', ' + item.pais;
        }else{
            msg = '<div><h3><strong>' + item.nombre + '</strong></h3>Dirección: ' + item.direccion
                + '<br>Horarios: ' + item.horarios
                + '<br>Celular: ' + item.celular
                + '<br><br>' + item.ciudad + ', ' + item.pais;
        }

        infoWindow.setContent(msg);
        infoWindow.setOptions({
            pixelOffset: new google.maps.Size(0, -40)
        });
        infoWindow.open(map);
    };
    $scope.myLocation = function () {

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                infoWindow.close();
                if (marcador != null) {
                    marcador.setVisible(false);
                }

                marcador = new google.maps.Marker({
                    position: pos,
                    icon: '/wp-content/uploads/2016/12/ic_person_pin_circle_1.png',
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: 'Mi posicion',
                });
                marcador.addListener('click', toggleBounce);
                marcador.setVisible(true);

                infoWindow.setPosition(pos);
                msg = 'Mi posicion';
                infoWindow.setContent(msg);
                map.setCenter(pos);
                //map.panTo(pos);
                map.setZoom(15);
                infoWindow.setOptions({
                    pixelOffset: new google.maps.Size(0, -50)
                });
                getData(position.coords.latitude, position.coords.longitude);
            }, function () {
                getData(9999, 9999);
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation            
            getData(9999, 9999);
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }
    var init = function () {
        $scope.myLocation();
    };

    var handleLocationError = function (browserHasGeolocation, infoWindow, pos) {
        //infoWindow.setPosition(pos);
        console.log(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

    $scope.backButton = function () {
        $scope.showSearch = !$scope.showSearch;
        $scope.search = '';
    }

    init();
    //getData();


}