"use client";
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { useEffect, useState, useRef } from "react";
import trees from "@/utils/data/dummydata";
import { retrieveProblems } from "@/utils/helpers/problems";
import { IoWarning } from "react-icons/io5";
import InfoWindowMap from "./InfoWindowMap";
import { useGeolocated } from "react-geolocated";
import supabase from "@/utils/supabase";
import { useRouter } from "next/navigation";
export default function DisplayMap() {
  const router = useRouter();
  const [position, setPosition] = useState(null);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  const [flag, setFlag] = useState(false);
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    supabase
      .channel("room1")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "problems" },
        (payload) => {
          
          setProblems((prev) => [...prev, payload.new]);
          router.refresh();
        },
      )
      .subscribe();
  }, []);
  useEffect(() => {
    retrieveProblems().then((res) => {
      setProblems(res);
    });
  }, [flag]);
  useEffect(() => {
    if (isGeolocationAvailable && isGeolocationEnabled && coords) {
      setPosition({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);
  return position ? (
    <div style={{ height: "100vh", width: "100%" }}>
      <APIProvider apiKey={"AIzaSyBUxV8dM0JJzEDDguDOylxMEjMyi6_dd5Q"}>
        <Map
          defaultCenter={position}
          defaultZoom={10}
          mapId={"9fbc1ee3cd3228ce"}
        >
          <Markers points={problems} />
        </Map>
      </APIProvider>
    </div>
  ) : (
    <div className="loader mx-auto"></div>
  );
}
type Point = google.maps.LatLngLiteral & { key: string };
type Props = { points: any };

const Markers = ({ points }: Props) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {points.map((point) => (
        <InfoWindowMap
          setMarkerRef={setMarkerRef}
          marker={markers[point.key]}
          message="adsd"
          point={point}
        />
      ))}
    </>
  );
};
