$(document).ready(function() {
    var json = {
        brand: 'Menu UI',
        menu: [{
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
                disable: false,
                submenu: [
                    { id: '#/new/products', value: 'Add new Product', action: 'click' },
                    { id: '#/list/products', value: 'Manage products', show: true, action: 'click' }
                ]
            },
            {
                id: '',
                value: 'Events',
                icon: 'glyphicon glyphicon-calendar',
                action: 'click',
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
                id: '',
                value: 'Settings',
                icon: 'glyphicon glyphicon-cog',
                show: true,
                submenu: [
                    { id: '#/apps', value: 'Apps', action: 'click' },
                    { id: '#/users', value: 'Users', action: 'click' },
                    { id: '#/stripe_settings', value: 'Merchant settings', show: true, action: 'click' },
                    { id: '#/help', value: 'Help', show: true, action: 'click' }
                ]
            }
        ]
    };
    var clickAction = function(id) {
        if (id == "") return;

        window.location = id;
    }
    $("#menuUI").menuUI(json, clickAction);
});