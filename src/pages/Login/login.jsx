import React, { useState } from 'react';
import Navbar from "../../components/NavBar/navbar";
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper.jsx';
import axiosInstance from '../../utils/axiosInstance.js';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState({ email: "", password: "", api: "" });

  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setError({ ...error, ...newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError({ email: "", password: "", api: "" });

    if (!validateInputs()) return;

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (error) {
      setError((prev) => ({
        ...prev,
        api: error.response?.data?.message || "Unexpected error occurred. Please try again later.",
      }));
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>Login</h4>

            <input
              type="text"
              placeholder="Email"
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && <p className='text-red-500 text-xs mb-1'>{error.email}</p>}

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.password && <p className='text-red-500 text-xs mb-1'>{error.password}</p>}

            {error.api && <p className='text-red-500 text-xs mb-2'>{error.api}</p>}

            <button type="submit" className='btn-primary'>Login</button>

            <p className='text-xs text-center mt-4'>
              Not registered yet?{" "}
              <Link to="/signup" className='text-blue-600 underline'>
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
