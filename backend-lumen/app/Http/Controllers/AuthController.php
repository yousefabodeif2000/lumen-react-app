<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        return response()->json($user, 201);
    }

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
