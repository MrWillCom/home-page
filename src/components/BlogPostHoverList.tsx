'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Portal } from '@radix-ui/react-portal'
import { motion, AnimatePresence, useMotionValue } from 'motion/react'
import { useMediaQuery } from '@reactuses/core'
import styles from './BlogPostsSection.module.scss'

interface Post {
  title: string
  date: string
  permalink: string
  coverImage: string | undefined
  coverImageAlt: string
}

interface BlogPostHoverListProps {
  posts: Post[]
}

export default function BlogPostHoverList({ posts }: BlogPostHoverListProps) {
  const [activePost, setActivePost] = useState<Post | null>(null)
  const left = useMotionValue(0)
  const top = useMotionValue(0)
  const hasFinePointer = useMediaQuery('(pointer: fine)')

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      left.set(e.clientX + 10)
      top.set(e.clientY + 10)
    },
    [left, top],
  )

  return (
    <>
      <ul
        className={styles.postsList}
        {...(hasFinePointer ? { onMouseMove: handleMouseMove } : {})}
      >
        {posts.map(post => (
          <li
            key={post.permalink}
            className={styles.postItem}
            {...(hasFinePointer
              ? {
                  onMouseEnter: () => setActivePost(post),
                  onMouseLeave: () => setActivePost(null),
                }
              : {})}
          >
            <a href={post.permalink} target="_blank" className={styles.postLink}>
              <span className={styles.title}>{post.title}</span>
              <span className={styles.date}>{post.date}</span>
            </a>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {hasFinePointer && activePost?.coverImage && (
          <Portal key={activePost.permalink}>
            <motion.div
              className={styles.hoverImage}
              style={{
                left,
                top,
              }}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <Image
                src={activePost.coverImage}
                alt={activePost.coverImageAlt}
                width={320}
                height={180}
                className={styles.coverImage}
              />
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  )
}
