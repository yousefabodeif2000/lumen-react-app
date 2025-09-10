<?php
/**
 * Authenticate Middleware
 *
 * Ensures that incoming requests are authenticated using the specified guard.
 * Returns a 401 Unauthorized response if no user is authenticated.
 * Narrated by Yousef Abo Deif
 */
namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;

class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var Factory
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param Factory $auth The authentication factory
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * Checks if the request is authenticated with the specified guard.
     * If not authenticated, returns a 401 Unauthorized response.
     *
     * @param Request $request The incoming HTTP request
     * @param Closure $next The next middleware or controller
     * @param string|null $guard The authentication guard to check (optional)
     * @return mixed The next request handler or a JSON unauthorized response
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if ($this->auth->guard($guard)->guest()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
