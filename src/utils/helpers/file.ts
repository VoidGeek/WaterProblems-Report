import supabase from "../supabase";

const uploadFile = (file) => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage
      .from("files")
      .upload(
        `public/${file.name.split(".")[0]}${Date.now()}.${file.name.split(".")[1]}`,
        file,
        {
          cacheControl: "3600",
          upsert: false,
        },
      );
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  });
};

const getPublicUrl = (fileName) => {
  return new Promise(async (resolve, reject) => {
    const { data } = supabase.storage
      .from("public-bucket")
      .getPublicUrl(fileName);
    if (data) {
      resolve(data);
    } else {
      reject("error");
    }
  });
};

export { uploadFile, getPublicUrl };
