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

        $scope.Do("GET", "products", {},
            (data) => {
                if (data) {

                    var categories = [];
                    var subCategories = [];
                    var eCache = { c: [], sc: [] };

                    for (var i = data.length - 1; i >= 0; i--) {
                        var item = data[i],
                            subEntry = { name: item.sub_category },
                            entry = { name: item.category };

                        var indexCategory = eCache.c.indexOf(item.category);
                        var indexSubCategory = eCache.sc.indexOf(item.sub_category);

                        if (indexCategory == -1 && entry.name != ""){
                            eCache.c.push(item.category);
                            categories.push(entry);
                        }

                        if (indexSubCategory == -1 && subEntry.name != ""){
                            eCache.sc.push(item.sub_category)
                            subCategories.push(subEntry);
                        }

                    }


                    pasync(() => {
                        SetupAutoComplete("input.category", categories);
                        SetupAutoComplete("input.subCategory", subCategories);
                    });




                }
            });

    }
]);

function SetupAutoComplete(name, categories) {
    var options = {
        data: categories,
        getValue: "name"
    };
    $(name).easyAutocomplete(options);
}