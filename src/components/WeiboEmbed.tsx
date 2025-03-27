
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Twitter, Heart, MessageCircle, RefreshCw, Share2, ExternalLink } from 'lucide-react';

// Mock data for Weibo posts
const mockWeiboPosts = [
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
  },
  {
    id: 6,
    username: "体育之声",
    handle: "@SportVoice",
    verified: true,
    avatar: "https://via.placeholder.com/50",
    time: "昨天",
    content: "【国足世预赛12强赛抽签结果出炉】中国男足将在2026世界杯亚洲区预选赛12强赛中与日本、澳大利亚、沙特阿拉伯、巴林和印尼同分在B组。A组为韩国、伊朗、卡塔尔、阿联酋、乌兹别克斯坦和吉尔吉斯斯坦。",
    images: ["https://via.placeholder.com/300/eee"],
    likes: 7654,
    comments: 3214,
    reposts: 1532
  }
];

const WeiboEmbed: React.FC = () => {
  const [posts, setPosts] = useState(mockWeiboPosts);

  return (
    <div className="w-full py-4">
      <div className="flex items-center mb-4">
        <Twitter className="mr-2 text-primary" />
        <h2 className="text-xl font-serif font-semibold">微博热门</h2>
      </div>

      <ScrollArea className="h-[500px] w-full pr-4">
        <div className="space-y-6">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img src={post.avatar} alt={post.username} className="w-full h-full object-cover" />
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex items-center">
                    <span className="font-medium">{post.username}</span>
                    {post.verified && (
                      <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{post.handle} · {post.time}</div>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.content}</p>
              </div>
              
              {post.images.length > 0 && (
                <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-3`}>
                  {post.images.map((img, index) => (
                    <div key={index} className="rounded-lg overflow-hidden bg-gray-100">
                      <img src={img} alt={`Post image ${index}`} className="w-full h-auto" />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between text-gray-500 pt-2">
                <button className="flex items-center hover:text-blue-500">
                  <MessageCircle size={18} className="mr-1" />
                  <span>{post.comments.toLocaleString()}</span>
                </button>
                <button className="flex items-center hover:text-green-500">
                  <RefreshCw size={18} className="mr-1" />
                  <span>{post.reposts.toLocaleString()}</span>
                </button>
                <button className="flex items-center hover:text-red-500">
                  <Heart size={18} className="mr-1" />
                  <span>{post.likes.toLocaleString()}</span>
                </button>
                <button className="flex items-center hover:text-primary">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-4 text-center">
        <a 
          href="https://weibo.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary hover:underline"
        >
          查看更多微博内容 <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default WeiboEmbed;
