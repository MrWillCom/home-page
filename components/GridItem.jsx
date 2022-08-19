import React from 'react'
import styles from './GridItem.module.css'

class GridItem extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <a className={styles.gridItem} href={this.props.link}>
      <svg className={styles.icon} style={{ '--fill': this.props.iconFill ? this.props.iconFill : '#fffd' }} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d={this.props.icon.path} /></svg>
      <p className={styles.title}>{this.props.title}</p>
      <p className={styles.subtitle}>{this.props.subtitle}</p>
    </a>
  }
}

export default GridItem
