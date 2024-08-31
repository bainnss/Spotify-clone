import React, { useEffect, useRef, useState } from 'react';
import '../styles/Playlist.scss';
import SearchIcon from '../assets/icons/search.png';
import Loader from '../components/Loader';
import InfoIcon from '../assets/icons/info.png';
import BackIcon from '../assets/icons/back.png';
import PauseIcon from '../assets/icons/pause.png';
import PlayIcon from '../assets/icons/play.png';
import ForwardIcon from '../assets/icons/forward.png';
import VolumeIcon from '../assets/icons/volume.png';

const Playlist = ({ setBackgroundColor }) => {
    const [currentSelection, setCurrentSelection] = useState('for-you');
    const [fetchData, setFetchData] = useState([]);
    const [searchSong, setSearchSong] = useState('');
    const [loader, setLoader] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showVolume, setShowVolume] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchSongsData = async () => {
            setLoader(true);
            try {
                const res = await fetch('https://cms.samespace.com/items/songs');
                const songData = await res.json();
                console.log(songData, 'song response');
                setFetchData(songData.data);

                if (songData.data.length) {
                    // Access the accent property of the first song
                    const accentColor = songData.data[0]?.accent;
                    setBackgroundColor(accentColor);
                    setCurrentSongIndex(0); // Set default song index to the first song
                    console.log(accentColor, "Accent Color");
                }
            } catch (error) {
                console.error('Error Fetching data', error);
            } finally {
                setLoader(false);
            }
        };

        fetchSongsData();
    }, [setBackgroundColor]);

    useEffect(() => {
        if (currentSongIndex !== null && fetchData[currentSongIndex]) {
            const accentColor = fetchData[currentSongIndex].accent;
            setBackgroundColor(accentColor);
        }
    }, [currentSongIndex, fetchData, setBackgroundColor]);

    const handleForYouClick = () => {
        setCurrentSelection('for-you');
    };

    const handleTopTrackClick = () => {
        setCurrentSelection('top-tracks');
    };

    const handleSearchSong = (e) => {
        setSearchSong(e.target.value);
    };

    const handleSongClick = (index) => {
        if (currentSongIndex === index) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSongIndex(index);
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSongIndex]);

    const handleTimeUpdate = () => {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        const progressPercentage = (currentTime / duration) * 100;
        setProgress(progressPercentage);
    };

    const handleProgressChange = (e) => {
        const newProgress = e.target.value;
        audioRef.current.currentTime = (audioRef.current.duration * newProgress) / 100;
        setProgress(newProgress);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    const toggleVolumeControl = () => {
        setShowVolume((prev) => !prev);
    };

    const handleForwardClick = () => {
        const nextIndex = currentSongIndex + 1;
        if (nextIndex < fetchData.length) {
            setCurrentSongIndex(nextIndex);
            setBackgroundColor(fetchData[nextIndex].accent); // Update the accent color in the parent
        }
    };

    const handleBackwardClick = () => {
        const prevIndex = currentSongIndex - 1;
        if (prevIndex >= 0) {
            setCurrentSongIndex(prevIndex);
            setBackgroundColor(fetchData[prevIndex].accent); // Update the accent color in the parent
        }
    };

    const allTracks = fetchData.filter((song) => {
        const matchesSearch = song.name.toLowerCase().includes(searchSong) ||
            song.artist.toLowerCase().includes(searchSong);
        return currentSelection === 'top-tracks' ? song.top_track && matchesSearch : matchesSearch;
    });

    return (
        <div className='playlist-cover-wrapper'>
            <div className='playlist-wrapper'>
                <div className='playlist-tabs'>
                    <div
                        className={`playlist-fy-text ${currentSelection === 'for-you' ? 'tabActive' : ''}`}
                        onClick={handleForYouClick}
                    >
                        For You
                    </div>
                    <div
                        className={`playlist-tt-text ${currentSelection === 'top-tracks' ? 'tabActive' : ''}`}
                        onClick={handleTopTrackClick}
                    >
                        Top Tracks
                    </div>
                </div>
                <div className='playlist-search-holder'>
                    <input
                        placeholder='Search Songs,Artist'
                        className='playlist-search'
                        type='text'
                        value={searchSong}
                        onChange={handleSearchSong}
                    />
                    <img src={SearchIcon} alt='search' width={32} height={32} className='search-icon' />
                </div>
                <div className='playlist-tab-content'>
                    {loader ? (
                        <Loader />
                    ) : currentSelection === 'for-you' ? (
                        <div className='fy-songs'>
                            {allTracks.map((song, index) => (
                                <div className='fy-song' key={index}
                                    onClick={() => handleSongClick(index)}>
                                    <div className='fy-song-c1'>
                                        <div className='fy-c1-s1'>
                                            <img src={`https://cms.samespace.com/assets/${song.cover}`} className='fy-song-icon' height={48} width={48} />
                                        </div>
                                        <div className='fy-c1-s2'>
                                            <span className='fy-song-name'>{song.name}</span>
                                            <span className='fy-song-artist'>{song.artist}</span>
                                        </div>
                                    </div>
                                    <div className='fy-song-c2'>
                                        4:10
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='fy-songs'>
                            {allTracks.map((song, index) => (
                                <div className='fy-song' key={index}>
                                    <div className='fy-song-c1'>
                                        <div className='fy-c1-s1'>
                                            <img src={`https://cms.samespace.com/assets/${song.cover}`} className='fy-song-icon' height={48} width={48} />
                                        </div>
                                        <div className='fy-c1-s2'>
                                            <span className='fy-song-name'>{song.name}</span>
                                            <span className='fy-song-artist'>{song.artist}</span>
                                        </div>
                                    </div>
                                    <div className='fy-song-c2'>
                                        4:10
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Cover */}
            <div className='cover-song-wrapper'>
                {currentSongIndex !== null && (
                    <div className='cover-single'>
                        <h4 className='cover-song-name'>{fetchData[currentSongIndex].name}</h4>
                        <span className='cover-artist-name'>{fetchData[currentSongIndex].artist}</span>
                        <img
                            src={`https://cms.samespace.com/assets/${fetchData[currentSongIndex].cover}`}
                            className='cover-img'
                            height={380}
                            width={380}
                            alt={fetchData[currentSongIndex].name}
                        />
                        <div className='cover-actions'>
                            <audio
                                ref={audioRef}
                                src={fetchData[currentSongIndex].url}
                                onTimeUpdate={handleTimeUpdate}
                            // Removed autoPlay to ensure it starts paused
                            />
                            <div className='cover-progress'>
                                <input
                                    type='range'
                                    className='progress-bar'
                                    min='0'
                                    max='100'
                                    value={progress}
                                    onChange={handleProgressChange}
                                />
                            </div>
                            <div className='cover-cta-wrapper'>
                                <div className='cover-cta-info'>
                                    <img src={InfoIcon} alt='info' width={40} height={40} />
                                </div>
                                <div className='cover-cta-back'>
                                    <img
                                        src={BackIcon}
                                        alt='backward'
                                        width={40}
                                        height={40}
                                        onClick={handleBackwardClick}
                                    />
                                </div>
                                <div className='cover-cta-play'>
                                    <img
                                        src={isPlaying ? PlayIcon : PauseIcon}
                                        alt={isPlaying ? 'pause' : 'play'}
                                        width={40}
                                        height={40}
                                        onClick={() => setIsPlaying((prev) => !prev)}
                                    />
                                </div>
                                <div className='cover-cta-forward'>
                                    <img
                                        src={ForwardIcon}
                                        alt='forward'
                                        width={40}
                                        height={40}
                                        onClick={handleForwardClick}
                                    />
                                </div>
                                <div className='cover-volume'>
                                    <img
                                        src={VolumeIcon}
                                        alt='volume'
                                        width={40}
                                        height={40}
                                        onClick={toggleVolumeControl}
                                    />
                                    {showVolume && (
                                        <input
                                            type='range'
                                            className='volume-bar'
                                            min='0'
                                            max='1'
                                            step='0.01'
                                            value={volume}
                                            onChange={handleVolumeChange}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Playlist;
