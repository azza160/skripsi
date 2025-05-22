import { motion } from "framer-motion";

export function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-2xl p-8 shadow-xl"
      >
        <div className="flex flex-col items-center">
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
            className="mt-4 text-gray-600 font-medium"
          >
            Mohon tunggu...
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
} 