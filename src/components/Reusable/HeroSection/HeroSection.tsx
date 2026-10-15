import React from "react";
import Container from "../Container/Container";
import HeroHeading from "../HeroHeading/HeroHeading";
import ReusableHeroCards from "../ReusableHeroCards/ReusableHeroCards";
import Button from "../Button/Button";

interface HeroDetail {
  value: React.ReactNode;
  icon: string;
}

interface ReusableHeroSectionProps {
  headingLines: string[];
  bgImage: string;
  heroDetails: HeroDetail[];
  description: React.ReactNode;
  buttonLabel?: string;
  onButtonClick?: () => void;
  gradientBottom?: string;
}

const ReusableHeroSection: React.FC<ReusableHeroSectionProps> = ({
  headingLines,
  bgImage,
  heroDetails,
  description,
  buttonLabel,
  onButtonClick,
  gradientBottom,
}) => {
  return (
    <div className="relative h-fit">
      <img
        src={bgImage}
        alt="Hero Background"
        className="absolute top-0 left-0 w-full h-full object-cover -z-500"
      />
      <div className="relative z-10 pt-[68px]">
        <Container>
          <HeroHeading lines={headingLines} />
          <ReusableHeroCards details={heroDetails} bg="bg-surface-10" />
          <div className="mt-14 mb-16 lg:mb-28 flex flex-col gap-12 lg:gap-8 justify-center items-center">
            <p className="text-center text-base lg:text-[32px] tracking-[-0.6] font-medium text-neutral-30 max-w-[328px] mx-auto lg:max-w-full">
              {description}
            </p>
           {buttonLabel &&<Button
              variant="primary"
              label={buttonLabel}
              onClick={onButtonClick}
              classNames="w-full sm:w-fit px-8 py-4"
            />}
          </div>
        </Container>  
        {gradientBottom && (
          <div className={`${gradientBottom} h-[130px] w-full`}></div>
        )}
      </div>
    </div>
  );
};

export default ReusableHeroSection;
