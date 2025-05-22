@component('mail::message')
# Verifikasi Email Anda

Halo {{ $user->nama_lengkap }},

Terima kasih telah mendaftar di platform pembelajaran bahasa Jepang kami. Untuk memulai perjalanan belajar Anda, 
silakan verifikasi email Anda dengan mengklik tombol di bawah ini:

@component('mail::button', ['url' => $verificationUrl])
Verifikasi Email
@endcomponent

Link verifikasi ini akan kadaluarsa dalam 24 jam. Jika Anda tidak merasa mendaftar di platform kami, 
Anda dapat mengabaikan email ini.

Terima kasih,<br>
{{ config('app.name') }}
@endcomponent
