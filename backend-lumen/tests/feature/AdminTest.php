<?php

namespace Tests\Feature;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;

class AdminTest extends TestCase
{
    use DatabaseMigrations;

    protected $admin;
    protected $token;
    protected $rand;

    protected function setUp(): void
    {
        parent::setUp();

        $this->rand = random_int(1000, 9999);

        $this->admin = User::create([
            'name' => 'Admin' . $this->rand,
            'email' => "admin{$this->rand}@example.com",
            'password' => app('hash')->make('secret'),
        ]);

        $adminAccess = Permission::firstOrCreate(['name' => 'admin_access']);

        $role = Role::create(['name' => 'admin_' . $this->rand]);
        $role->permissions()->attach($adminAccess->id);

        $this->admin->roles()->attach($role->id);

        $this->token = app('auth')->attempt([
            'email' => "admin{$this->rand}@example.com",
            'password' => 'secret'
        ]);
    }

    /** @test */
    public function admin_can_assign_role_to_user()
    {
        $user = User::create([
            'name' => 'Target' . $this->rand,
            'email' => "target{$this->rand}@example.com",
            'password' => app('hash')->make('secret'),
        ]);

        $role = Role::create(['name' => 'editor_' . $this->rand]);

        $this->post("/admin/users/{$user->id}/assign-role", [
            'role' => $role->name, 
        ], ['Authorization' => "Bearer {$this->token}"])
            ->seeStatusCode(200)
            ->seeJsonContains(['message' => "Role '{$role->name}' assigned to user '{$user->name}'"]);
    }

    /** @test */
    public function admin_can_remove_role_from_user()
    {
        $user = User::create([
            'name' => 'Target' . $this->rand,
            'email' => "target{$this->rand}@example.com",
            'password' => app('hash')->make('secret'),
        ]);

        $role = Role::create(['name' => 'editor_' . $this->rand]);
        $user->roles()->attach($role->id);

        $this->post("/admin/users/{$user->id}/remove-role", [
            'role' => $role->name, 
        ], ['Authorization' => "Bearer {$this->token}"])
            ->seeStatusCode(200)
            ->seeJsonContains(['message' => "Role '{$role->name}' removed from user '{$user->name}'"]);
    }

    /** @test */
    public function admin_can_assign_permission_to_role()
    {
        $role = Role::create(['name' => 'moderator_' . $this->rand]);
        $perm = Permission::create(['name' => 'test_perm_' . $this->rand]);

        $this->post("/admin/roles/{$role->id}/assign-permission", [
            'permission' => $perm->name, 
        ], ['Authorization' => "Bearer {$this->token}"])
            ->seeStatusCode(200)
            ->seeJsonContains(['message' => "Permission '{$perm->name}' assigned to role '{$role->name}'"]);
    }

    /** @test */
    public function admin_can_remove_permission_from_role()
    {
        $role = Role::create(['name' => 'moderator_' . $this->rand]);
        $perm = Permission::create(['name' => 'test_perm_' . $this->rand]);
        $role->permissions()->attach($perm->id);

        $this->post("/admin/roles/{$role->id}/remove-permission", [
            'permission' => $perm->name, 
        ], ['Authorization' => "Bearer {$this->token}"])
            ->seeStatusCode(200)
            ->seeJsonContains(['message' => "Permission '{$perm->name}' removed from role '{$role->name}'"]);
    }
}
