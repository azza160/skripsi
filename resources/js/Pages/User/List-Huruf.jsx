"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronUp,
    X,
    BookOpen,
    Volume2,
    Check,
    RefreshCw,
    Cherry,
    CherryIcon as Sakura,
    GraduationCap,
} from "lucide-react";
import Dashboard from "../../Layouts/DashboardLayout";
import { useLayout } from "../../Layouts/DashboardLayout";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react"; // Inertia hook untuk mengambil data
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";


// Content Loading Component
const ContentLoading = () => {
    return (
        <div className="flex items-center justify-center min-h-[300px]">
            <div className="relative w-16 h-16">
                <motion.div
                    className="absolute inset-0 border-4 border-[hsl(252,94%,56%)] rounded-full"
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                <motion.div
                    className="absolute inset-2 border-4 border-[hsl(252,94%,70%)] rounded-full"
                    animate={{
                        rotate: -360,
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="ml-4 text-gray-600 font-medium"
            >
                Memuat konten...
            </motion.p>
        </div>
    );
};

// Decorative elements for background
const FloatingElement = ({ children, className, delay = 0 }) => {
    return (
        <motion.div
            className={`absolute pointer-events-none ${className}`}
            animate={{
                y: ["0%", "5%", "0%"],
                rotate: [0, 5, 0],
                opacity: [0.7, 1, 0.7],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                delay: delay,
            }}
        >
            {children}
        </motion.div>
    );
};

const HiraganaCard = ({ character, romaji, jenis, kategori, id, hurufs, audio, is_learned }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    
    const playAudio = (url) => {
        if (!url) return;
        const audio = new Audio(url);
        audio.play().catch((e) => console.error("Gagal memutar audio:", e));
    };

    const handleClick = () => {
        if (audio) {
            playAudio(audio);
        } else {
            setShowDialog(true);
        }
    }

    return (
        <>
            <AlertDialog open={showDialog} onOpenChange={setShowDialog} className="z-[500] transition-all duration-300">
                <AlertDialogContent className="z-[500] transition-all duration-300">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Audio belum tersedia</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Maaf, audio untuk huruf ini belum tersedia. Silakan coba huruf lainnya.
                    </p>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowDialog(false)}>
                            Tutup
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <motion.div
                className="relative bg-gradient-to-br from-background to-background/90 border border-primary/20 rounded-2xl shadow-lg overflow-hidden h-[180px] group"
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
                    borderColor: "hsl(var(--primary) / 0.5)",
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                transition={{ duration: 0.3 }}
            >
                {/* Card background pattern */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[length:12px_12px]"></div>

                {/* Status indicator - Always visible */}
                <div className="absolute top-3 right-3 z-20">
                    <motion.div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            is_learned ? "bg-green-500" : "bg-amber-500"
                        } shadow-md`}
                        whileHover={{ scale: 1.2 }}
                        animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: is_learned
                                ? [
                                    "0 0 0 rgba(34, 197, 94, 0.4)",
                                    "0 0 10px rgba(34, 197, 94, 0.6)",
                                    "0 0 0 rgba(34, 197, 94, 0.4)",
                                ]
                                : [
                                    "0 0 0 rgba(245, 158, 11, 0.4)",
                                    "0 0 10px rgba(245, 158, 11, 0.6)",
                                    "0 0 0 rgba(245, 158, 11, 0.4)",
                                ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop",
                        }}
                    >
                        {is_learned ? (
                            <Check size={14} className="text-white" />
                        ) : (
                            <RefreshCw size={14} className="text-white" />
                        )}
                    </motion.div>
                </div>

                {/* Character content */}
                <div className="p-6 flex flex-col items-center justify-center h-full relative z-10">
                    <motion.span
                        className="text-6xl font-bold mb-3 text-primary transition-all duration-300"
                        animate={{
                            scale: isHovered ? 0.9 : 1,
                            y: isHovered ? -10 : 0,
                            opacity: isHovered ? 0.5 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {character}
                    </motion.span>

                    <motion.span
                        className="text-sm font-medium text-foreground/80 mb-2"
                        animate={{
                            opacity: isHovered ? 0.5 : 1,
                            y: isHovered ? -5 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {romaji}
                    </motion.span>

                    <motion.div
                        className="mt-1 flex items-center"
                        animate={{
                            opacity: isHovered ? 0 : 1,
                            y: isHovered ? -5 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <span
                            className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                is_learned ? "bg-green-500" : "bg-amber-500"
                            }`}
                        ></span>
                        <span className="text-xs text-foreground/70">
                            {is_learned ? "Sudah dipelajari" : "Belum dipelajari"}
                        </span>
                    </motion.div>
                </div>

                {/* Overlay that slides up on hover */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary to-primary/90 z-10 flex flex-col items-center justify-center p-4"
                    initial={{ y: "100%" }}
                    animate={{ y: isHovered ? "0%" : "100%" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.span
                        className="text-5xl font-bold mb-2 text-primary-foreground"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: isHovered ? 1 : 0.8,
                            opacity: isHovered ? 1 : 0,
                        }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        {character}
                    </motion.span>

                    <motion.span
                        className="text-sm font-medium text-primary-foreground/90 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        {romaji}
                    </motion.span>

                    <motion.button
                        className="px-5 py-2 bg-primary-foreground text-primary rounded-lg text-sm font-medium shadow-md flex items-center space-x-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            y: isHovered ? 0 : 10,
                        }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ delay: 0.3, duration: 0.2 }}
                    >
                        <BookOpen size={16} />
                        <span>
                        <Link
                            href={route('huruf-hiragana-detail', {
                                jenis: jenis,
                                kategori: kategori,
                                id: id,
                            })}
                            data={{ idList: hurufs.map((h) => h.id) }}
                        >
                            Pelajari
                        </Link>
                        </span>
                    </motion.button>

                    <motion.button
                        className="mt-2 px-3 py-1 bg-primary-foreground/20 text-primary-foreground rounded-lg text-xs font-medium flex items-center space-x-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ delay: 0.4, duration: 0.2 }}
                        onClick={handleClick}
                    >
                        <Volume2 size={12} />
                        <span>Dengarkan</span>
                    </motion.button>
                </motion.div>

                {/* Decorative elements that appear on hover */}
                <motion.div
                    className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-2xl"
                    initial={{ rotate: 45, x: "100%", y: "-100%" }}
                    animate={{
                        rotate: 45,
                        x: isHovered ? "50%" : "100%",
                        y: isHovered ? "-50%" : "-100%",
                    }}
                    transition={{ duration: 0.3 }}
                />

                <motion.div
                    className="absolute bottom-0 left-0 w-12 h-12 bg-primary/10 rounded-tr-2xl"
                    initial={{ rotate: 45, x: "-100%", y: "100%" }}
                    animate={{
                        rotate: 45,
                        x: isHovered ? "-50%" : "-100%",
                        y: isHovered ? "50%" : "100%",
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </>
    );
};

const renderDeskripsi = ({ jenis, kategori }) => {
    if (jenis == "hiragana" && kategori == "gojuon") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Pelajari huruf dasar
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Gojuon
                </span>
                dalam bahasa Jepang, fondasi penting untuk membaca dan menulis
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Hiragana
                </span>
                dengan baik!
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Ayo mulai dengan huruf-huruf dasar sekarang!
                </span>
            </p>
        );
    }

    if (jenis == "hiragana" && kategori == "dakuten") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Kenali perubahan suara huruf melalui
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Dakuten
                </span>
                , untuk memperluas kemampuan membaca dan berbicara dalam bahasa
                Jepang.
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Pelajari huruf-huruf bersuara sekarang!
                </span>
            </p>
        );
    }

    if (jenis == "hiragana" && kategori == "handakuten") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Pelajari huruf dengan tanda
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Handakuten
                </span>
                untuk memahami pelafalan bunyi "p" dalam bahasa Jepang.
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Siap mengenal bunyi unik ini?
                </span>
            </p>
        );
    }

    if (jenis == "hiragana" && kategori == "youon") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Pelajari gabungan bunyi dalam
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Youon
                </span>
                , yang banyak digunakan dalam kosakata Jepang modern.
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Gabungkan bunyi, tingkatkan pemahamanmu!
                </span>
            </p>
        );
    }

    if (jenis == "hiragana" && kategori == "sokuon") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Pahami penggunaan
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Sokuon
                </span>
                (っ) untuk pelafalan konsonan ganda yang penting dalam
                pengucapan Jepang.
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Mari kuasai pelafalan yang tepat!
                </span>
            </p>
        );
    }

    if (jenis == "hiragana" && kategori == "choon") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Pelajari tanda perpanjangan suara vokal
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Chōon
                </span>
                dalam huruf Jepang untuk menguasai pengucapan dengan panjang
                vokal yang benar.
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Perpanjang suara, tingkatkan kefasihanmu!
                </span>
            </p>
        );
    }

    if (jenis == "katakana" && kategori == "gojuon") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Kuasai huruf dasar
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Gojuon
                </span>
                dalam bentuk
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Katakana
                </span>
                , yang sering digunakan untuk menulis kata serapan asing dalam
                bahasa Jepang.
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Ayo mulai dari huruf-huruf dasarnya dulu!
                </span>
            </p>
        );
    }

    if (jenis == "katakana" && kategori == "dakuten") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Pelajari variasi suara dari
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Dakuten
                </span>
                dalam Katakana, untuk memperluas pemahaman terhadap pelafalan
                kata asing dengan akurat.
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Tambahkan nuansa suara ke dalam pelajaranmu!
                </span>
            </p>
        );
    }

    if (jenis == "katakana" && kategori == "handakuten") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Pahami bunyi "p" yang khas dalam Katakana dengan mempelajari
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Handakuten
                </span>
                . Cocok untuk kata serapan yang menggunakan konsonan kuat!
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Siap menambahkan kekuatan bunyi?
                </span>
            </p>
        );
    }

    if (jenis == "katakana" && kategori == "youon") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Pelajari gabungan suku kata dalam
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Youon
                </span>
                versi Katakana, penting untuk melafalkan kata asing yang
                kompleks dengan benar.
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Gabungkan suara dengan lebih lancar!
                </span>
            </p>
        );
    }

    if (jenis == "katakana" && kategori == "sokuon") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Pelajari penggunaan
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Sokuon
                </span>
                (ッ) untuk melafalkan konsonan ganda dengan tepat dalam kata
                Katakana.
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Tingkatkan akurasi pelafalanmu!
                </span>
            </p>
        );
    }

    if (jenis == "katakana" && kategori == "choon") {
        return (
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Pelajari tanda perpanjangan vokal
                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                    Chōon
                </span>
                (ー) dalam Katakana, penting untuk melafalkan kata pinjaman
                dengan vokal panjang secara benar.
                <br />
                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                    Perjelas pelafalan kata-kata asing!
                </span>
            </p>
        );
    }
};

function HiraganaContent() {
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    const { sidebarOpen, isMobile } = useLayout();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { hurufs, jenis, kategori, max, presentase } = usePage().props;

    // Simulate initial page load
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Membuat hiraganaData dari data yang dikirimkan
    const hiraganaData = hurufs.reduce((acc, huruf) => {
        const group = huruf.groups;
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(huruf);
        return acc;
    }, {});

    

    const applyFilter = (filter) => {
        setIsPageLoading(true);
        setActiveFilter(filter);
        setFilterOpen(false);

        // Simulasi delay agar animasi loading terlihat
        setTimeout(() => {
            setIsPageLoading(false);
        }, 500); // 0.5 detik
    };

    // Fungsi filter yang sebelumnya
    const getFilteredCharacters = () => {
        if (activeFilter === "all") {
            return Object.values(hiraganaData).flat();
        }
        return hiraganaData[activeFilter] || [];
    };

    const filteredCharacters = getFilteredCharacters();

    if (isPageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <ContentLoading />
            </div>
        );
    }

    return (
        <div className="bg-transparent text-foreground relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <FloatingElement
                    className="top-[10%] left-[5%] text-primary/20"
                    delay={1}
                >
                    <Sakura size={40} />
                </FloatingElement>
                <FloatingElement
                    className="top-[30%] right-[8%] text-primary/15"
                    delay={2}
                >
                    <Cherry size={50} />
                </FloatingElement>
                <FloatingElement
                    className="bottom-[20%] left-[12%] text-primary/10"
                    delay={3}
                >
                    <Sakura size={60} />
                </FloatingElement>
                <FloatingElement
                    className="top-[60%] right-[15%] text-primary/20"
                    delay={4}
                >
                    <Cherry size={35} />
                </FloatingElement>
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--primary)_0px,_transparent_1000px)] opacity-[0.03]"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                {/* Breadcrump */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-2 text-sm bg-gradient-to-r from-background to-muted/50 dark:from-slate-950 dark:to-slate-900/50 p-3 rounded-lg shadow-sm border border-border/50 dark:border-slate-800/50  mb-[50px] w-fit"
                >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <Link href={route("dashboard")}>
                            <span className="text-muted-foreground dark:text-slate-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300">
                                Dashboard
                            </span>
                        </Link>
                        <span className="text-primary dark:text-violet-400">
                            /
                        </span>
                        <Link href={route("huruf")}>
                            <span className="text-muted-foreground dark:text-slate-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300">
                                Huruf Jepang
                            </span>
                        </Link>
                        <span className="text-primary dark:text-violet-400">
                            /
                        </span>
                        <Link
                            href={route(
                                jenis === "hiragana"
                                    ? "kategori-huruf-hiragana"
                                    : "kategori-huruf-katakana"
                            )}
                        >
                            <span className="text-muted-foreground dark:text-slate-400 hover:text-viol;let-800 dark:hover:text-violet-300 transition-all duration-300 capitalize">
                                Kategori Huruf {jenis}
                            </span>
                        </Link>
                        <span className="text-primary dark:text-violet-400">
                            /
                        </span>
                        <Link
                            href={route("huruf-list", {
                                jenis: jenis,
                                kategori: kategori,
                            })}
                        >
                            <span className="text-violet-400 dark:text-violet-600">
                                Huruf {jenis} {kategori}
                            </span>
                        </Link>
                    </div>
                    <motion.div
                        className="h-1 w-1 rounded-full bg-primary/50 dark:bg-violet-500/50"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                    />
                </motion.div>

                {/* Header */}
                <header className="text-center mb-16 relative">
                    <div className="absolute top-0 left-0 w-full h-full -z-10">
                        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
                        <div className="absolute bottom-0 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
                    </div>

                    {/* Header Section dengan desain yang ditingkatkan */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-5 text-center relative"
                    >
                        <div className="py-8 px-4 relative z-0 bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-pink-500/10 dark:from-violet-800/30 dark:via-purple-800/20 dark:to-pink-800/20 rounded-lg">
                            <div className="inline-block mb-4 bg-violet-500/20 p-2 rounded-full">
                                <GraduationCap className="h-8 w-8 text-slate-900 dark:text-slate-200" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 dark:text-slate-200 capitalize">
                                Huruf {jenis} {"-"} {kategori}
                            </h1>
                            {renderDeskripsi({ jenis, kategori })}
                        </div>
                    </motion.div>

                    {/* Progress indicator */}
                    <motion.div
                        className="bg-primary/10 p-4 rounded-xl inline-flex items-center space-x-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="text-sm font-bold">
                                {presentase}%
                            </span>
                        </div>
                        <div className="text-left">
                            <p className="font-medium">
                                Mulai Perjalanan Hiragana Anda
                            </p>
                            <p className="text-sm text-foreground/70">
                                Pelajari {max} karakter untuk membuka kategori
                                berikutnya
                            </p>
                        </div>
                    </motion.div>
                </header>

                {/* Hiragana Grid */}
                <AnimatePresence mode="wait">
                    {isPageLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-[400px] flex items-center justify-center"
                        >
                            <ContentLoading />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="grid grid-cols-1  sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-24"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {filteredCharacters.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: index * 0.05,
                                            duration: 0.3,
                                        }}
                                    >
                                        <HiraganaCard
                                            character={item.huruf}
                                            romaji={item.romaji}
                                            jenis={jenis}
                                            kategori={kategori}
                                            id={item.id}
                                            hurufs={hurufs}
                                            audio={item.audio}
                                            is_learned={item.is_learned}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Learning Tips Section */}
                            <motion.div
                                className="mb-24 grid md:grid-cols-2 gap-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/10 shadow-inner relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm">あ</span>
                                        </span>
                                        Tentang Hiragana
                                    </h3>
                                    <p className="text-foreground/80 mb-3 pl-4 border-l-2 border-primary/30">
                                        📌 Hiragana terdiri dari 46 karakter dasar yang
                                        mewakili setiap suku kata dalam bahasa Jepang.
                                    </p>
                                    <p className="text-foreground/80 pl-4 border-l-2 border-primary/30">
                                        📌 Hiragana digunakan untuk menulis kata-kata asli
                                        Jepang, akhiran kata kerja, dan partikel tata
                                        bahasa.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/10 shadow-inner relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm">✓</span>
                                        </span>
                                        Tips Belajar
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-start space-x-2">
                                            <span className="text-primary">•</span>
                                            <span className="text-foreground/80">
                                                Pelajari 5 karakter setiap hari untuk hasil
                                                optimal
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-primary">•</span>
                                            <span className="text-foreground/80">
                                                Praktikkan menulis karakter untuk memperkuat
                                                ingatan
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-primary">•</span>
                                            <span className="text-foreground/80">
                                                Dengarkan pengucapan untuk meningkatkan
                                                kemampuan mendengar
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Call to Action */}
                            <motion.div
                                className="mb-24 bg-primary text-primary-foreground rounded-2xl p-8 relative overflow-hidden"
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0px,_transparent_600px)]"></div>
                                <div className="relative z-10 text-center">
                                    <h3 className="text-2xl font-bold mb-4">
                                        Siap untuk menguasai Hiragana?
                                    </h3>
                                    <p className="mb-6 text-primary-foreground/90 max-w-2xl mx-auto">
                                        Lanjutkan perjalanan belajar bahasa Jepang Anda
                                        dengan kursus lengkap kami. Dapatkan akses ke
                                        latihan interaktif, pengucapan audio, dan banyak
                                        lagi!
                                    </p>
                                    <button className="bg-primary-foreground text-primary px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow">
                                        Mulai Kursus Lengkap
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Filter Button (Sticky) */}
            <div
                className={cn(
                    "fixed bottom-0 z-30",
                    isMobile
                        ? "left-0 right-0"
                        : sidebarOpen
                        ? "left-80 right-0"
                        : "left-20 right-0",
                    "transition-all duration-300"
                )}
            >
                <motion.div
                    className="bg-background border-t border-primary/10 shadow-lg"
                    initial={{ y: filterOpen ? 0 : "100%" }}
                    animate={{ y: filterOpen ? 0 : "0%" }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Filter Toggle Button */}
                    <div className="flex justify-center" onClick={() => setFilterOpen(!filterOpen)}>
                        <motion.button
                            className="flex items-center justify-center space-x-2 py-3 px-6 text-primary font-medium"
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Filter Huruf</span>
                            <motion.div
                                animate={{ rotate: filterOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronUp size={18} />
                            </motion.div>
                        </motion.button>
                    </div>

                    {/* Filter Drawer */}
                    <AnimatePresence>
                        {filterOpen && (
                            <motion.div
                                className="bg-background p-4 border-t border-primary/10"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold">
                                        Pilih Kelompok Huruf
                                    </h3>
                                    <button
                                        onClick={() => setFilterOpen(false)}
                                        className="text-foreground/70 hover:text-foreground"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                                    <FilterButton
                                        label="Semua"
                                        active={activeFilter === "all"}
                                        onClick={() => applyFilter("all")}
                                    />
                                    {Object.keys(hiraganaData).map((group) => (
                                        <FilterButton
                                            key={group}
                                            label={group}
                                            active={activeFilter === group}
                                            onClick={() => applyFilter(group)}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

export default function HiraganaIndex() {
    return (
        <Dashboard>
            <HiraganaContent />
        </Dashboard>
    );
}

const FilterButton = ({ label, active, onClick }) => {
    return (
        <motion.button
            className={`py-2 px-4 rounded-lg text-sm font-medium ${
                active
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-foreground hover:bg-primary/20"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
        >
            {label}
        </motion.button>
    );
};
