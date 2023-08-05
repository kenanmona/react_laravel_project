<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user_list = Permission::create(['name' => 'skills.list']);
        $user_view = Permission::create(['name' => 'skills.view']);
        $user_create = Permission::create(['name' => 'skills.create']);
        $user_update = Permission::create(['name' => 'skills.update']);
        $user_delete = Permission::create(['name' => 'skills.delete']);

        $admin_role = Role::create(['name' => 'admin']);
        $admin_role->givePermissionTo([
            $user_create,
            $user_list,
            $user_view,
            $user_update,
            $user_delete,
        ]);

        $admin = User::create([
            'name' => 'Kenan',
            'email' => 'kenanmona90@gmail.com',
            'profile_image' => 'images/1664994460_logo.jpg',
            'password' => Hash::make("zzzzzz"),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole($admin_role);
        $admin->givePermissionTo([
            $user_create,
            $user_list,
            $user_view,
            $user_update,
            $user_delete,
        ]);

        $user_role = Role::create(['name' => 'user']);
        $user_role->givePermissionTo([
            $user_list,
            $user_view,
        ]);
        /* $user = User::create([
    'name' => 'User',
    'email' => 'user@gmail.com',
    'password' => Hash::make("zzzzzz"),
    'email_verified_at' => now(),
    ]);

    $user->assignRole($user_role);
    $user->givePermissionTo([
    $user_list,
    $user_view,
    ]); */
    }
}
