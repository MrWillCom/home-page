import styles from './ReneurPromotion.module.scss'

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
}

const Logo = ({ size, ...props }: LogoProps) => (
  <svg
    width="600"
    height="800"
    style={
      {
        '--size': typeof size === 'number' ? size + 'px' : size,
        width: 'calc(var(--size) * 3 / 4)',
        height: 'var(--size)',
      } as React.CSSProperties
    }
    viewBox="0 0 600 800"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Reneur Logo"
    {...props}
  >
    <g clipPath="url(#clip0_2_28)">
      <path
        d="M0 800V0H160C500 0 600 235 600 405H255C300 680 525 800 525 800H0Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_2_28">
        <rect width="600" height="800" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

// this is a temporary banner for Reneur's waitlist

export default function ReneurPromotion() {
  return (
    <section className={styles.sect}>
      <div className={styles.card}>
        <Logo className={styles.logo} size={'2.5em'} />
        <h2>Reneur</h2>
        <p>The all-in-one place for your links.</p>
        <a href="https://accounts.reneur.link/waitlist" target="_blank">
          Join the Waitlist
        </a>
      </div>
    </section>
  )
}
