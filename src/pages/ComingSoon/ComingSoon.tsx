import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { FaRocket, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import Button from "../../components/Reusable/Button/Button";

const ComingSoon = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "backOut",
      },
    },
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Icon */}
      <motion.div
        className="relative mb-8"
        variants={iconVariants}
        animate={["visible", "float"]}
        whileHover="hover"
      >
        <div className="relative">
          <FaRocket className="text-6xl md:text-8xl text-secondary-10" />
          <motion.div
            className="absolute -bottom-2 -right-2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FaRocket className="text-2xl md:text-4xl text-secondary-10/50" />
          </motion.div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-gray-800 font-Montserrat mb-4 text-center"
        variants={itemVariants}
      >
        Coming Soon
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-gray-600 font-medium text-center max-w-2xl mb-8 leading-relaxed"
        variants={itemVariants}
      >
        Something amazing is on the way! We're working hard to bring you an
        incredible experience. Stay tuned for the launch.
      </motion.p>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl w-full"
        variants={containerVariants}
      >
        {[
          {
            icon: FaRocket,
            title: "Innovative Features",
            description:
              "Cutting-edge technology that will revolutionize your experience",
          },
          {
            icon: FaEnvelope,
            title: "Stay Updated",
            description:
              "Get notified when we launch. Be the first to try it out!",
          },
          {
            icon: FaCalendarAlt,
            title: "Launching Soon",
            description: "We're putting the final touches on everything",
          },
        ].map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 text-center"
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* <motion.div
              className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <feature.icon className="text-2xl text-secondary-10" />
            </motion.div> */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Coming Soon
            </h3>
            {/* <p className="text-gray-600 text-sm">{feature.description}</p> */}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-center"
        variants={itemVariants}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/">
            <Button label="Back Home" variant="primary" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-20 left-10 text-indigo-200 text-4xl opacity-30"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FaRocket />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-indigo-200 text-4xl opacity-30"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <FaCalendarAlt />
      </motion.div>
    </motion.div>
  );
};

export default ComingSoon;
