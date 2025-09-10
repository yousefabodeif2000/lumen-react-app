<?php
/**
 * RolesAndPermissionsSeeder
 *
 * Seeds the database with:
 * - Default permissions (create, edit, delete, view posts)
 * - Default roles (admin, editor, user)
 * - Assigns permissions to roles
 * - Creates sample users (admin, editor, regular user) and assigns roles
 *
 * This provides a ready-to-use Role-Based Access Control (RBAC) structure.
 *
 * Narrated by Yousef Abo Deif
 */
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Create permissions
        $permissions = ['create_post', 'edit_post', 'delete_post', 'view_post'];
        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        //Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $editorRole = Role::firstOrCreate(['name' => 'editor']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // assign permissions to roles
        $adminRole->permissions()->sync(Permission::pluck('id')); // all permissions
        $editorRole->permissions()->sync(
            Permission::whereIn('name', ['create_post', 'edit_post', 'view_post', 'delete_post'])->pluck('id')
        );
        $userRole->permissions()->sync(
            Permission::where('name', 'view_post', 'create_post')->pluck('id')
        );

        //Create admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'password' => Hash::make('password')]
        );
        $adminUser->roles()->syncWithoutDetaching([$adminRole->id]);

        //Create editor user
        $editorUser = User::firstOrCreate(
            ['email' => 'editor@example.com'],
            ['name' => 'Editor', 'password' => Hash::make('password')]
        );
        $editorUser->roles()->syncWithoutDetaching([$editorRole->id]);

        //Create regular user
        $normalUser = User::firstOrCreate(
            ['email' => 'user@test.com'],
            ['name' => 'User', 'password' => Hash::make('password')]
        );
        $normalUser->roles()->syncWithoutDetaching([$userRole->id]);
    }
}
