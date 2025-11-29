// src/App.js
import React, { useContext } from 'react'
import { AuthContext } from './AuthContext'
import LoginForm      from './components/LoginForm'
import RegisterForm   from './components/RegisterForm'
import MainApp        from './MainApp'

export default function App() {
  const { user } = useContext(AuthContext)

  // If there’s no logged‑in user, show login/register
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <LoginForm />
          <div className="text-center text-gray-500">— or —</div>
          <RegisterForm />
        </div>
      </div>
    )
  }

  // Otherwise, render your main leaderboard/history UI
  return <MainApp />
}
