import React from 'react'
import { Link } from 'react-router-dom'

const UserNotFound = () => {
  return (
    <div>
      <h2>User not found</h2>
      <Link to={'/'}>Return to Home Page</Link>
    </div>
  )
}

export default UserNotFound
