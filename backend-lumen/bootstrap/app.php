<?php

/**
 * Lumen Application Bootstrap
 *
 * This file bootstraps the Lumen application:
 * - Loads environment variables
 * - Sets the default timezone
 * - Creates the Lumen application instance
 * - Registers essential service providers (JWTAuth, Redis, Validation, Tinker, etc.)
 * - Configures facades, Eloquent, and application configs
 * - Registers middleware and route groups
 *
 * Narrated by Yousef Abo Deif
 */

require_once __DIR__.'/../vendor/autoload.php';

(new Laravel\Lumen\Bootstrap\LoadEnvironmentVariables(
    dirname(__DIR__),
    '.env.local' 
))->bootstrap();

date_default_timezone_set(env('APP_TIMEZONE', 'UTC'));

$app = new Laravel\Lumen\Application(
    dirname(__DIR__)
);


$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->withFacades();
$app->withEloquent();

$app->configure('app');
$app->configure('auth');

$app->register(\Tymon\JWTAuth\Providers\LumenServiceProvider::class);
$app->register(App\Providers\AuthServiceProvider::class);
$app->register(\Illuminate\Redis\RedisServiceProvider::class);
$app->register(Illuminate\Validation\ValidationServiceProvider::class);
$app->register(Laravel\Tinker\TinkerServiceProvider::class);


$app->routeMiddleware([
    'auth' => App\Http\Middleware\Authenticate::class,
    'permission' => App\Http\Middleware\CheckPermission::class,
]);

$app->router->group([
    'namespace' => 'App\Http\Controllers',
], function ($router) {
    require __DIR__.'/../routes/web.php';
});


return $app;
