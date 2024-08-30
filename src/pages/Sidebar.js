import React from 'react'
import '../styles/Sidebar.scss'
import Logo from '../assets/logo/Logo.png'
import Profile from '../assets/profile/Profile.png'
const Sidebar = () => {
    return (
        <div className='sidebar-wrapper'>
            <img src={Logo} className='sw-logo' height={40} width={130} alt='Spotify-logo' />
            <img src={Profile} className='sw-profile' height={48} width={48} alt='profile-icon' />
        </div>
    )
}

export default Sidebar
