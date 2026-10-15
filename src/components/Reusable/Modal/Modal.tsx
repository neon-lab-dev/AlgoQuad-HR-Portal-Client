import { RxCrossCircled } from "react-icons/rx";

type TModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  heading?: string;
  description?: string;
  width?: string;
  children: React.ReactNode;
};
const Modal: React.FC<TModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  heading,
  description,
  width = "w-[90%] sm:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[25%]",
  children,
}) => {
  return (
    <div
      className={`${
        isModalOpen ? " visible" : " invisible"
      } w-full h-screen fixed top-0 left-0 z-20000000000 bg-[#0000002a] flex items-center justify-center transition-all duration-300 p-4`}
    >
      <div
        className={`${
          isModalOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } ${width} bg-white rounded-2xl p-6 transition-all duration-300 z-[999] h-fit max-h-[660px] overflow-y-auto`}
      >
        <div className="w-full">
          <RxCrossCircled
            onClick={() => setIsModalOpen(false)}
            className="text-end justify-self-end text-2xl text-neutral-125 cursor-pointer"
          />
          <h1 className="text-neutral-20 text-xl md:text-2xl font-medium leading-7 text-center mb-3">
            {heading}
          </h1>
          <p className="text-neutral-50 text-center mb-8">{description}</p>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
