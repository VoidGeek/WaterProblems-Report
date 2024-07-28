"use client";

import { getMessages, sendMessage } from "@/utils/helpers/messages";
import supabase from "@/utils/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function Message({ data }: { data: any }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session?.user);
      }
    });
  }, []);
  useEffect(() => {
    supabase
      .channel("room1")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setFlag((prev) => !prev);
        },
      )
      .subscribe();
  }, []);
  useEffect(() => {
    getMessages(data.id).then((res) => {
      setMessages(res);
      setLoading(false);
    });
  }, [flag]);
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!user) router.push("/signin");
    sendMessage({
      message: message,
      problemId: data.id,
      userId: user.id,
      userName: user.user_metadata.name,
    });
    setMessages((prev) => [
      {
        message: message,
        problemId: data.id,
        userId: user.id,
        userName: user.user_metadata.name,
      },
      ...prev,
    ]);
  };
  return (
    <div>
      <div className="w-full px-4 pt-8">
        <h2 className="mb-8 text-xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
          Community Discussion
        </h2>
        <div className="mb-8">
          <label
            htmlFor="message"
            className="mb-3 block text-sm font-medium text-dark dark:text-white"
          >
            Message
          </label>
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="border-stroke w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
          ></textarea>

          <button
            onClick={handleSendMessage}
            className="mt-4 rounded-xl bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 disabled:bg-gray-400 dark:shadow-submit-dark"
          >
            Send Message
          </button>
        </div>
      </div>
      <div
        className="mb-12 rounded-xl bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
        data-wow-delay=".15s"
      >
        {loading ? (
          <div className="loader mx-auto"></div>
        ) : (
          <>
            {" "}
            {messages.length === 0 && (
              <p className="mt-2 text-base font-medium leading-relaxed text-body-color">
                No messages yet
              </p>
            )}
            {messages.map((message, index) => (
              <div className="mt-4" key={index}>
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={
                          "https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg"
                        }
                        alt="author"
                        fill
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <span className="mb-1 text-base font-medium text-body-color">
                      <span>{message?.userName}</span>
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-base font-medium leading-relaxed text-body-color">
                  {message.message}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
