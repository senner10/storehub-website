app.controller('apps', [
    '$scope',
    function($scope) {

        $scope.plans = {
            Essential: {
                rate: "$29 per month."
            },
            Professional: {
                rate: "$149 per month."
            },
            Enterprise: {
                rate: "Custom pricing."
            }
        };

        $scope.plansIndex = Object.keys($scope.plans);



        $scope.appList = [
            { name: "Geolocation marketing", description: "Powerful features make it possible to leverage each store location to the max and convert customers on the go.", icon: "glyphicon glyphicon-flag", id: "gm" },
            { name: "Shop the look", description: "Upload, Link products, Launch Shoppable Images on Any Device. With intuitive shoppable images you’ll be selling more product, faster.", icon: "glyphicon glyphicon-tags", id: "spl" },
            { name: "Retail events", description: "Drive Sales to Stores With Events. A simple, powerful way to plan and manage events at any store location.", icon: "glyphicon glyphicon-calendar", id: "re" },
            { name: "Product wishlists", description: "Oftentimes the wishlist is underutilized. Beef it up with recommendations, shareable links, and one-click-add. For retailers who sell online or offline", icon: "glyphicon glyphicon-barcode", id: "cme" }
        ];

        $scope.hasApp = (id) => {
            if (!$scope.apps) return false;
            return $scope.apps.indexOf(id) != -1;
        }

        $scope.install = (id) => {
            $scope.Do("GET", `app/install/${id}`, {}, (data) => {
                if (data) {
                    swal("Success", "App installed, refresh the page to apply changes.", "success")
                    $scope.apps.push(id);
                } else {
                    swal("Error installing app", "You may need to upgrade your plan to add more apps.", "error");
                }
            })
        }

        $scope.upgrade = (id) => {
            if (!$scope.getPlanId()) {
                swal("", "Please enter your payment information to upgrade your account.", "warning");
                return;
            }
            $scope.Do("GET", `upgrade/${id}`, {}, (data) => {
                if (data) {
                    swal("Success", "Your account subscription was upgraded", "success")
                    $scope.plan_id = id;
                } else {
                    swal("Error", "Please try again.", "error")
                }
            })
        }

        $scope.uninstall = (id) => {
            $scope.Do("GET", `app/uninstall/${id}`, {}, (data) => {
                if (data) {
                    swal("Success", "App uninstalled, refresh the page to apply changes.", "success")
                    var index = $scope.apps.indexOf(id);
                    $scope.apps.splice(index, 1);
                } else {
                    swal("Error uninstalling app", "Please try again.", "error");
                }
            })
        }

    }
]);


app.controller('mailchimp', [
    '$scope',
    function($scope) {
        $scope.saveMailChimp = () => {
            var id = $scope.mc._id
            $scope.Do("PUT", `mailchimps/${id}`, $scope.mc, (data) => {
                if (data) {
                    swal("Success", "Mailchimp settings saved!", "success");
                }
            });
        }

        $scope.Do("GET", "mailchimps", {}, (data) => {
            if (!data || data.length == 0) {

                $scope.Do("POST", "mailchimps", {}, (data) => {
                    if (data) {
                        $scope.mc = data;
                    }
                })
                return;
            }

            $scope.mc = data[0];
        })
    }
]);

app.controller('themes', [
    '$scope',
    function($scope) {
        $scope.theme = {};

        $scope.Do("GET", "theme", {}, (data) => {
            if (data) {
                $scope.theme = data.theme;
                if (!$scope.theme)
                    $scope.theme = {
                        panelBackgroundColor: "rgb(255,255,255)",
                        headerBackgroundColor: "rgb(255,255,255)",
                        buttonBackgroundColor: "rgb(255,255,255)"
                    };

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
    function($scope) {

        $scope.Do("GET", "merchant_token", {}, (data) => {
            if (data) $scope.merchantData = true;
            $scope.ready = true;
        })

    }
]);