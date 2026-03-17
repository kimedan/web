
import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useSite } from '../contexts/SiteContext';
import { Users, Eye, FileText, MousePointer, Plus, Trash2, Search, Palette, Globe, Save, Upload, Image as ImageIcon, X, LayoutTemplate, Layers, Award, Package, Pencil, Wand2, Loader2, Download, RefreshCcw, AlertTriangle } from 'lucide-react';
import { BorderRadiusSize } from '../types';
import { uploadImageToStorage } from '../utils/firebase';

// --- Dashboard Component ---
export const AdminDashboard: React.FC = () => {
  const { posts, certifications } = useSite();
  const totalViews = posts.reduce((acc, curr) => acc + curr.views, 0);

  const stats = [
    { label: '총 방문자 수', value: '12,450', change: '+12%', icon: <Users className="w-6 h-6 text-blue-600" /> },
    { label: '인증서 보유', value: certifications.length.toString(), change: '현황', icon: <Award className="w-6 h-6 text-green-600" /> },
    { label: '게시글 수', value: posts.length.toString(), change: '+2', icon: <FileText className="w-6 h-6 text-purple-600" /> },
    { label: '문의 접수', value: '8', change: '+8', icon: <MousePointer className="w-6 h-6 text-orange-600" /> },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-yellow-800 font-bold text-lg mb-1">관리자 주의사항 (데이터 동기화 안내)</h3>
               <p className="text-yellow-700 text-sm leading-relaxed">
                  이제 이미지를 업로드하면 <strong>Firebase 서버</strong>에 저장되어 어디서든 이미지가 보입니다.<br/>
                  다만, 텍스트 변경사항이나 설정값은 여전히 <strong>현재 브라우저</strong>에만 저장되므로, 
                  다른 PC로 설정을 옮기려면 <strong>[사이트 설정] &gt; [데이터 백업 및 복원]</strong> 기능을 이용하세요.
               </p>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
                <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">{stat.change}</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">빠른 바로가기</h3>
              <div className="flex gap-4">
                 <a href="#/admin/content" className="flex-1 bg-blue-50 p-4 rounded-xl text-brand-blue font-bold hover:bg-blue-100 transition-colors text-center">
                    페이지 문구 수정
                 </a>
                 <a href="#/admin/posts" className="flex-1 bg-gray-50 p-4 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-colors text-center">
                    새 공지사항 작성
                 </a>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// --- Content Manager Component (Updated) ---
export const AdminContent: React.FC = () => {
  const { certifications, addCertification, deleteCertification, content, updateContent, products, updateProduct } = useSite();
  const [activeTab, setActiveTab] = useState<'cert' | 'text' | 'images' | 'products'>('products');
  const [newCert, setNewCert] = useState({ title: '', imageUrl: '' });
  const [uploading, setUploading] = useState<{[key: string]: boolean}>({});

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(prev => ({ ...prev, 'newCert': true }));
      try {
        const url = await uploadImageToStorage(file, 'certificates/');
        setNewCert({ ...newCert, imageUrl: url });
      } finally {
        setUploading(prev => ({ ...prev, 'newCert': false }));
      }
    }
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.imageUrl) return;
    addCertification(newCert);
    setNewCert({ title: '', imageUrl: '' });
  };

  const handleContentImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(prev => ({ ...prev, [key]: true }));
      try {
        const url = await uploadImageToStorage(file, 'content_images/');
        updateContent(key, url);
      } finally {
        setUploading(prev => ({ ...prev, [key]: false }));
      }
    }
  };

  const handleProductImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(prev => ({ ...prev, [`prod_${id}`]: true }));
      try {
        const url = await uploadImageToStorage(file, 'products/');
        updateProduct(id, { imageUrl: url });
      } finally {
        setUploading(prev => ({ ...prev, [`prod_${id}`]: false }));
      }
    }
  };

  const ImageUploadBlock = ({ label, contentKey, description }: { label: string, contentKey: string, description?: string }) => {
    const isUploadingThis = uploading[contentKey];
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
           <div>
              <h4 className="font-bold text-gray-900">{label}</h4>
              {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
           </div>
        </div>
        
        <div className="space-y-3">
           <div className="relative aspect-video w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              {isUploadingThis ? (
                 <div className="flex flex-col items-center justify-center w-full h-full text-brand-blue">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-xs font-medium">업로드 중...</span>
                 </div>
              ) : content[contentKey] ? (
                 <img src={content[contentKey]} alt={label} className="w-full h-full object-cover" />
              ) : (
                 <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                 </div>
              )}
              <label className={`absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center cursor-pointer group ${isUploadingThis ? 'pointer-events-none' : ''}`}>
                 <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <Upload className="w-4 h-4" /> 이미지 변경
                 </span>
                 <input type="file" accept="image/*" className="hidden" onChange={(e) => handleContentImageUpload(contentKey, e)} disabled={isUploadingThis} />
              </label>
           </div>
           <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="truncate flex-1 font-mono bg-gray-50 p-1 rounded">{content[contentKey]?.substring(0, 40)}...</span>
              <button onClick={() => updateContent(contentKey, '')} className="text-red-400 hover:text-red-500">삭제</button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
       <div className="space-y-6">
          <div className="flex space-x-4 border-b border-gray-200 pb-1 overflow-x-auto">
            <button 
               onClick={() => setActiveTab('products')}
               className={`pb-3 px-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'products' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500 hover:text-gray-700'}`}
             >
               제품 관리
             </button>
             <button 
               onClick={() => setActiveTab('cert')}
               className={`pb-3 px-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'cert' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500 hover:text-gray-700'}`}
             >
               인증서 관리
             </button>
             <button 
               onClick={() => setActiveTab('text')}
               className={`pb-3 px-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'text' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500 hover:text-gray-700'}`}
             >
               텍스트 편집
             </button>
             <button 
               onClick={() => setActiveTab('images')}
               className={`pb-3 px-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'images' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500 hover:text-gray-700'}`}
             >
               이미지 관리
             </button>
          </div>

          {activeTab === 'products' && (
            <div className="animate-fade-in space-y-8">
               <div className="bg-blue-50 p-6 rounded-2xl flex items-center gap-4 border border-blue-100">
                  <div className="p-3 bg-white rounded-full text-brand-blue shadow-sm">
                     <Package className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="font-bold text-brand-blue text-lg">제품 소재 관리</h3>
                     <p className="text-gray-600 text-sm">제품 소개 페이지에 표시되는 8가지 소재의 이미지와 설명을 관리합니다.</p>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => {
                     const isUploadingProd = uploading[`prod_${product.id}`];
                     return (
                     <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                        <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200">
                           {isUploadingProd ? (
                             <div className="flex flex-col items-center justify-center h-full text-brand-blue">
                               <Loader2 className="w-6 h-6 animate-spin mb-2" />
                               <span className="text-xs">업로드 중</span>
                             </div>
                           ) : (
                             <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                           )}
                           <label className={`absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer group ${isUploadingProd ? 'pointer-events-none' : ''}`}>
                              <span className="bg-white/90 text-gray-900 px-3 py-1.5 rounded-lg font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                 <Pencil className="w-3 h-3" /> 사진 변경
                              </span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleProductImageUpload(product.id, e)} disabled={isUploadingProd} />
                           </label>
                        </div>
                        
                        <div className="space-y-3 flex-1">
                           <div>
                              <label className="text-xs font-bold text-gray-400 block mb-1">제품명</label>
                              <div className="font-bold text-gray-900 text-lg">{product.title}</div>
                           </div>
                           <div>
                              <label className="text-xs font-bold text-gray-400 block mb-1">설명</label>
                              <textarea 
                                 rows={3}
                                 className="w-full text-sm border border-gray-200 rounded-lg p-2 resize-none focus:ring-1 focus:ring-brand-blue outline-none"
                                 value={product.description}
                                 onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                              />
                           </div>
                        </div>
                     </div>
                  )})}
               </div>
            </div>
          )}

          {activeTab === 'cert' && (
             <div className="space-y-8 animate-fade-in">
                {/* Add New Cert */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-lg mb-4">새 인증서 등록</h3>
                   <form onSubmit={handleAddCert} className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1 w-full">
                         <label className="block text-sm font-medium text-gray-700 mb-1">인증서명</label>
                         <input 
                           type="text" 
                           value={newCert.title} 
                           onChange={(e) => setNewCert({...newCert, title: e.target.value})}
                           placeholder="예: ISO 14001"
                           className="w-full border border-gray-300 rounded-lg p-3"
                         />
                      </div>
                      <div className="flex-1 w-full">
                         <label className="block text-sm font-medium text-gray-700 mb-1">이미지</label>
                         <div className="flex gap-2">
                           <label className={`flex-1 cursor-pointer border border-gray-300 bg-gray-50 text-gray-500 rounded-lg p-3 flex items-center justify-center hover:bg-gray-100 ${uploading['newCert'] ? 'opacity-50 pointer-events-none' : ''}`}>
                              {uploading['newCert'] ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                              {uploading['newCert'] ? '업로드 중...' : (newCert.imageUrl ? '이미지 변경' : '이미지 업로드')}
                              <input type="file" accept="image/*" onChange={handleCertUpload} className="hidden" disabled={uploading['newCert']} />
                           </label>
                         </div>
                      </div>
                      <button type="submit" disabled={uploading['newCert']} className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 w-full md:w-auto disabled:opacity-50">
                         등록
                      </button>
                   </form>
                   {newCert.imageUrl && (
                      <div className="mt-4 w-32 h-40 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative">
                         <img src={newCert.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                         <button onClick={() => setNewCert({...newCert, imageUrl: ''})} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><X className="w-3 h-3"/></button>
                      </div>
                   )}
                </div>

                {/* List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-lg mb-6">등록된 인증서 목록 ({certifications.length})</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {certifications.map((cert) => (
                         <div key={cert.id} className="group relative bg-gray-50 rounded-xl p-3 border border-gray-200">
                            <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center relative">
                               <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-contain" />
                               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button onClick={() => deleteCertification(cert.id)} className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600">
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                            </div>
                            <p className="text-center text-sm font-medium truncate">{cert.title}</p>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'text' && (
             <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                {/* Hero Section Edit */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                   <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-3">
                      <div className="p-2 bg-blue-50 rounded text-brand-blue"><LayoutTemplate className="w-4 h-4" /></div>
                      <h3 className="font-bold">메인 페이지 - 히어로 섹션</h3>
                   </div>
                   
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">타이틀 접두어</label>
                      <input 
                        type="text" 
                        value={content['home_hero_title_prefix'] || ''}
                        onChange={(e) => updateContent('home_hero_title_prefix', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 mt-1"
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">강조 타이틀</label>
                      <input 
                        type="text" 
                        value={content['home_hero_title_highlight'] || ''}
                        onChange={(e) => updateContent('home_hero_title_highlight', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 mt-1"
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">설명 문구</label>
                      <textarea 
                        rows={3}
                        value={content['home_hero_desc'] || ''}
                        onChange={(e) => updateContent('home_hero_desc', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 mt-1 resize-none"
                      />
                   </div>
                </div>

                {/* Intro Page Edit */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                   <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-3">
                      <div className="p-2 bg-purple-50 rounded text-purple-600"><FileText className="w-4 h-4" /></div>
                      <h3 className="font-bold">회사소개 - 개요 페이지</h3>
                   </div>
                   
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">메인 타이틀 1</label>
                      <input 
                        type="text" 
                        value={content['intro_main_title_1'] || ''}
                        onChange={(e) => updateContent('intro_main_title_1', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 mt-1"
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">메인 타이틀 2 (강조)</label>
                      <input 
                        type="text" 
                        value={content['intro_main_title_2'] || ''}
                        onChange={(e) => updateContent('intro_main_title_2', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 mt-1"
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">소개글</label>
                      <textarea 
                        rows={5}
                        value={content['intro_desc'] || ''}
                        onChange={(e) => updateContent('intro_desc', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 mt-1 resize-none"
                      />
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'images' && (
             <div className="animate-fade-in space-y-8">
                {/* Section: Main */}
                <div>
                   <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 border-l-4 border-brand-blue pl-3">메인 화면 (Home)</h3>
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <ImageUploadBlock 
                         label="히어로 배경 이미지" 
                         contentKey="home_hero_bg" 
                         description="메인 화면 최상단에 노출되는 대형 배경입니다."
                      />
                   </div>
                </div>
                
                {/* Section: Company Intro */}
                <div>
                   <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 border-l-4 border-brand-blue pl-3">회사 개요 (Factory)</h3>
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <ImageUploadBlock 
                         label="공장 사진 1 (대구)" 
                         contentKey="intro_img_1" 
                         description="회사개요 페이지 좌측/상단에 위치하는 첫 번째 사진입니다."
                      />
                      <ImageUploadBlock 
                         label="공장 사진 2 (창녕)" 
                         contentKey="intro_img_2" 
                         description="회사개요 페이지 우측/하단에 위치하는 두 번째 사진입니다."
                      />
                   </div>
                </div>

                {/* Section: Philosophy */}
                <div>
                   <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 border-l-4 border-brand-blue pl-3">경영 이념</h3>
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <ImageUploadBlock 
                         label="경영이념 메인 이미지" 
                         contentKey="philosophy_img_main" 
                         description="경영이념 섹션 좌측에 위치한 세로형 이미지입니다."
                      />
                   </div>
                </div>
             </div>
          )}
       </div>
    </AdminLayout>
  );
}

// --- Post Manager Component ---
export const AdminPosts: React.FC = () => {
  const { posts, deletePost, addPost } = useSite();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', category: '공지사항', author: '관리자', status: 'Published' as const });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title) return;
    addPost(newPost);
    setIsModalOpen(false);
    setNewPost({ title: '', category: '공지사항', author: '관리자', status: 'Published' });
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
             <h2 className="text-xl font-bold text-gray-900">게시글 관리</h2>
             <p className="text-sm text-gray-500">사이트의 공지사항 및 뉴스를 관리합니다.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-900 transition-colors"
          >
            <Plus className="w-4 h-4" /> 게시글 작성
          </button>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">제목</th>
                <th className="px-6 py-4 font-medium">카테고리</th>
                <th className="px-6 py-4 font-medium">작성자</th>
                <th className="px-6 py-4 font-medium">날짜</th>
                <th className="px-6 py-4 font-medium">상태</th>
                <th className="px-6 py-4 font-medium">조회수</th>
                <th className="px-6 py-4 font-medium text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 block">{post.title}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{post.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{post.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">새 게시글 작성</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                  <input 
                    type="text" 
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2" 
                  />
               </div>
               <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                  <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-900">저장하기</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

// --- Settings Manager Component ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig, exportSiteData, importSiteData } = useSite();
  const [localConfig, setLocalConfig] = useState(config);
  const [autoRemoveBg, setAutoRemoveBg] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = () => {
    updateConfig(localConfig);
    alert('설정이 저장되었습니다.');
  };
  
  const handleExport = () => {
    exportSiteData();
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
         const json = event.target?.result as string;
         if (json) {
            const success = importSiteData(json);
            if (success) {
               alert('데이터 복원이 완료되었습니다. 페이지를 새로고침합니다.');
               window.location.reload();
            } else {
               alert('데이터 복원에 실패했습니다. 파일 형식을 확인해주세요.');
            }
         }
      };
      reader.readAsText(file);
    }
  };

  // Function to remove background based on top-left pixel color
  const removeImageBackground = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(imageSrc); return; }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Get background color from top-left pixel
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];
        const bgA = data[3];

        // If top-left is already transparent, assume it's good
        if (bgA === 0) { resolve(imageSrc); return; }

        const tolerance = 50; // Tolerance for color matching

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate distance from background color
          const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);

          if (diff < tolerance) {
            data[i + 3] = 0; // Make transparent
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(imageSrc);
      img.src = imageSrc;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
        let url = await uploadImageToStorage(file, 'branding/');
        
        // Process if auto remove is enabled
        // Note: Removing background requires Cross-Origin access which Firebase Storage provides if configured (CORS).
        // If not configured, this might fail or return original URL.
        // For simplicity, we only run removeImageBackground if we have a valid URL.
        if (autoRemoveBg) {
           try {
             url = await removeImageBackground(url);
           } catch (e) {
             console.warn("Could not remove background", e);
           }
        }
        
        setLocalConfig({ ...localConfig, logoUrl: url });
      } catch (e) {
        // Error already handled
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const clearLogo = () => {
    setLocalConfig({ ...localConfig, logoUrl: null });
  };

  return (
    <AdminLayout>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
           {/* Backup & Restore (New Feature for Cross-Device Support) */}
           <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 shadow-sm border border-indigo-100">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-indigo-100 rounded-lg"><RefreshCcw className="w-5 h-5 text-indigo-700" /></div>
                 <div>
                    <h3 className="text-lg font-bold text-gray-900">데이터 백업 및 복원 (Data Sync)</h3>
                    <p className="text-xs text-indigo-500">다른 PC나 모바일로 설정을 옮기려면 이 기능을 사용하세요.</p>
                 </div>
              </div>
              
              <div className="flex gap-4 items-center">
                 <button 
                   onClick={handleExport}
                   className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-indigo-200 text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
                 >
                    <Download className="w-4 h-4" /> 백업 데이터 내보내기
                 </button>
                 
                 <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 bg-indigo-600 border border-transparent text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    <Upload className="w-4 h-4" /> 백업 데이터 불러오기
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                 </label>
              </div>
           </div>

           {/* General Settings */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-blue-50 rounded-lg"><Globe className="w-5 h-5 text-brand-blue" /></div>
                 <h3 className="text-lg font-bold text-gray-900">기본 정보 & SEO</h3>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">사이트 이름</label>
                    <input 
                       type="text" 
                       value={localConfig.siteName}
                       onChange={(e) => setLocalConfig({...localConfig, siteName: e.target.value})}
                       className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-blue outline-none" 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">대표 이메일</label>
                    <input 
                       type="email" 
                       value={localConfig.contactEmail}
                       onChange={(e) => setLocalConfig({...localConfig, contactEmail: e.target.value})}
                       className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-blue outline-none" 
                    />
                 </div>
              </div>
           </div>

           {/* Design Settings */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-purple-50 rounded-lg"><Palette className="w-5 h-5 text-purple-600" /></div>
                 <h3 className="text-lg font-bold text-gray-900">디자인 커스터마이징</h3>
              </div>
              
              <div className="space-y-8">
                 {/* Border Radius Control */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                       <LayoutTemplate className="w-4 h-4" />
                       버튼 및 카드 스타일 (Border Radius)
                    </label>
                    <div className="grid grid-cols-4 gap-4">
                       {[
                         { label: 'Square', value: 'rounded-none' },
                         { label: 'Small', value: 'rounded-md' },
                         { label: 'Large', value: 'rounded-xl' },
                         { label: 'Round', value: 'rounded-full' }
                       ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setLocalConfig({...localConfig, borderRadius: opt.value as BorderRadiusSize})}
                            className={`py-3 px-2 border rounded-lg text-sm transition-all ${
                                localConfig.borderRadius === opt.value 
                                ? 'border-brand-blue bg-blue-50 text-brand-blue font-bold shadow-sm' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                             <div className={`w-8 h-8 bg-gray-200 mx-auto mb-2 ${opt.value === 'rounded-full' ? 'rounded-full' : opt.value}`}></div>
                             {opt.label}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Logo Upload Section */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">로고 이미지</label>
                    <div className="flex items-start gap-6">
                       <div className="w-32 h-16 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden relative group">
                          {isProcessing ? (
                             <div className="flex flex-col items-center">
                                <Loader2 className="w-6 h-6 animate-spin text-brand-blue mb-1" />
                                <span className="text-xs text-gray-500">처리중</span>
                             </div>
                          ) : localConfig.logoUrl ? (
                            <>
                              <img src={localConfig.logoUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                              <button 
                                onClick={clearLogo}
                                className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                       </div>
                       <div className="flex-1 space-y-3">
                          <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                             <Upload className="w-4 h-4" />
                             이미지 업로드
                             <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleImageUpload} className="hidden" disabled={isProcessing} />
                          </label>
                          
                          {/* Magic Background Remover Toggle */}
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => setAutoRemoveBg(!autoRemoveBg)}
                               className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                  autoRemoveBg 
                                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm' 
                                  : 'bg-gray-100 text-gray-500 border border-gray-200'
                               }`}
                             >
                                <Wand2 className="w-3.5 h-3.5" />
                                {autoRemoveBg ? '배경 자동 제거 ON' : '배경 자동 제거 OFF'}
                             </button>
                             <p className="text-xs text-gray-400">
                                {autoRemoveBg ? '업로드 시 배경색을 자동으로 투명하게 만듭니다.' : '배경 제거 기능을 사용하려면 클릭하세요.'}
                             </p>
                          </div>
                          
                          <p className="text-xs text-gray-400">
                             배경이 투명한 PNG 파일을 권장합니다.
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="border-t border-gray-100 my-4"></div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">브랜드 컬러</label>
                    <div className="flex items-center gap-4">
                       <input 
                          type="color" 
                          value={localConfig.primaryColor}
                          onChange={(e) => setLocalConfig({...localConfig, primaryColor: e.target.value})}
                          className="w-12 h-12 rounded-lg cursor-pointer border-0 p-1 bg-white shadow-sm"
                       />
                       <div className="flex-1">
                          <input 
                             type="text" 
                             value={localConfig.primaryColor}
                             onChange={(e) => setLocalConfig({...localConfig, primaryColor: e.target.value})}
                             className="w-full border border-gray-300 rounded-lg p-3 font-mono uppercase" 
                          />
                       </div>
                    </div>
                 </div>

                 {/* Preview Section */}
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 mb-3 uppercase">Style Preview</p>
                    <div className="flex gap-3">
                       <button className={`px-4 py-2 text-white text-sm font-medium shadow-sm transition-colors ${localConfig.borderRadius}`} style={{ backgroundColor: localConfig.primaryColor }}>Primary Button</button>
                       <button className={`px-4 py-2 border bg-white text-sm font-medium ${localConfig.borderRadius}`} style={{ color: localConfig.primaryColor, borderColor: localConfig.primaryColor }}>Secondary</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Save Actions */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-2">설정 저장</h3>
              <p className="text-sm text-gray-500 mb-6">변경사항을 사이트에 즉시 반영합니다.</p>
              
              <button 
                 onClick={handleSave}
                 className={`w-full py-3 bg-gray-900 text-white font-bold shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 ${localConfig.borderRadius}`}
              >
                 <Save className="w-4 h-4" /> 변경사항 저장
              </button>
              
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                 <a href="/" target="_blank" className="text-sm text-gray-500 hover:text-brand-blue hover:underline">
                    사이트 미리보기
                 </a>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};
