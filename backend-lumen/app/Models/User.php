<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password'];

    public function roles()
    {
        // explicitly set pivot table name 'user_role'
        return $this->belongsToMany(Role::class, 'user_role');
    }

    public function hasPermission($permissionName)
    {
        // eager load permissions for all roles
        $this->loadMissing('roles.permissions');

        foreach ($this->roles as $role) {
            if ($role->permissions->contains('name', $permissionName)) {
                return true;
            }
        }
        return false;
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    //Required by JWTSubject
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    //Required by JWTSubject
    public function getJWTCustomClaims()
    {
        return [];
    }
}
