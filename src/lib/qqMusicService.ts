
// This is a mock service for QQ Music integration
// In a real application, you would need to integrate with QQ Music's APIs

// Mock tracks with playable URLs (using royalty-free music for demo)
const freeTracks = [
  {
    id: '1',
    name: '稻香',
    artist: '周杰伦',
    album: '魔杰座',
    duration: '3:42',
    url: 'https://file-examples.com/storage/fee231cad563b359537d0c9/2017/11/file_example_MP3_700KB.mp3',
  },
  {
    id: '2',
    name: '平凡之路',
    artist: '朴树',
    album: '猎户星座',
    duration: '5:01',
    url: 'https://file-examples.com/storage/fee231cad563b359537d0c9/2017/11/file_example_MP3_1MG.mp3',
  },
  {
    id: '3',
    name: '天外来物',
    artist: '薛之谦',
    album: '天外来物',
    duration: '4:17',
    url: 'https://file-examples.com/storage/fee231cad563b359537d0c9/2017/11/file_example_MP3_2MG.mp3',
  },
  {
    id: '4',
    name: '起风了',
    artist: '买辣椒也用券',
    album: '起风了',
    duration: '5:11',
    url: 'https://file-examples.com/storage/fee231cad563b359537d0c9/2017/11/file_example_MP3_5MG.mp3',
  },
  {
    id: '5',
    name: '可惜没如果',
    artist: '林俊杰',
    album: '新地球',
    duration: '4:38',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/12/audio_78c0c34ecd.mp3',
  },
  {
    id: '6',
    name: '句号',
    artist: 'G.E.M.邓紫棋',
    album: '摩天动物园',
    duration: '4:20',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_30ff3b6df9.mp3',
  },
  {
    id: '7',
    name: '说散就散',
    artist: 'JC陈咏桐',
    album: '说散就散',
    duration: '4:14',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc816e4.mp3',
  },
  {
    id: '8',
    name: '认真的雪',
    artist: '薛之谦',
    album: '意外',
    duration: '4:14',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8a58993bc.mp3',
  },
  {
    id: '9',
    name: '夜空中最亮的星',
    artist: '逃跑计划',
    album: '世界',
    duration: '4:07',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5b8a2f4a0a.mp3',
  },
  {
    id: '10',
    name: '像我这样的人',
    artist: '毛不易',
    album: '平凡的一天',
    duration: '3:26',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3',
  },
];

// Mock user playlists (available after login)
const userTracks = [
  ...freeTracks,
  {
    id: '11',
    name: '花海',
    artist: '周杰伦',
    album: '魔杰座',
    duration: '4:24',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/10/audio_654d34a64f.mp3',
  },
  {
    id: '12',
    name: '晴天',
    artist: '周杰伦',
    album: '叶惠美',
    duration: '4:29',
    url: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_770e1fb98b.mp3',
  },
  {
    id: '13',
    name: '我爱他',
    artist: '王小洋',
    album: '我爱他',
    duration: '4:02',
    url: 'https://cdn.pixabay.com/download/audio/2022/12/15/audio_a4c52e6027.mp3',
  },
  {
    id: '14',
    name: '大鱼',
    artist: '周深',
    album: '大鱼',
    duration: '4:41',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_0621d4cd9e.mp3',
  },
  {
    id: '15',
    name: '沙漠骆驼',
    artist: '展展与罗罗',
    album: '沙漠骆驼',
    duration: '5:38',
    url: 'https://cdn.pixabay.com/download/audio/2023/01/17/audio_c39e965108.mp3',
  },
];

/**
 * Check if user is logged in to QQ Music
 */
export const isLoggedInToQQMusic = async (): Promise<boolean> => {
  // In a real app, check for authentication token or session
  const token = localStorage.getItem('qq_music_token');
  return !!token;
};

/**
 * Log in to QQ Music
 */
export const loginToQQMusic = async (qqId: string): Promise<boolean> => {
  try {
    // In a real app, make an API call to QQ Music auth service
    // This is just a mock implementation
    
    // Store a fake token
    localStorage.setItem('qq_music_token', 'mock_qq_token_' + qqId);
    localStorage.setItem('qq_music_user_id', qqId);
    return true;
  } catch (error) {
    console.error('Failed to login to QQ Music:', error);
    return false;
  }
};

/**
 * Log out from QQ Music
 */
export const logoutFromQQMusic = async (): Promise<void> => {
  localStorage.removeItem('qq_music_token');
  localStorage.removeItem('qq_music_user_id');
};

/**
 * Get music tracks (either free tracks or user's playlist)
 */
export const getQQMusicTracks = async (isLoggedIn: boolean): Promise<any[]> => {
  // In a real app, make API calls to QQ Music service
  // If not logged in, return free tracks
  // If logged in, return user's playlist
  
  // Adding a slight delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return isLoggedIn ? userTracks : freeTracks;
};
