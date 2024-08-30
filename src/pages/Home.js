import React from 'react'
import Sidebar from './Sidebar'
import '../styles/Home.scss'
import Playlist from './Playlist'

const Home = () => {
  return (
    <div className='spotify-home-wrapper'>
      <Sidebar />
      <Playlist />
    </div>
  )
}

export default Home
