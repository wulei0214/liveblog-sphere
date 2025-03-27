
import React, { useState, useEffect } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  url: string;
  source: string;
  date: string;
}

// Mock data for CCTV news
const mockNewsData: NewsItem[] = [
  {
    id: 1,
    title: "习近平在西安考察调研",
    summary: "中共中央总书记、国家主席、中央军委主席习近平在陕西省考察调研重要讲话精神。",
    url: "https://news.cctv.com/2023/news1",
    source: "央视新闻",
    date: "2023-11-10"
  },
  {
    id: 2,
    title: "中央金融工作会议在北京举行",
    summary: "中央金融工作会议于11月讨论金融政策和金融稳定措施。",
    url: "https://news.cctv.com/2023/news2",
    source: "央视新闻",
    date: "2023-11-09"
  },
  {
    id: 3,
    title: "第六届中国国际进口博览会开幕",
    summary: "第六届中国国际进口博览会在上海开幕，多国参展。",
    url: "https://news.cctv.com/2023/news3",
    source: "央视新闻",
    date: "2023-11-08"
  },
  {
    id: 4,
    title: "我国成功发射风云四号03星",
    summary: "我国成功发射风云四号03星，将用于气象观测。",
    url: "https://news.cctv.com/2023/news4",
    source: "央视新闻",
    date: "2023-11-07"
  },
  {
    id: 5,
    title: "全国粮食生产再获丰收",
    summary: "全国粮食生产再获丰收，为经济稳定提供保障。",
    url: "https://news.cctv.com/2023/news5",
    source: "央视新闻",
    date: "2023-11-06"
  },
  {
    id: 6,
    title: "中国航天员乘组完成任务返回地球",
    summary: "神舟十七号航天员乘组完成空间站任务安全返回地球。",
    url: "https://news.cctv.com/2023/news6",
    source: "央视新闻",
    date: "2023-11-05"
  },
  {
    id: 7,
    title: "2023年世界互联网大会在浙江乌镇举行",
    summary: "世界互联网大会在浙江乌镇举行，讨论数字经济和互联网发展。",
    url: "https://news.cctv.com/2023/news7",
    source: "央视新闻",
    date: "2023-11-04"
  },
  {
    id: 8,
    title: "国家疾控局发布最新疫情防控指南",
    summary: "国家疾控局发布最新疫情防控指南，优化防疫措施。",
    url: "https://news.cctv.com/2023/news8",
    source: "央视新闻",
    date: "2023-11-03"
  },
  {
    id: 9,
    title: "全国人大常委会审议多项法律修正案",
    summary: "全国人大常委会审议多项法律修正案，推进法治建设。",
    url: "https://news.cctv.com/2023/news9",
    source: "央视新闻",
    date: "2023-11-02"
  },
  {
    id: 10,
    title: "中国制造业PMI指数连续三个月处于扩张区间",
    summary: "10月份中国制造业PMI指数为51.2%，连续三个月处于扩张区间。",
    url: "https://news.cctv.com/2023/news10",
    source: "央视新闻",
    date: "2023-11-01"
  },
  {
    id: 11,
    title: "2023年前三季度国民经济运行情况发布",
    summary: "国家统计局发布2023年前三季度国民经济运行情况，经济呈现回升向好态势。",
    url: "https://news.cctv.com/2023/news11",
    source: "央视新闻",
    date: "2023-10-31"
  },
  {
    id: 12,
    title: "第六届中国-南亚博览会开幕",
    summary: "第六届中国-南亚博览会在昆明开幕，促进区域合作。",
    url: "https://news.cctv.com/2023/news12",
    source: "央视新闻",
    date: "2023-10-30"
  },
  {
    id: 13,
    title: "2023世界VR产业大会在南昌举行",
    summary: "2023世界VR产业大会在南昌举行，展示虚拟现实最新技术。",
    url: "https://news.cctv.com/2023/news13",
    source: "央视新闻",
    date: "2023-10-29"
  },
  {
    id: 14,
    title: "中国—东盟自贸区3.0版谈判顺利完成",
    summary: "中国—东盟自贸区3.0版谈判顺利完成，推动区域经济一体化。",
    url: "https://news.cctv.com/2023/news14",
    source: "央视新闻",
    date: "2023-10-28"
  },
  {
    id: 15,
    title: "全国医保电子凭证用户量突破8亿",
    summary: "国家医保局宣布全国医保电子凭证用户量突破8亿，覆盖面持续扩大。",
    url: "https://news.cctv.com/2023/news15",
    source: "央视新闻",
    date: "2023-10-27"
  }
];

const NewsSlider: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // In a real application, we would fetch the news from an API
    // For now, we'll use the mock data
    setNews(mockNewsData);
  }, []);

  return (
    <div className="w-full py-4">
      <div className="flex items-center mb-4">
        <Newspaper className="mr-2 text-primary" />
        <h2 className="text-xl font-serif font-semibold">央视新闻简报</h2>
      </div>
      
      <ScrollArea className="h-[400px] w-full pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item) => (
            <a 
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg line-clamp-2">{item.title}</h3>
                <ExternalLink size={16} className="text-gray-500 flex-shrink-0 ml-2" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{item.summary}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{item.source}</span>
                <span>{item.date}</span>
              </div>
            </a>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-4 text-center">
        <a 
          href="https://news.cctv.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary hover:underline"
        >
          查看更多央视新闻 <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default NewsSlider;
