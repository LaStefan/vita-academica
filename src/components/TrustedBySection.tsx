
import React from "react";

const TrustedBySection = () => {
  return (
    <section className="py-6 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 text-gray-700">
          TRUSTED BY ACADEMICS FROM
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          <div className="py-1 px-4 rounded">
            <span className="text-gray-700 font-medium text-base">STANFORD</span>
          </div>
          <div className="py-1 px-4 rounded">
            <span className="text-gray-700 font-medium text-base">MIT</span>
          </div>
          <div className="py-1 px-4 rounded">
            <span className="text-gray-700 font-medium text-base">OXFORD</span>
          </div>
          <div className="py-1 px-4 rounded">
            <span className="text-gray-700 font-medium text-base">CAMBRIDGE</span>
          </div>
          <div className="py-1 px-4 rounded">
            <span className="text-gray-700 font-medium text-base">HARVARD</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
