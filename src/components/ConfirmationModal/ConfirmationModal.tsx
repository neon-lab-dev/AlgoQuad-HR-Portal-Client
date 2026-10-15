import type { ReactNode } from "react";
import { RxCrossCircled } from "react-icons/rx";

type TConfirmationModal = {
  heading?: string;
  isCrossVisible?: boolean;
  children: ReactNode;
  isConfirmationModalOpen: boolean;
  setIsConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const ConfirmationModal: React.FC<TConfirmationModal> = ({
  heading,
  isCrossVisible = true,
  children,
  isConfirmationModalOpen,
  setIsConfirmationModalOpen,
}) => {
  return (
    <div
      className={`${
        isConfirmationModalOpen ? " visible" : " invisible"
      } w-full h-screen fixed top-0 left-0 z-[200000000] bg-[#0000002a] flex items-center justify-center transition-all duration-300 p-4 font-Montserrat`}
    >
      <div
        className={`${
          isConfirmationModalOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0"
        } w-full md:w-[400px] lg:w-[580px] bg-white rounded-2xl transition-all duration-300 z-[999] h-fit max-h-[600px] overflow-y-auto`}
      >
        <div className="w-full">
         <div  className="pt-6 px-6 flex items-center justify-between">
           <h2 className="text-xl font-semibold text-neutral-10">{heading}</h2>
           {isCrossVisible && (
            <div>
              <RxCrossCircled
                onClick={() => setIsConfirmationModalOpen(false)}
                className="text-end text-2xl text-neutral-125 cursor-pointer"
              />
            </div>
          )}
         </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
