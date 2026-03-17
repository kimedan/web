
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, SiteConfig, Language, Certification, ContentMap, Product } from '../types';
import { TRANSLATIONS } from '../translations';
import { db, doc, onSnapshot, setDoc } from '../utils/firebase';

interface SiteContextType {
  config: SiteConfig;
  posts: Post[];
  products: Product[]; 
  certifications: Certification[];
  content: ContentMap;
  language: Language;
  t: typeof TRANSLATIONS['KOR'];
  setLanguage: (lang: Language) => void;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  addPost: (post: Omit<Post, 'id' | 'date' | 'views'>) => void;
  deletePost: (id: string) => void;
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  deleteCertification: (id: string) => void;
  updateContent: (key: string, value: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  exportSiteData: () => void;
  importSiteData: (jsonData: string) => boolean;
  isSyncing: boolean;
}

const DEFAULT_CONFIG: SiteConfig = {
  siteName: '대우경금속',
  siteDescription: '차별화된 기술력과 서비스로 알루미늄 산업을 선도하겠습니다.',
  primaryColor: '#071D49',
  borderRadius: 'rounded-full', 
  seoKeywords: '알루미늄, 압출, 경량소재, 자동차부품',
  contactEmail: 'info@aldmc.co.kr',
  logoUrl: 'https://firebasestorage.googleapis.com/v0/b/company-homepage-28347.firebasestorage.app/o/DMC%20%EC%8B%9C%EA%B7%B8%EB%8B%88%EC%B2%98(%EC%83%81%ED%95%98)%20ENG%20white.png?alt=media&token=95cc47a9-e985-4013-9239-67bc60786d4e'
};

const DEFAULT_POSTS: Post[] = [
  { id: '1', title: '2024년 신년사', author: '관리자', category: '공지사항', date: '2024-01-02', status: 'Published', views: 1250 },
  { id: '2', title: '창녕공장 신규 설비 도입 안내', author: '운영팀', category: '뉴스', date: '2024-02-15', status: 'Published', views: 890 },
  { id: '3', title: 'IATF 16949 인증 갱신 완료', author: '품질팀', category: '인증', date: '2024-03-10', status: 'Published', views: 540 },
  { id: '4', title: '하계 휴가 기간 공지', author: '인사팀', category: '공지사항', date: '2024-06-20', status: 'Draft', views: 0 },
];

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p1', title: '경량소재', category: 'Lightweight', description: '자동차 경량화를 위한 고강도 알루미늄 소재', imageUrl: 'https://picsum.photos/id/20/600/400' },
  { id: 'p2', title: '산업용소재', category: 'Industrial', description: '다양한 산업 설비 및 기계 구조용 소재', imageUrl: 'https://picsum.photos/id/1/600/400' },
  { id: 'p3', title: '가공소재', category: 'Processing', description: '정밀 가공성이 우수한 고품질 소재', imageUrl: 'https://picsum.photos/id/192/600/400' },
  { id: 'p4', title: '전기전자부품소재', category: 'Electronics', description: '전기 전도성과 방열성이 뛰어난 부품 소재', imageUrl: 'https://picsum.photos/id/3/600/400' },
  { id: 'p5', title: '건축소재', category: 'Construction', description: '내구성과 심미성을 갖춘 건축 내외장재', imageUrl: 'https://picsum.photos/id/10/600/400' },
  { id: 'p6', title: '환경소재', category: 'Environmental', description: '친환경 재활용이 가능한 지속 가능한 소재', imageUrl: 'https://picsum.photos/id/11/600/400' },
  { id: 'p7', title: '외장소재', category: 'Exterior', description: '건물 및 제품의 외관을 돋보이게 하는 외장재', imageUrl: 'https://picsum.photos/id/12/600/400' },
  { id: 'p8', title: '대체소재', category: 'Substitute', description: '기존 금속을 대체하는 고성능 합금 소재', imageUrl: 'https://picsum.photos/id/13/600/400' },
];

const DEFAULT_CERTIFICATIONS: Certification[] = [
    { id: 'c1', title: "ISO 14001", imageUrl: "https://file.notion.so/f/f/c7dae5a5-48c6-4450-a729-3ac476c1b5bf/66d8c4ba-557d-4474-99e1-1fdcb5e3b341/%EC%9D%B8%EC%A6%9D%EC%84%9C_ISO_14001_KOR.jpg?table=block&id=2f7c2f22-549c-8023-8c3e-d83be4f40481&spaceId=c7dae5a5-48c6-4450-a729-3ac476c1b5bf&expirationTimestamp=1769731200000&signature=_GF85xHtmem9PFnqeJ4ijquTGWVOlLlwLXik6dkXWso&downloadName=%5B%EC%9D%B8%EC%A6%9D%EC%84%9C%5D+ISO+14001_KOR.jpg" },
    { id: 'c2', title: "ISO 9001", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer02_z.gif" },
    { id: 'c3', title: "벤처기업확인서", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer03_z.gif" },
    { id: 'c4', title: "KS 제품인증서", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer04_z.gif" },
    { id: 'c5', title: "기업부설연구소 인정서", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer05_z.gif" },
    { id: 'c6', title: "기술혁신형 중소기업", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer06_z.gif" },
    { id: 'c7', title: "IATF 16949", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer07_z.gif" },
    { id: 'c8', title: "상표등록증", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer08_z.gif" },
];

const DEFAULT_CONTENT: ContentMap = {
  'home_hero_title_prefix': 'The Future of',
  'home_hero_title_highlight': 'Aluminum Technology',
  'home_hero_desc': '차별화된 기술력과 서비스로 알루미늄 산업을 선도합니다. 고객 맞춤형 설계부터 완벽한 납기까지, 우리는 기준을 만듭니다.',
  'home_hero_bg': 'https://plus.unsplash.com/premium_photo-1672423154405-5fd922c11af2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'home_hero_badge': 'Total Aluminum Solutions',
  'intro_main_title_1': 'Global Leader in',
  'intro_main_title_2': 'Aluminum Extrusion',
  'intro_desc': '대우경금속은 고객 맞춤형 설계, 생산, 피막, 기계가공 및 적기적소의 납기까지 Total 서비스를 제공합니다. 최첨단 설비와 축적된 기술력을 바탕으로 다양한 산업 분야의 핵심 소재를 공급하고 있습니다.',
  'intro_img_1': 'https://firebasestorage.googleapis.com/v0/b/company-homepage-28347.firebasestorage.app/o/%EB%8C%80%EA%B5%AC%EA%B3%B5%EC%9E%A5.JPG?alt=media&token=530a1c33-4075-4f33-a6e2-cf01939f5b8b',
  'intro_img_2': 'https://firebasestorage.googleapis.com/v0/b/company-homepage-28347.firebasestorage.app/o/%EC%B0%BD%EB%85%95%EA%B3%B5%EC%9E%A5.png?alt=media&token=124af372-5d38-4717-a191-546d04907f48',
  'philosophy_img_main': 'https://firebasestorage.googleapis.com/v0/b/company-homepage-28347.firebasestorage.app/o/site-assets%2F1769752363492_%EA%B8%88%ED%98%95.jpg?alt=media&token=d93ff708-ffe1-4a7a-ab7e-0469a2b71f61'
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '7 29 73';
};

// Firestore Collection Name
const COLLECTION_NAME = 'site_data';

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initially use DEFAULTs to avoid flicker, then hydrate from Firestore
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [posts, setPosts] = useState<Post[]>(DEFAULT_POSTS);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [certifications, setCertifications] = useState<Certification[]>(DEFAULT_CERTIFICATIONS);
  const [content, setContent] = useState<ContentMap>(DEFAULT_CONTENT);
  
  const [language, setLanguage] = useState<Language>('KOR');
  const [isSyncing, setIsSyncing] = useState(true);

  // --- Firestore Realtime Sync ---
  // This is crucial: We must listen to Firestore so when Admin uploads an image (and updates the URL in DB),
  // all other clients receive that new URL instantly.
  useEffect(() => {
    // Helper to subscribe to a document
    const subscribe = (docName: string, setter: any, defaultData: any) => {
      return onSnapshot(doc(db, COLLECTION_NAME, docName), (snapshot: any) => {
        if (snapshot.exists()) {
          // If document exists in DB, use it (This means Admin has customized it)
          setter(snapshot.data().data);
        } else {
          // If not exists (first run), we use hardcoded defaults.
          // We optionally write them to DB so Admin can edit them later.
          // For now, we just use local defaults to keep it fast.
          setter(defaultData);
        }
      }, (error: any) => {
        console.error(`Error syncing ${docName}:`, error);
      });
    };

    const unsubConfig = subscribe('config', setConfig, DEFAULT_CONFIG);
    const unsubPosts = subscribe('posts', setPosts, DEFAULT_POSTS);
    const unsubProducts = subscribe('products', setProducts, DEFAULT_PRODUCTS);
    const unsubCerts = subscribe('certifications', setCertifications, DEFAULT_CERTIFICATIONS);
    const unsubContent = subscribe('content', setContent, DEFAULT_CONTENT);

    setIsSyncing(false);

    return () => {
      unsubConfig();
      unsubPosts();
      unsubProducts();
      unsubCerts();
      unsubContent();
    };
  }, []);

  // Update CSS Variables & Meta tags
  useEffect(() => {
    const rgb = hexToRgb(config.primaryColor);
    document.documentElement.style.setProperty('--brand-blue', rgb);
    document.title = `${config.siteName} | ${language === 'KOR' ? '알루미늄 전문기업' : 'Aluminum Specialist'}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', config.siteDescription);
  }, [config, language]);

  // --- Action Handlers (Write to Firestore) ---
  // When Admin changes something, we save to DB.
  
  const saveData = async (docName: string, data: any) => {
    try {
      await setDoc(doc(db, COLLECTION_NAME, docName), { data });
    } catch (error) {
      console.error(`Failed to save ${docName}:`, error);
      alert("변경사항 저장에 실패했습니다. (네트워크/권한 문제)");
    }
  };

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    const updated = { ...config, ...newConfig };
    saveData('config', updated);
  };

  const addPost = (newPostData: Omit<Post, 'id' | 'date' | 'views'>) => {
    const newPost: Post = {
      ...newPostData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      views: 0,
    };
    const updated = [newPost, ...posts];
    saveData('posts', updated);
  };

  const deletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    saveData('posts', updated);
  };

  const addCertification = (cert: Omit<Certification, 'id'>) => {
    const newCert = { ...cert, id: Date.now().toString() };
    const updated = [...certifications, newCert];
    saveData('certifications', updated);
  };

  const deleteCertification = (id: string) => {
    const updated = certifications.filter(c => c.id !== id);
    saveData('certifications', updated);
  };

  const updateContent = (key: string, value: string) => {
    const updated = { ...content, [key]: value };
    saveData('content', updated);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    saveData('products', updated);
  };

  // --- Export/Import ---
  
  const exportSiteData = () => {
    const data = {
      config,
      posts,
      products,
      certifications,
      content,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daewoo-site-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importSiteData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.config || !data.content) throw new Error("Invalid data format");

      saveData('config', data.config);
      saveData('posts', data.posts || []);
      saveData('products', data.products || []);
      saveData('certifications', data.certifications || []);
      saveData('content', data.content);

      return true;
    } catch (e) {
      console.error("Import failed:", e);
      return false;
    }
  };

  return (
    <SiteContext.Provider value={{ 
      config, 
      posts, 
      products,
      certifications,
      content,
      language,
      t: TRANSLATIONS[language],
      setLanguage,
      updateConfig, 
      addPost, 
      deletePost,
      addCertification,
      deleteCertification,
      updateContent,
      updateProduct,
      exportSiteData,
      importSiteData,
      isSyncing
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};
