
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import PromoVideo from './components/PromoVideo';
import ProductSection from './components/ProductSection';
import ContactBanner from './components/ContactBanner';
import ContactForm from './components/ContactForm';
import PageLayout from './components/PageLayout';
import ScrollReveal from './components/ScrollReveal'; 
import { SiteProvider, useSite } from './contexts/SiteContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminDashboard, AdminPosts, AdminSettings, AdminContent } from './pages/Admin';
import Login from './pages/Login';
import { Phone, Mail, MapPin, Clock, TrendingUp, ThumbsUp, Lightbulb, UserCheck, Sparkles, Award, Printer, Navigation } from 'lucide-react';
import { TRANSLATIONS } from './translations';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Public Layout Component ---
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen font-sans antialiased text-brand-text bg-brand-gray selection:bg-brand-blue selection:text-white">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

// --- Page Components ---

const HomePage = () => (
  <PublicLayout>
    <Hero />
    <Philosophy />
    <PromoVideo />
    <ProductSection />
    <ContactBanner />
  </PublicLayout>
);

// About Section
const AboutIntroPage = () => {
  const { content, t, language } = useSite();
  const isDefaultLang = language === 'KOR';

  return (
    <PublicLayout>
      <PageLayout title={t.pages.intro.title} subtitle={t.pages.intro.subtitle}>
        <div className="space-y-16">
          
          {/* Intro Text & Vision */}
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto space-y-6 mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {isDefaultLang ? content['intro_main_title_1'] : (language === 'ENG' ? 'Global Leader in' : 'Global Leader in')} <br/>
                <span className="text-brand-blue">{isDefaultLang ? content['intro_main_title_2'] : (language === 'ENG' ? 'Aluminum Extrusion' : 'Aluminum Extrusion')}</span>
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg break-keep">
                {isDefaultLang ? content['intro_desc'] : t.pages.intro.subtitle}
              </p>
            </div>
          </ScrollReveal>

          {/* Factory Images */}
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
                <div className="group relative rounded-3xl overflow-hidden shadow-xl h-[300px] md:h-[400px]">
                  <img 
                    src={content['intro_img_1']} 
                    alt="대구공장 전경" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                      <div className="text-white transform transition-transform duration-300 group-hover:-translate-y-2">
                        <h4 className="text-2xl font-bold mb-2">{t.footer.daegu}</h4>
                        <p className="text-white/80 text-sm font-medium">{language === 'KOR' ? '최첨단 압출 설비 및 본사 운영\nIATF 16949 인증 사업장' : (language === 'ENG' ? 'HQ & State-of-the-art Facility' : '最先端押出設備および本社運営')}</p>
                      </div>
                  </div>
                </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
                <div className="group relative rounded-3xl overflow-hidden shadow-xl h-[300px] md:h-[400px]">
                  <img 
                    src={content['intro_img_2']} 
                    alt="창녕공장 전경" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                      <div className="text-white transform transition-transform duration-300 group-hover:-translate-y-2">
                        <h4 className="text-2xl font-bold mb-2">{t.footer.changnyeong}</h4>
                         <p className="text-white/80 text-sm font-medium">{language === 'KOR' ? '대규모 물류 센터 및 제2 생산 거점\n스마트 팩토리 시스템 구축' : (language === 'ENG' ? 'Large-scale Logistics & 2nd Factory' : '大規模物流センターおよび第2生産拠点')}</p>
                      </div>
                  </div>
                </div>
            </ScrollReveal>
          </div>

          {/* Company Detail Table */}
          <ScrollReveal delay={0.3}>
            <div className="bg-gray-50 rounded-[2.5rem] p-8 md:p-12 border border-gray-100/50 shadow-inner">
                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
                   {language === 'KOR' ? '기업 상세 정보' : (language === 'ENG' ? 'Company Details' : '企業詳細情報')}
                </h3>
                
                <div className="space-y-6">
                  {/* Row Item */}
                  <div className="flex flex-col md:flex-row md:items-baseline border-b border-gray-200 pb-6">
                      <div className="w-40 font-bold text-gray-500 shrink-0 mb-2 md:mb-0">{language === 'KOR' ? '회사명' : (language === 'ENG' ? 'Company Name' : '会社名')}</div>
                      <div className="font-bold text-lg text-gray-900">{language === 'KOR' ? '(주)대우경금속' : 'Daewoo Light Metal Co., Ltd.'}</div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-baseline border-b border-gray-200 pb-6">
                      <div className="w-40 font-bold text-gray-500 shrink-0 mb-2 md:mb-0">{language === 'KOR' ? '대표이사' : (language === 'ENG' ? 'CEO' : '代表取締役')}</div>
                      <div className="font-bold text-lg text-gray-900">{language === 'KOR' ? '김도연' : 'Kim Do-yeon'}</div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-baseline border-b border-gray-200 pb-6">
                      <div className="w-40 font-bold text-gray-500 shrink-0 mb-2 md:mb-0">{language === 'KOR' ? '주요사업' : (language === 'ENG' ? 'Main Business' : '主要事業')}</div>
                      <div className="text-gray-800 leading-relaxed">{language === 'KOR' ? '알루미늄 압출 제조 및 판매 (자동차, 전자, 건축, 산업용 소재)' : (language === 'ENG' ? 'Aluminum Extrusion Manufacturing & Sales' : 'アルミニウム押出製造および販売')}</div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start border-b border-gray-200 pb-6">
                      <div className="w-40 font-bold text-gray-500 shrink-0 mb-4 md:mb-0 pt-1">{language === 'KOR' ? '사업장 안내' : (language === 'ENG' ? 'Locations' : '事業所案内')}</div>
                      <div className="flex-1 space-y-6">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <span className="font-bold block text-brand-blue mb-2 text-lg">{t.footer.daegu}</span>
                            <p className="text-gray-700 mb-3">{t.footer.address_daegu}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> T. 053-611-6061</span>
                              <span className="hidden sm:inline text-gray-300">|</span>
                              <span>F. 053-611-6066</span>
                            </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <span className="font-bold block text-brand-blue mb-2 text-lg">{t.footer.changnyeong}</span>
                            <p className="text-gray-700 mb-3">{t.footer.address_changnyeong}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> T. 055-533-0013</span>
                              <span className="hidden sm:inline text-gray-300">|</span>
                              <span>F. 055-533-0225</span>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <span className="font-bold block text-brand-blue mb-2 text-lg">{t.contact.info.japan_branch}</span>
                            <p className="text-gray-700 mb-3">Daewoo Metal Japan Co., Ltd. 591-1, Miyata, Miyawaka-city, Fukuoka-ken Japan</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> T. +81-949-28-8028</span>
                              <span className="hidden sm:inline text-gray-300">|</span>
                              <span>F. +81-949-28-8028</span>
                            </div>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
          </ScrollReveal>
        </div>
      </PageLayout>
    </PublicLayout>
  );
};

const AboutHistoryPage = () => {
  const { t } = useSite();
  // Using dynamic data from translations
  const historyData = t.history.groups;

  return (
    <PublicLayout>
      <PageLayout title={t.pages.history.title} subtitle={t.pages.history.subtitle}>
        <div className="max-w-4xl mx-auto py-8">
             {/* Section Circle Header */}
             <div className="flex justify-center mb-20">
                <ScrollReveal mode="scale">
                  <div className="w-40 h-40 rounded-full bg-brand-blue text-white flex flex-col items-center justify-center shadow-xl shadow-blue-900/20 border-8 border-white ring-1 ring-gray-100">
                       <span className="text-xl font-medium opacity-90">Present</span>
                       <span className="text-lg opacity-80 my-0.5">~</span>
                       <span className="text-3xl font-bold">2013</span>
                  </div>
                </ScrollReveal>
             </div>

             <div className="space-y-20 relative">
                {/* Vertical Line */}
                <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[2px] bg-blue-100 -translate-x-1/2"></div>

                {historyData.map((group, gIdx) => {
                    const isLeft = gIdx % 2 !== 0; // Alternate sides on desktop
                    
                    return (
                      <div key={group.year} className="relative">
                          {/* Year Marker */}
                          <ScrollReveal>
                              <div className="flex items-center mb-8 relative">
                                  {/* Center Dot */}
                                  <div className="absolute left-[19px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[5px] border-brand-blue z-10 shadow-sm"></div>
                                  
                                  {/* Year Label - Updated for cleaner overlap & color */}
                                  <div className="pl-14 md:pl-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:-top-14 z-10">
                                      <span className="text-4xl font-bold text-brand-blue bg-white px-4 inline-block">{group.year}</span>
                                  </div>
                              </div>
                          </ScrollReveal>

                          {/* Events Content */}
                          <div className={`pl-14 md:pl-0 md:flex ${isLeft ? 'md:flex-row-reverse' : ''} md:gap-0`}>
                              {/* Spacer for desktop alignment */}
                              <div className="hidden md:block md:w-1/2"></div>

                              <div className={`md:w-1/2 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} space-y-5 pb-6`}>
                                  {group.events.map((event, idx) => (
                                      <ScrollReveal key={idx} delay={idx * 0.05}>
                                          <div className={`group flex flex-col md:block hover:bg-white hover:shadow-sm hover:rounded-xl p-2 -m-2 transition-all duration-300`}>
                                              <span className="inline-block text-gray-400 font-bold text-sm mb-1 md:mr-2">
                                                {event.date}
                                              </span>
                                              <span className="text-gray-800 font-medium text-lg leading-snug group-hover:text-brand-blue transition-colors">
                                                {event.desc}
                                              </span>
                                          </div>
                                      </ScrollReveal>
                                  ))}
                              </div>
                          </div>
                      </div>
                    );
                })}
             </div>
             
             {/* End Dot */}
             <div className="relative h-10">
                <div className="absolute left-[19px] md:left-1/2 -translate-x-1/2 top-0 w-3 h-3 rounded-full bg-blue-200"></div>
             </div>
        </div>
      </PageLayout>
    </PublicLayout>
  );
};

// Updated Philosophy Page with "Nonstop Jump" Concept
const AboutPhilosophyPage = () => {
  const { content, t } = useSite();
  const coreValues = [
    {
      icon: <ThumbsUp className="w-8 h-8" />,
      title: t.philosophy.cv_1_title,
      subtitle: t.philosophy.cv_1_sub,
      desc: t.philosophy.cv_1_desc,
      bg: "bg-blue-50"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: t.philosophy.cv_2_title,
      subtitle: t.philosophy.cv_2_sub,
      desc: t.philosophy.cv_2_desc,
      bg: "bg-blue-50"
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: t.philosophy.cv_3_title,
      subtitle: t.philosophy.cv_3_sub,
      desc: t.philosophy.cv_3_desc,
      bg: "bg-blue-50"
    }
  ];

  return (
    <PublicLayout>
      <PageLayout title={t.pages.philosophy.title} subtitle={t.pages.philosophy.subtitle}>
        <div className="py-8 space-y-24">
          
          {/* Section 1: Nonstop Jump (Refined - Sophisticated & Modern) */}
          <ScrollReveal>
             <div className="group relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(7,29,73,0.3)]">
                
                {/* 1. Deep Space/Ocean Gradient Background */}
                <div className="absolute inset-0 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-[#071D49] to-[#0A265E] animate-pulse"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#1e3a8a,transparent)] opacity-60 mix-blend-screen"></div>

                {/* 2. Animated Particles / Grid (Subtle) */}
                <div className="absolute inset-0 opacity-20" style={{ 
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                }}></div>

                {/* 3. Content Container */}
                <div className="relative z-10 flex flex-col items-center justify-center py-24 px-6 md:px-12 text-center">
                   
                   {/* Icon with Ring Pulse Animation */}
                   <div className="relative mb-10">
                      <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping blur-xl"></div>
                      <div className="absolute inset-0 rounded-full border border-white/20 scale-150 animate-pulse"></div>
                      <div className="w-24 h-24 bg-gradient-to-tr from-white/10 to-white/5 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500 ease-spring">
                         <TrendingUp className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" strokeWidth={1.5} />
                      </div>
                   </div>
                   
                   {/* Typography: Modern & Elegant */}
                   <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white drop-shadow-lg">
                     Nonstop <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 animate-text-shimmer bg-[length:200%_auto]">Jump</span>
                   </h2>
                   
                   <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mb-8 opacity-50"></div>

                   <p className="text-lg md:text-2xl text-blue-50/90 max-w-3xl mx-auto leading-relaxed font-light tracking-wide mix-blend-overlay">
                     {t.philosophy.nonstop_desc}
                   </p>
                </div>

                {/* 4. Glassmorphism Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
             </div>
          </ScrollReveal>

          {/* Section 2: Core Values (Cards instead of Hexagons) */}
          <div>
            <ScrollReveal>
               <div className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                     <Sparkles className="w-5 h-5 text-brand-blue" />
                     {t.philosophy.core_values_title}
                  </h3>
                  <div className="w-12 h-1 bg-gray-200 mx-auto mt-4 rounded-full"></div>
               </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
               {coreValues.map((val, idx) => (
                  <ScrollReveal key={idx} delay={idx * 0.1}>
                     <div className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-spring h-full flex flex-col items-center text-center">
                        <div className={`w-20 h-20 ${val.bg} rounded-2xl flex items-center justify-center mb-6 text-brand-blue group-hover:scale-110 transition-transform duration-300`}>
                           {val.icon}
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-1">{val.title}</h4>
                        <p className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-6 opacity-60">{val.subtitle}</p>
                        <p className="text-gray-500 leading-relaxed whitespace-pre-line break-keep">
                           {val.desc}
                        </p>
                     </div>
                  </ScrollReveal>
               ))}
            </div>
          </div>

        </div>
      </PageLayout>
    </PublicLayout>
  );
};

// New Certification Page - Consumes Dynamic Content
const AboutCertificationPage = () => {
  const { certifications, t } = useSite();

  return (
    <PublicLayout>
      <PageLayout title={t.pages.cert.title} subtitle={t.pages.cert.subtitle}>
         <ScrollReveal>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                 {certifications.map((cer, idx) => (
                     <div key={cer.id} className="group flex flex-col items-center">
                         <div className="w-full bg-white border border-gray-100 p-2 md:p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 ease-spring cursor-pointer">
                             <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white relative flex items-center justify-center">
                                 {/* Fallback styling in case image fails */}
                                 <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-50 text-xs">
                                     <Award className="w-12 h-12 opacity-20" />
                                 </div>
                                 <img 
                                   src={cer.imageUrl} 
                                   alt={cer.title} 
                                   className="relative z-10 w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                                   onError={(e) => {
                                      e.currentTarget.style.opacity = '0.3';
                                   }}
                                 />
                             </div>
                         </div>
                         <p className="mt-4 text-center font-bold text-gray-800 text-sm md:text-base group-hover:text-brand-blue transition-colors">
                             {cer.title}
                         </p>
                     </div>
                 ))}
             </div>
         </ScrollReveal>
      </PageLayout>
    </PublicLayout>
  );
};

const AboutLocationPage = () => {
  const { t } = useSite();
  const [activeTab, setActiveTab] = useState<'daegu' | 'changnyeong'>('daegu');

  const locations = {
    daegu: {
      name: t.footer.daegu,
      address: t.footer.address_daegu,
      tel: '053-611-6061',
      fax: '053-611-6066',
      mapQuery: '대구광역시 달성군 구지면 달성2차동3로 46'
    },
    changnyeong: {
      name: t.footer.changnyeong,
      address: t.footer.address_changnyeong,
      tel: '055-533-0013',
      fax: '055-533-0225',
      mapQuery: '경남 창녕군 대합면 대합産業단지로 22-44'
    }
  };

  const activeLoc = locations[activeTab];

  return (
    <PublicLayout>
      <PageLayout title={t.pages.location.title} subtitle={t.pages.location.subtitle}>
          <div className="space-y-8">
              {/* Map Container */}
              <ScrollReveal>
                <div className="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative">
                   <iframe 
                      title="Location Map"
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight={0} 
                      marginWidth={0} 
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(activeLoc.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full"
                   ></iframe>
                   
                   {/* Overlay Label for Context */}
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-gray-200">
                      <span className="font-bold text-brand-blue flex items-center gap-2">
                         <MapPin className="w-4 h-4" /> {activeLoc.name}
                      </span>
                   </div>
                </div>
              </ScrollReveal>

              {/* Selection Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                  {(['daegu', 'changnyeong'] as const).map((key) => {
                     const loc = locations[key];
                     const isActive = activeTab === key;
                     return (
                       <ScrollReveal key={key} delay={0.1}>
                         <div 
                            onClick={() => setActiveTab(key)}
                            className={`p-6 md:p-8 rounded-2xl cursor-pointer transition-all duration-300 ease-spring ${
                               isActive 
                               ? 'bg-white shadow-xl scale-[1.02] border-2 border-brand-blue' 
                               : 'bg-gray-50 hover:bg-white hover:shadow-md border border-transparent'
                            }`}
                         >
                             <div className="flex justify-between items-start mb-4">
                                <h4 className={`font-bold text-xl ${isActive ? 'text-brand-blue' : 'text-gray-900'}`}>{loc.name}</h4>
                                {isActive && <div className="bg-brand-blue text-white p-1 rounded-full"><Navigation className="w-4 h-4" /></div>}
                             </div>
                             
                             <div className="space-y-3 text-sm md:text-base">
                                <p className="flex items-start gap-3 text-gray-600">
                                   <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? 'text-brand-blue' : 'text-gray-400'}`} />
                                   <span>{loc.address}</span>
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pl-8">
                                   <p className="flex items-center gap-2 text-gray-500">
                                      <Phone className="w-4 h-4" /> {loc.tel}
                                   </p>
                                   <p className="flex items-center gap-2 text-gray-500">
                                      <Printer className="w-4 h-4" /> {loc.fax}
                                   </p>
                                </div>
                             </div>
                         </div>
                       </ScrollReveal>
                     );
                  })}
              </div>
          </div>
      </PageLayout>
    </PublicLayout>
  );
};

// Products Section
const ProductsListPage = () => {
    const { t } = useSite();
    return (
        <PublicLayout>
          <div className="pt-32 pb-24 min-h-screen bg-brand-gray">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t.products.title}</h1>
                 <p className="text-xl text-gray-500 mb-12">{t.products.desc}</p>
                 <ProductSection />
             </div>
          </div>
        </PublicLayout>
    );
};

const ProductDetailPage = ({ categoryKey }: { categoryKey: keyof typeof TRANSLATIONS.KOR.nav }) => {
    const { t } = useSite();
    const categoryName = t.nav[categoryKey];
    
    return (
        <PublicLayout>
          <PageLayout title={`${categoryName}`} subtitle={t.products.desc}>
              <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="group cursor-pointer">
                          <div className="aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                               <img src={`https://picsum.photos/seed/${categoryKey}${i}/400/400`} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                          </div>
                          <h4 className="font-bold text-lg group-hover:text-brand-blue transition-colors">{t.products.detail_page.model_name} {String(i).padStart(2, '0')}</h4>
                          <p className="text-sm text-gray-500">{t.products.detail_page.spec_desc}</p>
                      </div>
                  ))}
              </div>
          </PageLayout>
        </PublicLayout>
    );
};

// Other Sections
const ProcessPage = () => {
    const { t } = useSite();
    return (
        <PublicLayout>
          <PageLayout title={t.pages.process.title} subtitle={t.pages.process.subtitle}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {t.process.steps.map((step, idx) => (
                      <div key={step} className="p-6 bg-gray-50 rounded-xl text-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100">
                          <div className="text-3xl font-bold text-brand-blue/20 mb-2">0{idx + 1}</div>
                          <h3 className="font-bold text-gray-900">{step}</h3>
                      </div>
                  ))}
              </div>
          </PageLayout>
        </PublicLayout>
    );
};

const RndPage = () => {
    const { t } = useSite();
    return (
        <PublicLayout>
          <PageLayout title={t.pages.rnd.title} subtitle={t.pages.rnd.subtitle}>
              <div className="space-y-6 text-center">
                  <h3 className="text-2xl font-bold">{t.rnd.title}</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                      {t.rnd.desc}
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mt-12">
                       {t.rnd.cards.map((card, idx) => (
                         <div key={idx} className="p-8 bg-gray-50 rounded-2xl">
                             <h4 className="font-bold text-lg mb-2">{card}</h4>
                         </div>
                       ))}
                  </div>
              </div>
          </PageLayout>
        </PublicLayout>
    );
};

// Improved Contact/Support Page
const ContactPage = () => {
  const { config, t } = useSite();
  
  return (
    <PublicLayout>
      <PageLayout title={t.pages.support.title} subtitle={t.pages.support.subtitle}>
          <div className="grid lg:grid-cols-5 gap-12 items-start">
             {/* Left Info Column */}
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-brand-blue text-white p-8 rounded-3xl shadow-xl">
                   <h3 className="text-xl font-bold mb-6">{t.contact.info.title}</h3>
                   <div className="space-y-6">
                      <div className="flex items-start gap-4">
                         <div className="p-2 bg-white/10 rounded-lg"><Phone className="w-5 h-5" /></div>
                         <div>
                            <p className="text-xs text-blue-200 mb-1">{t.contact.info.phone}</p>
                            <p className="font-bold text-lg">053-611-6061</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="p-2 bg-white/10 rounded-lg"><Mail className="w-5 h-5" /></div>
                         <div>
                            <p className="text-xs text-blue-200 mb-1">{t.contact.info.email}</p>
                            <p className="font-bold">{config.contactEmail}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="p-2 bg-white/10 rounded-lg"><Clock className="w-5 h-5" /></div>
                         <div>
                            <p className="text-xs text-blue-200 mb-1">{t.contact.info.hours}</p>
                            <p className="font-bold">{t.contact.info.hours_desc}</p>
                            <p className="text-sm text-blue-200">{t.contact.info.closed}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-900 mb-4">{t.footer.daegu}</h3>
                   <div className="flex items-start gap-3 text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 shrink-0 mt-1 text-brand-blue" />
                      <p>{t.footer.address_daegu}</p>
                   </div>
                   <a href="/about/location" className="text-sm font-bold text-brand-blue hover:underline block text-center bg-blue-50 py-3 rounded-xl">
                      {t.contact.info.view_map}
                   </a>
                </div>
             </div>

             {/* Right Form Column */}
             <div className="lg:col-span-3">
                <ContactForm />
             </div>
          </div>
      </PageLayout>
    </PublicLayout>
  );
};

const NotFound = () => (
    <PublicLayout>
      <div className="pt-32 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">페이지를 찾을 수 없습니다.</h1>
          <p className="text-gray-500 mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
          <a href="/" className="text-brand-blue hover:underline">홈으로 돌아가기</a>
      </div>
    </PublicLayout>
)

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
            <Route path="/admin/posts" element={<ProtectedRoute><AdminPosts /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* About Routes */}
            <Route path="/about" element={<AboutPhilosophyPage />} />
            <Route path="/about/intro" element={<AboutIntroPage />} />
            <Route path="/about/history" element={<AboutHistoryPage />} />
            <Route path="/about/cer" element={<AboutCertificationPage />} /> 
            <Route path="/about/location" element={<AboutLocationPage />} />
            
            {/* Product Routes */}
            <Route path="/products" element={<ProductsListPage />} />
            {/* Map product detail pages to use translations */}
            <Route path="/products/light" element={<ProductDetailPage categoryKey="light" />} />
            <Route path="/products/industry" element={<ProductDetailPage categoryKey="industry" />} />
            <Route path="/products/processing" element={<ProductDetailPage categoryKey="processing" />} />
            <Route path="/products/electronic" element={<ProductDetailPage categoryKey="electronic" />} />
            <Route path="/products/construction" element={<ProductDetailPage categoryKey="construction" />} />
            <Route path="/products/environmental" element={<ProductDetailPage categoryKey="environmental" />} />
            <Route path="/products/exterior" element={<ProductDetailPage categoryKey="exterior" />} />
            <Route path="/products/substitute" element={<ProductDetailPage categoryKey="substitute" />} />
            
            {/* Other Routes */}
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/rnd" element={<RndPage />} />
            
            {/* Replaced SupportPage with ContactPage */}
            <Route path="/support" element={<ContactPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SiteProvider>
    </AuthProvider>
  );
};

export default App;
