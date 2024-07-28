"use client";
import { retrieveProblemsLimited } from "@/utils/helpers/problems";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    retrieveProblemsLimited().then((res) => {
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
          setProblems((prev) => [payload.new, prev.slice(0, 2)]);
        },
      )
      .subscribe();
  }, []);
  return (
    <section
      id="blog"
      className="bg-gray-light py-16 dark:bg-bg-color-dark md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Latest Water Insights"
          paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          center
        />
        {loading ? (
          <div className="loader mx-auto"></div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
            {problems.map((blog) => (
              <div key={blog.id} className="w-full">
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
