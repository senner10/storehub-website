app.controller('NewResource', [
    '$scope',
    '$routeParams',
    function($scope, $routeParams) {
        $scope.resName = $routeParams.type.substring(0, $routeParams.type.length - 1);
        $scope.data = {};
        $scope.emptyCache();
        $scope.create = () => {


            $scope.Do("POST", $routeParams.type, $scope.data, (data) => {
                if (data) {
                    var resName = $scope.resName;
                    swal({
                        title: "Success",
                        text: `Your new ${resName} is created.`,
                        icon: "success",
                        button: "Dismiss",
                    });
                    if (resName == "api") resName = "website";

                    window.location = `#/${resName}s/${data._id}`;
                } else {
                    swal({
                        title: "Error",
                        text: "There was a problem performing your request, please try again.",
                        icon: "error",
                        button: "Dismiss",
                    });
                }
            });
        }
    }
]);

app.controller('List', [
    '$scope',
    '$routeParams',
    function($scope, $routeParams) {

        $scope.selectMap = {},
            $scope.prev = {};

        $scope.getString = (set) => {
            var arr = [];
            for (var i = set.length - 1; i >= 0; i--) {
                arr.push(set[i]._id);
            }
            return arr.join(",");
        }

        $scope.resetSearch();

        $scope.selectedCount = () => {
            var keys = Object.keys($scope.selectMap),
                active = 0;

            for (var i = keys.length - 1; i >= 0; i--) {
                if ($scope.selectMap[keys[i]])
                    active++;
            }

            return active;
        }

        $scope.deleteSelected = () => {
            swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover these resources.",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {

                        var keys = Object.keys($scope.selectMap);
                        var targetCount = keys.length;
                        for (var i = keys.length - 1; i >= 0; i--) {
                            var id = keys[i];
                            if ($scope.selectMap[id]) {
                                var type = $routeParams.type;
                                delete $scope.selectMap[id];
                                $scope.Do("DELETE", `${type}/${id}`, {}, (data) => {
                                    targetCount--;
                                    if (data && targetCount == 0) {
                                        swal("Resources deleted.", {
                                            icon: "success",
                                        });
                                        $scope.getData();
                                    }

                                })
                            } else targetCount--;

                        }


                    }
                });

        }

        $scope.selectAll = () => {
            for (var i = $scope.items.length - 1; i >= 0; i--) {
                $scope.selectMap[$scope.items[i]._id] = true;
            }
        }

        $scope.deselectAll = () => {
            for (var i = $scope.items.length - 1; i >= 0; i--) {
                $scope.selectMap[$scope.items[i]._id] = false;
            }
        }

        $scope.clone = () => {
            var keys = Object.keys($scope.selectMap);
            var targetCount = keys.length;
            for (var i = keys.length - 1; i >= 0; i--) {
                var key = keys[i];
                if ($scope.selectMap[key]) {
                    delete $scope.selectMap[key];
                    var original = Object.assign({}, $scope.findItem(key));
                    original.name = `${original.name} clone`;
                    delete original._id;
                    $scope.Do("POST", $routeParams.type, original, (data) => {
                        targetCount--;
                        if (data && targetCount == 0) {
                            swal("Success", "Your resources were cloned successfully.", "success");
                            $scope.getData();
                        }
                    })
                } else targetCount--;
            }
        }

        $scope.html = () => {
            $scope.previewSet = [];
            var keys = Object.keys($scope.selectMap);
            for (var i = keys.length - 1; i >= 0; i--) {
                var key = keys[i];
                if ($scope.selectMap[key]) {
                    var item = $scope.findItem(key);
                    $scope.previewSet.push(item);
                }
            }
            $scope.modal('preview-modal');
        }

        $scope.capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        $scope.resName = $routeParams.type.substring(0, $routeParams.type.length - 1);

        $scope.getData = () => {
            $scope.Do("GET", $routeParams.type, {}, (data) => {
                $scope.items = data;
            });
        }

        $scope.Do("GET", "theme", {}, (data) => {
            if (data)
                $scope.theme = data.theme;
        });

        $scope.Do("GET", "apis", {}, (data) => {
            if (data)
                $scope.websites = data;
        });

        $scope.findItem = (id) => {
            for (var i = $scope.items.length - 1; i >= 0; i--) {
                if ($scope.items[i]._id == id) {
                    return $scope.items[i];
                }
            }
            return false;
        }

        $scope.getData();

        $scope.items = [];

    }
]);