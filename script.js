
// initializing app
var myMap = angular.module('myMaps', ['ngRoute']);


// config route
myMap.config(function ($routeProvider) {
   $routeProvider.when('/', {
       templateUrl: 'index.html',
       controller: 'myController'
   })
});

// controller definition
myMap.controller('myController', function ($scope) {
    $scope.locatePin = false;
    $scope.flickrApiKey = '87c9c371d7fbeb5b5e1da8a1453d9ea0';
    $scope.mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);

    $scope.myLatlng = new google.maps.LatLng(40.713956, -74.006653);

    $scope.marker = new google.maps.Marker({
        draggable: true,
        position: $scope.myLatlng,
        map: $scope.map,
        title: "Your location"
    });

    // a click handler on pin location to fetch the location
    google.maps.event.addListener($scope.map, 'click', function(event){
        $scope.lat = event.latLng.lat();
        $scope.lng = event.latLng.lng();
        $scope.marker.setPosition(event.latLng);
        $scope.$apply(function () {
            $scope.getTotalCount($scope.lat, $scope.lng);
        });
    });

    // get the flickr images on click at specific location
    $scope.getTotalCount = function (lat, lng) {
        $scope.url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + $scope.flickrApiKey + '&safe_search=1&lat=' + lat + '&lon=' + lng + '&per_page=10&format=json&nojsoncallback=1';

        if (window.XMLHttpRequest) {
            $scope.pictureDisplay = [];
            $scope.xhttp = new XMLHttpRequest();
            $scope.xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    $scope.picInfo = JSON.parse(this.responseText);
                    $scope.totalPicCount = "Total Number of pics: " + $scope.picInfo.photos.total;

                    $scope.picturesUrl = '';
                    for(var i=0; i < $scope.picInfo.photos.photo.length; i++){
                        $scope.pic = $scope.picInfo.photos.photo[i];
                        $scope.$apply(function () {
                            $scope.pictureDisplay.push({img: 'https://farm' + $scope.pic.farm + '.staticflickr.com/' + $scope.pic.server + '/' + $scope.pic.id + '_' + $scope.pic.secret + '.jpg'});
                            $scope.locatePin = true;
                        });
                    }
                }
            };
            $scope.xhttp.open("GET", $scope.url, true);
            $scope.xhttp.send();

        } else {
            // code for IE6, IE5
            $scope.xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
});
