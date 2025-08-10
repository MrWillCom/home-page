'use client'

import styles from './MessageSection.module.scss'
import { useState } from 'react'
import * as z from 'zod'
import { useOpenPanel } from '@openpanel/nextjs'

const MESSAGE_MAX_LENGTH = 150
const messageDataZ = z.object({
  message: z.string().max(MESSAGE_MAX_LENGTH).min(1),
  email: z.email(),
  name: z.string().max(30).optional(),
  website: z.string().max(80).optional(),
})

export default function MessageSection() {
  const [isDone, setIsDone] = useState(false)
  const [isError, setIsError] = useState(false)
  const op = useOpenPanel()

  return (
    <section className={styles.sect}>
      <h2 className={styles.heading}>
        <i>Send</i> a Message
      </h2>
      <form
        className={styles.controls}
        onSubmit={async ev => {
          ev.preventDefault()
          const data = Object.fromEntries(new FormData(ev.currentTarget))
          const { data: parsed, success } = messageDataZ.safeParse(data)

          if (!success) {
            setIsError(true)
          } else {
            if (isError) {
              setIsError(false)
            }

            op.track('send_a_message', parsed)

            ev.currentTarget.reset()
            setIsDone(true)
          }
        }}
      >
        <textarea
          placeholder="Feel free to message whatever you'd like to.*"
          maxLength={MESSAGE_MAX_LENGTH}
          name="message"
          className={styles.left}
        />
        <div className={styles.right}>
          <input type="email" placeholder="Email*" name="email" />
          <input type="text" placeholder="Name" maxLength={30} name="name" />
          <input
            type="text"
            placeholder="Website"
            maxLength={80}
            name="website"
          />
          <button type="submit" disabled={isDone}>
            {isDone ? 'Message sent.' : 'Send'}
          </button>
          <label
            className={styles.notes + (isError ? ' ' + styles.warning : '')}
          >
            Fields without "*" are optional. Your email is necessary to send you
            a reply. Don't spam.
          </label>
          {isError ? (
            <label className={styles.error}>
              Something went wrong. Please make sure what you entered are valid.
              Your message can't be empty or longer than {MESSAGE_MAX_LENGTH}{' '}
              characters.
            </label>
          ) : null}
        </div>
      </form>
    </section>
  )
}
