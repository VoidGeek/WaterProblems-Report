import supabase from "../supabase";

const SignUp = ({ email, password, name }) => {
  return new Promise(async (resolve, reject) => {
    supabase.auth
      .signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      })
      .then(() => {
        resolve({
          message: "User created successfully",
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const signIn = ({ email, password }) => {
  return new Promise(async (resolve, reject) => {
    supabase.auth
      .signInWithPassword({
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data?.user) {
          resolve({
            message: "User signed in successfully",
          });
        } else {
          reject({
            message: res.error.message,
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export { SignUp, signIn };
