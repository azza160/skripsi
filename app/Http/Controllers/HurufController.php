<?php

namespace App\Http\Controllers;

use App\Models\Contoh_Penggunaan;
use App\Models\Gambar_Huruf;
use App\Models\Huruf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HurufController extends Controller
{
    public function showDetailHuruf( $jenis, $kategori, $id)
    {
        $huruf = Huruf::where('id', $id)->first();
        $contoh_penggunaan = Contoh_Penggunaan::where('huruf_id', $huruf->id)->get();
        $gambar_huruf = Gambar_Huruf::where('huruf_id', $huruf->id)->get();

  // Terima idList langsung dari halaman sebelumnya


        return Inertia::render('User/Detail-Huruf', [
            'huruf' => $huruf,
            'contoh_penggunaan' => $contoh_penggunaan,
            'gambar_huruf' => $gambar_huruf,
            'jenis' => $jenis,
            'kategori' => $kategori,
            'idList' => request()->input('idList'),
        ]);
    }

    public function GetHurufByKategori($jenis, $kategori)
    {
        // Validasi manual untuk jenis dan kategori huruf
        $allowedJenis = ['hiragana', 'katakana'];
        $allowedKategori = ['gojuon', 'dakuten', 'handakuten', 'youon', 'sokuon', 'choon'];

        if (!in_array($jenis, $allowedJenis) || !in_array($kategori, $allowedKategori)) {
            abort(404);
        }

        $hurufs = Huruf::where('jenis_huruf', $jenis)->where('kategori_huruf', $kategori)->orderBy('id')->get();

        return Inertia::render('User/List-Huruf', [
            'hurufs' => $hurufs,
            'jenis' => $jenis,
            'kategori' => $kategori,
        ]);
    }
}
