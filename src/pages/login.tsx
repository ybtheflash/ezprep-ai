import React, { useState } from "react";
import styles from "../styles/Login.module.css";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.branding}>
          <img
            src="/images/brand-icon.png"
            alt="Brand Icon"
            className={styles.brandIcon}
          />
          <h1 className={styles.brandName}>ezPrep AI</h1>
        </div>

        <h2 className={styles.title}>Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </div>

          <div className={styles.forgotPassword}>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className={styles.submitButton}>
            Log In
          </button>
        </form>

        <div className={styles.divider}>
          <hr />
          <span>or</span>
          <hr />
        </div>

        <button className={styles.googleButton}>
          {/* <img
            src="/google-icon.svg"
            alt="Google Icon"
            className={styles.googleIcon}
          /> */}
          <span>Sign in with Google</span>
        </button>

        <p className={styles.signup}>
          Don't have an account? <a href="signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
