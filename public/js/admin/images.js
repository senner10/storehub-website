app.controller('images', [
    '$scope',
    '$routeParams',
    function($scope, $routeParams) {
        var id = $routeParams.ID;


        $scope.Do("GET", `images/${id}`, {},
            (data) => {
                if (data) {
                    $scope.item = data;
                    if (!$scope.item.meta) $scope.item.meta = { items: {}, index: [] };
                    $scope.prepareImage();
                } else {
                    //redirect to 404
                }
            });

        $scope.addImage = (data) => {
            $scope.item.meta.image = data._id;
            $scope.update('images', $scope.item._id, $scope.item);
            $scope.prepareImage();
            $scope.$apply();
        }

        $scope.hideitems = () => {
            $scope.showitems = false;
        }

        var currentTag, currentID;

        window.addProduct = (elem) => {
            $scope.showitems = true;
            currentID = $(elem).parents("[data-for]").attr("data-for");
            console.log(currentID);
            currentTag = $(elem).parents(".image-tag-wrapper.enabled");
            $scope.$apply();
        }

        $scope.pulse = (id) => {
            var elem = $(`[data-id="${id}"]`);

            var top = elem.css("top"),
                left = elem.css("left");
            var image = $("<img />").attr("style", `padding-left:7px;margin-top:-10px;width: 55px;position:absolute;top:${top};left:${left}`)
                .attr("src", "/img/ripple.gif");

            $(".image-tag-wrapper.enabled").append(image);

            setTimeout(() => {
                image.remove();
            }, 2500);


        }

        $scope.selectProduct = (item) => {
            $scope.showitems = false;
            var id = currentID;
            if (!$scope.item.meta.items)
                $scope.item.meta.items = {},
                $scope.item.meta.index = [];

            $(`[data-id="${currentID}"]`, currentTag).removeClass("unsaved");
            $scope.item.meta.items[id] = item;
            $scope.item.meta.index.push(id);
            pasync(() => {
                $(`.tagform-wrapper[data-for="${id}"]`, currentTag).remove();

                $("div[data-id]").each((i, item) => {
                    var id = $(item).attr("data-id");
                    var position = $scope.item.meta.items[id].position;
                    var top = $(item).css("top"),
                        left = $(item).css("left");

                    if (!position)
                        position = {};

                    position.top = top;
                    position.left = left;
                    $scope.item.meta.items[id].position = position;
                    $scope.$apply();
                });
            });
        }

        $scope.removeProduct = (id) => {
            swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this resource.",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        $scope.performProductRemoval(id);
                    }
                });

        }

        $scope.performProductRemoval = (id) => {
            var index = $scope.item.meta.index.indexOf(id);
            $scope.item.meta.index.splice(index, 1);
            delete $scope.item.meta.items[id];

            $(`[data-id=${id}]`).remove();
            $scope.$apply();
        }


        $scope.prepareImage = () => {
            pasync(() => {

                $('.tag-image').imageTag({
                    tagForm: $("#imageForm")
                });

                if($scope.item.meta && $scope.item.meta.index)
                for (var i = $scope.item.meta.index.length - 1; i >= 0; i--) {
                    var id = $scope.item.meta.index[i];
                    var position = $scope.item.meta.items[id].position;
                   $(".image-tag-wrapper.enabled").append(`<div data-id="${id}" class="tagdiv" style="top: ${position.top}; left: ${position.left};">Product </div>`);
                }

            });
        }

        $scope.items = [];

        $scope.Do("GET", "products", {}, (data) => {
            if (data) {
                $scope.items = data;
            }
        });
    }
]);