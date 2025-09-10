<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTGuard;

class AuthServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }
    /**
     * Bootstrap any application authentication services.
     *
     * This method extends the authentication system by registering
     * a custom "jwt" guard. The guard uses the Tymon JWT library
     * for handling token-based authentication.
     *
     * @return void
     */
    public function boot()
    {
        Auth::extend('jwt', function ($app, $name, array $config) {
            return new JWTGuard(
                $app['tymon.jwt'],
                $app['auth']->createUserProvider($config['provider']),
                $app['request']
            );
        });
    }
}
