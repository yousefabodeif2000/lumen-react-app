<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class FirstUserSeeder extends Seeder
{
    public function run()
    {
        // Find the first user
        $user = User::find(1);

        if (!$user) {
            return; // no user found
        }

        // Assign the "admin" role (which has all permissions)
        $adminRole = Role::where('name', 'admin')->first();
        $user->roles()->syncWithoutDetaching([$adminRole->id]);
    }
}
