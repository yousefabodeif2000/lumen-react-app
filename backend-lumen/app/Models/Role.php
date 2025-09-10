<?php
/**
 * Role Model
 *
 * Represents a role that can be assigned to users.
 * Each role can have multiple permissions and can be assigned to multiple users.
 * Narrated by Yousef Abo Deif
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name'];

    /**
     * Get the permissions associated with this role.
     *
     * Defines a many-to-many relationship between
     * roles and permissions through the "role_permission" pivot table.
     *
     * @return BelongsToMany
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    /**
     * Get the users assigned to this role.
     *
     * Defines a many-to-many relationship between
     * roles and users through the "user_role" pivot table.
     *
     * @return BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_role');
    }

}
