import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface HeroHeadingProps {
  lines: string[];
  delayPerLine?: number;
  className?: string;
}

const HeroHeading = ({
  lines,
  delayPerLine = 0.2,
  className = "",
}: HeroHeadingProps) => {
  return (
    <h1
      className={twMerge(
        "text-[32px] lg:text-[64px] font-bold leading-9 lg:leading-[70px] text-neutral-10 text-center max-w-[750px] mx-auto mt-9",
        className
      )}
    >
      {lines.map((line, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * delayPerLine,ease: "easeOut"  }}
          className="block"
        >
          {line}
        </motion.span>
      ))}
    </h1>
  );
};

export default HeroHeading;
