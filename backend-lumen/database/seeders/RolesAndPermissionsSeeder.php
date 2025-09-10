<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Create roles
        $admin = Role::create(['name' => 'admin']);
        $editor = Role::create(['name' => 'editor']);
        $user = Role::create(['name' => 'user']);

        // Create permissions
        $createPost = Permission::create(['name' => 'create_post']);
        $editPost = Permission::create(['name' => 'edit_post']);
        $deletePost = Permission::create(['name' => 'delete_post']);
        $viewPost = Permission::create(['name' => 'view_post']);

        // Assign permissions to roles
        $admin->permissions()->sync([$createPost->id, $editPost->id, $deletePost->id, $viewPost->id]);
        $editor->permissions()->sync([$createPost->id, $editPost->id, $viewPost->id]);
        $user->permissions()->sync([$viewPost->id]);
    }
}
