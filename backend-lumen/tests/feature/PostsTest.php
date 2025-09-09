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

    protected int $randomNumber;

    protected function setUp(): void
    {
        parent::setUp();

        $this->randomNumber = random_int(1000, 9999);

        // Mock Redis globally so tests don’t fail in CI
        Redis::shouldReceive('get')->andReturn(null);
        Redis::shouldReceive('set')->andReturn(true);
        Redis::shouldReceive('expire')->andReturn(true);
        Redis::shouldReceive('del')->andReturn(true);
    }

    /** @test */
    public function it_can_fetch_all_posts()
    {
        $user = User::create([
            'name' => 'Tester' . $this->randomNumber,
            'email' => 'test' . $this->randomNumber . '@example.com',
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

        $token = app('auth')->attempt([
            'email' => $user->email,
            'password' => 'secret'
        ]);
        $this->assertNotFalse($token, "JWT token generation failed");

        $this->get('/api/posts', ['Authorization' => "Bearer $token"])
            ->seeStatusCode(200)
            ->seeJsonStructure([
                '*' => ['id', 'title', 'content', 'user_id', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function authenticated_user_can_create_a_post()
    {
        $user = User::create([
            'name' => 'Tester'. $this->randomNumber,
            'email' => 'test' . $this->randomNumber . '@example.com',
            'password' => app('hash')->make('secret'),
        ]);

        $token = app('auth')->attempt([
            'email' => $user->email,
            'password' => 'secret'
        ]);
        $this->assertNotFalse($token, "JWT token generation failed");

        $this->post('/api/posts', [
            'title' => 'My First Post',
            'content' => 'This is a test post content.'
        ], ['Authorization' => "Bearer $token"])
        ->seeStatusCode(201)
        ->seeJsonStructure([
            'id', 'title', 'content', 'user_id', 'created_at', 'updated_at'
        ]);

        $this->seeInDatabase('posts', [
            'title' => 'My First Post',
            'user_id' => $user->id
        ]);
    }

    /** @test */
    public function authenticated_user_can_fetch_post_by_id()
    {
        $user = User::create([
            'name' => 'Tester'. $this->randomNumber,
            'email' => 'test' . $this->randomNumber . '@example.com',
            'password' => app('hash')->make('secret'),
        ]);

        $post = Post::create([
            'user_id' => $user->id,
            'title' => 'Test Post',
            'content' => 'Content of the test post',
        ]);

        $token = app('auth')->attempt([
            'email' => $user->email,
            'password' => 'secret'
        ]);
        $this->assertNotFalse($token, "JWT token generation failed");

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
