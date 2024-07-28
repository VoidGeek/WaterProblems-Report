import { SendMailClient } from "zeptomail";

export async function POST(request: Request) {
  const formData = await request.json();
  console.log(formData);
  
  const url = "api.zeptomail.in/";
  const token =
    "Zoho-enczapikey PHtE6r1cEeniiWEt8UICs6W5RMfwPIsmqeNuLwAS5NsQDfFVGU1S/4p5lz/lqU9+UKRBRfGbyIo5tLzNteOMImjoMmdND2qyqK3sx/VYSPOZsbq6x00YsFkSd03UXITnd9ds1C3TstzcNA==";
  let client = new SendMailClient({ url, token });
  let mail = await client.sendMail({
    from: {
      address: "noreply@bohrinvento.com",
      name: "noreply",
    },
    to: formData?.email,
    subject: `New water problem detected at ${formData?.location}`,
    textbody: `${formData.description} Please check the app for more details.`,
  });
  return Response.json({
    message: "success",
  });
}
