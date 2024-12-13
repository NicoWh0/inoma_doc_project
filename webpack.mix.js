const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/react/app.js', 'public/js').react()
    .postCss('resources/css/main.css', 'public/css', [
        require("tailwindcss"),
    ])
    .postCss('resources/css/home.css', 'public/css', [
        require("tailwindcss"),
    ])
    .postCss('resources/css/login.css', 'public/css', [
        require("tailwindcss"),
    ])
    .postCss('resources/css/registration.css', 'public/css', [
        require("tailwindcss"),
    ])
    .postCss('resources/css/email-verify-notice.css', 'public/css', [
        require("tailwindcss"),
    ])
    .postCss('resources/css/notfound.css', 'public/css', [
        require("tailwindcss"),
    ])
    .postCss('resources/css/profile.css', 'public/css', [
        require("tailwindcss"),
    ])
    .postCss('resources/css/page2fa.css', 'public/css', [
        require("tailwindcss"),
    ])
