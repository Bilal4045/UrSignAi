// services/lessonData.js

export const CATEGORIES = [
  {
    id: 'adjectives',
    title: 'Adjectives',
    lessons: [
      { id: 'adj_1', video: require('../assets/videos/Adjectives/able_1623416971_70330.mp4') },
      { id: 'adj_2', video: require('../assets/videos/Adjectives/abnormal_1623417023_80230.mp4') },
      { id: 'adj_3', video: require('../assets/videos/Adjectives/absentminded_1623417126_26951.mp4') },
      { id: 'adj_4', video: require('../assets/videos/Adjectives/absolute_1623417187_17263.mp4') },
      { id: 'adj_5', video: require('../assets/videos/Adjectives/accurate_1623421048_68413.mp4') },
    ]
  },
  {
    id: 'adverbs',
    title: 'Adverbs',
    lessons: [
      // Note: If the file name has a space, ensure it is typed exactly as below
      { id: 'adv_1', video: require('../assets/videos/Adverbs/lately_1609132248_79227.mp4') },
      { id: 'adv_2', video: require('../assets/videos/Adverbs/lightly_1609132288_35501.mp4') },
      { id: 'adv_3', video: require('../assets/videos/Adverbs/moderate_1609132425_14678.mp4') },
      { id: 'adv_4', video: require('../assets/videos/Adverbs/often_1609132666_76531.mp4') },
      { id: 'adv_5', video: require('../assets/videos/Adverbs/unfortunately_1609133643_25462.mp4') },
    ]
  },
  {
    id: 'urdu_alphabets',
    title: 'Urdu Alphabets',
    lessons: [
      { id: 'alp_1', video: require('../assets/videos/Urdu-Alphabets/v1.mp4') },
      { id: 'alp_2', video: require('../assets/videos/Urdu-Alphabets/v2.mp4') },
      { id: 'alp_3', video: require('../assets/videos/Urdu-Alphabets/v3.mp4') },
      { id: 'alp_4', video: require('../assets/videos/Urdu-Alphabets/v4.mp4') },
      { id: 'alp_5', video: require('../assets/videos/Urdu-Alphabets/v5.mp4') },
    ]
  }
];

export const getCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(CATEGORIES), 300);
  });
};