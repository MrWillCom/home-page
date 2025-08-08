import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { OpenPanelComponent } from '@openpanel/nextjs'
import 'normalize.css/normalize.css'
import 'inter-ui/inter.css'
import 'inter-ui/inter-variable.css'
import 'simple-icons-font/font/simple-icons.min.css'
import 'atropos/scss'
import './globals.scss'

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mr. Will',
  description: 'A full-stack developer and a photographer.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistMono.variable}>
        <OpenPanelComponent
          clientId={process.env.OPENPANEL_CLIENT_ID!}
          trackScreenViews
          trackOutgoingLinks
          trackAttributes
          filter={(() => {
            return localStorage.getItem('umami.disabled') !== '1'
          }).toString()}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
