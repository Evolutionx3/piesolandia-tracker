import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const UnauthenticatedApp = () => {
  const { login } = useAuth();
  const credentials = [{ login: "test", password: "test123" }];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginError, setLoginError] = useState(false);

  const onSubmit = (data) => {
    const matchingCredential = credentials.find(
      (cred) => cred.login === data.login && cred.password === data.password
    );

    if (matchingCredential) {
      console.log("Zalogowano pomyślnie!");
      login();
      setLoginError(false);
    } else {
      console.log("Błąd logowania");
      setLoginError(true);
    }
    console.log(matchingCredential, data);
  };

  // const onSubmit = async (data) => {
  //   try {
  //     const response = await axios.post("/login", {
  //       login: data.login,
  //       password: data.password,
  //     });

  //     const { token } = response.data;
  //     localStorage.setItem("token", token);

  //     setLoginError(false);
  //     console.log("Zalogowano pomyślnie!");
  //   } catch (error) {
  //     setLoginError(true);
  //     console.log("Błąd logowania");
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <img src="piesologo.png" />
      <form
        className="form-control w-full max-w-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="label">
          <span className="label-text">Login</span>
        </label>
        <input
          label="login"
          name="login"
          id="login"
          className={`input input-bordered w-full ${
            errors.login ? "input-warning" : ""
          }`}
          {...register("login", { required: true })}
        />
        {errors.login && (
          <span className="text-warning">Login jest wymagany</span>
        )}
        <label className="label">
          <span className="label-text">Hasło</span>
        </label>
        <input
          label="password"
          name="password"
          id="password"
          type="password"
          className={`input input-bordered w-full ${
            errors.password ? "input-warning" : ""
          }`}
          {...register("password", { required: true })}
        />
        {errors.password && (
          <span className="text-warning">Hasło jest wymagane</span>
        )}
        {loginError && !errors.login && !errors.password && (
          <span className="text-error">Niepoprawny login lub hasło</span>
        )}
        <button className="btn btn-primary mt-6" type="submit">
          Zaloguj się
        </button>
      </form>
    </div>
  );
};

export default UnauthenticatedApp;
