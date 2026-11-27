<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/media/{path}', function (string $path) {
    $basePath = realpath(storage_path('app/public'));
    $fullPath = $basePath !== false ? realpath($basePath . DIRECTORY_SEPARATOR . $path) : false;

    if (
        $basePath === false
        || $fullPath === false
        || ! str_starts_with($fullPath, $basePath . DIRECTORY_SEPARATOR)
        || ! is_file($fullPath)
    ) {
        abort(404);
    }

    return response()->file($fullPath);
})->where('path', '.*');
