<?php

namespace Tests\Feature;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;
use App\Models\User;

class AuthTest extends TestCase
{
    use DatabaseMigrations;

    protected int $randomNumber;

    protected function setUp(): void
    {
        parent::setUp();
        $this->randomNumber = random_int(1000, 5000);
    }

    /** @test */
    public function it_can_register_a_user()
    {
        $this->post('/api/register', [
            'name' => 'TestUser' . $this->randomNumber,
            'email' => 'test' . $this->randomNumber . '@example.com',
            'password' => 'secret',
        ])
        ->seeStatusCode(201)
        ->seeJsonStructure(['id', 'name', 'email']);
    }

    /** @test */
    public function it_can_login_with_valid_credentials()
    {
        User::create([
            'name' => 'TestUser' . $this->randomNumber,
            'email' => 'test' . $this->randomNumber . '@example.com',
            'password' => app('hash')->make('secret'),
        ]);

        $this->post('/api/login', [
            'email' => 'test' . $this->randomNumber . '@example.com',
            'password' => 'secret',
        ])
        ->seeStatusCode(200)
        ->seeJsonStructure(['token', 'user']);
    }

    /** @test */
    public function it_cannot_login_with_invalid_credentials()
    {
        $this->post('/api/login', [
            'email' => 'fake@example.com',
            'password' => 'wrongpassword',
        ])
        ->seeStatusCode(401)
        ->seeJsonContains(['error' => 'Invalid Credentials']);
    }

    /** @test */
    public function it_requires_authentication_to_access_posts()
    {
        $this->get('/api/posts')
            ->seeStatusCode(401)
            ->seeJsonContains(['error' => 'Unauthorized']);
    }
}
