import { useEffect } from 'react'

const SITE_NAME = 'Bliss Haven Edge'
const OG_IMAGE  = '/images/logo.jpeg'

// Sets document.title + all relevant meta tags client-side.
// Works with Googlebot (renders JS). Replace placeholder domain before launch.
export function useSEO({ title, description, path = '/' }) {
  useEffect(() => {
    document.title = title

    // Creates or updates a <meta> tag by name or property
    const set = (key, value, isProp = false) => {
      const attrName = isProp ? 'property' : 'name'
      let el = document.head.querySelector(`meta[${attrName}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    set('description',         description)
    set('og:title',            title,                true)
    set('og:description',      description,          true)
    set('og:type',             'website',            true)
    set('og:image',            OG_IMAGE,             true)
    set('og:site_name',        SITE_NAME,            true)
    set('twitter:card',        'summary_large_image')
    set('twitter:title',       title)
    set('twitter:description', description)
  }, [title, description, path])
}
