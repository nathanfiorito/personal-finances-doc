import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>
      Personal Finances
    </span>
  ),
  primaryHue: 24,
  primarySaturation: 93,
  project: {
    link: 'https://github.com/nathanfiorito/personal-finances',
  },
  docsRepositoryBase: 'https://github.com/nathanfiorito/personal-finances-doc',
  footer: {
    text: 'Personal Finances — private reference docs',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Personal Finances Docs',
    }
  },
}

export default config
