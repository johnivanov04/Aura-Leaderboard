// src/AuthContext.js

import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Initialize token from localStorage (if any)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  // Decode JWT payload into a `user` object, or null if no token
  const user = token ? jwtDecode(token) : null

  // Whenever `token` changes:
  //  • Persist it to localStorage
  //  • Wire up axios defaults for baseURL and Authorization header
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5050/api'
    if (token) {
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Call this with a real JWT to log in
  const login = newToken => setToken(newToken)

  // Call this to log out (clears token, header, and localStorage)
  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
