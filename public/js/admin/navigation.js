function BuildNav(apps) {

    var menu = [{
            id: '#/',
            value: 'Home',
            icon: 'glyphicon glyphicon-home',
            action: 'click',
            disable: false
        },
        {
            id: '',
            value: 'Locations',
            icon: 'glyphicon glyphicon-flag',
            action: 'click',
            aid: 'gm',
            disable: false,
            submenu: [
                { id: '#/new/locations', value: 'Add new location', action: 'click' },
                { id: '#/list/locations', value: 'Manage locations', show: true, action: 'click' }
            ]
        },
        {
            id: '',
            value: 'Shoppable images',
            icon: 'glyphicon glyphicon-tags',
            action: 'click',
            aid: 'spl',
            disable: false,
            submenu: [
                { id: '#/new/images', value: 'Add new image', action: 'click' },
                { id: '#/list/images', value: 'Manage images', show: true, action: 'click' }
            ]
        },
        {
            id: '',
            value: 'Products',
            icon: 'glyphicon glyphicon-barcode',
            action: 'click',
            aid: "cme",
            disable: false,
            submenu: [
                { id: '#/new/products', value: 'Add new Product', action: 'click' },
                { id: '#/list/products', value: 'Manage products', show: true, action: 'click' }
            ]
        },
        {
            id: '',
            value: 'Retail events',
            icon: 'glyphicon glyphicon-calendar',
            action: 'click',
            aid: "re",
            disable: false,
            submenu: [
                { id: '#/new/events', value: 'Add new event', action: 'click' },
                { id: '#/list/events', value: 'Manage events', show: true, action: 'click' }
            ]
        },
        {
            id: '',
            value: 'Websites',
            icon: 'glyphicon glyphicon-globe',
            action: 'click',
            disable: false,
            submenu: [
                { id: '#/new/apis', value: 'Add new website', action: 'click' },
                { id: '#/list/apis', value: 'Manage websites', show: true, action: 'click' }
            ]
        },
        {
            id: '#/apps',
            value: 'Apps',
            icon: 'glyphicon glyphicon-cloud',
            action: 'click',
            disable: false
        },
        {
            id: '',
            value: 'Settings',
            icon: 'glyphicon glyphicon-cog',
            show: true,
            submenu: [
                { id: '#/themes', value: 'Colors', action: 'click' },
                { id: '#/stripe_settings', value: 'Merchant settings', show: true, action: 'click' },
                { id: '#/mailchimp', value: 'Mailchimp', show: true, action: 'click' },
                { id: '#/help', value: 'Help', show: true, action: 'click' }
            ]
        }
    ]

    for (var i = menu.length - 1; i >= 0; i--) {
        var item = menu[i];
        if (item.aid && apps.indexOf(item.aid) == -1) {
            menu.splice(i, 1);
        }
    }

    var json = {
        brand: 'Menu UI',
        menu: menu

    };
    var clickAction = function(id) {
        console.log(id);
        if (id == "") return;
        window.location = id;
        $(".nav-open").removeClass("nav-open");
    }
    $("#menuUI").menuUI(json, clickAction);

    var width = parseInt($("html").css("width"));

    if (width <= 768) {
        var menu = $("#menuUI .nav.navbar-nav");
        $("#menuUI .nav.navbar-nav").appendTo($(".nav-bar .menu").parent())
        $(".nav-bar a[id]").click((e) => {

            e.preventDefault();
            clickAction ( $(e.target).attr("id"));

        })
    }

}