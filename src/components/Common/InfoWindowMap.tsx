"use client";

import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import { IoWarning } from "react-icons/io5";

export default function InfoWindowMap({
  marker,
  message,
  setMarkerRef,
  point,
}: {
  marker: any;
  message: string;
  setMarkerRef: any;
  point: any;
}) {
  const [infowindowOpen, setInfowindowOpen] = useState(false);

  return (
    <AdvancedMarker
      position={point.position}
      key={point.key}
      ref={(marker) => setMarkerRef(marker, point.key)}
      onClick={() => setInfowindowOpen(true)}
      
    >
      <IoWarning className="h-10 w-10 text-red-500" />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <p className="text-black">{point.description}</p>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
}
