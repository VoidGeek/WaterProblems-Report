"use client";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import Breadcrumb from "@/components/Common/Breadcrumb";
import DisplayMap from "@/components/Common/DisplayMap";
import { IoWarning } from "react-icons/io5";
const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);
const MapView = () => {
  const position = { lat: 53.54, lng: 10 };

  const List = ({ text }) => (
    <p className="mb-5 flex items-center text-lg font-medium text-body-color">
      <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
        {checkIcon}
      </span>
      {text}
    </p>
  );
  return (
    <>
      <Breadcrumb
        pageName="Map"
        description="Welcome to HydroView, your interactive map for navigating water challenges in your community. With HydroView, you can visualize reported incidents."
      />
      <section
        id="about"
        className="pb-16 pt-16 md:pb-20 md:pt-20 lg:pb-28 lg:pt-28"
      >
        <div className="container">
          <div className="relative aspect-[77/40] items-center justify-center">
            <DisplayMap />
          </div>
          <div className="mx-[-12px] mt-8 flex flex-wrap lg:mt-16">
            <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2 flex items-center gap-8">
              <IoWarning className="h-10 w-10 text-red-500" />
              <p>
                Water Problems
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MapView;
