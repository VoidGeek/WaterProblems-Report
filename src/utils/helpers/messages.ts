import supabase from "../supabase";

const sendMessage = ({ userId, message, problemId, userName }) => {
  return new Promise((resolve, reject) => {
    supabase
      .from("messages")
      .insert([
        {
          userId: userId,
          message: message,
          problemId: problemId,
          userName: userName,
        },
      ])
      .then((res) => {
        if (res.error) {
          reject(res.error);
        } else {
          resolve({
            message: "Message sent successfully",
          });
        }
      });
  });
};

const getMessages = (problemId) => {
  return new Promise((resolve, reject) => {
    supabase
      .from("messages")
      .select()
      .eq("problemId", problemId)
      .order("id", { ascending: false })
      .then((res) => {
        if (res.error) {
          reject(res.error);
        } else {
          resolve(res.data);
        }
      });
  });
};
export { sendMessage, getMessages };
