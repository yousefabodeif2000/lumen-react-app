<?php 
namespace Tests\Feature; 
use Laravel\Lumen\Testing\DatabaseMigrations; 
use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\Redis;

class PostsTest extends TestCase 
{ 
   use DatabaseMigrations;

    /** @test */
    public function it_can_fetch_all_posts()
    {
        // Arrange: create a user and some posts
        $user = User::create([
            'name' => 'Tester',
            'email' => 'test@example.com',
            'password' => app('hash')->make('secret'),
        ]);

        Post::create([
            'user_id' => $user->id,
            'title'   => 'Post 1',
            'content' => 'Content 1',
        ]);

       Post::create([
            'user_id' => $user->id,
            'title'   => 'Post 2',
            'content' => 'Content 2',
        ]);

        // Act: generate JWT token and make GET request
        $token = app('auth')->attempt([
            'email' => $user->email,
            'password' => 'secret'
        ]);

        $this->get('/api/posts', ['Authorization' => "Bearer $token"])
            ->seeStatusCode(200)
            ->seeJsonStructure([
                '*' => ['id', 'title', 'content', 'user_id', 'created_at', 'updated_at']
            ]);
    }
      /** @test */
    public function authenticated_user_can_create_a_post()
    {
        // Arrange: create a user
        $user = User::create([
            'name' => 'Tester',
            'email' => 'test@example.com',
            'password' => app('hash')->make('secret'),
        ]);

        // Generate JWT token
        $token = app('auth')->attempt([
            'email' => $user->email,
            'password' => 'secret'
        ]);

        // Optionally mock Redis so test doesn't depend on running Redis
        Redis::shouldReceive('del')->once();

        // Act: make POST request to create a post
        $this->post('/api/posts', [
            'title' => 'My First Post',
            'content' => 'This is a test post content.'
        ], ['Authorization' => "Bearer $token"])
        ->seeStatusCode(201)
        ->seeJsonStructure([
            'id', 'title', 'content', 'user_id', 'created_at', 'updated_at'
        ]);

        // Assert the post is actually in the database
        $this->seeInDatabase('posts', [
            'title' => 'My First Post',
            'user_id' => $user->id
        ]);
    }
     /** @test */
    public function authenticated_user_can_fetch_post_by_id()
    {
        // Arrange: create a user
        $user = User::create([
            'name' => 'Tester',
            'email' => 'test@example.com',
            'password' => app('hash')->make('secret'),
        ]);

        // Create a post for that user
        $post = Post::create([
            'user_id' => $user->id,
            'title' => 'Test Post',
            'content' => 'Content of the test post',
        ]);

        // Generate JWT token
        $token = app('auth')->attempt([
            'email' => $user->email,
            'password' => 'secret'
        ]);

        // Act: make GET request to /api/posts/{id}
        $this->get("/api/posts/{$post->id}", [
            'Authorization' => "Bearer $token"
        ])
        ->seeStatusCode(200)
        ->seeJsonStructure([
            'id', 'title', 'content', 'user_id', 'created_at', 'updated_at'
        ])
        ->seeJson([
            'id' => $post->id,
            'title' => 'Test Post',
            'content' => 'Content of the test post',
            'user_id' => $user->id
        ]);
    }

}