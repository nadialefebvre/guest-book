import React from "react"
import { useNavigate } from "react-router-dom"

const NotFound = () => {

  const navigate = useNavigate()

  return (
    <div>
      <h1>
        Not found
      </h1>
      <button
        type="button"
        onClick={() => navigate("/")}
      >
        Go back to home page
      </button>
    </div>
  )
}

export default NotFound
