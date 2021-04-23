import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Head from 'next/head';
import ptBr from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Link from 'next/link';

import styles from '../../styles/pages/episodes/episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    duration: string;
    durationAsString: string;
    members: string;
    published_at: string;
    url: string;
    publishedAt: string;
}

type EpisodeProps = {
    episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
    const { play } = usePlayer();

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>
            <div className={styles.wrapper}>
                <div className={styles.thumbnailContainer}>
                    <Link href="/">
                        <button type="button">
                            <img src="/arrow-left.svg" alt="back"/>
                        </button>
                    </Link>

                    <Image 
                        width={700}
                        height={160}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />

                    <button
                        type="button"
                        onClick={() => play(episode)}
                    >
                        <img src="/play.svg" alt="play episode"/>
                    </button>
                </div>

                <header>
                    <h1>{episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                </header>

                <div 
                    className={styles.description} 
                    dangerouslySetInnerHTML={{ __html: episode.description }}
                />
            </div>
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async() => {
    const response = await api.get('/episodes', {
        params: {
          _limit: 2,
          _sort: 'published_at',
          _order: 'desc'
        }
      })
      const data = await response.data;
      const paths = data.map(episode => {
          return {
            params: {
                slug: episode.id
            }
          }
      })
    
    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async(ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`);
    
    const episode = {
        ...data,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
          locale: ptBr
        }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        url: data.file.url
    }

    return {
        props: {
            episode
        },
        revalidate: 60*60*24,
    }
}