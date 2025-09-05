<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class PostController extends Controller
{
    public function index()
    {
        return response()->json(Post::with('user')->get());
    }

    public function show($id)
    {
        return response()->json(Post::with('user')->findOrFail($id));
    }

    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $post = $user->posts()->create([
            'title'   => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($post, 201);
    }
}
