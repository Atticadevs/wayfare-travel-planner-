import { nanoid } from 'nanoid'
import { addDays, toISODate } from '../lib/dates'

// Trip definitions use day offsets from "today" so every status stays accurate
// whenever demo data is loaded. Tuple layouts are documented on each field.
const trips = [
  {
    title: 'Kuala Lumpur Food Trail', destination: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY',
    cover: 'sunset', start: 20, end: 27, status: 'planned', travelers: 2, budget: [1500, 'USD'], tags: ['Food', 'Culture'],
    // [type, title, provider, code, dayOffset, time, endDayOffset, endTime, from, to, cost, currency, status]
    bookings: [
      ['flight', 'Lahore → Kuala Lumpur', 'Malaysia Airlines', 'MH2P7Q', 0, '02:40', 0, '13:55', 'LHE', 'KUL', 640, 'USD', 'confirmed'],
      ['hotel', 'Pavilion Residences', 'Booking.com', 'BK88213', 0, '15:00', 7, '11:00', 'Kuala Lumpur', 'Kuala Lumpur', 520, 'USD', 'confirmed'],
      ['flight', 'Kuala Lumpur → Lahore', 'Malaysia Airlines', 'MH9X4D', 7, '16:20', 7, '21:10', 'KUL', 'LHE', 0, 'USD', 'pending'],
    ],
    // [dayOffset, time, title, place, category, status]
    itinerary: [
      [0, '17:00', 'Check in and walk Bukit Bintang', 'Bukit Bintang', 'stay', 'todo'],
      [1, '09:00', 'Petronas Towers and KLCC Park', 'Petronas Towers', 'sightseeing', 'todo'],
      [1, '13:00', 'Nasi lemak lunch', 'Village Park', 'food', 'todo'],
      [2, '10:00', 'Batu Caves', 'Batu Caves', 'sightseeing', 'todo'],
      [3, '11:00', 'Central Market crafts', 'Central Market', 'shopping', 'todo'],
      [3, '19:00', 'Jalan Alor street food', 'Jalan Alor', 'food', 'todo'],
      [4, '09:30', 'Train to Ipoh', 'KL Sentral', 'transport', 'todo'],
      [5, '12:00', 'Ipoh white coffee crawl', 'Old Town Ipoh', 'food', 'todo'],
    ],
    // [title, amount, currency, category, dayOffset]
    expenses: [['Airport SIM cards', 40, 'MYR', 'other', 0], ['Grab to hotel', 55, 'MYR', 'transport', 0]],
    // [label, group, packed]
    packing: [['Passport', 'documents', true], ['Power adapter', 'electronics', true], ['Light rain jacket', 'clothes', false], ['Sunscreen', 'toiletries', false], ['Phone charger', 'electronics', true], ['Walking shoes', 'clothes', false]],
    // [placeName, title, body, pinned]
    notes: [['Central Market', 'Craft stalls', 'Bargain politely. Batik scarves near the back are the best value.', true], ['Jalan Alor', 'Dinner plan', 'Go after 7pm. Try the grilled chicken wings and durian dessert.', false]],
  },
  {
    title: 'Istanbul Weekender', destination: 'Istanbul', country: 'Türkiye', countryCode: 'TR',
    cover: 'rose', start: 75, end: 82, status: 'planned', travelers: 3, budget: [2400, 'USD'], tags: ['History', 'Food'],
    bookings: [
      ['flight', 'Lahore → Istanbul', 'Turkish Airlines', 'TK3L9A', 0, '04:10', 0, '08:35', 'LHE', 'IST', 1180, 'USD', 'confirmed'],
      ['hotel', 'Sultanahmet Boutique', 'Agoda', 'AG55021', 0, '14:00', 7, '12:00', 'Istanbul', 'Istanbul', 840, 'USD', 'confirmed'],
      ['activity', 'Bosphorus dinner cruise', 'GetYourGuide', 'GY7712', 3, '19:30', 3, '22:30', 'Istanbul', 'Istanbul', 120, 'USD', 'pending'],
    ],
    itinerary: [
      [0, '15:00', 'Settle in and tea on the terrace', 'Sultanahmet', 'stay', 'todo'],
      [1, '09:00', 'Hagia Sophia', 'Hagia Sophia', 'sightseeing', 'todo'],
      [1, '14:00', 'Basilica Cistern', 'Basilica Cistern', 'sightseeing', 'todo'],
      [2, '10:00', 'Grand Bazaar', 'Grand Bazaar', 'shopping', 'todo'],
      [3, '19:30', 'Bosphorus cruise', 'Eminönü Pier', 'transport', 'todo'],
      [4, '11:00', 'Ferry to Kadıköy', 'Kadıköy', 'transport', 'todo'],
      [5, '13:00', 'Fish sandwich at Galata', 'Galata Bridge', 'food', 'todo'],
    ],
    expenses: [['Visa e-fee', 50, 'USD', 'other', 0]],
    packing: [['Passport', 'documents', false], ['Travel insurance', 'documents', false], ['Warm jacket', 'clothes', false], ['Power adapter', 'electronics', false], ['Scarf', 'clothes', false]],
    notes: [['Grand Bazaar', 'Shopping list', 'Ceramics, Turkish delight, evil-eye charms. Start at the Kalpakçılar entrance.', true]],
  },
  {
    title: 'Bangkok Getaway', destination: 'Bangkok', country: 'Thailand', countryCode: 'TH',
    cover: 'forest', start: -2, end: 4, status: 'planned', travelers: 2, budget: [1200, 'USD'], tags: ['City', 'Food'],
    bookings: [
      ['flight', 'Lahore → Bangkok', 'Thai Airways', 'TG6K2M', 0, '05:15', 0, '11:30', 'LHE', 'BKK', 390, 'USD', 'confirmed'],
      ['hotel', 'Riverside Siam Hotel', 'Booking.com', 'BK30991', 0, '14:00', 6, '11:00', 'Bangkok', 'Bangkok', 460, 'USD', 'confirmed'],
      ['activity', 'Floating market tour', 'Klook', 'KL0031', 3, '07:00', 3, '13:00', 'Bangkok', 'Damnoen Saduak', 45, 'USD', 'confirmed'],
    ],
    itinerary: [
      [0, '15:00', 'Check in', 'Riverside Siam Hotel', 'stay', 'done'],
      [0, '18:30', 'Night market dinner', 'Asiatique', 'food', 'done'],
      [1, '09:00', 'Grand Palace', 'Grand Palace', 'sightseeing', 'done'],
      [1, '13:00', 'Pad thai lunch', 'Thip Samai', 'food', 'done'],
      [2, '10:00', 'Wat Arun by ferry', 'Wat Arun', 'sightseeing', 'in_progress'],
      [3, '07:00', 'Floating market tour', 'Damnoen Saduak', 'sightseeing', 'todo'],
      [4, '11:00', 'Chatuchak weekend market', 'Chatuchak', 'shopping', 'todo'],
      [5, '17:00', 'Rooftop sunset', 'Lebua', 'sightseeing', 'todo'],
      [6, '09:00', 'Check out and airport', 'BKK', 'transport', 'todo'],
    ],
    expenses: [
      ['Street food', 1800, 'THB', 'food', 0], ['Tuk-tuk rides', 600, 'THB', 'transport', 1], ['Grand Palace tickets', 1000, 'THB', 'activities', 1],
      ['Souvenirs', 2200, 'THB', 'shopping', 2], ['Massage', 1500, 'THB', 'activities', 2], ['Airport taxi', 450, 'THB', 'transport', 0],
    ],
    packing: [['Passport', 'documents', true], ['Sunscreen', 'toiletries', true], ['Sandals', 'clothes', true], ['Power bank', 'electronics', true], ['Linen shirts', 'clothes', true], ['Insect repellent', 'toiletries', false], ['Rain poncho', 'clothes', false]],
    notes: [['Wat Arun', 'Dress code', 'Cover shoulders and knees. Sarongs can be rented at the entrance.', true], ['Chatuchak', 'Section 26', 'Plants and home decor. Go early before the heat.', false]],
  },
  {
    title: 'Dubai Desert Escape', destination: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE',
    cover: 'sand', start: -62, end: -56, status: 'completed', travelers: 2, budget: [1600, 'USD'], tags: ['Adventure', 'Luxury'],
    bookings: [
      ['flight', 'Lahore → Dubai', 'Emirates', 'EK6D3F', 0, '03:30', 0, '06:00', 'LHE', 'DXB', 520, 'USD', 'confirmed'],
      ['hotel', 'Marina Bay Suites', 'Booking.com', 'BK71410', 0, '14:00', 6, '12:00', 'Dubai', 'Dubai', 780, 'USD', 'confirmed'],
      ['activity', 'Desert safari', 'Viator', 'VT2203', 2, '15:30', 2, '21:30', 'Dubai', 'Dubai Desert', 95, 'USD', 'confirmed'],
    ],
    itinerary: [
      [0, '14:00', 'Check in at the marina', 'Dubai Marina', 'stay', 'done'],
      [1, '10:00', 'Burj Khalifa observation deck', 'Burj Khalifa', 'sightseeing', 'done'],
      [1, '19:00', 'Dubai Fountain show', 'Downtown Dubai', 'sightseeing', 'done'],
      [2, '15:30', 'Desert safari and BBQ', 'Dubai Desert', 'sightseeing', 'done'],
      [3, '11:00', 'Gold Souk', 'Deira', 'shopping', 'done'],
      [4, '09:00', 'Abra ride across the creek', 'Dubai Creek', 'transport', 'done'],
      [5, '13:00', 'Brunch at JBR', 'JBR', 'food', 'skipped'],
      [5, '17:00', 'Beach sunset', 'Kite Beach', 'sightseeing', 'done'],
    ],
    expenses: [
      ['Taxis', 420, 'AED', 'transport', 1], ['Dinner at the marina', 380, 'AED', 'food', 1], ['Souk gifts', 900, 'AED', 'shopping', 3],
      ['Brunch', 300, 'AED', 'food', 4], ['Metro card', 100, 'AED', 'transport', 0], ['Ice cream', 60, 'USD', 'food', 5],
    ],
    packing: [['Passport', 'documents', true], ['Sunglasses', 'other', true], ['Modest evening wear', 'clothes', true], ['Sunscreen', 'toiletries', true], ['Camera', 'electronics', true]],
    notes: [['Desert safari', 'What to wear', 'Closed shoes, a light scarf for sand. Sunset slot is the best.', true]],
  },
  {
    title: 'Tokyo Cherry & Neon', destination: 'Tokyo', country: 'Japan', countryCode: 'JP',
    cover: 'lavender', start: -150, end: -141, status: 'completed', travelers: 2, budget: [3500, 'USD'], tags: ['City', 'Culture'],
    bookings: [
      ['flight', 'Lahore → Tokyo', 'Japan Airlines', 'JL4Z8R', 0, '23:50', 1, '14:20', 'LHE', 'HND', 1240, 'USD', 'confirmed'],
      ['hotel', 'Shinjuku Capsule Plus', 'Agoda', 'AG20077', 1, '15:00', 9, '11:00', 'Tokyo', 'Tokyo', 960, 'USD', 'confirmed'],
      ['train', 'Tokyo → Kyoto Shinkansen', 'JR Central', 'JR9921', 5, '09:12', 5, '11:35', 'Tokyo', 'Kyoto', 180, 'USD', 'confirmed'],
      ['activity', 'teamLab Planets', 'Klook', 'KL7781', 3, '10:00', 3, '12:00', 'Tokyo', 'Toyosu', 60, 'USD', 'confirmed'],
    ],
    itinerary: [
      [1, '16:00', 'Check in and ramen dinner', 'Shinjuku', 'food', 'done'],
      [2, '09:00', 'Senso-ji and Asakusa', 'Asakusa', 'sightseeing', 'done'],
      [2, '15:00', 'Ueno Park cherry blossoms', 'Ueno Park', 'sightseeing', 'done'],
      [3, '10:00', 'teamLab Planets', 'Toyosu', 'sightseeing', 'done'],
      [4, '11:00', 'Harajuku and Meiji Shrine', 'Harajuku', 'sightseeing', 'done'],
      [4, '19:00', 'Shibuya Crossing at night', 'Shibuya', 'sightseeing', 'done'],
      [5, '09:12', 'Shinkansen to Kyoto', 'Tokyo Station', 'transport', 'done'],
      [6, '08:00', 'Fushimi Inari', 'Fushimi Inari', 'sightseeing', 'done'],
      [7, '12:00', 'Nishiki Market lunch', 'Nishiki Market', 'food', 'done'],
      [8, '10:00', 'Day trip to Nara', 'Nara', 'sightseeing', 'skipped'],
    ],
    expenses: [
      ['Suica cards', 4000, 'JPY', 'transport', 1], ['Ramen', 3200, 'JPY', 'food', 1], ['Tokyo souvenirs', 18000, 'JPY', 'shopping', 4],
      ['Kyoto kimono rental', 9000, 'JPY', 'activities', 6], ['Sushi dinner', 14000, 'JPY', 'food', 7], ['Pocket wifi', 40, 'USD', 'other', 1],
    ],
    packing: [['Passport', 'documents', true], ['Pocket wifi', 'electronics', true], ['Comfortable shoes', 'clothes', true], ['Coin pouch', 'other', true], ['Light jacket', 'clothes', true], ['Power adapter', 'electronics', true]],
    notes: [['Shinjuku', 'Ramen picks', 'Fuunji for tsukemen, Ichiran for solo booths. Queue before 6pm.', true], ['Fushimi Inari', 'Go early', 'Reach by 7am to avoid crowds. Bring water for the full loop.', false], ['Nara', 'Missed this one', 'Skipped for rain. Add it next time.', false]],
  },
  {
    title: 'Lahore Heritage Weekend', destination: 'Lahore', country: 'Pakistan', countryCode: 'PK',
    cover: 'night', start: -25, end: -21, status: 'planned', travelers: 4, budget: [700, 'USD'], tags: ['History', 'Family'],
    bookings: [
      ['hotel', 'Walled City Haveli', 'Airbnb', 'AB4410', 0, '14:00', 4, '11:00', 'Lahore', 'Lahore', 260, 'USD', 'confirmed'],
      ['car', 'Family van with driver', 'Local rental', 'CR2031', 0, '09:00', 4, '18:00', 'Lahore', 'Lahore', 120, 'USD', 'confirmed'],
    ],
    itinerary: [
      [0, '15:00', 'Check in at the haveli', 'Walled City', 'stay', 'todo'],
      [1, '10:00', 'Badshahi Mosque and Lahore Fort', 'Badshahi Mosque', 'sightseeing', 'todo'],
      [1, '20:00', 'Food Street dinner', 'Fort Road Food Street', 'food', 'todo'],
      [2, '09:00', 'Shalimar Gardens', 'Shalimar Gardens', 'sightseeing', 'todo'],
      [3, '11:00', 'Anarkali Bazaar', 'Anarkali', 'shopping', 'todo'],
      [4, '08:00', 'Halwa puri breakfast', 'Gawalmandi', 'food', 'todo'],
    ],
    expenses: [['Entry tickets', 6000, 'PKR', 'activities', 1], ['Food Street dinner', 12000, 'PKR', 'food', 1]],
    packing: [['CNIC', 'documents', true], ['Dupatta and scarves', 'clothes', true], ['Camera', 'electronics', false], ['Comfortable sandals', 'clothes', true]],
    notes: [['Badshahi Mosque', 'Visiting hours', 'Best light just before maghrib. Shoes off, cloth bags provided.', false]],
  },
  {
    title: 'Bali Retreat', destination: 'Ubud', country: 'Indonesia', countryCode: 'ID',
    cover: 'mint', start: 40, end: 47, status: 'cancelled', travelers: 2, budget: [2000, 'USD'], tags: ['Wellness', 'Nature'],
    bookings: [
      ['flight', 'Lahore → Denpasar', 'Singapore Airlines', 'SQ8V2N', 0, '01:20', 0, '16:40', 'LHE', 'DPS', 910, 'USD', 'cancelled'],
      ['hotel', 'Ubud Jungle Villa', 'Booking.com', 'BK66402', 0, '15:00', 7, '11:00', 'Ubud', 'Ubud', 700, 'USD', 'cancelled'],
    ],
    itinerary: [
      [0, '17:00', 'Check in and sunset yoga', 'Ubud Jungle Villa', 'stay', 'todo'],
      [1, '07:00', 'Tegalalang rice terraces', 'Tegalalang', 'sightseeing', 'todo'],
      [2, '09:00', 'Monkey forest walk', 'Sacred Monkey Forest', 'sightseeing', 'todo'],
      [3, '10:00', 'Balinese cooking class', 'Ubud', 'food', 'todo'],
      [4, '08:00', 'Mount Batur sunrise trek', 'Mount Batur', 'sightseeing', 'todo'],
      [5, '12:00', 'Spa afternoon', 'Ubud', 'other', 'todo'],
    ],
    expenses: [['Cancellation fee', 120, 'USD', 'other', 0]],
    packing: [['Passport', 'documents', false], ['Swimwear', 'clothes', false], ['Hiking shoes', 'clothes', false], ['Insect repellent', 'toiletries', false]],
    notes: [['Ubud', 'Cancelled', 'Postponed due to schedule clash. Rebook for the dry season.', false]],
  },
]

/** Builds a complete, self-consistent demo dataset relative to `now`. */
export function createDemoData(now = new Date()) {
  const day = (offset) => toISODate(addDays(now, offset))
  const stamp = now.toISOString()
  const data = { trips: [], bookings: [], itinerary: [], expenses: [], packing: [], notes: [] }

  trips.forEach((t) => {
    const tripId = nanoid()
    const dateOf = (offset) => day(t.start + offset)

    data.trips.push({
      id: tripId, title: t.title, destination: t.destination, country: t.country, countryCode: t.countryCode,
      coverImage: t.cover, startDate: day(t.start), endDate: day(t.end), status: t.status, travelers: t.travelers,
      budget: { amount: t.budget[0], currency: t.budget[1] }, tags: t.tags, createdAt: stamp, updatedAt: stamp,
    })

    t.bookings.forEach(([type, title, provider, confirmationCode, d1, time1, d2, time2, from, to, amount, currency, status]) =>
      data.bookings.push({
        id: nanoid(), tripId, type, title, provider, confirmationCode,
        startDateTime: `${dateOf(d1)}T${time1}`, endDateTime: `${dateOf(d2)}T${time2}`,
        from, to, cost: { amount, currency }, status, notes: '',
      }),
    )

    t.itinerary.forEach(([offset, time, title, place, category, status], order) =>
      data.itinerary.push({ id: nanoid(), tripId, title, place, date: dateOf(offset), time, category, status, order, notes: '' }),
    )

    t.expenses.forEach(([title, amount, currency, category, offset]) =>
      data.expenses.push({ id: nanoid(), tripId, title, amount, currency, category, date: dateOf(offset), note: '' }),
    )

    t.packing.forEach(([label, group, packed]) => data.packing.push({ id: nanoid(), tripId, label, group, packed }))

    t.notes.forEach(([placeName, title, body, pinned]) =>
      data.notes.push({ id: nanoid(), tripId, placeName, title, body, pinned, createdAt: stamp, updatedAt: stamp }),
    )
  })

  return data
}
