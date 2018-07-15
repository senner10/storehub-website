function BuildStoreHub() {

    if (!window.jQuery) {
        LoadJquery();
        return
    }

    AddStoreButton();
}

function LoadJquery() {
    LoadScript("/js/jquery.min.js", AddStoreButton);
}

function LoadScript(src, onload) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = onload;
    document.body.appendChild(script);
}


function AddStoreButton() {
    var baseStyles = '.storehub button{padding:3px 10px;height:30px;border:1px solid #333;border-radius:10px;font-family:inherit!important}.storehub button:focus{border:1px solid #333}.storehub input{background:#f5f5f5;border:1px solid #333;width:initial!important;height:50px;min-width:400px;padding-left:20px;font-weight:500;margin-bottom:24px;border-radius:0 !important;}.storehub-panel{overflow:hidden;border:1px solid;}.storehub-panel .header,.storehub-panel .panel{padding:10px;border-radius:0;margin:0;font-family:inherit!important}';
    var storehubData, theme, position;

    AddStyle(baseStyles);

    $.ajax({
        url: "/api/get_locations",
        headers: { "token": storeToken },
        contentType: "application/json",
        success: (response) => {
            parse(response);
        },
        error: () => {
            console.log("Please contact your developer, the snippet failed to authenticate.")
        }
    })

    var parse = (response) => {
        storehubData = response;
        $.ajax({
            url: `/api/user_theme/${storehubData.w.owner}`,
            contentType: "application/json",
            success: (response) => {
                theme = response.theme;
                addButton();
            },
            error: () => {
                console.log("Please contact your developer, the snippet failed to authenticate.")
            }
        })
    }

    var StoreHubPanel = (title, content) => {
        var panel = $(`<div class="storehub"><div class="storehub-panel" > <div class="header"><h2>${title}</h2></div> <div class="panel"> </div> </div> </div>`)
        $(".panel", panel).append(content);
        return panel;
    }

    var ShowModal = (content) => {

        $(".remodal-wrapper").remove();

        var modal = $('<div class="remodal" data-remodal-id="modal" data-remodal-options="hashTracking: false, closeOnOutsideClick: true"> <button data-remodal-action="close" class="remodal-close"></button> <div> </div><br></div>');

        $("div", modal).append(content);

        $("body").append(modal);

        var inst = $('[data-remodal-id=modal]').remodal({});
        inst.open();
    }

    var generateLocationContent = (location) => {
        var content = $('<div/>');

        content.append(`<h2 >${location.name}</h2>`)

        content.append('<div class="scrolldiv"> </div>')

        content.append('<div class="float-column one"> </div> <div class="float-column two"> </div>')

        content.append('<div style="clear:both"> </div>')

        $(".float-column.one", content).append(`<h4><i class="fa fa-map-marker"></i> ${location.address}</h4>`);

        $(".float-column.one", content).append('<div class="perks"><b>Amenities</b><br></div><br>');

        if (location.meta.perks)
            for (var i = location.meta.perks.length - 1; i >= 0; i--) {
                var perk = location.meta.perks[i];
                $(".perks", content).append(`<span style='margin-right:5px'><i class='fa fa-thumb-tack'></i> ${perk}</span> `);
            }

        $(".float-column.one", content).append(`<span><i class="fa fa-phone"></i> ${location.meta.phone}</span><br><br><br>`);


        $(".float-column.two", content).append('<h2>Hours</h2>');

        if (location.meta.hours)
            for (var i = location.meta.hours.length - 1; i >= 0; i--) {
                var day = location.meta.hours[i];
                var dayElement = $(`<p><b>${day.day} : </b> </p>`);

                if (day.open) {
                    dayElement.append(`${day.open_time} — ${day.close_time}`);
                } else {
                    dayElement.append("CLOSED");
                }

                if (day.open_time)
                    $(".float-column.two", content).append(dayElement);
            }

        $(".float-column.one", content).append(`<a href="mailto:${location.meta.email}" class="social"><i class="fa fa-envelope"></i></a>`);

        $(".float-column.one", content).append(`<a href="${location.meta.facebook}" class="social" target="_blank"><i class="fa fa-facebook"></i></a>`);

        $(".float-column.one", content).append(`<a href="${location.meta.pinterest}" class="social" target="_blank"><i class="fa fa-pinterest"></i></a>`);
        $(".float-column.one", content).append(`<a href="${location.meta.twitter}" class="social" target="_blank"><i class="fa fa-twitter"></i></a>`);

        for (var i = location.images.length - 1; i >= 0; i--) {
            var image = location.images[i]
            $(".scrolldiv", content).append(`<img src="/file/${image}" />`)
        }

        return content;
    }

    var addLocations = () => {
        var panel = $(".storehub .panel");
        var storeView = $("<div style='display:none;'><div style='text-align:left;'><button class='back'>Back</button></div><div class='store-content' > </div></div>");
        var locationElements = $('<div > </div>');
        $(".back", storeView).click(() => {
            storeView.css('display', "none");
            locationElements.css('display', "block");
        });


        panel.append(storeView);
        for (var i = storehubData.locations.length - 1; i >= 0; i--) {
            var location = storehubData.locations[i];
            if (location.location) {



                var locationElement = $(`<a style="-webkit-box-shadow: 0 8px 6px -6px black;-moz-box-shadow: 0 8px 6px -6px black;box-shadow: 0 8px 6px -6px black;" class="list-element"  href="#${location._id}" >${location.name}<br/><b>Address:</b> ${location.address}<br/></a>`);

                var lat = location.location.geometry.location.lat,
                    lon = location.location.geometry.location.lng;

                var dist;
                if (position) {
                    dist = calcCrow(position.latitude, position.longitude, lat, lon);
                    //0.621371
                }
                var locationRow = $(`<div><iframe src="/map_viewer.html?lat=${lat}&lon=${lon}" ></iframe></div>`);

                locationRow.prepend(locationElement);
                var directions = $(`<a class="list-element" style="margin-top: 163px;" href="http://www.google.com/maps/place/${lat},${lon}" target="_blank" >Get directions</a>`);

                if (dist)
                    directions.append(` (${Math.floor(dist)} miles away)`);
                locationRow.prepend(directions);



                locationElement.click({ location }, (e) => {
                    storeView.css('display', "block");
                    var content = $(".store-content", storeView)
                    content.html("");

                    var locationInformation = generateLocationContent(e.data.location);
                    content.append(locationInformation);
                    locationElements.css('display', "none");
                    return false;
                })
                if ((!location.useFence && dist < location.range) || inFence(location))
                    locationElements.append(locationRow)
            }
        }

        if ($(".list-element", locationElements).length == 0) {
            locationElements.append("<p style='text-align:center;'>No nearby stores found.</p>");
        }

        $(".remodal-wrapper .panel").append(locationElements);
    }

    var checkEvents = () => {
        $.ajax({
            url: `/api/user_events/${storehubData.w.owner}`,
            contentType: "application/json",
            success: (response) => {
                parseEvents(response);
            },
            error: () => {
                console.log("Please contact your developer, the snippet failed to authenticate.")
            }
        })
    }

    var parseEvents = (events) => {

        for (var i = events.length - 1; i >= 0; i--) {
            var event = events[i];
            if (!window.localStorage[event._id]) {
                window.localStorage[event._id] = true;
                findEventLocation(event);
            }
        }
    }

    var findEventLocation = (event) => {
        for (var i = storehubData.locations.length - 1; i >= 0; i--) {
            var location = storehubData.locations[i];
            if (location.location) {
                var lat = location.location.geometry.location.lat,
                    lon = location.location.geometry.location.lng;

                var dist = calcCrow(position.latitude, position.longitude, lat, lon);

                if ((!location.useFence && dist < location.range) || inFence(location)) {
                    showEvent(event);
                }

            }
        }
    }

    var showEvent = (event) => {
        var content = $('<div/>'),
            rsvp = $(`<button class="form">Save</button>`);

        content.append('<div class="scrolldiv"> </div>')
        content.append(`<p >${event.description ? event.description : ""}</p>`)

        if (event.rsvp) {
            content.append('<p><strong>You must RSVP to attend.</strong></p>');
        }
        content.append(`<p>Add your email to get event updates.</p><input class="form" type="text" placeholder="email" /><br>`);

        content.append(rsvp);

        rsvp.click(() => {


            var data = {
                owner: storehubData.w.owner,
                email: $("input", content).val()
            }

            var removeLoader = () => {
                $(".loader", content).remove();
            }
            removeLoader();
            content.append("<p class='loader'><i class='fa fa-spin fa-cog'></i> One moment... </p>")
            $.ajax({
                url: "/api/save_email",
                type: "POST",
                data: data,
                success: () => {
                    removeLoader();
                    $(".form", content).remove();
                    content.append("<p class='loader'>Thank you, your email is saved. closing window.</p>")
                    setInterval(() => {
                        $(".remodal-close").click();
                    }, 2100);

                },
                error: () => {
                    removeLoader();
                    content.append("<p class='loader'>Error, please try again.</p>")

                }
            })
        })

        for (var i = event.images.length - 1; i >= 0; i--) {
            var image = event.images[i]
            $(".scrolldiv", content).append(`<img src="/file/${image}" />`)
        }

        var panel = StoreHubPanel(event.name, content)
        ShowModal(panel);

    }


    var inFence = (location) => {
        var polygon = [];
        if (!position) return false;

        for (var i = location.meta.geofence.length - 1; i >= 0; i--) {
            var point = location.meta.geofence[i];
            polygon.push([point.lat, point.lon]);
        }
        return inside([position.latitude, position.longitude], polygon);
    }

    var inside = (point, vs) => {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var x = point[0],
            y = point[1];

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0],
                yi = vs[i][1];
            var xj = vs[j][0],
                yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };

    var addButton = () => {

        var userStyles = `.storehub { font-family : ${theme.fontFamily};text-align:left; }.storehub p, .storehub .social , .storehub button, .storehub { color : ${theme.paragraphColor}; font-size: ${theme.paragraphSize}px; } .storehub button,.storehub .social, .storehub input { border-color: ${theme.buttonBorderColor}; border-radius: ${theme.buttonRadius}%;background-color : ${theme.buttonBackgroundColor} } .storehub-panel .header > h2 { color:${theme.headerColor};margin:0;font-size : ${theme.headerSize}px;  } .storehub .social {border:1px solid ${theme.buttonBorderColor};margin:2px;display:inline-block;width:50px;text-align:center;height:42px;font-size:30px;line-height:45px}  .storehub-panel .header {  background-color:${theme.headerBackgroundColor}; } .storehub-panel .panel { background-color : ${theme.panelBackgroundColor}; } .storehub .widget{line-height:22px;position:fixed;top:60px;right:-91px;-webkit-transition:right 1s;transition:right 1s}.storehub .widget:hover{right:-2px} .storehub-panel .list-element { text-decoration:none;display:block;max-width:400px;padding:12px } .storehub .float-column { float:left;max-width : 400px; width:50%; } .storehub iframe{width:100%;border:1px solid #333;margin-top:0;height:270px;margin-top:1.2em;} .storehub .list-element{position:absolute;margin-top:200px;display:block;width:100%;background:#333333b3;color:#fff} .storehub hr {  border: none;border-top: 1px solid #ccc;margin: 0 0 24px 0;width: 100%;} `;

        AddStyle(userStyles);


        $("head").append('<link rel="stylesheet" rel="stylesheet" type="text/css" href="/css/remodal.css" />');
        $("head").append('<link rel="stylesheet" rel="stylesheet" type="text/css" href="/css/remodal-default-theme.css" />');
        $("head").append('<link rel="stylesheet" rel="stylesheet" type="text/css" href="/css/font-awesome.min.css" />');
        LoadScript("/js/remodal.min.js");

        var btn = $('<div class="storehub"><button class="widget" > <img style="float: left;position: relative;left: -5px;" src="/img/icon.png" width="25" /> Show locations</buttton></div>');



        $("button", btn).click(() => {
            var panel = StoreHubPanel("Locations", "")
            ShowModal(panel);
            addLocations();
        });

        $("button", btn).css('display', 'none');

        $("body").append(btn);
        getLocation();
        parseProducts();
    }

    function parseProducts() {
        $(".storehub[data-type='product']").each((i, product) => {
            fetchProduct($(product).data("id"), $(product))
        })
    }

    function fetchProduct(id, tag) {
        $.ajax({
            url: `/api/user_product/${id}`,
            success: (response) => {
                buildProduct(response, tag)
            }
        })
    }

    function buildProduct(data, tag) {
        var product = $(`<div><h2>${data.name}</h2> <hr> <div class="float-column scrolldiv" style="margin-right:25px; width:calc(50% - 25px)"> </div><div class="float-column two"> <p style="line-height: 22px;"> </p></div><div style="clear:both"></div></div>`);

        for (var i = data.images.length - 1; i >= 0; i--) {
            var image = data.images[i];
            $(".float-column.scrolldiv", product).append(`<img src="/file/${image}" />`);
        }

        if (product.category)
            $(".float-column.two", product).append(` <strong>Category</strong> / ${product.category} <br>`)

        if (product.sub_category)
            $(".float-column.two", product).append(` <strong>Sub category</strong> / ${product.sub_category} <br>`)

        if (product.description) {
            $(".float-column.two", product).append(` <strong>Description</strong> / ${product.description} <br><a class="expander">View more</a>`)
        }

        $(".float-column.two", product).append(`<p class="storehub" style="margin:0;"><button class="add-wishlist">+Wishlist</button></p>`)

        tag.append(product);
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(savePosition);
        }
    }

    function savePosition(p) {
        position = p.coords;
        $(".storehub .widget").css('display', 'block');
        checkEvents();
    }


    //This function takes in latitude and longitude of two 
    // location and returns the distance between them as the crow flies (in miles)
    function calcCrow(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        return dist
    }


}




function AddStyle(style) {
    $("body").append(`<style type="text/css">${style}</style>`);
}

BuildStoreHub();