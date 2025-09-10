<?php
/**
 * AdminController
 *
 * Handles user-role and role-permission management.
 * Narrated by Yousef Abo Deif
 */

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Get a list of all users with their assigned roles.
     *
     * @return ResponseFactory JSON response containing users and their roles
     */
    public function users()
    {
        $users = User::with('roles')->get();
        return response()->json($users);
    }
    /**
     * Assign a role to a specific user.
     *
     * @param Request $request HTTP request containing the role name
     * @param int $userId The ID of the user to assign the role to
     * @return ResponseFactory JSON response with success or validation errors
     */
    public function assignRole(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::findOrFail($userId);
        $role = Role::where('name', $request->role)->first();

        $user->roles()->syncWithoutDetaching([$role->id]);

        return response()->json([
            'message' => "Role '{$role->name}' assigned to user '{$user->name}'"
        ]);
    }
    /**
     * Remove a role from a specific user.
     *
     * @param Request $request HTTP request containing the role name
     * @param int $userId The ID of the user to remove the role from
     * @return ResponseFactory JSON response with success or validation errors
     */
    public function removeRole(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::findOrFail($userId);
        $role = Role::where('name', $request->role)->first();

        $user->roles()->detach($role->id);

        return response()->json([
            'message' => "Role '{$role->name}' removed from user '{$user->name}'"
        ]);
    }
    /**
     * Get a list of all roles with their assigned permissions.
     *
     * @return ResponseFactory JSON response containing roles and their permissions
     */
    public function roles()
    {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    /**
     * Assign a permission to a specific role.
     *
     * @param Request $request HTTP request containing the permission name
     * @param int $roleId The ID of the role to assign the permission to
     * @return ResponseFactory JSON response with success or validation errors
     */
    public function assignPermission(Request $request, $roleId)
    {
        $validator = Validator::make($request->all(), [
            'permission' => 'required|string|exists:permissions,name',
        ]);   

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role = Role::findOrFail($roleId);
        $permission = Permission::where('name', $request->permission)->first();

        $role->permissions()->syncWithoutDetaching([$permission->id]);

        return response()->json([
            'message' => "Permission '{$permission->name}' assigned to role '{$role->name}'"
        ]);
    }

    /**
     * Remove a permission from a specific role.
     *
     * @param Request $request HTTP request containing the permission name
     * @param int $roleId The ID of the role to remove the permission from
     * @return ResponseFactory JSON response with success or validation errors
     */
    public function removePermission(Request $request, $roleId)
    {
        $validator = Validator::make($request->all(), [
            'permission' => 'required|string|exists:permissions,name',
        ]);   

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $role = Role::findOrFail($roleId);
        $permission = Permission::where('name', $request->permission)->first();

        $role->permissions()->detach($permission->id);

        return response()->json([
            'message' => "Permission '{$permission->name}' removed from role '{$role->name}'"
        ]);
    }
}
