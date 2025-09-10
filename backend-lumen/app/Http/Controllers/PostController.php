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
    public function destroy($id)
    {
        // Authenticate user
        $user = JWTAuth::parseToken()->authenticate();

        // Find the post
        $post = Post::findOrFail($id);

        // Check if user has permission
        if (!$user->hasPermission('delete_post')) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // Optional: allow only the author or admin to delete
        if ($post->user_id !== $user->id && !$user->hasPermission('admin_delete_post')) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // Delete the post
        $post->delete();

        // Clear relevant caches
        Redis::del('posts_cache');       // invalidate list cache
        Redis::del("post_{$id}");       // invalidate single post cache

        return response()->json(['message' => 'Post deleted successfully']);
    }

}
