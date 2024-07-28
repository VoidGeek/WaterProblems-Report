"use client";
import blogData from "@/components/Blog/blogData";
import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { retrieveProblems } from "@/utils/helpers/problems";
import supabase from "@/utils/supabase";
import { useState, useEffect } from "react";
const ViewProblems = () => {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    retrieveProblems().then((res) => {
      setProblems(res);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    supabase
      .channel("room1")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "problems" },
        (payload) => {
          setProblems((prev) => [payload.new, ...prev]);
        },
      )
      .subscribe();
  }, []);
  return (
    <>
      <Breadcrumb
        pageName="View Problems"
        description="Welcome to the Problem Spotter page, where you can explore and address water-related issues affecting your community."
      />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          {loading ? (
            <div className="loader mx-auto"></div>
          ) : (
            <div className="-mx-4 flex flex-wrap justify-center gap-y-8">
              {problems.map((blog) => (
                <div
                  key={blog.id}
                  className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
                >
                  <SingleBlog blog={blog} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ViewProblems;
