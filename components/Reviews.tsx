import ReviewsMarquee from './ReviewsMarquee';

interface Review {
  authorAttribution: { displayName: string };
  rating: number;
  text?: { text: string; languageCode: string };
  publishDate: string;
}

const REVIEWS: Review[] = [
  {
    authorAttribution: { displayName: 'Bart-Jan Hoogink' },
    rating: 5,
    text: {
      text: 'Rik heeft onlangs geluid verzorgd tijdens ons optreden. Hij was lekker op tijd aanwezig om de situatie goed te bekijken en om even kennis te kunnen maken en specifieke wensen vanuit ons als band te bespreken. De organisatie vanuit het geluidsbedrijf dat hem inhuurde verliep niet helemaal volgens afspraak, maar dat loste Rik heel professioneel op door rustig te blijven, focus op wat moest gebeuren en met ons te blijven communiceren tijdens de opbouw en soundcheck. Het geluid richting het publiek klonk hartstikke goed. We regelden zelf onze in ear mix, maar ook daar dacht Rik in mee wanneer we daarin tegen issues aanliepen. Al met al zou ik Rik zeker aanraden!',
      languageCode: 'nl',
    },
    publishDate: '2026-05-26',
  },
  {
    authorAttribution: { displayName: 'Peter Coolen' },
    rating: 5,
    text: {
      text: 'Alles was perfect geregeld. Rik was ruim op tijd aanwezig en heeft samen met ons alles opgebouwd, echt goed teamwork. Tijdens het feest werkte alles uitstekend. Kortom: professioneel, prettig in de omgang en een belangrijke bijdrage aan een heel geslaagd feest.',
      languageCode: 'nl',
    },
    publishDate: '2026-05-23',
  },
  {
    authorAttribution: { displayName: 'Yara L' },
    rating: 5,
    text: {
      text: 'Fijne communicatie en Rik heeft het optreden van de band bij ons gala top verzorgd!',
      languageCode: 'nl',
    },
    publishDate: '2026-05-21',
  },
  {
    authorAttribution: { displayName: 'Abraham Pinto' },
    rating: 5,
    publishDate: '2026-04-26',
  },
  {
    authorAttribution: { displayName: 'Emma Schoutsen' },
    rating: 5,
    publishDate: '2026-03-26',
  },
  {
    authorAttribution: { displayName: 'Tames de Buck' },
    rating: 5,
    publishDate: '2026-03-26',
  },
  {
    authorAttribution: { displayName: 'Zoë' },
    rating: 5,
    publishDate: '2026-03-26',
  },
  {
    authorAttribution: { displayName: 'Eileen Staa' },
    rating: 5,
    publishDate: '2026-03-26',
  },
  {
    authorAttribution: { displayName: 'Ramon Boon' },
    rating: 5,
    publishDate: '2026-03-26',
  },
  {
    authorAttribution: { displayName: 'Jelle van Baar' },
    rating: 5,
    publishDate: '2026-03-26',
  },
  {
    authorAttribution: { displayName: 'Lars Z' },
    rating: 5,
    publishDate: '2026-03-26',
  },
];

export default function Reviews() {
  return (
    <section className="py-24 px-6 bg-[#fafafa] overflow-hidden">
      <div className="max-w-7xl mx-auto w-full mb-16">
        <h2 className="text-sm uppercase tracking-[0.4em] font-bold text-gray-400 mb-4">Ervaringen</h2>
        <h3 className="text-5xl font-light tracking-tight leading-none">Wat klanten zeggen</h3>
      </div>
      <ReviewsMarquee reviews={REVIEWS} />
    </section>
  );
}
