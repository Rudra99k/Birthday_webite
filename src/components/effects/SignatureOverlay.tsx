import { motion } from "framer-motion";

/**
 * SignatureOverlay — shown briefly when the "R" keyboard shortcut fires.
 * A simple centered, glowing signature line.
 */
export function SignatureOverlay() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[59] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.p
        className="font-hand glow-rose text-3xl text-gradient md:text-5xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        Made With ❤️ By Rudra
      </motion.p>
    </motion.div>
  );
}
