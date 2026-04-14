import Image from 'next/image'
import styles from './FriendsSection.module.scss'

interface Friend {
  name: string
  description: string
  link: string
  avatar: string
}

const friends: Friend[] = [
  {
    name: 'Louis Aeilot',
    description: 'Stay Hungry. Stay Foolish.',
    link: 'https://aeilot.top/',
    avatar: 'aeilot.jpeg',
  },
  {
    name: 'Kevin Zhong',
    description: "HSEFZ 25' | UIUC 29'",
    link: 'https://www.clckkkkk.site/',
    avatar: 'clck.webp',
  },
  {
    name: 'Innei',
    description: '致虚极，守静笃。',
    link: 'https://innei.in/',
    avatar: 'innei.jpeg',
  },
]

async function FriendItem({ friend }: { friend: Friend }) {
  const { default: image } = await import('@/assets/friends-avatars/' + friend.avatar)

  return (
    <li className={styles.friendItem}>
      <a href={friend.link} target="_blank">
        <Image
          src={image}
          alt={`${friend.name}'s avatar`}
          width={60}
          height={60}
          className={styles.avatar}
        />
        <h3 className={styles.name}>{friend.name}</h3>
        <p className={styles.description}>{friend.description}</p>
      </a>
    </li>
  )
}

export default function FriendsSection() {
  return (
    <section className={styles.sect}>
      <h2 className={styles.heading}>Friends</h2>
      <ul className={styles.friendsList}>
        {...friends.map(friend => <FriendItem friend={friend} />)}
      </ul>
    </section>
  )
}
