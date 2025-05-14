import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
export default function AdminDashboard() {
    const { props } = usePage();
    const flash = props.flash;
    const handleLogout = () => {
        Swal.fire({
            title: 'Konfirmasi Logout',
            text: 'Apakah Anda yakin ingin keluar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('logout'));
            }
        });
    };

    useEffect(() => {
        if (flash?.message) {
            Swal.fire({
                icon: flash.success ? 'success' : 'error',
                title: flash.success ? 'Sukses' : 'Gagal',
                text: flash.message,
                confirmButtonText: 'OK',
                confirmButtonColor: '#6366f1'
            });
        }
    }, [flash]);

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <Button onClick={handleLogout} variant="outline">
                            Logout
                        </Button>
                    </div>
                    <div className="bg-card rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Selamat Datang di Panel Admin</h2>
                        <p className="text-muted-foreground">
                            Ini adalah halaman dashboard admin. Anda memiliki akses penuh ke fitur administratif.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
} 