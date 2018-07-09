app.controller('locations', [
    '$scope',
    '$routeParams',
    function($scope, $routeParams) {
        var id = $routeParams.ID;

        $scope.perkbase = {};

        $scope.addPerk = () => {



            if (!$scope.item.meta) {
                $scope.item.meta = { perks: [] };
            } else if (!$scope.item.meta.perks)
                $scope.item.meta.perks = [];



            $scope.item.meta.perks.push($scope.perkbase.name);

            $scope.perkbase = {};
        }

        $scope.addImage = (data) => {
            $scope.item.images.push(data._id);
            $scope.update('locations', $scope.item._id, $scope.item);
            $scope.$apply();
        }

        $scope.removeImage = (file) => {
            $scope.Do("DELETE", `/file/${file}`, {}, (response) => {

                if (response) {
                    var imageIndex = $scope.item.images.indexOf(file);
                    $scope.item.images.splice(imageIndex, 1)
                    $scope.update('locations', $scope.item._id, $scope.item);
                    $scope.apply();

                } else swal("Error", "Please try again.", "error");
            });
        }

        $scope.removePerk = (perk) => {

            var index = $scope.item.meta.perks.indexOf(perk);
            $scope.item.meta.perks.splice(index, 1);

        }




        $scope.Do("GET", `locations/${id}`, {},
            (data) => {
                if (data) {
                    $scope.item = data;
                    $scope.setupFence();
                    pasync(() => {
                        var input = document.getElementById('location-address'),
                            autocomplete = new google.maps.places.Autocomplete(input);


                        autocomplete.addListener('place_changed', function() {
                            var place = autocomplete.getPlace();
                            $scope.item.address = place.formatted_address;
                            $scope.item.location = place;
                            $scope.$apply();
                            $scope.setupFence();
                        })
                    })
                } else {
                    //redirect to 404
                }
            });

        var tempfence;
        $scope.initMap = () => {

            $("#fence-modal .modal-body").html('<div style="height:450px;" class="gmap-polygon"></div><div id="controls-polygon"></div>');
            pasync(() => {
                    var map = new Maplace({
                        locations: tempfence,
                        map_div: '.gmap-polygon',
                        show_markers: true,
                        generate_controls: false,
                        type: 'polygon',
                        dragEnd: function(index, location, marker) {
                            tempfence[index].lat = marker.position.lat();
                            tempfence[index].lon = marker.position.lng();

                            $scope.item.meta.geofence = tempfence;
                        }
                        //draggable: true
                    }).Load();
                }

            );
        }

        // setup geo fence
        $scope.setupFence = () => {

            if (!$scope.item.location) return;

            if ((!$scope.item.meta || !$scope.item.meta.geofence || $scope.item.meta.geofence.length == 0) && $scope.item.location) {

                if (!$scope.item.meta)
                    $scope.item.meta = { geofence: [] };
                if ($scope.item.meta.geofence) $scop.item.meta.geofence = [];

                tempfence = [{
                        lat: $scope.item.location.geometry.location.lat + 0.003,
                        lon: $scope.item.location.geometry.location.lng + 0.003,
                        draggable: true,
                        //editable: true
                    },
                    {
                        lat: $scope.item.location.geometry.location.lat + 0.003,
                        lon: $scope.item.location.geometry.location.lng - 0.003,
                        draggable: true,
                        //editable: true
                    },
                    {
                        lat: $scope.item.location.geometry.location.lat - 0.003,
                        lon: $scope.item.location.geometry.location.lng - 0.003,
                        draggable: true,
                        //editable: true
                    },
                    {
                        lat: $scope.item.location.geometry.location.lat - 0.003,
                        lon: $scope.item.location.geometry.location.lng + 0.003,
                        draggable: true,
                        //editable: true
                    }
                ];
            } else tempfence = $scope.item.meta.geofence;



        }

    }
]);