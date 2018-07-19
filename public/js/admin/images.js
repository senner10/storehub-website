app.controller('images', [
    '$scope',
    '$routeParams',
    function($scope, $routeParams) {
        var id = $routeParams.ID;

        $scope.toggleMap = {},
            $scope.popoverMap = {};

        $scope.updateSize = (product) => {
            var size = $scope.item.meta.items[product].size;
            var lineHeight = size - 13;

            size = `${size}px`;

            $(`[data-id="${product}"]`).css("width", size)
                .css("height", size)
                .css("line-height", `${lineHeight}px`);

        }

        $scope.saveTagStyle = () => {

            var colorTargets = $(".colorTarget");
            var id = $scope.imageTagId;
            $scope.imageTag.backgroundColor = $(".preview", colorTargets[0]).css("backgroundColor");
            $scope.imageTag.textColor = $(".preview", colorTargets[1]).css("background-color");

            var tag = $(`[data-id="${id}"]`)

            tag.css({
                "background-color": $scope.imageTag.backgroundColor,
                "border-color": $scope.imageTag.backgroundColor,
                "color": $scope.imageTag.textColor
            })

            tag.html($scope.imageTag.text);

            $scope.modal("tag-modal");
        }



        $scope.editColors = (product) => {
            $scope.imageTag = $scope.item.meta.items[product];
            $scope.imageTagId = product;
            var tag = $(`[data-id="${product}"]`);
            $scope.imageTag.backgroundColor = $scope.imageTag.backgroundColor ?
                $scope.imageTag.backgroundColor : tag.css("background-color");

            $scope.imageTag.textColor = $scope.imageTag.textColor ?
                $scope.imageTag.textColor : tag.css("color");

            $scope.imageTag.text = $scope.imageTag.text ? $scope.imageTag.text : "+";


            $scope.modal("tag-modal");

            if (!$scope.initColor) {
                $scope.initColor = true;

                pasync(() => {
                    $(".colorTarget").each((i, picker) => {
                        $(picker).colorPickerByGiro({
                            preview: $(".preview", picker),
                            format: 'rgb',
                            value: $("input", picker).val()
                        });


                    })
                });
            } else {
                var colorTargets = $(".colorTarget");
                $(colorTargets[0]).colorPickerByGiro('setValue', $scope.imageTag.backgroundColor);
                $(colorTargets[1]).colorPickerByGiro('setValue', $scope.imageTag.textColor);
            }
        }

        $scope.togglePanel = () => {
            $scope.panelOpen = $scope.panelOpen ? false : true;
        }

        $scope.preview = (product) => {
            var p = $scope.item.meta.items[product],
                comment = p.comment ? p.comment : "Comments",
                cta = p.cta ? p.cta : "CALL TO ACTION",
                item = $scope.GetProduct(p._id),
                theme = $scope.theme.theme;

            var options = {
                placement: "left auto",
                html: true,
                content: `<p style="color:${theme.paragraphColor}" class="text-center">${comment}</p><h3 style="color:${theme.paragraphColor}" class="text-center">$ ${item.price}</h3><p class="text-center storehub"><button style="margin-bottom:1px;color:${theme.paragraphColor};border:1px solid ${theme.buttonBorderColor};background-color: ${theme.buttonBackgroundColor}">${cta}</button> </p>`,
                viewport: "body",
                title: `<span style="color:${theme.paragraphColor}">${item.name}</span>`
            };


            var target = `[data-id="${product}"]`;
            if ($scope.popoverMap[product]) {
                $(target).popover('destroy');
                delete $scope.popoverMap[product];
                return;
            }
            $scope.pulse(product);
            $scope.popoverMap[product] = true;
            $(target).popover(options);
            $(target).popover('show');


        }



        $scope.toggleSettings = (product) => {


            if (!$scope.item.meta.items[product].size) {
                $scope.item.meta.items[product].size = parseInt($(`[data-id="${product}"]`).css("width"));
            }



            if (!$scope.toggleMap[product]) {
                $scope.toggleMap[product] = true;
                return;
            }

            $scope.toggleMap[product] = $scope.toggleMap[product] ? false : true;

        };

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
            $scope.item.meta.image = false;

            pasync(() => {
                $scope.item.meta.image = data._id;
                $scope.update('images', $scope.item._id, $scope.item);
                $scope.prepareImage();
                $scope.$apply();
            });
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

            var top = parseInt(elem.css("top")) - 12.5,
                left = parseInt(elem.css("left")) - 13,
                elemWidth = parseInt(elem.css("width")) + 25;
            var image = $("<img />").attr("style", `width: 55px;position:absolute;top:${top}px; width: ${elemWidth}px;left:${left}px`)
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

                if ($scope.item.meta && $scope.item.meta.index)
                    for (var i = $scope.item.meta.index.length - 1; i >= 0; i--) {
                        var id = $scope.item.meta.index[i];
                        var position = $scope.item.meta.items[id].position;
                        var item = $scope.item.meta.items[id];

                        var tagDiv = $(`<div data-id="${id}" class="tagdiv" style="top: ${position.top}; left: ${position.left};">+</div>`);
                        if (item.backgroundColor) {
                            tagDiv.css({
                                "background-color": item.backgroundColor,
                                "border-color": item.backgroundColor,
                                "color": item.textColor
                            }).html(item.text);
                        }
                        $(".image-tag-wrapper.enabled").append(tagDiv);
                        $scope.updateSize(id);
                    }

            });
        }

        $scope.items = [];

        $scope.Do("GET", "products", {}, (data) => {
            if (data) {
                $scope.items = data;
            }
        });

        $scope.Do("GET", "theme", {}, (data) => {
            if (data) {
                $scope.theme = data;
            }
        });

        $scope.GetProduct = (id) => {

            for (var i = $scope.items.length - 1; i >= 0; i--) {
                if ($scope.items[i]._id == id) {
                    return $scope.items[i];
                }
            }

            return false
        }
    }
]);