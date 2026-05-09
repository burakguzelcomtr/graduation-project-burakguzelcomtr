const Hero = require('../models/hero')
const Country = require('../models/country')

const HEROES = [
  { slug: 'ada-lovelace', name: 'Ada Lovelace' },
  { slug: 'agatha-christie', name: 'Agatha Christie' },
  { slug: 'albert-einstein', name: 'Albert Einstein' },
  { slug: 'alfred-nobel', name: 'Alfred Nobel' },
  { slug: 'beethoven', name: 'Beethoven' },
  { slug: 'beryl-markham', name: 'Beryl Markham' },
  { slug: 'da-vinci', name: 'Leonardo da Vinci' },
  { slug: 'emmeline-pankhurst', name: 'Emmeline Pankhurst' },
  { slug: 'florence-nightingale', name: 'Florence Nightingale' },
  { slug: 'frida-kahlo', name: 'Frida Kahlo' },
  { slug: 'galileo-galilei', name: 'Galileo Galilei' },
  { slug: 'georgie-o-keeffe', name: "Georgia O'Keeffe" },
  { slug: 'gregor-mendel', name: 'Gregor Mendel' },
  { slug: 'helen-keller', name: 'Helen Keller' },
  { slug: 'jane-godall', name: 'Jane Goodall' },
  { slug: 'louis-pasteur', name: 'Louis Pasteur' },
  { slug: 'marie-curie', name: 'Marie Curie' },
  { slug: 'mary-shelley', name: 'Mary Shelley' },
  { slug: 'michael-faraday', name: 'Michael Faraday' },
  { slug: 'michelangelo', name: 'Michelangelo' },
  { slug: 'nadia-boulanger', name: 'Nadia Boulanger' },
  { slug: 'niels-bohr', name: 'Niels Bohr' },
  { slug: 'nikola-tesla', name: 'Nikola Tesla' },
  { slug: 'pablo-picasso', name: 'Pablo Picasso' },
  { slug: 'rachel-carson', name: 'Rachel Carson' },
  { slug: 'vincent-van-gogh', name: 'Vincent van Gogh' },
]

const COUNTRIES = [
  { slug: 'argentina', name: 'Argentina' },
  { slug: 'australia', name: 'Australia' },
  { slug: 'austria', name: 'Austria' },
  { slug: 'belgium', name: 'Belgium' },
  { slug: 'brazil', name: 'Brazil' },
  { slug: 'canada', name: 'Canada' },
  { slug: 'chile', name: 'Chile' },
  { slug: 'czech', name: 'Czech Republic' },
  { slug: 'denmark', name: 'Denmark' },
  { slug: 'estonia', name: 'Estonia' },
  { slug: 'finland', name: 'Finland' },
  { slug: 'france', name: 'France' },
  { slug: 'germany', name: 'Germany' },
  { slug: 'ireland', name: 'Ireland' },
  { slug: 'italy', name: 'Italy' },
  { slug: 'japan', name: 'Japan' },
  { slug: 'luxembourg', name: 'Luxembourg' },
  { slug: 'netherlands', name: 'Netherlands' },
  { slug: 'norway', name: 'Norway' },
  { slug: 'portugal', name: 'Portugal' },
  { slug: 'singapore', name: 'Singapore' },
  { slug: 'south-africa', name: 'South Africa' },
  { slug: 'south-korea', name: 'South Korea' },
  { slug: 'spain', name: 'Spain' },
  { slug: 'sweden', name: 'Sweden' },
  { slug: 'switzerland', name: 'Switzerland' },
  { slug: 'uk', name: 'United Kingdom' },
  { slug: 'usa', name: 'United States' },
]

async function seedProfileOptions() {
  const heroCount = await Hero.countDocuments()
  if (heroCount === 0) {
    await Hero.insertMany(HEROES)
    console.log('Seeded heroes.')
  }

  const countryCount = await Country.countDocuments()
  if (countryCount === 0) {
    await Country.insertMany(COUNTRIES)
    console.log('Seeded countries.')
  }
}

module.exports = seedProfileOptions
