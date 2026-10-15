import type { ReactNode } from "react";

const Container =({children} : {children:ReactNode}) => {
    return (
        <div className="max-w-[1200px] 2xl:max-w-[1400px] w-full mx-auto px-5 2xl:px-0">
            {children}
        </div>
    );
};

export default Container;