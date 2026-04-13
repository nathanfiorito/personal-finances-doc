import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '../styles/globals.css'

const navbar = (
  <Navbar
    logo={
      <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>
        Personal Finances
      </span>
    }
    projectLink="https://github.com/nathanfiorito/personal-finances"
  />
)

const footer = <Footer>Personal Finances — private reference docs</Footer>

export const metadata = {
  title: {
    template: '%s – Personal Finances Docs',
    default: 'Personal Finances Docs',
  },
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/nathanfiorito/personal-finances-doc"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
