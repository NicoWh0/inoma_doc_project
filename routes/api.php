<?php

use App\Http\Controllers\CategoryController;

Route::get('/categories',  [CategoryController::class, 'getAll']);





