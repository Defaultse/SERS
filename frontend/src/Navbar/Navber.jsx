import React, { ReactElement } from 'react'

export default function NavBar() {

    return (
      <nav className="">
          <a className="" href="/">Voice Patrol</a>
          <ul className="">
              <li>Home</li>
              <li>Profile</li>
          </ul>
      </nav>
    )
}