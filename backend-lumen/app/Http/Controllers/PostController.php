<?php
/**
 * PostController
 *
 * Handles post management including caching, retrieval, creation, and deletion.
 * Uses Redis for caching and JWT for authentication.
 * Narrated by Yousef Abo Deif
 */
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Redis;
class PostController extends Controller
{
    /**
     * Get a list of all posts with caching.
     *
     * Checks Redis for a cached list of posts. If not found,
     * retrieves posts from the database, caches them for 60 seconds,
     * and returns them as JSON.
     *
     * @return ResponseFactory JSON response containing all posts
     */
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

     /**
     * Get a single post by ID with caching.
     *
     * Checks Redis for a cached post. If not found,
     * retrieves the post from the database, caches it for 60 seconds,
     * and returns it as JSON.
     *
     * @param int $id The ID of the post to retrieve
     * @return ResponseFactory JSON response containing the post
     */
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

    /**
     * Create a new post for the authenticated user.
     *
     * Authenticates the user using JWT, then creates a new post
     * associated with that user. Clears the posts cache.
     *
     * @param Request $request HTTP request containing post data (title, content)
     * @return ResponseFactory JSON response with the created post
     */
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

    /**
     * Delete a post by ID if the user has the required permission.
     *
     * Authenticates the user with JWT, checks if they have the
     * `delete_post` permission (or are an admin with `admin_delete_post`),
     * and deletes the post if authorized. Clears related caches.
     *
     * @param int $id The ID of the post to delete
     * @return ResponseFactory JSON response confirming deletion or error
     */
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
