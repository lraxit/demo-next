import SimpleGallery from '../components/SimpleGallery'

const images = [
  {
    largeURL:
      'https://i5.walmartimages.com/seo/Cadbury-Dairy-Milk-Milk-Chocolate-Candy-Bar-3-5-oz_076151ce-29d1-4900-be38-ba72b84f0c77.37c1a3e183d8a715c428a13fb0ed45d1.jpeg',
    thumbnailURL:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQli6RkQDUC4pZ9MM0A2kFlfTfps7bZS1fpDked5NUa1g&s=10',
    width: 300,
    height: 400,
  },
  {
    largeURL: 'https://cdn.coda.io/icons/svg/color/path.svg',
    thumbnailURL:
      'https://codaio.imgix.net/docs/DK5IYAlqbJ/blobs/bl-sI4FVlHv_n/8fba4e8950870e4d487268690fbbfb1800bf245f66f4d11f0810c478e5862982832606b1c454aa5aa7616c6e2452985c92fc20d5d5f8e5be97d77f327a0395fa0a9dc8bd0f0fc561f872aa590093d032c28add8c0c2e4caa93d7a07850241473115fdadb?fit=max&fm=webp&lossless=true',
    width: 300,
    height: 400,
  },
]

// I belong inside src/app/about/page.js
export default function About() {
  return (
    <div className="p-12">
      <h1>About Page</h1>
      <SimpleGallery galleryID="a" images={images} />
    </div>
  )
}
