app.controller('websites', [
    '$scope',
    '$routeParams',
    function($scope, $routeParams) {

        var id = $routeParams.ID;
        $scope.Do("GET", `apis/${id}`, {},
            (data) => {
                if (data) {
                    $scope.item = data;
                } else {
                    //redirect to 404
                }
            });

        $scope.data = {};
        $scope.addOrigin = () => {


            if (!$scope.item.origins) {
                $scope.item.origins = { hosts: [] };
            } else if (!$scope.item.origins.hosts)
                $scope.item.origins.hosts = [];
            var name = $scope.data.hostname;
            $scope.item.origins.hosts.push(name);

            $scope.data.hostname = "";
        }


        $scope.removeOrigin = (perk) => {

            var index = $scope.item.origins.hosts.indexOf(perk);
            $scope.item.origins.hosts.splice(index, 1);

        }


    }
]);