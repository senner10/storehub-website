app.controller('events', [
    '$scope',
    '$routeParams',
    function($scope, $routeParams) {
        var id = $routeParams.ID;

        $scope.Do("GET", `events/${id}`, {},
            (data) => {
                if (data) {
                    data.start_date = data.start_date ? new Date(data.start_date) : new Date();
                    data.end_date = data.end_date ? new Date(data.end_date) : new Date();
                    $scope.item = data;
                } else {
                    // show 404 error
                    $scope.resourceNotFound();
                    $scope.back();
                }
            });

        $scope.Do("GET", `locations`, {},
            (data) => {
                if (data) {
                    $scope.locations = data;
                }
            });

        $scope.addImage = (data) => {
            if (!$scope.item.images)
                $scope.item.images = [];

            $scope.item.images.push(data._id);
            $scope.update('events', $scope.item._id, $scope.item);
            $scope.$apply();
        }

        $scope.addStore = (store) => {
            if (!$scope.item.meta)
                $scope.item.meta = { stores: {} };
            $scope.item.meta.stores[store._id] = store;
        }

        $scope.removeStore = (store) => {
            delete $scope.item.meta.stores[store._id];
        }

        $scope.removeImage = (file) => {
            $scope.Do("DELETE", `/file/${file}`, {}, (response) => {

                if (response) {
                    var imageIndex = $scope.item.images.indexOf(file);
                    $scope.item.images.splice(imageIndex, 1)
                    $scope.update('events', $scope.item._id, $scope.item);
                    $scope.apply();

                } else swal("Error", "Please try again.", "error");
            });
        }


    }
]);