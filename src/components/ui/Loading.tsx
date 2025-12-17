import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Orbiting Mathematical Symbols */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          {/* Central Core */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
              <span className="text-3xl font-bold text-primary">∑</span>
            </div>
          </motion.div>

          {/* Orbiting Symbols - Outer Ring */}
          {["∫", "π", "√", "∞"].map((symbol, index) => {
            const angle = (index * 360) / 4;
            return (
              <motion.div
                key={`outer-${symbol}`}
                className="absolute w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur-sm border border-primary/40"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: -360,
                }}
                transition={{
                  opacity: { delay: index * 0.1, duration: 0.5 },
                  scale: { delay: index * 0.1, duration: 0.5 },
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                }}
                style={{
                  left: `calc(50% - 24px + ${Math.cos((angle * Math.PI) / 180) * 64}px)`,
                  top: `calc(50% - 24px + ${Math.sin((angle * Math.PI) / 180) * 64}px)`,
                }}
              >
                <motion.span
                  className="text-xl font-bold text-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  {symbol}
                </motion.span>
              </motion.div>
            );
          })}

          {/* Orbiting Symbols - Inner Ring */}
          {["Δ", "θ", "α"].map((symbol, index) => {
            const angle = (index * 360) / 3 + 60;
            return (
              <motion.div
                key={`inner-${symbol}`}
                className="absolute w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 backdrop-blur-sm border border-secondary/30"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 360,
                }}
                transition={{
                  opacity: { delay: 0.3 + index * 0.1, duration: 0.5 },
                  scale: { delay: 0.3 + index * 0.1, duration: 0.5 },
                  rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                }}
                style={{
                  left: `calc(50% - 16px + ${Math.cos((angle * Math.PI) / 180) * 40}px)`,
                  top: `calc(50% - 16px + ${Math.sin((angle * Math.PI) / 180) * 40}px)`,
                }}
              >
                <motion.span
                  className="text-sm font-bold text-secondary"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  {symbol}
                </motion.span>
              </motion.div>
            );
          })}

          {/* Pulsing Rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [0.5, 1.5, 1.5],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Loading Text with Animated Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold mb-2">
            <motion.span
              className="inline-block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            >
              Loading Mathematics
            </motion.span>
          </h2>
          
          {/* Animated Dots */}
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="text-primary text-2xl font-bold"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              >
                .
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Progress Bar with Shimmer Effect */}
        <motion.div
          className="w-80 max-w-[90vw] mx-auto mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm border border-primary/20">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => {
            const startX = Math.random() * 100;
            const endX = startX + (Math.random() - 0.5) * 20;
            return (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: `${startX}vw`,
                  y: "110vh",
                  opacity: 0,
                }}
                animate={{
                  x: `${endX}vw`,
                  y: "-10vh",
                  opacity: [0, 0.6, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear",
                }}
              >
                <div
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))`,
                    boxShadow: "0 0 4px hsl(var(--primary))",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Status Text */}
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Preparing your learning experience
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;