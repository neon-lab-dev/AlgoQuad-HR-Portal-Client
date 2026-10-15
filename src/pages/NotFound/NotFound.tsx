import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { IMAGES } from "../../assets";
import Button from "../../components/Reusable/Button/Button";

const NotFound = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "anticipate",
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.img
        src={IMAGES.notFound}
        alt="404-not found"
        variants={imageVariants}
      />
      <motion.p
        className="text-neutral-20 text-base md:text-xl font-medium leading-6 font-Montserrat mt-8 mb-8 md:mb-[62px] text-center px-4"
        variants={itemVariants}
      >
        Oops! We seem to have run into a bit of a problem with this page.
      </motion.p>
      <motion.div variants={itemVariants}>
        <Link to="/" className="">
          <Button label="Go back to home" variant="primary" />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
