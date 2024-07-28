import supabase from "../supabase";

const addProblem = ({ userId, description, image, position, name, email }) => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.from("problems").insert([
      {
        userId: userId,
        description: description,
        image: image,
        position: position,
        name: name,
        email: email,
      },
    ]);
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  });
};

const retrieveProblems = () => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("problems")
      .select()
      .order("id", { ascending: false });
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  });
};

const retrieveProblemsLimited = () => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("problems")
      .select()
      .order("id", { ascending: false });
    if (error) {
      reject(error);
    } else {
      resolve(data.slice(0, 3));
    }
  });
};

const retrieveProblemsById = (id) => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("problems")
      .select()
      .eq("id", id);
    if (error) {
      reject(error);
    } else {
      resolve(data[0]);
    }
  });
};
export { addProblem, retrieveProblems, retrieveProblemsLimited ,retrieveProblemsById};
