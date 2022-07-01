import React, { useState, useEffect } from "react"
import { batch, useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import loading from "reducers/loading"
import user from "reducers/user"
import { API_URL } from "utils/urls"

const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isLoading = useSelector((store) => store.loading.isLoading)
  const accessToken = useSelector((store) => store.user.accessToken)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [mode, setMode] = useState("register")

  useEffect(() => {
    if (accessToken) {
      navigate("/loggedin")
    }
  }, [accessToken])

  const onFormSubmit = (event) => {
    event.preventDefault()
    if (!username || !password) {
      alert("Username and password are required.")
    } else {
      dispatch(loading.actions.setLoading(true))
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      }
      fetch(API_URL(mode), options)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            batch(() => {
              dispatch(user.actions.setUsername(data.response.username))
              dispatch(user.actions.setUserId(data.response.userId))
              dispatch(user.actions.setAccessToken(data.response.accessToken))
              dispatch(user.actions.setError(null))
            })
          } else {
            batch(() => {
              alert(data.response.message)
              dispatch(user.actions.setError(data.response))
              dispatch(user.actions.setUsername(null))
              dispatch(user.actions.setUserId(null))
              dispatch(user.actions.setAccessToken(null))
            })
          }
          dispatch(loading.actions.setLoading(false))
        })
    }
  }

  if (isLoading) {
    return <div>Loading</div>
  }

  return (
    <div>
      <h1>
        {mode === "register" ? "Register" : "Log in"}
      </h1>
      <form onSubmit={onFormSubmit}>
        <input
          required
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          onChange={e => setUsername(e.target.value)}
        />
        <input
          required
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
        >
          {mode === "register" ? "Register" : "Log in"}
        </button>
        <div>
          <a
            href="#"
            variant="body2"
            onClick={() => setMode(mode === "register" ? "login" : "register")}>
            {mode === "register"
              ?
              "You have an account? Click here to log in"
              :
              "Don't have an account? Click here to register"
            }
          </a>
        </div>
      </form>
    </div>
  )
}

export default Login
