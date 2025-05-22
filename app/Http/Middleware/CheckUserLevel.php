<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserLevel
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, int $requiredLevel): Response
    {
        if (auth()->user()->level < $requiredLevel) {
            return redirect()->route('huruf')->with('error', "Anda harus mencapai level {$requiredLevel} untuk mengakses fitur ini.");
        }

        return $next($request);
    }
} 