/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Container from "../Container/Container";

interface DetailItem {
  value: React.ReactNode;
  icon?: any;
}

interface ReusableHeroProps {
  details: DetailItem[];
  iconSize?: string;
  bg?: string;
}

const ReusableHeroCards = ({ details }: ReusableHeroProps) => {
  const detailsContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const detailItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="relative font-Montserrat overflow-hidden">
      {/* Background image */}

      <Container>
        <div className="relative z-10 mt-6 pb-0 lg:pb-20 flex items-center justify-center">
          {/* Details Section */}
          <motion.div
            className="flex flex-col xl:flex-row items-start lg:items-center justify-center gap-5 lg:gap-8 xl:gap-3 mt-8 xl:mt-6"
            initial="hidden"
            animate="visible"
            variants={detailsContainerVariants}
          >
            {details.map((item, index, arr) => (
              <motion.div
                key={index}
                className="flex flex-row gap-1 items-center"
                variants={detailItemVariants}
              >
                {/* Icon */}
                <div className="bg-surface-10 size-5 lg:size-8 rounded-full flex justify-center items-center">
                  <img src={item.icon} alt={""} />
                </div>

                {/* Value */}
                <p className="text-neutral-30 text-base lg:text-[13px] 2xl:text-xl font-medium leading-6">
                  {item.value}
                </p>

                {/* Separator */}
                {index !== arr.length - 1 && (
                  <span className="text-neutral-90 text-[28px] font-medium leading-8 mx-2 hidden xl:block">
                    |
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default ReusableHeroCards;
