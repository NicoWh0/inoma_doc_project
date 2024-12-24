<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Model;

class DocumentUser extends Pivot
{
    use SoftDeletes;

    protected $table = 'document_user';

    protected $fillable = ['document_id', 'user_id'];

    protected $dates = ['deleted_at'];
}
