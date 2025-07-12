import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Sparkles, Upload } from "lucide-react";
import { useAuth } from "../hooks/useAuth.tsx";
import { useToast } from "../hooks/useToast";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    location: "",
    profileImage: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      if (!formData.location) {
        newErrors.location = "Location is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          addToast("success", "Welcome back!");
          navigate("/dashboard");
        } else {
          addToast("error", "Invalid credentials or account banned");
        }
      } else {
        const success = await register(formData);
        if (success) {
          addToast("success", "Account created successfully!");
          navigate("/dashboard");
        } else {
          addToast("error", "Registration failed");
        }
      }
    } catch (error) {
      addToast("error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const fillDemoCredentials = () => {
    setFormData((prev) => ({
      ...prev,
      email: "sarah@example.com",
      password: "password123",
    }));
  };

  return (
    // The <style> block has been removed from here. Its content goes to index.css.
    <>
      {/* Main Container for the entire page - Now with a background gradient and floating boxes */}
      <div
        className="relative min-h-screen flex items-center justify-center p-4 font-sans
                      bg-gradient-to-br from-indigo-900 to-purple-900 overflow-hidden"
      >
        {/* Floating Boxes Container - Their base styles (background, border, border-radius) are Tailwind classes now. */}
        {/* Their animation styles will come from index.css */}
        <div className="absolute inset-0 z-0">
          {Array.from({ length: 8 }).map((_, i) => (
            // Applied Tailwind classes for background, border, and rounded corners directly here
            <div
              key={i}
              className="floating-box bg-black bg-opacity-40 border border-white border-opacity-20 rounded-lg"
              // The 'floating-box' class connects to the animation defined in index.css
            ></div>
          ))}
        </div>

        {/* The main login/register card container - z-index ensures it's above background */}
        <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-5xl rounded-3xl shadow-xl overflow-hidden min-h-[600px]">
          {/* Left Section: Gradient Background with organic shapes and text */}
          <div
            className="relative flex-1 p-8 text-white flex flex-col justify-between items-start 
                          lg:w-1/2 lg:min-h-full {/* Takes half width on large screens, full height */}
                          bg-gradient-to-br from-[#4A00B8] via-[#7B00C4] to-[#C000CF] {/* Custom gradient colors from image */}
                          rounded-t-3xl lg:rounded-tr-none lg:rounded-bl-3xl {/* Responsive border-radius */}
                          min-h-[300px] lg:min-h-full"
          >
            {" "}
            {/* Ensures minimum height for smaller screens */}
            {/* Organic Blob Shapes (positioned absolutely, z-index lower than text but higher than parent background) */}
            <div className="absolute w-40 h-40 bg-white bg-opacity-10 rounded-full blur-xl -top-10 -left-10 z-[1]"></div>
            <div className="absolute w-60 h-60 bg-white bg-opacity-10 rounded-full blur-xl -bottom-20 -right-20 z-[1]"></div>
            <div className="absolute w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl top-1/3 left-1/4 opacity-70 z-[1]"></div>
            <div className="absolute w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl bottom-1/4 right-1/3 opacity-70 z-[1]"></div>
            <div className="absolute w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl top-20 right-10 opacity-60 z-[1]"></div>
            {/* Logo (top-left) - z-index higher than blobs */}
            <div className="relative z-10 flex items-center space-x-3 mb-auto">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white opacity-90"></div>
              </div>
              <span className="text-2xl font-bold">LOGO</span>
            </div>
            {/* IMAGE IN PLACE OF WELCOME TEXT */}
            {/* Replace the H1 and P tags with an image */}
            <div className="relative z-10 flex items-center justify-center flex-grow text-center py-10">
              <img
                src="https://example.com/your-skill-swap-image.jpg" // *Replace with your actual image path*
                alt="Welcome to the platform"
                className="max-w-full h-auto object-contain" // Adjust object-fit as needed (contain, cover, fill)
              />
            </div>
            {/* Website URL (removed as per request) */}
            {/* <div className="relative z-10 mt-auto">
              <p className="text-sm text-gray-300">www.yoursite.com</p>
            </div> */}
          </div>

          {/* Right Section: Login/Register Form - Now dark themed */}
          <div
            className="flex-1 p-8 flex flex-col justify-center items-center lg:w-1/2 bg-gray-800 bg-opacity-70 text-gray-100 
                          rounded-b-3xl lg:rounded-bl-none lg:rounded-tr-3xl lg:rounded-br-3xl"
          >
            {/* Header */}
            <h2 className="text-3xl font-bold text-white mb-8 text-center w-full">
              {isLogin ? "Sign In" : "Register"}
            </h2>

            {/* Tab Buttons (Login/Register) - Retained and styled for dark theme */}
            <div className="flex w-full max-w-sm mb-8">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-l-lg transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-r-lg transition-all ${
                  !isLogin
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
              {/* Register specific fields (conditionally rendered) */}
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-b-2 bg-transparent outline-none focus:border-purple-500 transition-colors ${
                        errors.name ? "border-red-500" : "border-gray-600"
                      } text-gray-100 placeholder-gray-400`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-b-2 bg-transparent outline-none focus:border-purple-500 transition-colors ${
                        errors.location ? "border-red-500" : "border-gray-600"
                      } text-gray-100 placeholder-gray-400`}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Picture (Optional)
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                        {formData.profileImage ? (
                          <img
                            src={formData.profileImage}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <Upload className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="url"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border-b-2 bg-transparent outline-none focus:border-purple-500 transition-colors border-gray-600 text-gray-100 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-b-2 bg-transparent outline-none focus:border-purple-500 transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  } text-gray-100 placeholder-gray-400`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-b-2 bg-transparent outline-none focus:border-purple-500 transition-colors ${
                      errors.password ? "border-red-500" : "border-gray-600"
                    } text-gray-100 placeholder-gray-400`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 px-3 py-2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password (only for Register) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-b-2 bg-transparent outline-none focus:border-purple-500 transition-colors ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    } text-gray-100 placeholder-gray-400`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Demo credentials button (optional, but kept for dev utility) */}
              {isLogin && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-sm text-blue-400 hover:text-blue-200 underline"
                  >
                    Fill demo credentials
                  </button>
                </div>
              )}

              {/* CONTINUE / REGISTER Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] flex items-center justify-center space-x-2 mt-8"
              >
                <span>
                  {loading
                    ? "Please wait..."
                    : isLogin
                    ? "CONTINUE"
                    : "REGISTER"}
                </span>
                <span className="ml-2 text-xl">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;