<?php
/**
 * AuthController
 *
 * Handles user registration and authentication.
 * Narrated by Yousef Abo Deif
 */

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * Creates a new user record with hashed password and returns
     * the user object as a JSON response.
     *
     * @param Request $request HTTP request containing user details (name, email, password)
     * @return ResponseFactory JSON response with the created user
     */
    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        return response()->json($user, 201);
    }
    /**
     * Authenticate a user and return a JWT token.
     *
     * Attempts to log in a user using the provided credentials.
     * If successful, returns a JWT token and the authenticated user.
     * If authentication fails, returns an error response.
     *
     * @param Request $request HTTP request containing login credentials (email, password)
     * @return ResponseFactory JSON response with JWT token and user data, or error message
     */
    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid Credentials'], 401);
        }

        $user = auth()->user();
        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

}
