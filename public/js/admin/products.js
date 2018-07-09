app.controller('products', [
    '$scope',
    '$routeParams',
    function($scope, $routeParams) {
        var id = $routeParams.ID;

        $scope.Do("GET", `products/${id}`, {},
            (data) => {
                if (data) {
                    $scope.item = data;
                } else {
                    //redirect to 404
                }
            });

        $scope.locations = [];

        $scope.addImage = (data) => {
            $scope.item.images.push(data._id);
            $scope.update('products', $scope.item._id, $scope.item);
            $scope.$apply();
        }

        $scope.addStore = (store) => {
            if(!$scope.item.meta)
                $scope.item.meta = {stores : {} };
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
                    $scope.update('products', $scope.item._id, $scope.item);
                    $scope.apply();

                } else swal("Error", "Please try again.", "error");
            });
        }

        $scope.Do("GET", `locations`, {},
            (data) => {
                if (data) {
                    $scope.locations = data;
                } else {
                    //redirect to 404
                }
            });

    }
]);