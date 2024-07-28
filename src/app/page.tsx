import Blog from "@/components/Blog";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import MapView from "@/components/MapView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HydroHub",
  description: "HydroHub is a community-driven platform that empowers people to address water-related issues effectively.",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <MapView />
      <Blog />
      <Contact />
    </>
  );
}
