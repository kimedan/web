
import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from './Button';
import { useSite } from '../contexts/SiteContext';

interface FormData {
  company: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  message: string;
  agreement: boolean;
}

const ContactForm: React.FC = () => {
  const { t } = useSite();
  const [formData, setFormData] = useState<FormData>({
    company: '',
    name: '',
    phone: '',
    email: '',
    type: '견적문의',
    message: '',
    agreement: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, agreement: e.target.checked }));
    if (errors.agreement) setErrors(prev => ({ ...prev, agreement: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.company) newErrors.company = '회사명을 입력해주세요.';
    if (!formData.name) newErrors.name = '담당자 성함을 입력해주세요.';
    if (!formData.phone) newErrors.phone = '연락처를 입력해주세요.';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = '유효한 이메일을 입력해주세요.';
    if (!formData.message) newErrors.message = '문의 내용을 입력해주세요.';
    if (!formData.agreement) newErrors.agreement = '개인정보 수집 및 이용에 동의해주세요.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    try {
      const response = await fetch("https://formspree.io/f/mykjkgnj", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({
            company: '',
            name: '',
            phone: '',
            email: '',
            type: '견적문의',
            message: '',
            agreement: false
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.contact.form.success_title}</h3>
        <p className="text-gray-500 mb-8 leading-relaxed whitespace-pre-line">
          {t.contact.form.success_desc}
        </p>
        <Button onClick={() => setStatus('idle')} variant="outline" className="rounded-full">
          {t.contact.form.retry}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900">{t.contact.form.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{t.contact.form.subtitle}</p>
        </div>

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">{t.contact.form.labels.company} <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder={t.contact.form.placeholders.company}
              className={`w-full p-4 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 ${errors.company ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-brand-blue/20 focus:border-brand-blue'}`}
            />
            {errors.company && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.company}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">{t.contact.form.labels.name} <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t.contact.form.placeholders.name}
              className={`w-full p-4 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-brand-blue/20 focus:border-brand-blue'}`}
            />
            {errors.name && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">{t.contact.form.labels.phone} <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t.contact.form.placeholders.phone}
              className={`w-full p-4 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-brand-blue/20 focus:border-brand-blue'}`}
            />
            {errors.phone && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">{t.contact.form.labels.email} <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t.contact.form.placeholders.email}
              className={`w-full p-4 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-brand-blue/20 focus:border-brand-blue'}`}
            />
            {errors.email && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700 ml-1">{t.contact.form.labels.type}</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue appearance-none"
          >
            <option value="견적문의">{t.contact.form.options.inquiry}</option>
            <option value="기술상담">{t.contact.form.options.tech}</option>
            <option value="채용문의">{t.contact.form.options.recruit}</option>
            <option value="기타">{t.contact.form.options.etc}</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700 ml-1">{t.contact.form.labels.message} <span className="text-red-500">*</span></label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder={t.contact.form.placeholders.message}
            className={`w-full p-4 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 resize-none ${errors.message ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-brand-blue/20 focus:border-brand-blue'}`}
          />
          {errors.message && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.message}</p>}
        </div>

        {/* Agreement */}
        <div className="pt-2">
           <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  name="agreement"
                  checked={formData.agreement}
                  onChange={handleCheckboxChange}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-brand-blue checked:bg-brand-blue"
                />
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <span className={`text-sm ${errors.agreement ? 'text-red-500' : 'text-gray-500 group-hover:text-gray-700'}`}>
                {t.contact.form.labels.agreement}
              </span>
           </label>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            fullWidth 
            disabled={status === 'submitting'}
            className="rounded-xl h-14 text-lg font-bold shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20"
          >
            {status === 'submitting' ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> {t.contact.form.submitting}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {t.contact.form.submit} <Send className="w-5 h-5" />
              </span>
            )}
          </Button>
          {status === 'error' && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center flex items-center justify-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {t.contact.form.error}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
