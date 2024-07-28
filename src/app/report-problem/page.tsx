"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import supabase from "@/utils/supabase";
import { useRouter } from "next/navigation";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { getPublicUrl, uploadFile } from "@/utils/helpers/file";
import { addProblem } from "@/utils/helpers/problems";
import { toast } from "react-toastify";
import { sendMail } from "@/utils/helpers/sendEmail";
const ReportProblem = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  const getGeolocation = async (lat, lng) => {
    let response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=false&key=AIzaSyBUxV8dM0JJzEDDguDOylxMEjMyi6_dd5Q`,
    );
    let geoData = await response.json();
    return geoData?.plus_code.compound_code;
  };

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    image: null,
  });
  const [position, setPosition] = useState({
    lat: 20,
    lng: 77,
  });
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session?.user);
      } else {
        router.push("/signin");
      }
    });
  }, []);

  useEffect(() => {
    if (isGeolocationAvailable && isGeolocationEnabled && coords) {
      setPosition({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.image) {
      console.log(formData);

      return toast("Please fill all the fields", {
        type: "error",
        autoClose: 2000,
      });
    }
    setLoading(true);
    uploadFile(formData.image).then(async (res) => {
      let filePath = res.path;
      let geolocation = await getGeolocation(position.lat, position.lng);
      sendMail(geolocation, formData.description);
      addProblem({
        userId: user.id,
        description: formData.description,
        email: user.user_metadata.email,
        image: filePath,
        name: user.user_metadata.name,
        position: position,
      })
        .then((res) => {
          setFormData({
            description: "",
            image: null,
          });
          setLoading(false);
          toast("Problem reported successfully", {
            type: "success",
            autoClose: 2000,
          });
        })
        .catch((err) => {
          setLoading(false);
          toast("Problem reported failed", {
            type: "error",
            autoClose: 2000,
          });
        });
    });
  };
  return (
    <>
      <Breadcrumb
        pageName="Report Problem"
        description="Welcome to the Problem Spotter page, where you can report water-related issues affecting your community."
      />

      <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 ">
              <div
                className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                data-wow-delay=".15s
              "
              >
                <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                  Submit a Problem
                </h2>
                <p className="mb-12 text-base font-medium text-body-color">
                  Our support team will get back to you ASAP via email.
                </p>
                <form>
                  <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label
                          htmlFor="name"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          Your Name
                        </label>
                        <input
                          disabled
                          value={user?.user_metadata.name}
                          type="text"
                          placeholder="Enter your name"
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label
                          htmlFor="email"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          Your Email
                        </label>
                        <input
                          disabled
                          value={user?.user_metadata.email}
                          type="email"
                          placeholder="Enter your email"
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
                    <div className="mb-8 w-full px-4">
                      <div className="relative h-96 w-full items-center justify-center">
                        <APIProvider
                          apiKey={"AIzaSyBUxV8dM0JJzEDDguDOylxMEjMyi6_dd5Q"}
                        >
                          <div style={{ height: "100%", width: "100%" }}>
                            <Map
                              defaultZoom={10}
                              center={position}
                              mapId={"9fbc1ee3cd3228ce"}
                            >
                              <AdvancedMarker
                                draggable={true}
                                onDragEnd={(e) => {
                                  setPosition({
                                    lat: e.latLng.lat(),
                                    lng: e.latLng.lng(),
                                  });
                                }}
                                position={position}
                              >
                                <Pin
                                  background={"grey"}
                                  borderColor={"green"}
                                  glyphColor={"purple"}
                                />
                              </AdvancedMarker>
                            </Map>
                          </div>
                        </APIProvider>
                      </div>
                    </div>
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label
                          htmlFor="name"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          Lat/Long
                        </label>
                        <input
                          value={
                            position ? `${position.lat},${position.lng}` : ""
                          }
                          type="text"
                          placeholder="Enter the Lat/Long coordinates"
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
                    <div className="w-full px-4">
                      <div className="mb-8">
                        <label
                          htmlFor="message"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          Problem Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          name="message"
                          rows={5}
                          placeholder="Enter the problem description"
                          className="border-stroke w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        ></textarea>
                      </div>
                    </div>
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label
                          htmlFor="name"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          Upload Image
                        </label>
                        <input
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              image: e.target.files[0],
                            })
                          }
                          type="file"
                          accept="image/*"
                          placeholder="Upload Image"
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
                    <div className="w-full px-4">
                      <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="rounded-xl bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 disabled:bg-gray-400 dark:shadow-submit-dark"
                      >
                        Report Problem
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReportProblem;
