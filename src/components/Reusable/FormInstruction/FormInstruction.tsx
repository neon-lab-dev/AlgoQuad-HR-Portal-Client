const FormInstruction = ({
  title,
  instructions,
}: {
  title: string;
  instructions: { icon: string; text: string }[];
}) => {
  return (
    <div className="bg-surface-75 p-6 rounded-tl-[20px] rounded-tr-[20px] rounded-t-[20px] lg:rounded-tr-none lg:rounded-t-none lg:rounded-l-[20px] w-full lg:w-[40%] flex flex-col items-center lg:items-start">
      <h1 className="text-neutral-30 text-xl font-bold leading-6 text-center lg:text-start">
        {title}
      </h1>
      <div className="flex justify-center lg:justify-start">
        <div className="flex flex-col justify-center items-center gap-4 mt-8 w-full mx-auto">
          {instructions.map((item) => (
            <div key={item.text} className="flex items-center gap-2 w-full">
              <div className="bg-surface-30 size-10 p-2 rounded-full flex items-center justify-center">
                <img src={item.icon} alt="" />
              </div>
              <p className="text-neutral-30 text-sm font-medium leading-[18px] max-w-[200px] sm:max-w-[350px] lg:max-w-[400px]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormInstruction;
