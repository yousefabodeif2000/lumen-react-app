<?php

/**
 * Permission Model
 *
 * Represents a permission that can be assigned to roles.
 * Each permission may be associated with multiple roles.
 * Narrated by Yousef Abo Deif
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name'];

    /**
     * Get the roles associated with this permission.
     *
     * Defines a many-to-many relationship between
     * permissions and roles through the "role_permission" pivot table.
     *
     * @return BelongsToMany
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permission');
    }
}
