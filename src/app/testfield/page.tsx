"use client"

import { useEffect, useState } from "react";


const CircleRotation = () => {


  return (
    <>
      <section className="conainer h-screen w-screen bg-cyan-300 mx-auto place-items-center place-content-center ">
          <div className="relative bg-cyan-600 h-100 w-100 rounded-full" >
            <div className="absolute bg-red-400 w-20 h-20 bottom-0 translate-x-[-50%] translate-y-[50%] rounded-full"></div>
            <div className="absolute bg-red-400 w-20 h-20 top-0 translate-x-[-50%] translate-y-[-50%] rounded-full"></div>
            <div className="absolute bg-red-400 w-20 h-20 right-0 translate-x-[50%] translate-y-[-50%] rounded-full"></div>
            <div className="absolute bg-red-400 w-20 h-20 bottom-0 right-0 translate-x-[50%] translate-y-[50%] rounded-full"></div>
          </div>
      </section>
    </>
  );
};

export default CircleRotation;




