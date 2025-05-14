"use client"

import { useState } from "react"
import { Lock, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from '@inertiajs/react' // 1. Tambahkan import ini

const sidebarLinkVariants = cva(
  "group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ease-in-out",
  {
    variants: {
      isActive: {
        true: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground",
        false: "text-foreground/80 dark:text-foreground/70 hover:bg-muted/80 dark:hover:bg-slate-800/80",
      },
      isOpen: {
        true: "h-14",
        false: "h-12 justify-center",
      },
      highlight: {
        true: "bg-primary text-white dark:bg-violet-600 dark:text-white hover:bg-primary/90 dark:hover:bg-violet-700/90",
        false: "",
      },
      isLocked: {
        true: "bg-slate-100 dark:bg-slate-800/50 opacity-75 hover:bg-slate-200/80 dark:hover:bg-slate-800/60",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
      isOpen: true,
      highlight: false,
      isLocked: false,
    },
  },
)

const iconContainerVariants = cva("flex items-center justify-center transition-all duration-200 ease-in-out", {
  variants: {
    isOpen: {
      true: "h-9 w-9 rounded-lg",
      false: "h-8 w-8 rounded-full",
    },
    isActive: {
      true: "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground",
      false: "",
    },
    highlight: {
      true: "bg-white/20 text-white",
      false: "",
    },
  },
  defaultVariants: {
    isOpen: true,
    isActive: false,
    highlight: false,
  },
})

export function SidebarLink({
  icon,
  label,
  badge,
  isActive = false,
  isOpen = true,
  highlight = false,
  locked = false,
  href = "#",
  children = null,
  isDropdown = false,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Determine if this is a lock link
  const hasLock = locked
  const hasDropdown = isDropdown && children

  const handleDropdownToggle = (e) => {
    if (hasDropdown) {
      e.preventDefault()
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  const LinkComponent = hasDropdown ? 'a' : Link


  return (
    <>
       <motion.div
        whileHover={{ x: isOpen ? 4 : 0, scale: locked ? 1 : 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <LinkComponent
          href={hasDropdown ? "#" : href}
          onClick={handleDropdownToggle}
          className={cn(
            sidebarLinkVariants({ isActive, isOpen, highlight, isLocked: locked }),
            isActive && !highlight && "border-l-4 border-primary dark:border-primary",
            "flex items-center w-full" // 3. Tambahkan class flex dan w-full
          )}
        >
          {/* 4. Biarkan semua konten di dalamnya tetap sama persis */}
          <div
            className={cn(
              iconContainerVariants({
                isOpen,
                isActive: isActive && !highlight,
                highlight: isActive && highlight,
              }),
            )}
          >
            {icon}
          </div>

          {isOpen && (
            <>
              <div className="flex-1 min-w-0">
                <span
                  className={cn(
                    "font-medium transition-all duration-200 sidebar-link-text",
                    isActive ? "text-base" : "text-sm",
                    highlight && "text-white",
                    locked && "text-slate-500 dark:text-slate-400",
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Lock Icon */}
              {hasLock && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 shadow-sm">
                  <Lock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                </div>
              )}

              {/* Dropdown Chevron */}
              {hasDropdown && (
                <div className="flex items-center justify-center h-8 w-8">
                  {isDropdownOpen ? (
                    <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  )}
                </div>
              )}

              {/* Regular Badge */}
              {badge && !hasLock && !hasDropdown && (
                <span
                  className={cn(
                    "flex min-w-[1.5rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium",
                    isActive && highlight
                      ? "bg-white/20 text-white"
                      : isActive
                        ? "bg-primary dark:bg-violet-600 text-white"
                        : "bg-muted dark:bg-slate-700 text-foreground dark:text-white",
                  )}
                >
                  {badge}
                </span>
              )}
            </>
          )}
        </LinkComponent>
      </motion.div>

  
    </>
  )
}
