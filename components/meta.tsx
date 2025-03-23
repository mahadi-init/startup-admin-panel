import Head from "next/head"

interface MetaProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
}

export function Meta({ title, description, keywords, ogImage }: MetaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://admin.example.com"
  const defaultOgImage = `${siteUrl}/og-image.jpg`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

