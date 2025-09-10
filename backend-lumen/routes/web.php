<?php

$router->get('/api/health', function () use ($router) {
    return response()->json(['status' => 'ok']);
});





$router->post('/api/register', 'AuthController@register');
$router->post('/api/login', 'AuthController@login');
$router->delete('/api/posts/{id}', [
    'middleware' => 'permission:delete_post',
    'uses' => 'PostController@destroy'
]);

$router->group(['middleware' => 'auth:api'], function () use ($router) {
    
    // Anyone authenticated can view posts
    $router->get('/api/posts', 'PostController@index');
    $router->get('/api/posts/{id}', 'PostController@show');

    // Only users with 'create_post' permission can create posts
    $router->post('/api/posts', [
        'middleware' => 'permission:create_post',
        'uses' => 'PostController@store'
    ]);

    // Example: Only users with 'delete_post' permission can delete posts
    $router->delete('/api/posts/{id}', [
        'middleware' => 'permission:delete_post',
        'uses' => 'PostController@destroy'
    ]);

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





