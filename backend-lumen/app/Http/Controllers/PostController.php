<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Redis;
class PostController extends Controller
{

    public function index()
    {
        $cacheKey = 'posts_cache';
        if($chached = Redis::get($cacheKey)){
            return response()->json(json_decode($chached));
        }
        $posts = Post::with('user')->get();
        Redis::set($cacheKey, $posts->toJson());
        Redis::expire($cacheKey, 60); 

        return response()->json($posts);
    }

    public function show($id)
    {
        $cacheKey = "post_{$id}";
        if($chached = Redis::get($cacheKey)){
            return response()->json(json_decode($chached));
        }
        $post = Post::with('user')->findOrFail($id);
        Redis::set($cacheKey, $post->toJson());
        Redis::expire($cacheKey, 60);

        return response()->json($post);
    }

    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $post = $user->posts()->create([
            'title'   => $request->title,
            'content' => $request->content,
        ]);

        Redis::del('posts_cache');
        
        return response()->json($post, 201);
    }
}
