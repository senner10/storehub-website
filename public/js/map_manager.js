function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


new Maplace({
    show_markers: true,
    locations: [{
        lat: parseFloat(getUrlParameter("lat")),
        lon: parseFloat(getUrlParameter("lon")),
        zoom: 8
    }]
}).Load();