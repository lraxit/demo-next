import ReviewsCarousel from './ReviewsCarousel.js'

import ReviewCard from './ReviewCard.js'
import Carousel from './Carousel.js'

export default async function Reviews({ autoScroll = false, minStars = 4, autoScrollInterval = 500 }) {
  const id = '2190a137-ae96-4965-a6dd-946ce564ede7'

  const response = await fetch(`https://featurable.com/api/v2/widgets/${id}`, { next: { revalidate: 3600 } })

  if (!response.ok) {
    return <p>Unable to load reviews.</p>
  }

  const data = await response.json()

  if (!data.success || !data.widget) {
    return <p>Unable to load reviews.</p>
  }

  const { widget } = data

  const reviews = widget.reviews.map((review) => ({
    reviewId: review.id,
    reviewer: {
      displayName: review.author?.name || 'Anonymous',
      profilePhotoUrl: review.author?.avatarUrl || '',
      isAnonymous: !review.author?.name,
    },
    starRating: review.rating.value,
    comment: review.text || '',
    createTime: review.publishedAt,
    updateTime: review.publishedAt,
  }))

  return (
    <Carousel
      autoScroll={autoScroll}
      cards={reviews
        .filter((review) => review.starRating >= minStars)
        .map((review) => (
          <ReviewCard
            key={review.reviewId}
            profileImage={review.reviewer.profilePhotoUrl}
            name={review.reviewer.displayName}
            stars={review.starRating}
            date={review.createTime}
            description={review.comment}
          />
        ))}
    />
  )
}
