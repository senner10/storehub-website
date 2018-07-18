var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];

app.controller('Dashboard', [
    '$scope',
    function($scope, ) {

        $scope.currentapp = "n";
        $scope.toggleMap = {};

        $scope.toggle = (label) => {
            $scope.toggleMap[label] = $scope.toggleMap[label] ?
             false : true ;
        }

        $scope.appStat = {
            gm: {
                name: "Geomarketing"
            },
            spl: {
                name: "Shop the look"
            },
            cme: {
                name: "Commerce"
            },
            re: {
                name: "Retail events"
            },
            n: {
                name: "Select an app to view its metrics."
            }
        }

        $scope.newItemCache(true);
        var week = (84600 * 1000) * 7;

        $scope.displayedItems = [];

        $scope.getValueForDate = (date, index) => {
            var indexLabel = $scope.chartData.labels.indexOf(date);
            return $scope.chartData.datasets[index].data[indexLabel];
        }



        $scope.setApp = (app) => {
            $scope.currentapp = app;
            $scope.displayedItems = [];

            var cache = $scope.getCache();

            for (var i = cache.length - 1; i >= 0; i--) {
                var item = cache[i];
                if (item.appType == app) {
                    var itemClone = Object.assign({}, item)
                    itemClone.show = true;
                    $scope.displayedItems.push(itemClone);
                }
            }


            $scope.buildChart();

        }

        $scope.buildChart = () => {
            var lastWeek = (new Date()).getTime() - week;

            $scope.filter = {
                start: new Date(),
                end: new Date(lastWeek)
            };
            $scope.chartData = {
                datasets: []
            }

            $(".panel-body").html('<p class="text-center"><i class="fa fa-spin fa-cog"></i> Loading</p>')

            counter = $scope.displayedItems.length;
            for (var i = $scope.displayedItems.length - 1; i >= 0; i--) {
                var item = $scope.displayedItems[i];

                if (item.show)
                    setTimeout((item) => {
                        $scope.Do("POST", `stats/${item._id}`, $scope.filter, (data) => {
                            if (!$scope.chartData.labels ||
                                $scope.chartData.labels.length < data.labels.length) {

                                $scope.chartData.labels = data.labels;
                            }
                            counter--;
                            $scope.chartData.datasets.push({
                                label: `${item.name} impressions`,
                                borderColor: colorArray[counter],
                                data: data.sets[0],
                            })

                            $scope.chartData.datasets.push({
                                label: `${item.name} clicks`,
                                borderColor: colorArray[colorArray.length - counter],
                                data: data.sets[1],
                            })

                            if (counter == 0) {
                                $scope.initChart();
                            }
                        })
                    }, 200, item);
                else counter--;

                if (counter == 0) {
                    $(".panel-body").html("<p>No data found at the moment.</p>");
                }

            }
        }

        $scope.initChart = () => {
            pasync(() => {
                var width = parseInt($("html").css("width"));

                if (width <= 768) {

                    $scope.showList = true;
                    $(".panel-body").html("");

                    $scope.$apply();
                    return;
                }

                $(".panel-body").html('<canvas id="storeChart" height="120"></canvas>')

                var ctx = document.getElementById("storeChart").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: $scope.chartData,
                    options: {

                    }
                });
            })
        }

    }
]);