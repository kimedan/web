import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
          <div className="h-1 w-20 bg-brand-blue mt-8 rounded-full"></div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {children ? children : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                 <div className="w-2 h-2 bg-gray-300 rounded-full animate-ping"></div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">페이지 준비 중입니다</h3>
                <p className="text-gray-500">현재 컨텐츠를 업데이트하고 있습니다.<br/>더 나은 서비스로 찾아뵙겠습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;