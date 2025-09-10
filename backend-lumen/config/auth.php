<?php
/**
 * Authentication Configuration
 *
 * This file defines authentication settings for the application:
 *
 * - **defaults**: sets the default guard ("api") and password reset provider ("users").
 * - **guards**: defines available guards (session-based "web" and JWT-based "api").
 * - **providers**: configures how users are retrieved (Eloquent User model).
 * - **passwords**: defines password reset providers (for users in this case).
 *
 * Narrated by Yousef Abo Deif
 */

return [

    'defaults' => [
        'guard' => 'api',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [  
            'driver' => 'session',
            'provider' => 'users',
        ],
        'api' => [
            'driver' => 'jwt',
            'provider' => 'users',
            'hash' => false,
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
        ],
    ],

];
