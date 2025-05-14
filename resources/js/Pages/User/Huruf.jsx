import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Onboarding from "../../components/Onboarding";
import DashboardLayout from "../../Layouts/DashboardLayout";
import {
    Home,
    ChevronRight,
    BookText,
    Type,
    Lock,
    Unlock,
    LightbulbIcon,
    ArrowRight,
    GraduationCap,
    ArrowLeft,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export default function DashboardUser() {
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [showContent, setShowContent] = useState(false);

    // Simulasi level pengguna - dalam implementasi nyata, ini akan diambil dari state aplikasi
    const [userLevel, setUserLevel] = useState(2);
    const [isLoaded, setIsLoaded] = useState(false);

    // Level minimum untuk membuka Katakana
    const katakanaRequiredLevel = 3;
    const isKatakanaUnlocked = userLevel >= katakanaRequiredLevel;

    // Untuk demo: toggle level
    const toggleLevel = () => {
        setUserLevel((prev) => (prev >= katakanaRequiredLevel ? 1 : 3));
    };

    // Animasi variants
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
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    // Simulasi loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-pulse text-primary">Loading...</div>
            </div>
        );
    }

    const handleCompleteOnboarding = () => {
        // Trigger animation out
        setShowOnboarding(false);

        // Set timeout untuk animasi sebelum konten muncul
        setTimeout(() => setShowContent(true), 500);
    };

    return (
        <DashboardLayout>
            <AnimatePresence>
                {showOnboarding && (
                    <motion.div
                        key="onboarding"
                        initial={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            y: -50,
                            transition: {
                                duration: 0.5,
                                ease: "easeInOut",
                            },
                        }}
                    >
                        <Onboarding onComplete={handleCompleteOnboarding} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showContent && (
                    <div className=" text-foreground">
                        <div className="max-w-6xl mx-auto px-4 ">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center space-x-2 text-sm bg-gradient-to-r from-background to-muted/50 dark:from-slate-950 dark:to-slate-900/50 p-3 rounded-lg shadow-sm border border-border/50 dark:border-slate-800/50  mb-[50px] w-fit"
                            >
                                <div className="flex flex-wrap items-center space-x-2">
                                    <Link href={route("dashboard")}>
                                        <span className="text-muted-foreground dark:text-slate-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300">
                                            Dashboard
                                        </span>
                                    </Link>
                                    <span className="text-primary dark:text-violet-400">
                                        /
                                    </span>
                                    <Link href={route("huruf")}>
                                        <span className="text-violet-400 dark:text-violet-600">
                                            Huruf Jepang
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

                            {/* Header Section dengan desain yang ditingkatkan */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="mb-12 text-center relative"
                            >
                                <div className="py-8 px-4 relative z-0 bg-violet-300/20 dark:bg-violet-500/20 rounded-lg">
                                    <div className="inline-block mb-4 bg-violet-500/20 p-2 rounded-full">
                                        <GraduationCap className="h-8 w-8 text-slate-900 dark:text-slate-200" />
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 dark:text-slate-200 capitalize">
                                        Pilih Huruf untuk Dipelajari
                                    </h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                                        Pilih jenis huruf Jepang yang ingin kamu
                                        pelajari, mulai dari
                                        <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                                            Hiragana
                                        </span>
                                        hingga
                                        <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                                            Katakana
                                        </span>
                                        , dan mulai perjalanan belajarmu
                                        sekarang!
                                        <br />
                                        <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                                            Ayo pilih huruf yang ingin kamu
                                            pelajari!
                                        </span>
                                    </p>
                                </div>
                            </motion.div>

                            {/* Alphabet Cards */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
                            >
                                {/* Hiragana Card */}
                                <motion.div variants={itemVariants}>
                                    <Card className="overflow-hidden border border-border hover:shadow-md transition-all duration-300 rounded-2xl h-full">
                                        <div className="bg-gradient-to-r from-primary/10 to-primary/20 p-6 flex justify-between items-center">
                                            <BookText className="text-primary h-12 w-12" />
                                            <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full flex items-center">
                                                <Unlock
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                Terbuka
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-2xl flex items-center">
                                                Hiragana
                                                <span className="ml-2 text-3xl font-normal text-primary">
                                                    ひらがな
                                                </span>
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                Huruf dasar yang digunakan untuk
                                                kata-kata asli Jepang di
                                                kehidupan sehari-hari
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-start">
                                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                                                        <span className="text-primary text-xs">
                                                            1
                                                        </span>
                                                    </div>
                                                    <span>
                                                        46 karakter dasar yang
                                                        mudah dipelajari
                                                    </span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                                                        <span className="text-primary text-xs">
                                                            2
                                                        </span>
                                                    </div>
                                                    <span>
                                                        Digunakan untuk menulis
                                                        kata kerja dan partikel
                                                    </span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                                                        <span className="text-primary text-xs">
                                                            3
                                                        </span>
                                                    </div>
                                                    <span>
                                                        Bentuk lebih bulat dan
                                                        lembut
                                                    </span>
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Link
                                                href={route(
                                                    "kategori-huruf-hiragana"
                                                )}
                                                className="w-full"
                                            >
                                                <Button className="w-full group py-5 xl:py-6">
                                                    Mulai Belajar Hiragana
                                                    <ArrowRight
                                                        size={16}
                                                        className="ml-2 group-hover:translate-x-1 transition-transform"
                                                    />
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Card className="overflow-hidden border border-border hover:shadow-md transition-all duration-300 rounded-2xl h-full">
                                        <div className="bg-gradient-to-r from-primary/10 to-primary/20 p-6 flex justify-between items-center">
                                            <BookText className="text-primary h-12 w-12" />
                                            <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full flex items-center">
                                                <Unlock
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                Terbuka
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-2xl flex items-center">
                                                Katakana
                                                <span className="ml-2 text-3xl font-normal text-primary">
                                                カタカナ
                                                </span>
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                            Huruf yang digunakan untuk kata
                                                serapan dari bahasa asing dalam
                                                kehidupan sehari-hari.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-start">
                                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                                                        <span className="text-primary text-xs">
                                                            1
                                                        </span>
                                                    </div>
                                                    <span>
                                                    46 karakter dengan
                                                    bentuk yang lebih tegas
                                                    </span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                                                        <span className="text-primary text-xs">
                                                            2
                                                        </span>
                                                    </div>
                                                    <span>
                                                    Digunakan untuk
                                                        kata-kata dari bahasa
                                                        asing
                                                    </span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                                                        <span className="text-primary text-xs">
                                                            3
                                                        </span>
                                                    </div>
                                                    <span>
                                                    Penting untuk membaca
                                                    nama tempat dan merek
                                                    </span>
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Link
                                                href={route(
                                                    "kategori-huruf-katakana"
                                                )}
                                                className="w-full"
                                            >
                                                <Button className="w-full group py-5 xl:py-6">
                                                    Mulai Belajar Katakana
                                                    <ArrowRight
                                                        size={16}
                                                        className="ml-2 group-hover:translate-x-1 transition-transform"
                                                    />
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </motion.div>

                                
                            </motion.div>

                            {/* Tips/Insight Cards */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10"
                                custom={1}
                            >
                                <motion.div
                                    variants={itemVariants}
                                    custom={1}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Card className="bg-amber-50 border border-border dark:border-slate-800 bg-background dark:bg-slate-950">
                                        <CardContent className="p-4 flex items-start">
                                            <LightbulbIcon className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm sm:text-base md:text-md leading-relaxed text-muted-foreground md:text-justify">
                                                <span className="font-medium dark:text-slate-300">
                                                    Asal usul Hiragana :
                                                </span>{" "}
                                                Berasal dari bentuk kursif Kanji
                                                yang disederhanakan untuk
                                                memudahkan penulisan sehari-hari
                                                secara lebih cepat, efisien, dan
                                                mudah dipahami.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    custom={2}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Card className="bg-blue-50 border border-border dark:border-slate-800 bg-background dark:bg-slate-950">
                                        <CardContent className="p-4 flex items-start">
                                            <GraduationCap className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm sm:text-base md:text-md leading-relaxed text-muted-foreground md:text-justify">
                                                <span className="font-medium dark:text-slate-300">
                                                    Tips belajar :
                                                </span>{" "}
                                                Mulailah dengan mempelajari 5
                                                karakter Hiragana setiap hari
                                                dan latih pengucapannya. Dalam
                                                waktu 10 hari, kamu akan
                                                menguasai semua karakter dasar!
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            {/* Level Info / FAQ */}
                            {!isKatakanaUnlocked && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                    className="text-center mb-10"
                                >
                                    <p className="text-muted-foreground text-sm bg-card p-4 rounded-xl border border-border inline-flex items-center">
                                        <Lock size={14} className="mr-2" />
                                        Katakana akan terbuka setelah kamu
                                        menyelesaikan 3 pelajaran Hiragana.
                                    </p>
                                </motion.div>
                            )}

                            {/* Call-to-Action Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.4 }}
                                className="text-center"
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="group"
                                >
                                    Lihat Panduan Belajar
                                    <ArrowRight
                                        size={16}
                                        className="ml-2 group-hover:translate-x-1 transition-transform"
                                    />
                                </Button>
                            </motion.div>

                            {/* Demo Level Toggle (hanya untuk demonstrasi) */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="mt-8 text-center"
                            >
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={toggleLevel}
                                    className="text-xs"
                                >
                                    {isKatakanaUnlocked
                                        ? "Demo: Kunci Katakana"
                                        : "Demo: Buka Katakana"}
                                </Button>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Level saat ini: {userLevel}{" "}
                                    {isKatakanaUnlocked
                                        ? "(Katakana terbuka)"
                                        : "(Katakana terkunci)"}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
