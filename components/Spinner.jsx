import React from 'react';

const Spinner = ({loadingText}) => (

  <>
    <div className="absolute inset-0 m-auto w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin bg-[#ffffff6e]"></div>
    <p className="absolute inset-0 m-auto top-[85px] w-50 h-12 flex justify-center items-center">{loadingText}</p>
  </>
);

export default Spinner;
