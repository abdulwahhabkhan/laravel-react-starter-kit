<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's read-only profile, managed by an administrator.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'role' => $user->role->label(),
            'security' => [
                'two_factor_enabled' => ! is_null($user->two_factor_confirmed_at),
                'passkeys_count' => $user->passkeys()->count(),
            ],
        ]);
    }
}
