import type { JSX, ReactNode } from "react";
import { Link } from "react-router-dom";

interface DashboardContainerProps {
  children: ReactNode;
  headerText?: string;
  btn?: string;
  btnLink?: string;
  className?:string;
  div?: JSX.Element
}

const DashboardContainer = ({ children, headerText, btn, btnLink, className ,div}: DashboardContainerProps) => {
  return (
    <div className={`bg-transparent md:bg-white rounded-2xl py-0 md:py-4 px-0 md:px-4 font-Montserrat ${className}`}>
      {(headerText || btn) && (
        <div className="flex justify-between items-center mb-4">
          {headerText && <h2 className="text-xl leading-[22px] font-semibold mt-2 accent-5">{headerText}</h2>}
          {btn && btnLink && (
            <Link
              to={btnLink}
              className="text-primary-20 font-semibold leading-[22px]"
            >
              {btn}
            </Link>
          )}
          {div && <div>{div}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardContainer;
