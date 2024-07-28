import supabase from "../supabase";
import { SendMailClient } from "zeptomail";
import axios from "axios";
const sendMail = async (location, description) => {
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();
  let receiptants = users.map((user) => ({
    email_address: {
      address: user.email,
      name: user.user_metadata.name,
    },
  }));
  axios.post("https://water-problem.vercel.app/api/mail", {
    location: location,
    email: receiptants,
    description: description,
  });
};
export { sendMail };
