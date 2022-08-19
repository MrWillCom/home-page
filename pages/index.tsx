import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Hero from '../components/Hero'
import Divider from '../components/Divider'
import { siCodepen, siGithub, siHexo, siMastodon, siPatreon } from 'simple-icons/icons'
import Grid from '../components/Grid.jsx'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <title>Mr. Will</title>
        <meta name="description" content="Mr. Will's personal home page." />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Hero />
      <Divider />
      <Grid className={styles.grid} data={[
        {
          key: 'github',
          icon: siGithub,
          iconFill: '#f0f6fc',
          title: 'GitHub',
          subtitle: '@MrWillCom',
          link: 'https://github.com/MrWillCom',
        },
        {
          key: 'blog',
          icon: siHexo,
          iconFill: '#' + siHexo.hex,
          title: 'Blog',
          subtitle: 'blog.mrwillcom.com',
          link: 'https://blog.mrwillcom.com/',
        },
        {
          key: 'mastodon',
          icon: siMastodon,
          iconFill: '#' + siMastodon.hex,
          title: 'Mastodon',
          subtitle: '@MrWillCom@noc.social',
          link: 'https://noc.social/@MrWillCom',
        },
        {
          key: 'codepen',
          icon: siCodepen,
          iconFill: '#fefefe',
          title: 'CodePen',
          subtitle: '@mrwillcom',
          link: 'https://codepen.io/mrwillcom',
        },
        {
          key: 'patreon',
          icon: siPatreon,
          iconFill: '#' + siPatreon.hex,
          title: 'Patreon',
          subtitle: '@MrWillCom',
          link: 'https://www.patreon.com/MrWillCom',
        },
      ]} />
    </div>
  )
}

export default Home
