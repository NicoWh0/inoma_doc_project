<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'uploader',
        'title',
        'category_id',
        'file_path',
        'description',
        'document_status',
    ];

    protected $casts = [
        'uploader' => 'integer',
        'category_id' => 'integer',
        'document_status' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'archived_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
                    ->using(DocumentUser::class)
                    ->withTimestamps()
                    ->withPivot('deleted_at')
                    ->wherePivot('deleted_at', null);
    }

    public function getDeletedAtColumn()
    {
        return 'archived_at';
    }
}
