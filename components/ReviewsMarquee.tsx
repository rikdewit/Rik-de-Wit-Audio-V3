'use client';

interface Review {
  authorAttribution: { displayName: string; photoUri?: string };
  rating: number;
  text?: { text: string; languageCode: string };
  publishDate: string;
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const days = Math.floor((now.getTime() - date.getTime()) / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (days === 0) return 'vandaag';
  if (days === 1) return 'gisteren';
  if (days < 7) return `${days} dagen geleden`;
  if (weeks === 1) return 'een week geleden';
  if (weeks < 4) return `${weeks} weken geleden`;
  if (months === 1) return 'een maand geleden';
  if (months < 12) return `${months} maanden geleden`;
  if (years === 1) return 'een jaar geleden';
  return `${years} jaar geleden`;
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'xs' }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function TextReviewCard({ review }: { review: Review }) {
  const text = review.text!.text;
  const isLong = text.length > 180;

  return (
    <div
      className={`flex-shrink-0 ${isLong ? 'w-[420px]' : 'w-[290px]'} bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mx-3 flex flex-col gap-3`}
    >
      <StarRating rating={review.rating} />
      <p className="text-sm text-gray-700 leading-relaxed flex-1">"{text}"</p>
      <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
        <Avatar name={review.authorAttribution.displayName} />
        <div>
          <p className="text-xs font-semibold text-black leading-none">
            {review.authorAttribution.displayName}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {getRelativeTime(review.publishDate)}
          </p>
        </div>
      </div>
    </div>
  );
}

function CompactReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 w-[210px]">
      <Avatar name={review.authorAttribution.displayName} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-black leading-none truncate">
          {review.authorAttribution.displayName}
        </p>
        <div className="mt-1">
          <StarRating rating={review.rating} size="xs" />
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {getRelativeTime(review.publishDate)}
        </p>
      </div>
    </div>
  );
}

export default function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  const textReviews = reviews.filter((r) => r.text?.text?.trim());
  const noTextReviews = reviews.filter((r) => !r.text?.text?.trim());

  const pairs: Review[][] = [];
  for (let i = 0; i < noTextReviews.length; i += 2) {
    pairs.push(noTextReviews.slice(i, i + 2));
  }

  const items: Array<{ type: 'text'; review: Review } | { type: 'pair'; reviews: Review[] }> = [];
  const maxLen = Math.max(textReviews.length, pairs.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < textReviews.length) items.push({ type: 'text', review: textReviews[i] });
    if (i < pairs.length) items.push({ type: 'pair', reviews: pairs[i] });
  }

  if (!items.length) return null;

  const renderItems = (prefix: string) =>
    items.map((item, i) => {
      if (item.type === 'text') {
        return <TextReviewCard key={`${prefix}-${i}`} review={item.review} />;
      }
      return (
        <div key={`${prefix}-${i}`} className="flex flex-col gap-3 mx-3 flex-shrink-0">
          {item.reviews.map((r, j) => (
            <CompactReviewCard key={j} review={r} />
          ))}
        </div>
      );
    });

  return (
    <div
      className="relative"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex items-center"
        style={{ animation: 'marquee 35s linear infinite', width: 'max-content' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running';
        }}
        onTouchStart={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused';
        }}
        onTouchEnd={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running';
        }}
      >
        {renderItems('a')}
        {renderItems('b')}
      </div>
    </div>
  );
}
