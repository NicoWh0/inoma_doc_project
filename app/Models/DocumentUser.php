<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Model;

class DocumentUser extends Pivot
{
    use SoftDeletes;

    protected $table = 'document_user';

    protected $dates = ['deleted_at'];
}
