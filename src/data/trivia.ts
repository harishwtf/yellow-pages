/** "Did you know?" facts about Indiranagar, one per visit. Every fact was confirmed against published sources by
 *  at least two independent checks; the source is kept with each so it can be re-checked. */
export interface Fact {
  id: string;
  text: string;
  source: string;
}

export const TRIVIA: Fact[] = [
  {
    id: 'planned-1970s',
    text: 'In the 1970s, when Indiranagar was planned as a residential colony, defence personnel and civil servants lived in its bungalows.',
    source:
      'https://www.thenewsminute.com/karnataka/pubs-bengaluru-s-indiranagar-are-shutting-down-was-crackdown-long-overdue-113081',
  },
  {
    id: 'defence-colony-1964',
    text: 'Defence Colony began with defence officers: their housing society was handed the land by the City Improvement Trust Board in July 1964.',
    source: 'https://citizenmatters.in/park-encroachment-indiranagar-residents-demand-punishment-for-landgrabbers/',
  },
  {
    id: 'defence-colony-swamps',
    text: 'A woman who moved into one of Defence Colony’s first houses in 1973 remembered swamps and mosquitoes beside what is now Old Airport Road.',
    source: 'https://www.deccanherald.com/content/468586/the8200lost-world.html',
  },
  {
    id: 'beware-of-dog',
    text: 'One resident remembers 1990s Defence Colony for its overflowing gardens and its many “Beware of Dog” signs.',
    source: 'https://citizenmatters.in/825-defence-colony-indiranagar-nostalgia',
  },
  {
    id: 'karim-khan-road',
    text: '100 Feet Road’s official name is Dr S.K. Karim Khan Road, after a well-known Kannada folklorist. It was renamed in 2014.',
    source:
      'https://www.thehindu.com/news/cities/bangalore/indiranagar-100ft-road-to-be-renamed-as-dr-sk-karim-khan-road/article6357623.ece',
  },
  {
    id: 'rename-took-8-years',
    text: 'The city council voted to rename 100 Feet Road in 2006. It took eight years, and a protest by Kannada groups, before it happened.',
    source:
      'https://www.thehindu.com/news/cities/bangalore/indiranagar-100ft-road-to-be-renamed-as-dr-sk-karim-khan-road/article6357623.ece',
  },
  {
    id: '100ft-route',
    text: '100 Feet Road runs from Old Madras Road to Old Airport Road, through 1st Stage, 2nd Stage, Defence Colony and HAL 2nd Stage.',
    source: 'https://en.wikipedia.org/wiki/100_Feet_Road,_Bengaluru',
  },
  {
    id: 'cmh-road-name',
    text: 'CMH Road is short for Chinmaya Mission Hospital Road. The hospital opened in Indiranagar in 1970.',
    source: 'https://www.chinmayamission.com/global/chinmaya-mission-hospital',
  },
  {
    id: 'metro-2011',
    text: 'Indiranagar metro station opened on 20 October 2011, one of the first six stations on Namma Metro’s first stretch, from Baiyappanahalli to MG Road.',
    source: 'https://en.wikipedia.org/wiki/Indira_Nagar_metro_station_(Bengaluru)',
  },
  {
    id: 'two-metro-stations',
    text: 'Two Purple Line metro stations serve Indiranagar: Indiranagar, built above CMH Road, and Swami Vivekananda Road, on its northern edge.',
    source: 'https://en.wikipedia.org/wiki/Indiranagar,_Bengaluru',
  },
  {
    id: 'going-out-alternative',
    text: 'In 2014, The Hindu called Indiranagar the city’s alternative to MG Road, Brigade Road and Commercial Street for a night out.',
    source:
      'https://www.thehindu.com/news/cities/bangalore/indiranagar-100ft-road-to-be-renamed-as-dr-sk-karim-khan-road/article6357623.ece',
  },
  {
    id: 'sangeetha-sabha',
    text: 'The Indiranagar Sangeetha Sabha has promoted classical music since 1986. President A.P.J. Abdul Kalam opened its Purandara Bhavana in 2004.',
    source: 'https://en.wikipedia.org/wiki/Indiranagar_Sangeetha_Sabha',
  },
  {
    id: 'kalam-favourite-song',
    text: 'Opening the Sangeetha Sabha’s new hall in 2004, Kalam said M.S. Subbulakshmi singing “Bhagyada Lakshmi Baramma” was heavenly to him.',
    source:
      'https://presidentofindia.gov.in/dr-apj-abdul-kalam/speeches/address-inauguration-purandara-bhavana-indiranagar-sangeetha-sabha',
  },
  {
    id: '27-tree-species',
    text: 'On a 2016 tree walk in 1st Stage, residents counted 27 kinds of tree, among them rain tree, gulmohar, jamun, jackfruit and sampige.',
    source: 'https://citizenmatters.in/tree-walk-in-indiranagar-bengaluru',
  },
  {
    id: 'layouts-on-lakes',
    text: 'In 2022, Karnataka’s revenue minister told the Assembly that the HAL I and II layouts, from 1978, were among those built on filled-in lakes.',
    source:
      'https://www.thenewsminute.com/karnataka/over-42-lakes-disappeared-bengaluru-1963-karnataka-revenue-minister-168073',
  },
  {
    id: 'ulsoor-lake-army',
    text: 'Ulsoor Lake, just west of Indiranagar, covers about 50 hectares and has several islands. Part of it belongs to the Army’s Madras Engineer Group.',
    source: 'https://en.wikipedia.org/wiki/Ulsoor_Lake',
  },
  {
    id: 'vimanapura-aeroplane-town',
    text: 'Vimanapura, a little east of Indiranagar, means “aeroplane town” in Sanskrit. It is named for the HAL Airport next to it.',
    source: 'https://en.wikipedia.org/wiki/Vimanapura',
  },
  {
    id: 'hal-airport-2008',
    text: 'HAL Airport, a short drive east, was Bengaluru’s passenger airport until 24 May 2008, when flights moved to the new airport at Devanahalli.',
    source: 'https://en.wikipedia.org/wiki/HAL_Airport',
  },
  {
    id: 'hal-aerospace-museum',
    text: 'HAL’s Aerospace Museum opened in 2001. It shows aircraft, helicopters, engines and a mock air traffic control tower.',
    source: 'https://en.wikipedia.org/wiki/HAL_Aerospace_Museum',
  },
];
