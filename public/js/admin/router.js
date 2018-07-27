app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/dashboard.html',
            controller: 'Dashboard'
        })
        .when('/new/:type', {
            templateUrl: '/templates/new.html',
            controller: 'NewResource'
        })
        .when('/list/:type', {
            templateUrl: '/templates/list.html',
            controller: 'List'
        })
        .when('/locations/:ID', {
            templateUrl: '/templates/edit_location.html',
            controller: 'locations'
        })
        .when('/images/:ID', {
            templateUrl: '/templates/edit_image.html',
            controller: 'images'
        })
        .when('/products/:ID', {
            templateUrl: '/templates/edit_product.html',
            controller: 'products'
        })
        .when('/events/:ID', {
            templateUrl: '/templates/edit_event.html',
            controller: 'events'
        })
        .when('/websites/:ID', {
            templateUrl: '/templates/edit_website.html',
            controller: 'websites'
        })
        .when('/apps', {
            templateUrl: '/templates/apps.html',
            controller: 'apps'
        })
        .when('/stripe_settings', {
            templateUrl: '/templates/merchant.html',
            controller: 'stripe_controller'
        })
        .when('/mailchimp', {
            templateUrl: '/templates/mailchimp.html',
            controller: 'mailchimp'
        })
        .when('/help', {
            templateUrl: '/templates/help.html'
        })
        .when('/themes', {
            templateUrl: '/templates/themes.html',
            controller: 'themes'
        })


        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.hashPrefix('');

});