<?php

declare(strict_types=1);

use App\Models\BaseModel;

arch()->preset()->php();
arch()->preset()->security()->ignoring('md5');
arch()->preset()->laravel()->ignoring(BaseModel::class);
