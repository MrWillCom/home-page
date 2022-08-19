import React from 'react';
import styles from './Grid.module.css'

import GridItem from './GridItem.jsx'

class Grid extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <div className={(this.props.className ? this.props.className + ' ' : '') + styles.grid}>
      {(() => {
        var items = []
        for (var i = 0; i < this.props.data.length; i++) {
          const item = this.props.data[i]
          items.push(<GridItem
            key={item.key}
            icon={item.icon}
            iconFill={item.iconFill}
            title={item.title}
            subtitle={item.subtitle}
            link={item.link}
          />)
        }
        return items
      })()}
    </div>
  }
}

export default Grid
