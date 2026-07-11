export const metadata = {
  title: 'Maa.aam',
  description: 'Original ambient sounds from Estonia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="et">
      <body>{children}</body>
    </html>
  )
}