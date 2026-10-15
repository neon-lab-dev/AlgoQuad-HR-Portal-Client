import SectionTitle from "../../Reusable/Heading/Heading";
import Container from "../../Reusable/Container/Container";
import Accordion from "./Accordion";
import { motion, type Variants } from "framer-motion";

const Faq = () => {
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const accordingData = [
    {
      title: "Are you SEBI-registered?",
      description:
        "Yes. Amandeep Singh Juneja is a SEBI-Registered Investment Adviser (RIA). Registration number will appear on every invoice and email once issued.",
    },
    {
      title: "Do you give stock tips?",
      description:
        "No. We teach frameworks and offer goal-based advice. No intraday or speculative calls in any paid or free channel.",
    },
    {
      title: "How are you compensated?",
      description:
        "100% fee-only. We do not accept commissions, referral fees, or brokerage kick-backs.",
    },
    {
      title: "Can I get a refund on a digital course?",
      description:
        "Digital products are non-refundable once access is granted (see Refund Policy).",
    },
    {
      title: "How is my data protected?",
      description:
        "We follow industry-standard encryption, store data on secure servers, and never sell personal info. Full details in our Privacy Policy.",
    },
    {
      title: "Is NPS / PPF / ELSS right for me?",
      description:
        "It depends on your goals, horizon, and risk profile. Book a 1-on-1 session or complete our risk-profiling questionnaire for personalised advice.",
    },
  ];
  return (
    <div className="bg-gradient-course font-Montserrat pt-7">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={titleVariants}
          className="mb-12"
        >
          <SectionTitle heading="Your questions matter!" />
        </motion.div>
        <Accordion accordingData={accordingData} />
      </Container>
      <div className="bg-gradient-faq-blur h-[168px] w-full"></div>
    </div>
  );
};

export default Faq;
