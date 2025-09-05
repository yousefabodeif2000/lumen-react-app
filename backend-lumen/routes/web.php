<?php

$router->post('/api/register', 'AuthController@register');
$router->post('/api/login', 'AuthController@login');

$router->group(['middleware' => 'auth:api'], function () use ($router) {
    $router->get('/api/posts', 'PostController@index');
    $router->get('/api/posts/{id}', 'PostController@show');
    $router->post('/api/posts', 'PostController@store');
});
$router->get('/redis-test', function () {
    try {
        \Illuminate\Support\Facades\Redis::set('foo', 'bar');
        $val = \Illuminate\Support\Facades\Redis::get('foo');
        return response()->json(['set' => 'foo=bar', 'get' => $val]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});





