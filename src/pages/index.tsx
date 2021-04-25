import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from '../styles/pages/Home.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  durationAsString: string;
  members: string;
  published_at: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  allEpisodes: Episode[];
  latestEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList, togglePlay, currentEpisodeIndex, isPlaying, isPaused } = useContext(PlayerContext);
  
  const episodes = [...latestEpisodes, ...allEpisodes];

  return ( 
    <div className={styles.homePage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index: number) => (
            <li className={(index === currentEpisodeIndex && (isPlaying || isPaused)) ? styles.isListItemActive : ''} key={episode.id}>
              <Image 
                width={192}
                height={192} 
                src={episode.thumbnail} 
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>
              
             { (index === currentEpisodeIndex && isPlaying) ?
              (<button  
                  type="button"
                  onClick={togglePlay}  
                >
                  <img 
                    src="/pause-green.svg" 
                    alt="play latest episode" 
                    width="18px"
                    height="18px"  
                  /> 
                </button>):
                (<button  
                  type="button"
                  onClick={() => playList(episodes, index)}  
                >
                  <img src="/play-green.svg" alt="play latest episode" /> 
                </button>)
             }
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <table className={styles.responsiveTable} cellSpacing={0}>
              <thead>
                <tr>
                  <th></th>
                  <th>Título</th>
                  <th>Integrantes</th>
                  <th>Data</th>
                  <th>Duração</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {allEpisodes.map((episode, index: number) => (
                  <tr key={episode.id}>
                    <td style={{ width:100 }}>
                      <Image 
                        width={120} 
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                        
                      />
                      </td>

                      <td className={(index+latestEpisodes.length === currentEpisodeIndex) ? styles.isListItemActive : ''}>
                          <Link href={`/episodes/${episode.id}`}>
                            <a className={styles.linkResponsive}>{episode.title}</a>
                          </Link>
                      </td>

                      <td className={styles.membersResponsive}>{episode.members}</td>
                      <td style={{ width:100 }}>{episode.publishedAt}</td>
                      <td>{episode.durationAsString}</td>
                      <td>
                        { (index+latestEpisodes.length === currentEpisodeIndex && isPlaying) ?
                          (<button  
                              type="button"
                              onClick={togglePlay}  
                            >
                              <img src="/pause-green.svg" alt="play latest episode" /> 
                            </button>):
                            (<button  
                              type="button"
                              onClick={() => playList(episodes, index+latestEpisodes.length)}  
                            >
                              <img src="/play-green.svg" alt="play latest episode" /> 
                            </button>)
                        }
                      </td>
                    
                  </tr>
                ))}
              </tbody>
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async() => {
  const response = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  const data = await response.data;

  const episodes = data.map((episode) => {
    return {
      ...episode,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBr
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },  
    revalidate: 60*60*8
  }
}
