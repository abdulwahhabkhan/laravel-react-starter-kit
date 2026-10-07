<?php

namespace App\Providers;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Database\Query\Expression;
use Illuminate\Database\Eloquent\Builder;
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

        $this->queryMacros();
    }

    private function queryMacros(): void
    {
        Builder::macro('filterWhere', function (Expression|string $column, ?string $search) {
            if ($search === null || $search === '') {
                return $this;
            }

            return $this->where($column, '=', $search);

        });

        Builder::macro('filterStartWith', function (Expression|string $column, ?string $search): static {
            if ($search === null || $search === '') {
                return $this;
            }

            $this->whereLike($column, "$search%");

            return $this;
        });

        Builder::macro('filterContain', function (Expression|string $column, ?string $search): static {
            if ($search === null) {
                return $this;
            }

            $this->whereLike($column, "%$search%");

            return $this;
        });

        Builder::macro('filterDate', function (Expression|string $column, ?string $search): static {
            if ($search === null) {
                return $this;
            }

            $this->whereDate($column, $search);

            return $this;
        });

    }
}
