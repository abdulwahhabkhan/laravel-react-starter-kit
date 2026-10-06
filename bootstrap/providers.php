<?php

use App\Providers\AppServiceProvider;
use App\Providers\EssentialsServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    EssentialsServiceProvider::class,
];
