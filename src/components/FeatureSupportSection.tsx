import styles from './FeatureSupportSection.module.scss'
import VisuallyHidden from './VisuallyHidden'
import CSSSupports from './CSSSupports'
import type { ReactNode } from 'react'

function Row({ status, feature }: { status: ReactNode; feature: ReactNode }) {
  return (
    <div className={styles.item}>
      <dd>{status}</dd>
      <dt>{feature}</dt>
    </div>
  )
}

export default function FeatureSupportSection() {
  return (
    <section className={styles.sect}>
      <VisuallyHidden>
        <h2>About This Page</h2>
      </VisuallyHidden>
      <p className={styles.description}>
        This page uses <i>state-of-the-art web technologies</i>. To fully
        appreciate its stunning details, <i>Chromium-based browsers</i> are
        recommended.
      </p>
      <p className={styles.description}>Your browser:</p>
      <dl className={styles.dl}>
        <Row
          status={
            <CSSSupports condition="width: calc(sibling-index() * 1px)" />
          }
          feature={
            <>
              CSS: <code>sibling-index()</code>
            </>
          }
        />
        <Row
          status={<CSSSupports condition="animation-timeline: view()" />}
          feature={
            <>
              CSS: <code>animation-timeline: view()</code>
            </>
          }
        />
        <Row
          status={
            <CSSSupports condition="mask-image: linear-gradient(to bottom, black 0%, transparent 100%)" />
          }
          feature={
            <>
              CSS: <code>mask-image</code>
            </>
          }
        />
        <Row
          status={<CSSSupports condition="font-variation-settings: normal" />}
          feature="Variable fonts"
        />
      </dl>
    </section>
  )
}
