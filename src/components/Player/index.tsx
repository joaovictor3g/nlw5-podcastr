import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay, 
        setPlayingState, 
        playNext, 
        playPrevious, 
        hasNext, 
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState
    } = usePlayer();
    const episode = episodeList[currentEpisodeIndex];
    const audioRef = useRef<HTMLAudioElement>(null);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if(!audioRef.current)  
            return;
        if(isPlaying) {
            audioRef.current.play();
        }else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    function setUpProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if(hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    return (
        <div className={(isPlaying || episode) ? styles.playerContainer : styles.playerNotPlaying}>
            <header>
                <img src="/playing.svg" alt="playing now"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                        width={592} 
                        height={593} 
                        src={episode.thumbnail}
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={episode ? '' : styles.empty}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>

                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                                trackStyle={{ background:'#04D361' }}
                                railStyle={{ background: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04D361', borderWidth: 1 }}
                                max={Number(episode.duration)}
                                value={progress}
                                onChange={handleSeek}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        ) }
                    </div>

                    <span>{convertDurationToTimeString(Number(episode?.duration ?? 0))}</span>    
                </div>    

                { episode && (
                    <audio 
                        src={episode.url} 
                        autoPlay
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        loop={isLooping}
                        onLoadedMetadata={setUpProgressListener}
                        onEnded={handleEpisodeEnded}
                    />
                ) }

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length===1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="shuffle"/>
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode || !hasPrevious}
                        onClick={playPrevious}
                    >
                        <img src="/play-previous.svg" alt="previous play"/>
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode}
                        className={styles.playButton}
                        onClick={togglePlay}
                       
                    >
                        { isPlaying ? (
                            <img src="/pause.svg" alt="play"/>
                        ) : (
                            <img src="/play.svg" alt="play"/>
                        ) }
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode || !hasNext}
                        onClick={playNext}
                    >
                        <img src="/play-next.svg" alt="play next"/>
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="repeat"/>
                    </button>
                </div>
            </footer>  
        </div>
    );
}