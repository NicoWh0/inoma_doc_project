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
    ]);