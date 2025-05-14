"use client";
import { motion } from "framer-motion";
import {
    LockIcon,
    BookOpenIcon,
    ArrowRightIcon,
    InfoIcon,
    CheckCircleIcon,
    StarIcon,
    TrendingUpIcon,
    BookIcon,
    GraduationCapIcon,
    SparklesIcon,
    GraduationCap,
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
import { useState } from "react";
import Dashboard from "../../Layouts/DashboardLayout";
import { Link } from "@inertiajs/react";

// Define category data
const categories = [
    {
        id: "gojuon",
        title: "Gojuon",
        icon: "ごじゅおん",
        description:
            "Huruf dasar Hiragana yang terdiri dari 46 karakter, disusun dalam baris dan kolom berdasarkan bunyi vokal dan konsonan.",
        unlocked: true,
        progress: 85,
        color: "from-indigo-500 to-purple-600",
        bgPattern:
            "radial-gradient(circle, rgba(99, 102, 241, 0.15) 1px, transparent 1px)",
        examples: ["あ い う え お", "か き く け こ", "さ し す せ そ"],
        featured: true,
        featuredChars: ["あ", "い", "う", "え", "お"],
    },
    {
        id: "dakuten",
        title: "Dakuten",
        icon: "だくてん",
        description:
            "Huruf dengan tanda ゛yang mengubah bunyi konsonan menjadi bersuara.",
        unlocked: true,
        progress: 65,
        color: "from-violet-500 to-purple-600",
        bgPattern:
            "radial-gradient(circle, rgba(139, 92, 246, 0.15) 1px, transparent 1px)",
        examples: ["か → が", "さ → ざ", "た → だ"],
    },
    {
        id: "handakuten",
        title: "Handakuten",
        icon: "はんだくてん",
        description:
            "Huruf dengan tanda ゜yang mengubah bunyi konsonan menjadi semi-bersuara.",
        unlocked: true,
        progress: 30,
        color: "from-blue-500 to-cyan-600",
        bgPattern:
            "radial-gradient(circle, rgba(56, 189, 248, 0.15) 1px, transparent 1px)",
        examples: ["は → ぱ", "ひ → ぴ", "ふ → ぷ"],
    },
    {
        id: "youon",
        title: "Youon",
        icon: "ようおん",
        description:
            "Kombinasi kecil ya, yu, yo (ゃ,ゅ,ょ) dan konsonan membentuk bunyi baru.",
        unlocked: true,
        progress: 0,
        color: "from-emerald-500 to-teal-600",
        bgPattern:
            "radial-gradient(circle, rgba(16, 185, 129, 0.15) 1px, transparent 1px)",
        examples: ["き + ゃ = きゃ", "し + ゅ = しゅ", "ち + ょ = ちょ"],
    },
    {
        id: "sokuon",
        title: "Sokuon",
        icon: "そくおん",
        description:
            "Huruf tsu kecil (っ) yang menggandakan konsonan berikutnya.",
        unlocked: true,
        progress: 0,
        color: "from-rose-500 to-pink-600",
        bgPattern:
            "radial-gradient(circle, rgba(244, 63, 94, 0.15) 1px, transparent 1px)",
        examples: ["か + っ + か = かっか", "さ + っ + さ = さっさ"],
    },
    {
      id: "choon",
      title: "Chōon",
      icon: "ちょうおん",
      description:
          "Cara memanjangkan bunyi vokal dalam hiragana dengan menambahkan huruf vokal yang sesuai setelah vokal yang ingin dipanjangkan.",
      unlocked: true,
      progress: 0,
      color: "from-purple-500 to-violet-600",
      bgPattern:
          "radial-gradient(circle, rgba(156, 39, 176, 0.15) 1px, transparent 1px)",
      examples: ["おかあさん (okaasan - ibu)", "おにいさん (oniisan - kakak laki-laki)", "くうき (kuuki - udara)"],
    }
];

// Tips data
const tips = [
    {
        icon: "🔍",
        title: "Tahukah kamu?",
        content:
            "Dakuten adalah tanda yang mengubah suara konsonan menjadi bersuara, seperti か (ka) menjadi が (ga).",
        color: "bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200",
        iconBg: "bg-amber-200",
    },
    {
        icon: "💡",
        title: "Tips Belajar",
        content:
            "Latih pengucapan dengan membaca keras. Perbedaan bunyi akan lebih mudah diingat dengan latihan verbal.",
        color: "bg-gradient-to-br from-sky-100 to-blue-100 border-sky-200",
        iconBg: "bg-sky-200",
    },
];

export default function KategoriHiragana() {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [activeCategory, setActiveCategory] = useState("gojuon"); // Default to gojuon being active
    const [hoveredChar, setHoveredChar] = useState(null);

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
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const progressVariants = {
        initial: { width: 0 },
        animate: (progress) => ({
            width: `${progress}%`,
            transition: { duration: 1, ease: "easeOut" },
        }),
    };

    const charVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.15, transition: { duration: 0.2 } },
    };

    // Filter out the gojuon category
    const gojuonCategory = categories.find((cat) => cat.id === "gojuon");
    const regularCategories = categories.filter((cat) => cat.id !== "gojuon");

    return (
        <Dashboard>
            <div className="text-foreground ">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl -z-10"></div>
                <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl -z-10"></div>

                <div className="max-w-6xl mx-auto px-4 ">
                    {/* Breadcrump*/}
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
                            <Link href={route("kategori-huruf-hiragana")}>
                                <span className="text-violet-400 dark:text-violet-600">
                                    Kategori Huruf Hiragana
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
                                Pilih Kategori Hiragana
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                                Pilih kategori huruf
                                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                                    Hiragana
                                </span>
                                yang ingin kamu pelajari, seperti
                                <span className="relative inline-block mx-1 my-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                                    Gojuon
                                </span>
                                ,
                                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md">
                                    Dakuten
                                </span>
                                , atau
                                <span className="relative inline-block mx-1 px-2 bg-primary/10 dark:bg-primary/30 text-primary dark:text-violet-300 rounded-md mt-1">
                                    Handakuten
                                </span>
                                .
                                <br />
                                <span className="text-sm inline-block mt-2 bg-primary/5 px-3 py-1 rounded-full">
                                    Ayo pilih kelompok huruf Hiragana favoritmu!
                                </span>
                            </p>
                        </div>
                    </motion.div>

                    {/* Gojuon Card (Full Width) - Simplified */}
                    {gojuonCategory && (
                        <motion.div
                            className="mb-8"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            onMouseEnter={() => setHoveredCard("gojuon")}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => setActiveCategory("gojuon")}
                        >
                            <Card
                                className={`overflow-auto transition-all duration-500 border-2 ${
                                    activeCategory === "gojuon"
                                        ? "ring-2 ring-primary/50 border-primary/50"
                                        : hoveredCard === "gojuon"
                                        ? "border-primary/30"
                                        : "border-border"
                                } backdrop-blur-sm`}
                                style={{
                                    backgroundImage: gojuonCategory.bgPattern,
                                    backgroundSize: "30px 30px",
                                    boxShadow:
                                        activeCategory === "gojuon"
                                            ? "0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.05)"
                                            : hoveredCard === "gojuon"
                                            ? "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
                                            : "none",
                                }}
                            >
                                <div
                                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gojuonCategory.color}`}
                                ></div>

                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className={`h-auto py-2 lg:py-3 px-3 lg:px-5  text-xl lg:text-2xl font-japanese rounded-xl border-2 bg-gradient-to-br ${gojuonCategory.color} text-white shadow-md`}
                                                >
                                                    {gojuonCategory.icon}
                                                </Button>
                                            </motion.div>
                                            <motion.div
                                                className="rounded-full bg-primary/10 p-1.5 lg:p-2.5 border border-primary/20"
                                                initial={{ scale: 0 }}
                                                animate={{
                                                    scale: 1,
                                                    rotate: [0, 15, 0],
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.5,
                                                }}
                                            >
                                                {gojuonCategory.progress >=
                                                80 ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-primary" />
                                                ) : (
                                                    <TrendingUpIcon className="h-5 w-5 text-primary" />
                                                )}
                                            </motion.div>
                                        </div>

                                        <CardTitle className=" sm:text-2xl lg:text-3xl mb-2 flex items-center gap-2">
                                            {gojuonCategory.title}
                                            {gojuonCategory.progress >= 50 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        delay: 1,
                                                        type: "spring",
                                                    }}
                                                >
                                                    <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400" />
                                                </motion.div>
                                            )}
                                        </CardTitle>

                                        <CardDescription className="text-base lg:text-lg mb-4">
                                            {gojuonCategory.description}
                                        </CardDescription>

                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-full h-2.5 bg-muted/50 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full rounded-full bg-gradient-to-r ${gojuonCategory.color}`}
                                                    custom={
                                                        gojuonCategory.progress
                                                    }
                                                    initial="initial"
                                                    animate="animate"
                                                    variants={progressVariants}
                                                />
                                            </div>
                                            <span className="text-sm font-medium min-w-[40px] text-right">
                                                {gojuonCategory.progress}%
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                <span>46 karakter dasar</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                <span>
                                                    Disusun dalam 10 baris dan 5
                                                    kolom
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                <span>
                                                    Dasar untuk semua kategori
                                                    lainnya
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <Button
                                                className={`w-full group transition-all duration-300 bg-gradient-to-r ${gojuonCategory.color} hover:shadow-lg hover:shadow-indigo-500/20 text-white`}
                                            >
                                                <motion.span
                                                    animate={
                                                        hoveredCard === "gojuon"
                                                            ? {
                                                                  x: [
                                                                      -2, 2, -2,
                                                                      2, 0,
                                                                  ],
                                                              }
                                                            : {}
                                                    }
                                                    transition={{
                                                        duration: 0.5,
                                                    }}
                                                >
                                                    <Link
                                                        href={route(
                                                            "huruf-list",{
                                                              jenis: 'hiragana',
                                                              kategori: 'gojuon',
                                                            }
                                                        )}
                                                    >
                                                        Mulai Belajar Gojuon
                                                    </Link>
                                                </motion.span>
                                                <motion.div
                                                    className="ml-2"
                                                    animate={
                                                        hoveredCard === "gojuon"
                                                            ? { x: [0, 4, 0] }
                                                            : {}
                                                    }
                                                    transition={{
                                                        duration: 0.3,
                                                        repeat:
                                                            hoveredCard ===
                                                            "gojuon"
                                                                ? 1
                                                                : 0,
                                                    }}
                                                >
                                                    <ArrowRightIcon className="h-4 w-4" />
                                                </motion.div>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-6 border-l border-muted/30 flex flex-col justify-center items-center">
                                        <motion.div
                                            className="text-center mb-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="inline-flex items-center gap-2 mb-2">
                                                <GraduationCapIcon className="h-5 w-5 text-indigo-500" />
                                                <h3 className="font-medium text-lg">
                                                    Huruf Vokal Dasar
                                                </h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Mulai dengan mempelajari 5 huruf
                                                vokal dasar Hiragana
                                            </p>
                                        </motion.div>

                                        <div className="flex justify-center gap-3 mb-6">
                                            {gojuonCategory.featuredChars.map(
                                                (char, idx) => (
                                                    <motion.div
                                                        key={`char-${idx}`}
                                                        className="relative"
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            delay:
                                                                0.3 + idx * 0.1,
                                                        }}
                                                        whileHover="hover"
                                                        variants={charVariants}
                                                        onMouseEnter={() =>
                                                            setHoveredChar(char)
                                                        }
                                                        onMouseLeave={() =>
                                                            setHoveredChar(null)
                                                        }
                                                    >
                                                        <div className="h-[50px] w-[50px] lg:h-16 lg:w-16  rounded-full bg-indigo-100 dark:bg-slate-700 border border-primary/20 flex items-center justify-center text-xl lg:text-3xl font-japanese shadow-sm">
                                                            {char}
                                                        </div>
                                                        {hoveredChar ===
                                                            char && (
                                                            <motion.div
                                                                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded whitespace-nowrap z-100"
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: -5,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.2,
                                                                }}
                                                            >
                                                                {idx === 0
                                                                    ? "a"
                                                                    : idx === 1
                                                                    ? "i"
                                                                    : idx === 2
                                                                    ? "u"
                                                                    : idx === 3
                                                                    ? "e"
                                                                    : "o"}
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                )
                                            )}
                                        </div>

                                        <motion.div
                                            className="w-full bg-background rounded-xl border border-muted/50 p-4 text-center"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                        >
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <BookIcon className="h-5 w-5 text-indigo-500" />
                                                <h4 className="font-medium">
                                                    Status Belajar
                                                </h4>
                                            </div>
                                            <div className="flex items-center justify-center gap-6 mt-2">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-indigo-600">
                                                        32
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Karakter Dipelajari
                                                    </p>
                                                </div>
                                                <div className="h-10 w-px bg-muted"></div>
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-indigo-600">
                                                        5
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Level Saat Ini
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            className="mt-4 text-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1 }}
                                        >
                                            <div className="inline-block text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                                                <SparklesIcon className="h-3.5 w-3.5 inline-block mr-1" />
                                                <span>
                                                    Klik karakter untuk melihat
                                                    cara baca
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Regular Categories Grid - Now in two rows */}
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {regularCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                variants={itemVariants}
                                onMouseEnter={() => setHoveredCard(category.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() =>
                                    category.unlocked &&
                                    setActiveCategory(
                                        category.id === activeCategory
                                            ? null
                                            : category.id
                                    )
                                }
                                className="relative"
                            >
                                <Card
                                    className={`overflow-hidden transition-all duration-500 border-2 ${
                                        activeCategory === category.id
                                            ? "ring-2 ring-primary/50 border-primary/50"
                                            : hoveredCard === category.id &&
                                              category.unlocked
                                            ? "border-primary/30"
                                            : "border-border"
                                    } ${
                                        !category.unlocked ? "opacity-80" : ""
                                    } backdrop-blur-sm`}
                                    style={{
                                        backgroundImage: category.bgPattern,
                                        backgroundSize: "30px 30px",
                                        boxShadow:
                                            activeCategory === category.id
                                                ? "0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.05)"
                                                : hoveredCard === category.id &&
                                                  category.unlocked
                                                ? "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
                                                : "none",
                                    }}
                                >
                                    <div
                                        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color}`}
                                    ></div>
                                    <CardHeader className="pb-2 relative">
                                        <div className="flex justify-between items-center">
                                            <motion.div
                                                whileHover={
                                                    category.unlocked
                                                        ? { scale: 1.05 }
                                                        : {}
                                                }
                                                whileTap={
                                                    category.unlocked
                                                        ? { scale: 0.98 }
                                                        : {}
                                                }
                                            >
                                                <Button
                                                    variant="outline"
                                                    className={`h-auto py-3 px-5 text-2xl font-japanese rounded-xl border-2 bg-gradient-to-br ${category.color} text-white shadow-md`}
                                                >
                                                    {category.icon}
                                                </Button>
                                            </motion.div>
                                            {!category.unlocked ? (
                                                <motion.div
                                                    className="rounded-full bg-muted/80 backdrop-blur-sm p-2.5 border border-muted-foreground/20"
                                                    initial={{ rotate: 0 }}
                                                    animate={{
                                                        rotate: [
                                                            0, 5, 0, -5, 0,
                                                        ],
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: 1 + index * 0.2,
                                                        repeat: 1,
                                                    }}
                                                >
                                                    <LockIcon className="h-5 w-5 text-muted-foreground" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    className="rounded-full bg-primary/10 p-2.5 border border-primary/20"
                                                    initial={{ scale: 0 }}
                                                    animate={{
                                                        scale: 1,
                                                        rotate: [0, 15, 0],
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay:
                                                            0.5 + index * 0.2,
                                                    }}
                                                >
                                                    {category.progress >= 80 ? (
                                                        <CheckCircleIcon className="h-5 w-5 text-primary" />
                                                    ) : (
                                                        <TrendingUpIcon className="h-5 w-5 text-primary" />
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl md:text-2xl mt-5 flex items-center gap-2">
                                            {category.title}
                                            {category.progress >= 50 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        delay: 1,
                                                        type: "spring",
                                                    }}
                                                >
                                                    <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400" />
                                                </motion.div>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="text-base md:text-lg">
                                            {category.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-full h-2.5 bg-muted/50 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
                                                    custom={category.progress}
                                                    initial="initial"
                                                    animate="animate"
                                                    variants={progressVariants}
                                                />
                                            </div>
                                            <span className="text-sm font-medium min-w-[40px] text-right">
                                                {category.progress}%
                                            </span>
                                        </div>

                                        {/* Examples section - only visible when active */}
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height:
                                                    activeCategory ===
                                                    category.id
                                                        ? "auto"
                                                        : 0,
                                                opacity:
                                                    activeCategory ===
                                                    category.id
                                                        ? 1
                                                        : 0,
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-2 pb-1">
                                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                                    Contoh:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {category.examples.map(
                                                        (example, i) => (
                                                            <motion.span
                                                                key={i}
                                                                className="inline-block px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-md text-sm border border-border"
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        0.1 * i,
                                                                }}
                                                            >
                                                                {example}
                                                            </motion.span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className={`w-full group transition-all duration-300 ${
                                                !category.unlocked
                                                    ? "bg-muted hover:bg-muted text-muted-foreground"
                                                    : `bg-gradient-to-r ${
                                                          category.color
                                                      } hover:shadow-lg hover:shadow-${
                                                          category.color.split(
                                                              "-"
                                                          )[1]
                                                      }-500/20 text-white`
                                            }`}
                                            disabled={!category.unlocked}
                                        >
                                            <motion.span
                                                animate={
                                                    hoveredCard ===
                                                        category.id &&
                                                    category.unlocked
                                                        ? {
                                                              x: [
                                                                  -2, 2, -2, 2,
                                                                  0,
                                                              ],
                                                          }
                                                        : {}
                                                }
                                                transition={{ duration: 0.5 }}
                                            >
                                                {category.unlocked
                                                    ? <Link href={route('huruf-list',{
                                                      jenis:'hiragana',
                                                      kategori:category.id
                                                    })}>Mulai Belajar {category.title}</Link>
                                                    : "Terkunci"}
                                            </motion.span>
                                            {category.unlocked && (
                                                <motion.div
                                                    className="ml-2"
                                                    animate={
                                                        hoveredCard ===
                                                        category.id
                                                            ? { x: [0, 4, 0] }
                                                            : {}
                                                    }
                                                    transition={{
                                                        duration: 0.3,
                                                        repeat:
                                                            hoveredCard ===
                                                            category.id
                                                                ? 1
                                                                : 0,
                                                    }}
                                                >
                                                    <ArrowRightIcon className="h-4 w-4" />
                                                </motion.div>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Tips Section */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                    >
                        {tips.map((tip, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{
                                    y: -5,
                                    transition: { duration: 0.2 },
                                }}
                            >
                                <Card
                                    className={`border-2 dark:border-slate-800  dark:bg-slate-950 ${tip.iconBg} overflow-hidden`}
                                >
                                    <CardContent className="pt-6 pb-6">
                                        <div className="flex gap-4">
                                            <div
                                                className={`text-2xl ${tip.iconBg} h-12 w-12 rounded-full flex items-center justify-center shadow-sm`}
                                            >
                                                {tip.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-1">
                                                    {tip.title}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {tip.content}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Level Guidance */}
                    <motion.div
                        className="mb-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm border-2 border-muted/50 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                            <CardContent className="pt-8 pb-8">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <InfoIcon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-medium text-lg">
                                        Petunjuk Level
                                    </h3>
                                </div>

                                <div className="space-y-4 max-w-2xl mx-auto">
                                    <motion.div
                                        className="flex items-center gap-3 p-3 rounded-lg bg-background/80 border border-border"
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <LockIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                        <p className="text-muted-foreground">
                                            Youon akan terbuka setelah kamu
                                            menyelesaikan 80% pelajaran Dakuten
                                            dan Handakuten.
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        className="flex items-center gap-3 p-3 rounded-lg bg-background/80 border border-border"
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <LockIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                        <p className="text-muted-foreground">
                                            Sokuon akan terbuka setelah kamu
                                            menyelesaikan 50% pelajaran Youon.
                                        </p>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Button
                                variant="secondary"
                                size="lg"
                                className="group transition-all duration-300 bg-gradient-to-r from-primary/80 to-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 px-8"
                            >
                                <span className="mr-2">
                                    Lihat Panduan Belajar
                                </span>
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                    }}
                                >
                                    <BookOpenIcon className="h-5 w-5" />
                                </motion.div>
                            </Button>
                        </motion.div>

                        <motion.p
                            className="mt-4 text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            Pelajari dasar-dasar Hiragana untuk memulai
                            perjalanan bahasa Jepang Anda
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </Dashboard>
    );
}
