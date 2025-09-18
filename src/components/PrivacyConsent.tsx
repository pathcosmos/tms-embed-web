import React, { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { privacyPolicy } from '../data/privacyPolicy';

interface PrivacyConsentProps {
  onConsent: (consented: boolean) => void;
  isConsented: boolean;
}

const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onConsent, isConsented }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <button
            type="button"
            onClick={() => onConsent(!isConsented)}
            className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
              isConsented
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            {isConsented && <Check className="w-4 h-4" />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{privacyPolicy.title}</h3>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isExpanded ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {isExpanded && (
              <div className="mt-3 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {privacyPolicy.content}
              </div>
            )}
            
            <p className="mt-2 text-sm text-gray-500">
              {isConsented ? '개인정보 수집 및 활용에 동의하셨습니다.' : '개인정보 수집 및 활용에 동의해주세요.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyConsent;
