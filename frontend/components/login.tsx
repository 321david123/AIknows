"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function LoginPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    // Delay the animation to ensure it happens after component mount
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setEmailError("")
    setPasswordError("")

    // Validate email
    if (!email) {
      setEmailError("Email is required")
      return
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required")
      return
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    // Simulate login
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("Login successful! This is a demo.")
    }, 1500)
  }

  return (
    <div className={`login-container ${isVisible ? "visible" : ""}`}>
      <style jsx>{`
        .login-container {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          border-radius: 16px;
          background-color: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid #1f2937;
          position: relative;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }

        .login-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .login-container::before {
          content: '';
          position: absolute;
          inset: -1px;
          z-index: -1;
          background: linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6);
          border-radius: 17px;
          opacity: 0.3;
          filter: blur(8px);
          animation: pulse 3s infinite alternate;
        }

        @keyframes pulse {
          0% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.4;
          }
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-logo {
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }

        .login-logo-text {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          position: relative;
        }

        .login-logo-text::after {
          content: '';
          position: absolute;
          width: 40px;
          height: 4px;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(to right, #06b6d4, #3b82f6);
          border-radius: 2px;
        }

        .login-subtitle {
          font-size: 1rem;
          color: #9ca3af;
          margin-top: 1rem;
        }

        .login-form {
          margin-top: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #e5e7eb;
        }

        .form-input {
          width: 90%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          line-height: 1.5;
          color: #e5e7eb;
          background-color: rgba(31, 41, 55, 0.8);
          border: 1px solid #374151;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
        }

        .form-input.focused {
          border-color: #60a5fa;
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .form-error {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          animation: shake 0.5s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }

        .form-checkbox-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkbox-custom {
          position: relative;
          display: inline-block;
          width: 18px;
          height: 18px;
          margin-right: 8px;
          background-color: rgba(31, 41, 55, 0.8);
          border: 1px solid #374151;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .checkbox-input:checked ~ .checkbox-custom {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .checkbox-custom::after {
          content: '';
          position: absolute;
          display: none;
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .checkbox-input:checked ~ .checkbox-custom::after {
          display: block;
        }

        .checkbox-text {
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .forgot-password {
          font-size: 0.875rem;
          color: #60a5fa;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        .login-button {
          display: block;
          width: 100%;
          padding: 0.75rem 1.25rem;
          margin-top: 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          color: white;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .login-button:hover {
          background: linear-gradient(to right, #2563eb, #7c3aed);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .login-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .login-button-text {
          position: relative;
          z-index: 1;
          transition: all 0.2s ease;
        }

        .login-button-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
          opacity: 0;
          z-index: 0;
        }

        @keyframes spin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .login-button.loading .login-button-text {
          opacity: 0;
        }

        .login-button.loading .login-button-spinner {
          opacity: 1;
        }

        .login-divider {
          display: flex;
          align-items: center;
          margin: 2rem 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: #374151;
        }

        .login-divider::before {
          margin-right: 1rem;
        }

        .login-divider::after {
          margin-left: 1rem;
        }

        .social-login {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .social-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background-color: rgba(31, 41, 55, 0.8);
          border: 1px solid #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .social-button:hover {
          background-color: rgba(55, 65, 81, 0.8);
          transform: translateY(-2px);
        }

        .social-icon {
          width: 20px;
          height: 20px;
          fill: #e5e7eb;
        }

        .signup-prompt {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .signup-link {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .signup-link:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        /* Decorative elements */
        .login-decoration {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(to right, #06b6d4, #3b82f6);
          opacity: 0.1;
          filter: blur(40px);
          z-index: -1;
        }

        .login-decoration-1 {
          width: 200px;
          height: 200px;
          top: -100px;
          right: -100px;
        }

        .login-decoration-2 {
          width: 150px;
          height: 150px;
          bottom: -75px;
          left: -75px;
          background: linear-gradient(to right, #8b5cf6, #d946ef);
        }

        @media (max-width: 640px) {
          .login-container {
            padding: 1.5rem;
          }

          .login-logo-text {
            font-size: 2rem;
          }
        }
      `}</style>

      {/* Decorative elements */}
      <div className="login-decoration login-decoration-1"></div>
      <div className="login-decoration login-decoration-2"></div>

      <div className="login-header">
        <div className="login-logo">
          <h1 className="login-logo-text">AI-knows.me</h1>
        </div>
        <p className="login-subtitle">Sign in to discover your AI-generated profile</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`form-input ${isEmailFocused ? "focused" : ""} ${emailError ? "error" : ""}`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError("")
            }}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
          />
          {emailError && <div className="form-error">{emailError}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`form-input ${isPasswordFocused ? "focused" : ""} ${passwordError ? "error" : ""}`}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (passwordError) setPasswordError("")
            }}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
          {passwordError && <div className="form-error">{passwordError}</div>}
        </div>

        <div className="form-checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-text">Remember me</span>
          </label>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

        <button type="submit" className={`login-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
          <span className="login-button-text">Sign In</span>
          <span className="login-button-spinner"></span>
        </button>
      </form>

      <div className="login-divider">or continue with</div>

      <div className="social-login">
        <button className="social-button" title="Continue with Google">
          <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
        </button>
        <button className="social-button" title="Continue with LinkedIn">
          <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </button>
        <button className="social-button" title="Continue with Twitter">
          <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </button>
        <button className="social-button" title="Continue with GitHub">
          <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </button>
      </div>

      <div className="signup-prompt">
        Don't have an account?{" "}
        <a href="#" className="signup-link">
          Sign up
        </a>
      </div>
    </div>
  )
}
