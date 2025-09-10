<?php

namespace App\Http\Middleware;

use Closure;

class CheckPermission {
    public function handle($request, Closure $next, $permission)
    {
        $user = app('auth')->user();

        if (!$user || !$user->hasPermission($permission)) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
