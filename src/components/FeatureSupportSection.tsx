import styles from './FeatureSupportSection.module.scss'
import VisuallyHidden from './VisuallyHidden'
import CSSSupports from './CSSSupports'

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
        <div className={styles.item}>
          <dd>
            <CSSSupports condition="width: calc(sibling-index() * 1px)" />
          </dd>
          <dt>
            CSS: <code>sibling-index()</code>
          </dt>
        </div>
        <div className={styles.item}>
          <dd>
            <CSSSupports condition="animation-timeline: view()" />
          </dd>
          <dt>
            CSS: <code>animation-timeline: view()</code>
          </dt>
        </div>
      </dl>
    </section>
  )
}
