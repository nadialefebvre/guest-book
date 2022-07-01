import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { API_URL } from "utils/urls"
import user from "../reducers/user"

const LoggedIn = () => {

  const [message, setMessage] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const accessToken = useSelector((store) => store.user.accessToken)
  const username = useSelector((store) => store.user.username)

  useEffect(() => {
    if (!accessToken) {
      navigate("/")
    }
  }, [accessToken])

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken,
      },
    }

    fetch(API_URL("loggedin"), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage(data.response)
          dispatch(user.actions.setError(null))
        } else {
          dispatch(user.actions.setError(data.response))
        }
      })
  }, [])

  return (
    <div>
      <h1>Logged in</h1>
      <h2>
        Bravo {username}, you did it!<br />{message}
      </h2>
      <button
        type="button"
        onClick={() => dispatch(user.actions.logOut())}
      >
        Log out
      </button>
    </div>
  )
}

export default LoggedIn
