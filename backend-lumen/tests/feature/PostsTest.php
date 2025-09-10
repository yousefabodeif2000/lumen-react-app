<?php

namespace Tests\Feature;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use App\Models\Role;
use App\Models\Permission;
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

    protected function makeUserWithPermission(string $permissionName): array
    {
        $user = User::create([
            'name' => 'Tester' . $this->randomNumber,
            'email' => 'test' . $this->randomNumber . '@example.com',
            'password' => app('hash')->make('secret'),
        ]);

        $role = Role::firstOrCreate(['name' => 'test-role']);
        $permission = Permission::firstOrCreate(['name' => $permissionName]);

        // make sure relation syncs properly
        $role->permissions()->sync([$permission->id]);
        $user->roles()->sync([$role->id]);

        $token = app('auth')->attempt([
            'email' => $user->email,
            'password' => 'secret'
        ]);

        $this->assertNotFalse($token, "JWT token generation failed");

        return [$user, $token];
    }

    /** @test */
    public function authenticated_user_with_permission_can_create_a_post()
    {
        [$user, $token] = $this->makeUserWithPermission('create_post');

        $this->post('/api/posts', [
            'title' => 'My First Post',
            'content' => 'This is a test post content.'
        ], ['Authorization' => "Bearer $token"])
        ->seeStatusCode(201)
        ->seeJsonStructure([
            'id', 'title', 'content', 'user_id', 'created_at', 'updated_at'
        ]);
    }

    /** @test */
    public function user_without_permission_cannot_create_post()
    {
        [$user, $token] = $this->makeUserWithPermission('view_post'); // no create

        $this->post('/api/posts', [
            'title' => 'Forbidden Post',
            'content' => 'This should not be created',
        ], ['Authorization' => "Bearer $token"])
        ->seeStatusCode(403);
    }

    /** @test */
    public function it_returns_404_for_non_existent_post()
    {
        [$user, $token] = $this->makeUserWithPermission('view_post');

        $this->get('/api/posts/99999', ['Authorization' => "Bearer $token"])
            ->seeStatusCode(404); // no JSON expected, handled by Lumen automatically
    }

    /** @test */
    public function user_with_permission_can_delete_post()
    {
        [$user, $token] = $this->makeUserWithPermission('delete_post');

        $post = Post::create([
            'user_id' => $user->id,
            'title' => 'Delete Me',
            'content' => 'Will be deleted',
        ]);

        $this->delete("/api/posts/{$post->id}", [], ['Authorization' => "Bearer $token"])
            ->seeStatusCode(200)
            ->seeJsonContains(['message' => 'Post deleted successfully']);

        $this->notSeeInDatabase('posts', ['id' => $post->id]);
    }

    /** @test */
    public function user_without_permission_cannot_delete_post()
    {
        [$user, $token] = $this->makeUserWithPermission('view_post'); // no delete

        $post = Post::create([
            'user_id' => $user->id,
            'title' => 'Keep Me',
            'content' => 'Should not be deleted',
        ]);

        $this->delete("/api/posts/{$post->id}", [], ['Authorization' => "Bearer $token"])
            ->seeStatusCode(403);

        $this->seeInDatabase('posts', ['id' => $post->id]);
    }
}
