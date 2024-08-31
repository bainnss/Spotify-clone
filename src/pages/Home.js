import React, {useState} from 'react'
import Sidebar from './Sidebar'
import '../styles/Home.scss'
import Playlist from './Playlist'

const Home = () => {

  const [backgroundColor, setBackgroundColor] = useState('#201606')

  const backgroundStyle = {
    background: `linear-gradient(108.18deg, ${backgroundColor} 2.46%, #000000 99.84%)`,
    width: '100%',
    height: 'calc(1005 - 150px)',
    display: 'flex',
  };
  return (
    <div className='spotify-home-wrapper' style={backgroundStyle}>
      <Sidebar />
      <Playlist setBackgroundColor={setBackgroundColor} />
    </div>
  )
}

export default Home
