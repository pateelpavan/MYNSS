import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  ArrowLeft,
  LogIn,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { NSSUser } from "../App";
import { toast } from "sonner";
import Navbar from "./Navbar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface NSSLoginPageProps {
  users: NSSUser[];
  onLogin: (user: NSSUser) => void;
  onBack: () => void;
  onForgotPassword: () => void;
}

export default function NSSLoginPage({
  users,
  onLogin,
  onBack,
  onForgotPassword,
}: NSSLoginPageProps) {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ login?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = users.find(
      (u) =>
        u.rollNumber === rollNumber && u.password === password,
    );

    if (user) {
      if (user.isRejected) {
        toast.error(
          `Your account has been rejected. Reason: ${user.rejectionReason || "Contact admin for details"}`,
        );
        setErrors({ login: "Account rejected by admin" });
      } else if (!user.isApproved) {
        toast.error(
          "Your account is pending admin approval. Please wait for approval.",
        );
        setErrors({ login: "Account pending approval" });
      } else {
        toast.success(`Welcome back, ${user.fullName}! 🎉`);
        onLogin(user);
      }
    } else {
      toast.error("Invalid roll number or password");
      setErrors({ login: "Invalid credentials" });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Navbar */}
      <Navbar
        showBackButton
        onBack={onBack}
        title="Member Login"
      />

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
              style={{
                width: Math.random() * 80 + 20,
                height: Math.random() * 80 + 20,
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - College Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="relative">
              <motion.div
                className="relative overflow-hidden rounded-3xl shadow-2xl"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ImageWithFallback
                  src="https://i0.wp.com/cmrithyderabad.edu.in/wp-content/uploads/2023/01/Screenshot-17-1024x501-1-1-1.webp?fit=780%2C382&ssl=1"
                  alt="CMRIT College Campus"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    Welcome to CMRIT
                  </h2>
                  <p className="text-lg opacity-90 mb-4">
                    CMR Institute of Technology, Hyderabad
                  </p>
                  <div className="flex items-center gap-4 text-sm opacity-80">
                    <span>🎓 Excellence in Education</span>
                    <span>🌟 Innovation Hub</span>
                    <span>🤝 Community Service</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2,
            }}
            className="w-full max-w-md mx-auto"
          >
            {/* Login Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-8"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <LogIn className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Welcome Back!
                </h1>
                <p className="text-gray-600">
                  Sign in to access your NSS portfolio
                </p>
              </motion.div>

              {/* Error Message */}
              {errors.login && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">
                    {errors.login}
                  </span>
                </motion.div>
              )}

              {/* Login Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Roll Number Field */}
                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Roll Number
                  </Label>
                  <div className="relative">
                    <Input
                      value={rollNumber}
                      onChange={(e) =>
                        setRollNumber(e.target.value)
                      }
                      placeholder="Enter your roll number"
                      className="pl-12 pr-4 py-3 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white/50"
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      className="pl-12 pr-12 py-3 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white/50"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Sign In to Portfolio
                    </div>
                  )}
                </Button>
              </motion.form>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-8 text-center"
              >
                <div className="flex items-center gap-2 justify-center text-sm text-gray-600 mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>New to NSS CMRIT?</span>
                </div>
                <p className="text-sm text-gray-600">
                  Contact your NSS coordinator for registration
                  assistance
                </p>
              </motion.div>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              {[
                {
                  label: "Active Members",
                  value: users.filter((u) => u.isApproved)
                    .length,
                },
                {
                  label: "Pending Approval",
                  value: users.filter(
                    (u) => !u.isApproved && !u.isRejected,
                  ).length,
                },
                {
                  label: "Total Registered",
                  value: users.length,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/50"
                >
                  <div className="text-xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}