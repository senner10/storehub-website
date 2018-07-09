app.controller('NewResource', [
    '$scope',
    '$routeParams',
    function($scope, $routeParams) {
        $scope.resName = $routeParams.type.substring(0, $routeParams.type.length - 1);
        $scope.data = {};

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
                    if(resName == "api") resName = "website";

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
        $scope.capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        $scope.resName =  $routeParams.type.substring(0, $routeParams.type.length - 1) ;
      
        $scope.Do("GET", $routeParams.type, {}, (data) => {
            $scope.items = data;
        });
        
        $scope.items = [];

    }
]);