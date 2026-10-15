import { useState } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";



const Accordion = ({accordingData} : {accordingData: { title: string; description: string }[] }) => {
  const [isAccordingOpen, setIsAccordingOpen] = useState<number | null>(0);

  const handleClick = (index: number) =>
    setIsAccordingOpen((prevIndex) => (prevIndex === index ? null : index));

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="flex gap-3 flex-col w-full"
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {accordingData?.map((according, index) => (
        <motion.article
          key={index}
          className="border-b border-neutral-97 py-5 hover:border-primary-20 transform duration-300"
          variants={itemVariants}
          layout
        >
          <motion.div
            className="flex gap-2 cursor-pointer items-center justify-between w-full"
            onClick={() => handleClick(index)}
          >
            <h2 className="text-neutral-10 font-medium leading-[22px]">
              {according.title}
            </h2>
            <p>
              <IoChevronDownSharp
                className={`text-[1.2rem] text-neutral-10 transition-all duration-300 ${
                  isAccordingOpen === index && "rotate-180deg text-primary-10"
                }`}
              />
            </p>
          </motion.div>

          <AnimatePresence initial={false}>
            {isAccordingOpen === index && (
              <motion.section
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto", marginTop: "16px" },
                  collapsed: { opacity: 0, height: 0, marginTop: "0px" },
                }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <p className="text-neutral-30 text-sm leading-5">
                  {according.description}
                </p>
              </motion.section>
            )}
          </AnimatePresence>
        </motion.article>
      ))}
    </motion.div>
  );
};

export default Accordion;