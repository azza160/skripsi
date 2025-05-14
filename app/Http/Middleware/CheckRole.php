<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || $request->user()->peran !== $role) {
            return redirect()->back()->with([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke halaman ini.'
            ]);
        }

        return $next($request);
    }
} 