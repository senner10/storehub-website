app.controller('layerController', [
    '$scope',
    'Ape',
    '$http',
    function($scope, Ape, $http) {

        $scope.fileTarget = {};
        $scope.uploadFile = (cb) => {
            $scope.working = false;
            $scope.fileCB = cb;
            $scope.modal("file-upload");
        }


        $scope.help = {};

        $scope.sendMessage = () => {
            $scope.Do("POST", "help", $scope.help, (data) => {
                if (data)
                    swal("Success", "message sent!", "success");
            });
        }

        $scope.deleteFile = (file, action) => {
            swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this resource.",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        action(file);
                    }
                });

        }



        $scope.upload = () => {
            if (!selected_files || selected_files.length == 0) {
                swal({
                    title: "No files selected!",
                    icon: "warning"
                })
            }
            var counter = 0;
            for (var i = selected_files.length - 1; i >= 0; i--) {
                counter++;
                $scope.working = true;
                uploadFile(selected_files[i], (data) => {
                    $scope.fileCB(data)
                    counter--;
                    if (counter <= 0) {
                        $scope.modal("file-upload");
                    }
                });
            }
        }


        $scope.delete = (res, id) => {
            swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this resource.",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {

                        $scope.Do("DELETE", `${res}/${id}`, {}, (data) => {
                            if (data)
                                swal("Resource deleted.", {
                                    icon: "success",
                                }), $scope.back();
                            else swal("Resource could not be removed, please try again.", {
                                icon: "error",
                            });
                        })
                    }
                });
        }

        $scope.update = (res, id, changes) => {

            $scope.Do("PUT", `${res}/${id}`, changes, (data) => {
                if (data)
                    swal("Resource updated.", {
                        icon: "success",
                    });
                else swal("Failed to save resource changes, please try again.", {
                    icon: "error",
                });
            })

        }

        $scope.modal = (id) => {
            $(`#${id}`).modal('toggle');
        }

        $scope.back = () => {
            window.history.back();
        }

        window.logout = () => {
            $http({
                method: "GET",
                url: "/api/logout",
                headers: {},
            }).then(function successCallback(response) {
                window.location = "/login.html";
            })
        }

        Ape.Request("GET", "/api/is_loggedin", {}, (data) => {
            if (!data) {
                window.location = "/login.html";
                return;
            }
            $scope.ready = true;


            // initialize toolbar jquery plugins
            pasync(() => {
                InitSearchAutocomplete();
                $("a[data-placement].alerts").popover({});
                $("a[data-placement].account").popover({});
            });
            $scope.name = data.name;
            $scope.id = data.id;
            Ape.Init({
                base: "/api/res/",
                headers: {}, // {"JWT-TOKEN" : data.token },
                start: () => {

                },
                end: () => {

                }
            });
            $scope.Do = Ape.Request;
            $scope.Ape = Ape;
        })

    }
]);

window.pasync = (fn) => {
    setTimeout(fn, 1100);
}


var selected_files;

function handleFiles(files) {
    selected_files = files;
}


function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function InitSearchAutocomplete() {

}

function serialize(obj, prefix) {
    var str = [],
        p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

function uploadFile(file, cb) {
    var reader = new FileReader();
    var xhr = new XMLHttpRequest();
    var fd = new FormData();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var success = (xhr.status == 200)
            try {
                cb(JSON.parse(xhr.responseText));
            } catch (e) {
                console.log("Invalid JSON");
                cb({ error: xhr.responseText == "" ? "Server wrote no response" : xhr.responseText })
            }

        }
    };
    xhr.open("POST", `/api/res/upload`, true);
    fd.append('file', file);
    // Initiate a multipart/form-data upload
    xhr.send(fd);


}