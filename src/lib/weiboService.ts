
/**
 * 微博服务 - 提供微博相关的API调用和数据处理
 */

import { getCurrentUser } from './auth';

// 微博热搜类型定义
export interface WeiboHotTopic {
  id: number;
  title: string;
  hot: number;
  category: string;
  url: string;
}

// 微博帖子类型定义
export interface WeiboPost {
  id: number;
  username: string;
  handle: string;
  verified: boolean;
  avatar: string;
  time: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  reposts: number;
}

// 模拟微博热搜数据
const mockHotTopics: WeiboHotTopic[] = [
  {
    id: 1,
    title: "中国航天又创新纪录",
    hot: 4382015,
    category: "国内",
    url: "https://weibo.com/topic/123"
  },
  {
    id: 2,
    title: "新能源汽车销量突破百万",
    hot: 3721543,
    category: "财经",
    url: "https://weibo.com/topic/124"
  },
  {
    id: 3,
    title: "冬季养生小贴士",
    hot: 3215487,
    category: "健康",
    url: "https://weibo.com/topic/125"
  },
  {
    id: 4,
    title: "世界杯亚洲区预选赛",
    hot: 2987654,
    category: "体育",
    url: "https://weibo.com/topic/126"
  },
  {
    id: 5,
    title: "第五届进博会成果丰硕",
    hot: 2567890,
    category: "国际",
    url: "https://weibo.com/topic/127"
  },
  {
    id: 6,
    title: "人工智能新突破",
    hot: 2345678,
    category: "科技",
    url: "https://weibo.com/topic/128"
  },
  {
    id: 7,
    title: "年末音乐盛典阵容公布",
    hot: 2123456,
    category: "娱乐",
    url: "https://weibo.com/topic/129"
  },
  {
    id: 8,
    title: "新款手机发布会",
    hot: 1987654,
    category: "数码",
    url: "https://weibo.com/topic/130"
  },
  {
    id: 9,
    title: "高校期末考试季",
    hot: 1876543,
    category: "教育",
    url: "https://weibo.com/topic/131"
  },
  {
    id: 10,
    title: "冬季旅游好去处",
    hot: 1765432,
    category: "旅游",
    url: "https://weibo.com/topic/132"
  }
];

// 模拟微博帖子数据 - 关注的内容
const mockFollowingPosts: WeiboPost[] = [
  {
    id: 1,
    username: "科技新视野",
    handle: "@TechView",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "1小时前",
    content: "【最新研究】科学家发现一种新型材料可以提高锂电池容量30%，并延长其使用寿命。这项突破或将推动电动汽车和便携设备的革命性发展。研究结果已发表在《自然》杂志上。",
    images: ["https://via.placeholder.com/300/eee"],
    likes: 15872,
    comments: 2341,
    reposts: 4532
  },
  {
    id: 2,
    username: "美食达人",
    handle: "@FoodMaster",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "2小时前",
    content: "冬日暖心甜品推荐：红豆沙糯米糍。外层Q弹，内馅香甜，配上一杯热茶，温暖整个冬天！制作方法：糯米粉+清水制皮，红豆沙+黄油制馅，包裹成型后蒸8分钟即可。",
    images: ["https://via.placeholder.com/300/eee", "https://via.placeholder.com/300/ddd"],
    likes: 12453,
    comments: 987,
    reposts: 2341
  },
  {
    id: 3,
    username: "环球旅行",
    handle: "@WorldTravel",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "3小时前",
    content: "【冬季旅游推荐】哈尔滨冰雪大世界已开园迎客！今年的冰雪建筑更加宏伟壮观，夜晚的彩灯映照下如梦如幻。除了观赏冰雕，还有冰上滑梯、冰上自行车等多种互动体验项目，是冬季旅游的绝佳选择。",
    images: ["https://via.placeholder.com/300/eee"],
    likes: 9876,
    comments: 678,
    reposts: 1532
  },
  {
    id: 4,
    username: "财经观察",
    handle: "@FinanceWatch",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "5小时前",
    content: "【市场分析】今日A股三大指数集体收涨，半导体和新能源板块表现强势。专家认为，随着政策支持力度加大和外部环境改善，市场有望继续保持稳定上升趋势。建议投资者关注科技创新和消费升级相关领域。",
    images: [],
    likes: 8765,
    comments: 1234,
    reposts: 876
  },
  {
    id: 5,
    username: "健康生活",
    handle: "@HealthyLife",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "昨天",
    content: "冬季养生小贴士：1.保暖防寒，尤其是颈部和腹部；2.适当增加热量摄入，但注意控制油脂；3.多喝温水，保持水分；4.坚持适度运动，提高免疫力；5.保持良好睡眠，早睡早起。养成这些习惯，轻松度过寒冬！",
    images: ["https://via.placeholder.com/300/eee"],
    likes: 7654,
    comments: 543,
    reposts: 1098
  }
];

// 模拟微博帖子数据 - 公开推荐的内容（未登录可见）
const mockPublicPosts: WeiboPost[] = [
  {
    id: 1,
    username: "央视新闻",
    handle: "@CCTV_News",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "2小时前",
    content: "【#中国人的小康生活#】冬季到来，内蒙古乌兰察布市的农牧民们已经将牛羊转入暖棚喂养，为越冬做好准备。鸡鸭等家禽也已经被安置在温暖的畜禽舍内。多年来，随着国家扶持政策的实施，当地农牧民的生活水平不断提高，农牧业产业不断发展壮大。",
    images: ["https://via.placeholder.com/300/eee"],
    likes: 24563,
    comments: 4213,
    reposts: 6821
  },
  {
    id: 2,
    username: "人民日报",
    handle: "@PeoplesDaily",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "3小时前",
    content: "【国际锐评丨中国式现代化为什么\"行\"】近期，多个国际机构上调对中国经济增长预期。国际货币基金组织将中国2023年经济增长预期上调至5.4%，高于此前预测的5%；世界银行也将中国2023年经济增长预期从5%上调至5.2%。",
    images: [],
    likes: 18732,
    comments: 3102,
    reposts: 5317
  },
  {
    id: 3,
    username: "新华社",
    handle: "@XinhuaNews",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "5小时前",
    content: "【科技创新服务高质量发展】中国高技术制造业增加值增速连续41个月高于规模以上工业整体，战略性新兴产业增加值占规模以上工业增加值比重达到13.3%。如今，中国战略科技力量加快壮大，科技创新服务高质量发展的势头更加强劲。",
    images: ["https://via.placeholder.com/300/eee", "https://via.placeholder.com/300/ddd"],
    likes: 15211,
    comments: 2890,
    reposts: 4152
  },
  {
    id: 4,
    username: "中国日报",
    handle: "@ChinaDaily",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "昨天",
    content: "【第六届进博会圆满落幕，交易额再创新高】第六届中国国际进口博览会于11月10日圆满落幕。本届进博会累计意向成交额783.4亿美元，比上届增长了6.7%，再创历史新高。",
    images: ["https://via.placeholder.com/300/eee"],
    likes: 12453,
    comments: 1798,
    reposts: 3241
  },
  {
    id: 5,
    username: "科技日报",
    handle: "@ScienceDaily",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "昨天",
    content: "【中国天眼FAST重大发现：首次探测到宇宙中最强磁场】中国科学院国家天文台研究团队利用500米口径球面射电望远镜（FAST）在一颗脉冲星中发现了迄今宇宙中观测到的最强磁场，达到16亿特斯拉，相当于地球磁场的千亿倍。",
    images: [],
    likes: 9876,
    comments: 1432,
    reposts: 2876
  }
];

/**
 * 获取微博热搜话题列表
 * @returns 热搜话题列表
 */
export const getWeiboHotTopics = (): WeiboHotTopic[] => {
  return [...mockHotTopics];
};

/**
 * 获取微博帖子列表
 * 根据登录状态返回不同内容
 * @returns 微博帖子列表
 */
export const getWeiboPosts = (): WeiboPost[] => {
  const currentUser = getCurrentUser();
  // 如果用户已登录，返回关注内容，否则返回公共内容
  return currentUser ? [...mockFollowingPosts] : [...mockPublicPosts];
};

/**
 * 模拟登录微博
 * 实际应用中需要与实际微博API对接
 * @returns 是否登录成功
 */
export const loginToWeibo = (): boolean => {
  const currentUser = getCurrentUser();
  // 检查用户是否已登录系统
  return !!currentUser;
};

/**
 * 检查用户是否已登录微博
 * @returns 是否已登录
 */
export const isLoggedInToWeibo = (): boolean => {
  const currentUser = getCurrentUser();
  return !!currentUser;
};
