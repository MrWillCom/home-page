import styles from './VisuallyHidden.module.scss'
import React from 'react'

export default function VisuallyHidden({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          const typedChild = child as React.ReactElement<
            React.HTMLAttributes<HTMLElement>
          >
          const existingClassName = typedChild.props.className || ''
          const combinedClassName = `${existingClassName} ${styles.vh}`.trim()
          return React.cloneElement(typedChild, {
            className: combinedClassName,
          })
        } else {
          if (
            child === null ||
            child === undefined ||
            typeof child === 'boolean'
          ) {
            return null
          }
          return <div className={styles.vh}>{child}</div>
        }
      })}
    </>
  )
}
