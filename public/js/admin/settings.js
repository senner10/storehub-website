app.controller('apps', [
    '$scope',
    function($scope, ) {


    }
]);


app.controller('themes', [
    '$scope',
    function($scope, ) {
        $scope.theme = {};

        $scope.Do("GET", "theme", {}, (data) => {
            if (data) {
                $scope.theme = data.theme;
                if (!$scope.theme)
                    $scope.theme = { headerBackgroundColor: "rgb(255,255,255)" };

                pasync(() => {
                    $(".colorTarget").each((i, picker) => {
                        $(picker).colorPickerByGiro({
                            preview: $(".preview", picker),
                            format: 'rgb',
                            value: $("input", picker).val()
                        });

                    })
                });


                $('#themeTabs a').click(function(e) {
                    e.preventDefault()
                    $(this).tab('show')
                })
            }
        })


        $scope.getColorSettings = () => {
            $(".colorTarget").each((i, picker) => {
                var key = $("input[ng-model]", picker).attr("ng-model")
                    .split(".")[1];
                $scope.theme[key] = $(".preview", picker).css("background-color");
            });
        }

        $scope.saveTheme = () => {
            $scope.working = true;

            $scope.getColorSettings();

            pasync(() => {
                $scope.Do("PUT", "theme", $scope.theme, (data) => {
                    if (data) {
                        swal("Success", "Theme setting saved!", "success");
                        $scope.working = false;

                    }
                });
            });
        }



    }
]);



app.controller('stripe_controller', [
    '$scope',
    function($scope, ) {


    }
]);