<?php

namespace App\Providers;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class EssentialsServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->configureDefaults();
    }

    private function configureDefaults(): void
    {
        $this->configureCommands();
        $this->configureDates();
        $this->configureModel();
        $this->configureUrls();
    }

    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands(
            $this->app->isProduction(),
        );
    }

    private function configureUrls(): void
    {
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }
    }

    private function configureDates(): void
    {
        Carbon::macro('displayDate', fn (): string => $this->format('d-M-Y'));

        CarbonImmutable::macro('displayDate', fn (): string => $this->format('d-M-Y'));
    }

    private function configureModel(): void
    {
        Model::unguard();
        Model::automaticallyEagerLoadRelationships();
        Model::shouldBeStrict();
        /*
         *  if existing project
         * if (app()->environment('local')) {
            Model::shouldBeStrict();
        }*/
        Relation::enforceMorphMap([
            'user' => User::class,
        ]);
    }
}
