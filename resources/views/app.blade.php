<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Inoma Doc.</title>
        <link rel="icon" href={{asset('favicon.ico')}} type="image/x-icon">
        <link rel="shortcut icon" href={{asset('favicon.ico')}} type="image/x-icon">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,900" rel="stylesheet" type="text/css">
        <!-- Styles / Scripts -->
        <link href="{{ mix('css/main.css') }}" rel="stylesheet">
        <link href="{{ mix('css/home.css') }}" rel="stylesheet">

    </head>
    <body>
        <div id="root"></div>
        <script src="{{ mix('js/app.js') }}" defer></script>
    </body>
</html>
