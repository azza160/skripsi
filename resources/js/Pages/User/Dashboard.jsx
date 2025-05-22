"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import WelcomeAlert from "../../components/WelcomeAlert";
import { BarChart } from "../../components/charts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    GraduationCap,
    BookOpen,
    UsersIcon as Characters,
    Sparkles,
    ArrowRight,
    ChevronRight,
    Play,
    TrendingUp,
    Clock,
    Award,
    Zap,
    Calendar,
    Bookmark,
    Heart,
    Flame,
    Target,
    ArrowUpRight,
    Scroll,
    Type,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePage, Link, router } from "@inertiajs/react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

// Mock data for preview since we don't have access to Inertia's usePage
const mockData = {
    auth: {
        user: {
            name: "Pelajar Demo",
        },
    },
    pembelajaranProgress: [
        {
            id: 1,
            nama: "Hiragana",
            desk: "Huruf dasar bahasa Jepang untuk kata-kata asli Jepang",
            progress: 75,
            max: 100,
            status: "In Progress",
            route_name: "belajar.hiragana",
            type: "huruf",
            lastStudied: "2 jam yang lalu",
            level: "Dasar",
        },
        {
            id: 2,
            nama: "Katakana",
            desk: "Huruf untuk kata serapan dari bahasa asing",
            progress: 40,
            max: 100,
            status: "In Progress",
            route_name: "belajar.katakana",
            type: "huruf",
            lastStudied: "1 hari yang lalu",
            level: "Dasar",
        },
        {
            id: 3,
            nama: "Kosakata N5",
            desk: "Kosakata dasar level N5 untuk pemula",
            progress: 60,
            max: 100,
            status: "In Progress",
            route_name: "belajar.kosakata",
            type: "kosakata",
            lastStudied: "3 jam yang lalu",
            level: "N5",
        },
        {
            id: 4,
            nama: "Kanji Dasar",
            desk: "Kanji dasar yang sering digunakan dalam kehidupan sehari-hari",
            progress: 25,
            max: 100,
            status: "In Progress",
            route_name: "belajar.kanji",
            type: "huruf",
            lastStudied: "5 hari yang lalu",
            level: "Menengah",
        },
    ],
};

export default function DashboardUser() {
    const [chartPeriod, setChartPeriod] = useState("monthly");
    const [greeting, setGreeting] = useState("");
    const [todayStats, setTodayStats] = useState({
        huruf: Math.floor(Math.random() * 20) + 5,
        kosakata: Math.floor(Math.random() * 15) + 3,
    });
    const [motivationalQuotes] = useState([
        "一日一語 - Satu hari, satu kata.",
        "継続は力なり - Ketekunan adalah kekuatan.",
        "千里の道も一歩から - Perjalanan seribu mil dimulai dari satu langkah.",
        "七転び八起き - Jatuh tujuh kali, bangkit delapan kali.",
    ]);
    const [currentQuote, setCurrentQuote] = useState("");
    const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);
    const [chartData, setChartData] = useState([]);

    const progressSectionRef = useRef(null);

    const {
        user,
        jumlahHuruf,
        currentLevel,
        showWelcomeAlert: initialShowWelcomeAlert,
        jumlahHurufHariIni,
        jumlahKosakataHariIni,
        hiraganaProgress,
        maxHiragana,
        katakanaProgress,
        maxKatakana,
        kosakataProgress,
        maxKosakata,
        kosakataFavorit,
        pembelajaranProgress,
        jumlahKosakata,
        lastCompletedHumanReadable,
        lastCompletedHumanReadableKosakata,
        
    } = usePage().props;

    useEffect(() => {
        // Set welcome alert visibility berdasarkan props dari server
        setShowWelcomeAlert(initialShowWelcomeAlert);
    }, [initialShowWelcomeAlert]);

    const handleCloseWelcomeAlert = () => {
        setShowWelcomeAlert(false);
        // Hapus session flag di backend
        axios.post("/api/clear-welcome-alert");
    };

    useEffect(() => {
        // Set greeting based on time of day
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("おはようございます");
        else if (hour < 18) setGreeting("こんにちは");
        else setGreeting("こんばんは");

        // Set random motivational quote
        setCurrentQuote(
            motivationalQuotes[
                Math.floor(Math.random() * motivationalQuotes.length)
            ]
        );
    }, [motivationalQuotes]);

    function generateRouteLink(routeName, routeParams = {}) {
        return router.visit(route(routeName, routeParams));
    }

    const scrollToProgress = () => {
        progressSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    // Generate chart data
    const generateChartData = (period) => {
        if (period === "weekly") {
            return [
                { name: "Senin", huruf: 45, kosakata: 30 },
                { name: "Selasa", huruf: 60, kosakata: 40 },
                { name: "Rabu", huruf: 75, kosakata: 50 },
                { name: "Kamis", huruf: 55, kosakata: 35 },
                { name: "Jumat", huruf: 65, kosakata: 45 },
                { name: "Sabtu", huruf: 40, kosakata: 25 },
                { name: "Minggu", huruf: 50, kosakata: 30 }
            ];
        } else {
            const currentDate = new Date();
            const month = currentDate.getMonth();
            const monthNames = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ];
            const monthName = monthNames[month];
            
            return Array.from({ length: 7 }, (_, i) => ({
                name: `${i + 1} ${monthName}`,
                huruf: Math.floor(Math.random() * 100) + 10,
                kosakata: Math.floor(Math.random() * 80) + 5
            }));
        }
    };

    // Initialize and update chart data
    useEffect(() => {
        setChartData(generateChartData(chartPeriod));
    }, [chartPeriod]);

    return (
        <>
            <DashboardLayout>
                {showWelcomeAlert && (
                    <WelcomeAlert
                        username={user.nama_pengguna}
                        onClose={handleCloseWelcomeAlert}
                        jumlahHuruf={jumlahHuruf}
                        currentLevel={currentLevel}
                        loginStreak={user.login_streak}
                    />
                )}

                <div className="text-foreground">
                    <div className="max-w-6xl mx-auto px-4">
                        {/* Breadcrumb */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center space-x-2 text-sm bg-gradient-to-r from-background to-muted/50 dark:from-slate-950 dark:to-slate-900/50 p-3 rounded-lg shadow-sm border border-border/50 dark:border-slate-800/50 mb-8 w-fit"
                        >
                            <div className="flex flex-wrap items-center space-x-2">
                                <a href="#dashboard">
                                    <span className="text-muted-foreground dark:text-slate-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300">
                                        Dashboard
                                    </span>
                                </a>
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

                        {/* Welcome Section with Enhanced Animation */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="mb-10 relative overflow-hidden"
                        >
                            <div className="py-8 px-6 relative z-10 bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-pink-500/10 dark:from-violet-800/30 dark:via-purple-800/20 dark:to-pink-800/20 rounded-2xl shadow-lg border border-violet-200/50 dark:border-violet-800/30">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-300/20 to-transparent dark:from-violet-600/10 rounded-full -mr-20 -mt-20 z-0" />

                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-300/20 to-transparent dark:from-pink-600/10 rounded-full -ml-20 -mb-20 z-0" />

                                {/* Decorative Japanese characters */}
                                <div className="absolute top-12 right-20 z-0">
                                    <div className="text-4xl opacity-20 dark:opacity-10">
                                        あ
                                    </div>
                                </div>

                                <div className="absolute bottom-12 left-20 z-0">
                                    <div className="text-4xl opacity-20 dark:opacity-10">
                                        ア
                                    </div>
                                </div>

                                <div className="absolute top-20 left-1/4 z-0">
                                    <div className="text-4xl opacity-20 dark:opacity-10">
                                        日
                                    </div>
                                </div>

                                <div className="absolute bottom-16 right-1/4 z-0">
                                    <div className="text-4xl opacity-20 dark:opacity-10">
                                        本
                                    </div>
                                </div>

                                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 relative z-10">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 0.2,
                                            duration: 0.5,
                                        }}
                                        className="flex-shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-800 p-4 rounded-2xl shadow-lg relative overflow-hidden"
                                    >
                                        {/* Inner decorative elements for the icon box */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_60%)]"></div>
                                        <GraduationCap className="h-12 w-12 text-white relative z-10" />
                                    </motion.div>

                                    <div className="flex-1 text-center md:text-left">
                                        <motion.h2
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                delay: 0.3,
                                                duration: 0.5,
                                            }}
                                            className="text-xl font-medium text-violet-800 dark:text-violet-300 mb-1"
                                        >
                                            {greeting}
                                        </motion.h2>

                                        <motion.h1
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                delay: 0.4,
                                                duration: 0.5,
                                            }}
                                            className="text-3xl md:text-4xl font-bold mb-3 text-slate-900 dark:text-slate-100"
                                        >
                                            Selamat datang kembali,{" "}
                                            {user.nama_pengguna}
                                        </motion.h1>

                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                delay: 0.5,
                                                duration: 0.5,
                                            }}
                                            className="mb-3 relative"
                                        >
                                            <div className="inline-block relative">
                                                <p className="text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-violet-100 dark:border-violet-800/30">
                                                    {currentQuote}
                                                </p>
                                                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white/50 dark:bg-slate-800/50 border-b border-r border-violet-100 dark:border-violet-800/30 transform rotate-45"></div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                delay: 0.6,
                                                duration: 0.5,
                                            }}
                                            className="flex flex-wrap gap-2 items-center justify-center md:justify-start mb-4"
                                        >
                                            <div className="flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded-full">
                                                <Flame className="h-3.5 w-3.5 text-amber-500" />
                                                <span className="text-xs font-medium text-violet-800 dark:text-violet-300">
                                                    {" "}
                                                    {user.login_streak} Hari
                                                    Streak
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1 bg-pink-100 dark:bg-pink-900/30 px-2 py-1 rounded-full">
                                                <Target className="h-3.5 w-3.5 text-pink-500" />
                                                <span className="text-xs font-medium text-pink-800 dark:text-pink-300">
                                                    Level {user.level}
                                                </span>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                delay: 0.7,
                                                duration: 0.5,
                                            }}
                                            className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start"
                                        >
                                            <Link href="/dashboard/huruf">
                                                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 px-6">
                                                    <Play className="mr-2 h-4 w-4" />{" "}
                                                    Mulai Belajar Huruf
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                className="border-violet-300 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 shadow-sm hover:shadow transition-all duration-300"
                                                onClick={scrollToProgress}
                                            >
                                                <Scroll className="mr-2 h-4 w-4" />{" "}
                                                Lihat Progress
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Bottom wave decoration */}
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 dark:from-violet-800/30 dark:via-purple-800/30 dark:to-pink-800/30"></div>
                            </div>
                        </motion.div>

                        {/* Today's Summary - Enhanced */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-8 relative overflow-hidden"
                        >
                            <div className="p-6 bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-orange-950/20 rounded-xl border border-amber-200 dark:border-amber-900/30 shadow-md">
                                {/* Background decorative elements */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-200/30 to-transparent dark:from-amber-700/10 rounded-full -mr-20 -mt-20"></div>
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-200/30 to-transparent dark:from-orange-700/10 rounded-full -ml-20 -mb-20"></div>

                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-lg shadow-md">
                                            <Sparkles className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300">
                                            Ringkasan Hari Ini
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
                                        <Card className="border-amber-200 dark:border-amber-800/50 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                                                        <Type className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                                            Huruf dipelajari
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            {jumlahHurufHariIni >
                                                            0 ? (
                                                                <>
                                                                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                                                                        {
                                                                            jumlahHurufHariIni
                                                                        }
                                                                    </p>
                                                                    <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full">
                                                                        +
                                                                        {
                                                                            jumlahHurufHariIni
                                                                        }{" "}
                                                                        dari
                                                                        kemarin
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                                                    Belum ada
                                                                    huruf
                                                                    dipelajari
                                                                    hari ini
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-amber-200 dark:border-amber-800/50 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                                                        <BookOpen className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                                            Kosakata dipelajari
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            {jumlahKosakataHariIni >
                                                            0 ? (
                                                                <>
                                                                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                                                                        {
                                                                            jumlahKosakataHariIni
                                                                        }
                                                                    </p>
                                                                    <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full">
                                                                        +
                                                                        {
                                                                            jumlahKosakataHariIni
                                                                        }{" "}
                                                                        dari
                                                                        kemarin
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                                                    Belum ada
                                                                    kosakata
                                                                    dipelajari
                                                                    hari ini
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-amber-200 dark:border-amber-800/50 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                                                        <TrendingUp className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                                            Streak belajar
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                                                                {
                                                                    user.login_streak
                                                                }{" "}
                                                                hari
                                                            </p>
                                                            <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full">
                                                                Terbaik!
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Cards - Redesigned without charts */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid gap-4 sm:gap-6 lg:grid-cols-2 mb-8"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="h-full"
                            >
                                <Card className="border-violet-200 dark:border-violet-800/50 bg-white dark:bg-slate-900/60 overflow-hidden group hover:shadow-md transition-all duration-300 relative h-full flex flex-col">
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
                                        <div className="absolute top-0 right-0 w-40 h-40">
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute text-violet-900 dark:text-violet-300 text-4xl"
                                                        style={{
                                                            top: `${
                                                                Math.random() *
                                                                100
                                                            }%`,
                                                            left: `${
                                                                Math.random() *
                                                                100
                                                            }%`,
                                                            opacity: 0.3,
                                                            transform: `rotate(${
                                                                Math.random() *
                                                                360
                                                            }deg)`,
                                                        }}
                                                    >
                                                        あ
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <CardContent className="p-0 flex-1 flex flex-col">
                                        <div className="relative flex-1 flex flex-col">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-200/50 to-transparent dark:from-violet-800/20 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />

                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                                                        <Characters className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                            Huruf Dipelajari
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                                                                {jumlahHuruf >
                                                                0 ? (
                                                                    <>
                                                                        {
                                                                            jumlahHuruf
                                                                        }
                                                                    </>
                                                                ) : (
                                                                    <p className="text-sm text-violet-700 dark:text-violet-300">
                                                                        Belum
                                                                        ada
                                                                        huruf
                                                                        dipelajari
                                                                    </p>
                                                                )}
                                                            </p>
                                                            {jumlahHurufHariIni >
                                                                0 && (
                                                                <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full">
                                                                    +
                                                                    {
                                                                        jumlahHurufHariIni
                                                                    }{" "}
                                                                    hari ini
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 space-y-3 flex-1">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                Hiragana
                                                            </span>
                                                        </div>
                                                        <span className="font-medium text-violet-700 dark:text-violet-300">
                                                            {hiraganaProgress} /
                                                            113
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                Katakana
                                                            </span>
                                                        </div>
                                                        <span className="font-medium text-purple-700 dark:text-purple-300">
                                                            {katakanaProgress} / 113
                                                            
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-100 dark:border-violet-800/30">
                                                    <div className="flex items-start gap-2">
                                                        <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                                            <span className="font-medium text-violet-800 dark:text-violet-300">
                                                                Tip:
                                                            </span>{" "}
                                                            Fokus pada satu
                                                            jenis huruf sebelum
                                                            beralih ke yang lain
                                                            untuk hasil belajar
                                                            yang lebih baik.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <CardFooter className="flex justify-between items-center p-4 border-t border-violet-100 dark:border-violet-800/30 bg-violet-50/50 dark:bg-violet-900/20 mt-auto">
                                                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-none shadow-sm hover:shadow transition-all duration-300">
                                                    Lihat Huruf
                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                                        {
                                                            lastCompletedHumanReadable
                                                        }
                                                    </span>
                                                </div>
                                            </CardFooter>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="h-full"
                            >
                                <Card className="border-pink-200 dark:border-pink-800/50 bg-white dark:bg-slate-900/60 overflow-hidden group hover:shadow-md transition-all duration-300 relative h-full flex flex-col">
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
                                        <div className="absolute top-0 right-0 w-40 h-40">
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute text-pink-900 dark:text-pink-300 text-4xl"
                                                        style={{
                                                            top: `${
                                                                Math.random() *
                                                                100
                                                            }%`,
                                                            left: `${
                                                                Math.random() *
                                                                100
                                                            }%`,
                                                            opacity: 0.3,
                                                            transform: `rotate(${
                                                                Math.random() *
                                                                360
                                                            }deg)`,
                                                        }}
                                                    >
                                                        語
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <CardContent className="p-0 flex-1 flex flex-col">
                                        <div className="relative flex-1 flex flex-col">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200/50 to-transparent dark:from-pink-800/20 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />

                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                                                        <BookOpen className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                            Kosakata Dipelajari
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            {jumlahKosakata >
                                                            0 ? (
                                                                <>
                                                                    <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                                                                        {
                                                                            jumlahKosakata
                                                                        }
                                                                    </p>
                                                                    {jumlahKosakataHariIni >
                                                                        0 && (
                                                                        <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full">
                                                                            +
                                                                            {
                                                                                jumlahKosakataHariIni
                                                                            }{" "}
                                                                            hari
                                                                            ini
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <p className="text-sm text-pink-700 dark:text-pink-300">
                                                                    Belum ada
                                                                    kosakata
                                                                    dipelajari
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 space-y-3 flex-1">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                kosakata
                                                            </span>
                                                        </div>
                                                        <span className="font-medium text-pink-700 dark:text-pink-300">
                                                            {kosakataProgress >
                                                            0
                                                                ? kosakataProgress
                                                                : 0}
                                                            /{maxKosakata}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                Kosakata Favorit
                                                            </span>
                                                        </div>
                                                        <span className="font-medium text-rose-700 dark:text-rose-300">
                                                            {kosakataFavorit > 0
                                                                ? kosakataFavorit
                                                                : 0}
                                                            /{maxKosakata}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30">
                                                    <div className="flex items-start gap-2">
                                                        <Zap className="h-5 w-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                                            <span className="font-medium text-pink-800 dark:text-pink-300">
                                                                Tip:
                                                            </span>{" "}
                                                            Pelajari kosakata di
                                                            platofrm kami dan
                                                            praktikkan
                                                            penggunaannya secara
                                                            langsung.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <CardFooter className="flex justify-between items-center p-4 border-t border-pink-100 dark:border-pink-800/30 bg-pink-50/50 dark:bg-pink-900/20 mt-auto">
                                                <Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-none shadow-sm hover:shadow transition-all duration-300">
                                                    Lihat Kosakata
                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                                {lastCompletedHumanReadableKosakata ? (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                                            {
                                                                lastCompletedHumanReadableKosakata
                                                            }
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                                            Belum ada kosakata
                                                            dipelajari
                                                        </span>
                                                    </div>
                                                )}
                                            </CardFooter>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Learning Chart - Enhanced */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mb-10"
                        >
                            <Card className="border-border dark:border-slate-800 bg-card dark:bg-slate-900/60 overflow-hidden shadow-md">
                                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/30 dark:to-pink-900/30 border-b border-border/50 dark:border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2.5 rounded-lg shadow-md">
                                            <TrendingUp className="h-5 w-5 text-white" />
                                        </div>
                                        <CardTitle className="text-lg font-medium text-foreground dark:text-white">
                                            Statistik Pembelajaran
                                        </CardTitle>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="h-3 w-3 rounded-full bg-violet-500"></span>
                                            <span className="text-sm text-muted-foreground dark:text-slate-300">
                                                Huruf
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-3 w-3 rounded-full bg-pink-500"></span>
                                            <span className="text-sm text-muted-foreground dark:text-slate-300">
                                                Kosakata
                                            </span>
                                        </div>
                                        <Select
                                            value={chartPeriod}
                                            onValueChange={setChartPeriod}
                                        >
                                            <SelectTrigger className="w-[150px] border-border dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-foreground dark:text-slate-300">
                                                <SelectValue placeholder="Pilih periode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="weekly">
                                                    Mingguan
                                                </SelectItem>
                                                <SelectItem value="monthly">
                                                    Bulanan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="relative">
                                        <div className="absolute left-4 top-4 md:left-10 md:top-10 rounded-lg bg-white/90 dark:bg-slate-800/90 p-3 backdrop-blur-sm z-10 shadow-md border border-slate-200/50 dark:border-slate-700/50">
                                            <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">
                                                {chartPeriod === "weekly" ? "Minggu Ini" : "Bulan Ini"}
                                            </p>
                                            <p className="text-xs text-muted-foreground dark:text-slate-400">
                                                {new Date().toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div className="h-[350px] w-full overflow-x-auto custom-scrollbar p-4">
                                            <div className={`min-w-full ${chartPeriod === "monthly" ? "md:min-w-[800px]" : ""}`}>
                                                <BarChart
                                                    period={chartPeriod}
                                                    data={chartData}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/30 dark:to-pink-900/30 border-t border-border/50 dark:border-slate-700/50">
                                        <div className="flex flex-wrap gap-4 justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/50">
                                                    <Award className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        Hari terbaik
                                                    </p>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        Rabu, 15 Mei
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/50">
                                                    <ArrowUpRight className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        Peningkatan
                                                    </p>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        +23% dari bulan lalu
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                className="border-violet-200 dark:border-violet-800/50 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                                            >
                                                Lihat Analisis Lengkap{" "}
                                                <ChevronRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Progress Pembelajaran - Enhanced */}
                        <motion.div
                            ref={progressSectionRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="mb-10"
                        >
                            <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-pink-500/10 dark:from-violet-800/30 dark:via-purple-800/20 dark:to-pink-800/20 p-3 rounded-lg">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Target className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">
                                    Progress Pembelajaran
                                </h2>
                            </div>

                            {pembelajaranProgress.length === 0 ? (
                                <Card className="p-6 text-center">
                                    <p className="text-muted-foreground">
                                        Belum ada progress pembelajaran.
                                    </p>
                                    <Button className="mt-4 bg-violet-600 hover:bg-violet-700">
                                        Mulai Belajar Sekarang
                                    </Button>
                                </Card>
                            ) : (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid gap-4"
                                >
                                    {pembelajaranProgress.map((item, index) => (
                                        <ProgressItem
                                            key={item.id}
                                            name={item.nama}
                                            type={item.tipe}
                                            description={item.desk}
                                            progress={item.progress}
                                            max={item.max}
                                            status={item.status}
                                            lastStudied={item.last_completed_at}
                                            routeName={item.route_name}
                                            routeParams={item.route_params}
                                            level={item.jenis}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}

function ProgressItem({
    name,
    type,
    description,
    progress,
    max,
    status,
    lastStudied,
    routeName,
    routeParams,
    level,
}) {
    const progressPercent = Math.round((progress / max) * 100);

    // Parse route params jika berupa string JSON
    const parsedRouteParams = typeof routeParams === 'string' ? JSON.parse(routeParams) : (routeParams || {});

    // Generate gradient colors based on the color prop
    const getBgColor = () => {
        return "bg-violet-100 dark:bg-violet-900/30";
    };

    const getBorderColor = () => {
        return "border-violet-200 dark:border-violet-800/50";
    };

    const getProgressColor = () => {
        return "bg-gradient-to-r from-violet-500 to-purple-600";
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "selesai":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
            case "belajar":
                return "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300";
            case "belum":
                return "bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-300";
            default:
                return "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300";
        }
    };

    // Get button text based on progress
    const getButtonText = () => {
        if (progressPercent === 100) return "Ulangi";
        if (progressPercent > 0) return "Lanjutkan";
        return "Mulai";
    };

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="group"
        >
            <Card
                className={`${getBorderColor()} bg-white dark:bg-slate-900/60 overflow-hidden hover:shadow-md transition-all duration-300 relative`}
            >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-40 h-40">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute text-violet-900 dark:text-violet-300 text-4xl"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: 0.3,
                                    transform: `rotate(${Math.random() * 360}deg)`,
                                }}
                            >
                                {type === "huruf" ? "あ" : "語"}
                            </div>
                        ))}
                    </div>
                </div>

                <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-shrink-0">
                            <div
                                className={`${getBgColor()} p-3 rounded-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            
                                    <BookOpen className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                            {name}
                                        </h3>
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(
                                                status
                                            )}`}
                                        >
                                            {status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                        {description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                            <Bookmark className="h-3 w-3 text-violet-500" />
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                {type === "huruf" ? "Huruf" : "Kosakata"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                            <Clock className="h-3 w-3 text-violet-500" />
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                {lastStudied ? `selesai ${lastStudied}` : "Belum selesai"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right mt-1 sm:mt-0">
                                    <div className="flex items-center gap-1 justify-end mb-1">
                                        <span className="text-lg font-bold text-violet-700 dark:text-violet-300">
                                            {progress}
                                        </span>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            / {max}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {progressPercent}% selesai
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 space-y-3">
                                <div className="relative pt-1">
                                    <div className="flex mb-1 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block text-slate-600 dark:text-slate-400">
                                                Progress
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                                        <div
                                            style={{
                                                width: `${progressPercent}%`,
                                            }}
                                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor()} transition-all duration-500 ease-in-out`}
                                        ></div>
                                    </div>
                                </div>

                                {routeName && (
                                    <div className="flex justify-end">
                                        <Link
                                            href={route(routeName, parsedRouteParams)}
                                            className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm hover:shadow transition-all duration-300 text-sm font-medium"
                                        >
                                            {getButtonText()}
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
