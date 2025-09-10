<?php
/**
 * Application Routes
 *
 * Defines all API endpoints for authentication, posts, admin management,
 * and utility routes such as health checks and Redis testing.
 *
 * Routes are grouped and protected with middleware for authentication (JWT)
 * and role/permission checks.
 *
 * Narrated by Yousef Abo Deif
 */

//health check endpoint for debug
$router->get('/api/health', function () use ($router) {
    return response()->json(['status' => 'ok']);
});



//authentication
$router->post('/api/register', 'AuthController@register');
$router->post('/api/login', 'AuthController@login');

// Post viewing (requires authentication)
$router->group(['middleware' => 'auth:api'], function () use ($router) {
    $router->get('/api/posts', 'PostController@index');
    $router->get('/api/posts/{id}', 'PostController@show');
});

// Only users with 'create_post' permission can create posts
$router->post('/api/posts', [
    'middleware' => ['auth:api', 'permission:create_post'],
    'uses' => 'PostController@store'
]);

// Only users with 'delete_post' permission can delete posts
$router->delete('/api/posts/{id}', [
    'middleware' => ['auth:api', 'permission:delete_post'],
    'uses' => 'PostController@destroy'
]);

// Admin-only routes (requires "admin_access" permission)
$router->group(['middleware' => ['auth:api', 'permission:admin_access']], function () use ($router) {

    // User management
    $router->get('/admin/users', 'AdminController@users');
    $router->post('/admin/users/{userId}/assign-role', 'AdminController@assignRole');
    $router->post('/admin/users/{userId}/remove-role', 'AdminController@removeRole');

    // Role & permission management
    $router->get('/admin/roles', 'AdminController@roles');
    $router->post('/admin/roles/{roleId}/assign-permission', 'AdminController@assignPermission');
    $router->post('/admin/roles/{roleId}/remove-permission', 'AdminController@removePermission');
});

//redis test endpoint
$router->get('/redis-test', function () {
    try {
        \Illuminate\Support\Facades\Redis::set('foo', 'bar');
        $val = \Illuminate\Support\Facades\Redis::get('foo');
        return response()->json(['set' => 'foo=bar', 'get' => $val]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});





