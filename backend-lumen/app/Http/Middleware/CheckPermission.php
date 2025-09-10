<?php
/**
 * CheckPermission Middleware
 *
 * Ensures that an authenticated user has the required permission
 * to access a given route. Supports role-based permissions and
 * includes an optional admin bypass.
 * Narrated by Yousef Abo Deif
 */
namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * Authenticates the user via JWT, loads their roles and permissions,
     * and checks if they have the required permission to proceed.
     * If the user has the "admin" role, bypasses permission checks.
     * Returns a 403 Forbidden if the user lacks permission,
     * or 401 Unauthorized if authentication fails.
     *
     * @param Request $request The incoming HTTP request
     * @param Closure $next The next middleware or controller
     * @param string $permission The required permission for the route
     * @return mixed The next request handler or a JSON error response
     */
    public function handle($request, Closure $next, $permission)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $user->load('roles.permissions');
            
            // Debug: check roles and permissions
            Log::info('User roles: ' . $user->roles->pluck('name'));
            Log::info('User permissions: ' . $user->roles->flatMap->permissions->pluck('name'));

            if ($user->roles->contains('name', 'admin')) {
                return $next($request);
            }

            if (!$user->hasPermission($permission)) {
                return response()->json(['error' => 'Forbidden'], 403);
            }

        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
