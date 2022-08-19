import React from 'react';
import styles from './Hero.module.css'

class Hero extends React.Component {
  render() {
    return <div className={styles.hero}>
      <h1 className={styles.greeting}>Hello,<br />I&apos;m <span className={styles.name}>Mr. Will</span>.</h1>
    </div>
  }
}

export default Hero
