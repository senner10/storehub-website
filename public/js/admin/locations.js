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
                    var id = data._id;
                    pasync(() => {
                        var input = document.getElementById('location-address'),
                            autocomplete = new google.maps.places.Autocomplete(input);


                        autocomplete.addListener('place_changed', function() {
                            var place = autocomplete.getPlace();
                            $scope.item.address = place.formatted_address;
                            $scope.item.location = JSON.parse(JSON.stringify(place));
                            if ($scope.item.meta && $scope.item.meta.geofence)
                                delete $scope.item.meta.geofence;
                            $scope.$apply();
                            $scope.update('locations', $scope.item._id, $scope.item);
                            $scope.setupFence();

                            window.nextTip();

                            pasync(() => { window.location = `#/locations/${data._id}` });

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

        $scope.verifyHoursArray = () => {

            if (!$scope.item.meta.hours) {
                var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
               
               $scope.item.meta.hours = [];
               for (var i = 0; i < daysOfWeek.length; i++) {
                    var day = daysOfWeek[i];
                    var entry = {day : day,open : true };

                    $scope.item.meta.hours.push(entry);
                }
            }
        }

        // setup geo fence
        $scope.setupFence = () => {

            if (!$scope.item.location) return;

            if ((!$scope.item.meta || !$scope.item.meta.geofence || $scope.item.meta.geofence.length == 0) && $scope.item.location) {

                if (!$scope.item.meta)
                    $scope.item.meta = { geofence: [] };
                if ($scope.item.meta.geofence) $scope.item.meta.geofence = [];

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