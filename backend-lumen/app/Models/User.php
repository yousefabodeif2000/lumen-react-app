<?php

/**
 * User Model
 *
 * Represents an application user who can authenticate, hold roles,
 * have permissions, and create posts.
 * Implements JWT authentication and role/permission-based access control.
 * Narrated by Yousef Abo Deif
 */

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'email', 'password'];

    /**
     * The attributes that should be hidden when serializing.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password'];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['roles_list'];

    /**
     * The roles assigned to the user.
     *
     * Many-to-many relationship through the "user_role" pivot table.
     *
     * @return BelongsToMany
     */
    public function roles()
    {
        // explicitly set pivot table name 'user_role'
        return $this->belongsToMany(Role::class, 'user_role');
    }
    /**
     * Check if the user has a specific permission.
     *
     * Loads the user's roles and their permissions, and checks
     * whether the given permission name exists.
     *
     * @param  string  $permissionName
     * @return bool
     */
    public function hasPermission($permissionName)
    {
        $this->load('roles.permissions');
        foreach ($this->roles as $role) {
            if ($role->permissions->contains('name', $permissionName)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Accessor for the user's roles list.
     *
     * Returns a collection of role names assigned to the user.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getRolesListAttribute()
    {
        return $this->roles->pluck('name');
    }

    /**
     * Get the posts created by the user.
     *
     * One-to-many relationship with the Post model.
     *
     * @return HasMany
     */

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get the identifier for JWT.
     *
     * Required by JWTSubject.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Get custom claims for JWT.
     *
     * Required by JWTSubject.
     *
     * @return array<mixed>
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
