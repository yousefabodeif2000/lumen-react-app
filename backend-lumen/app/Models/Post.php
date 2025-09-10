<?php

/**
 * Post Model
 *
 * Represents a blog post created by a user.
 * Each post belongs to a single user (author).
 * Narrated by Yousef Abo Deif
 */


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User; 

class Post extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['title', 'content', 'user_id'];

    /**
     * Get the user (author) that owns the post.
     *
     * Defines an inverse one-to-many relationship
     * between posts and users.
     *
     * @return BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
