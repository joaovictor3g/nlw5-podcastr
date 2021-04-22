import Image from 'next/image';
import React, { useContext, useEffect, useRef } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';

export function Player() {
    const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState } = useContext(PlayerContext);
    const episode = episodeList[currentEpisodeIndex];
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if(!audioRef.current)  
            return;
        if(isPlaying) {
            audioRef.current.play();
        }else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <div className={styles.playerContainer}>
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
                    <span>00:00</span>

                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                                trackStyle={{ background:'#04D361' }}
                                railStyle={{ background: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04D361', borderWidth: 1 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        ) }
                    </div>

                    <span>00:00</span>    
                </div>    

                { episode && (
                    <audio 
                        src={episode.url} 
                        autoPlay
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                ) }

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="shuffle"/>
                    </button>

                    <button type="button" disabled={!episode}>
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

                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="play next"/>
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="repeat"/>
                    </button>
                </div>
            </footer>  
        </div>
    );
}