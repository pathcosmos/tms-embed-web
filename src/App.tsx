import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Car, User, Phone, ArrowRightLeft, Eye, EyeOff, Check, Sun, RotateCcw, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { vehicleValidator } from './utils/vehicleValidator';

// 타입 정의
interface VehicleFormData {
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  entryExitType: 'entry' | 'exit';
  privacyConsent: boolean;
}

interface QRCodeData {
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  entryExitType: 'entry' | 'exit';
  timestamp: string;
  id: string;
}

// 검증 스키마
const vehicleFormSchema = {
  vehicleNumber: (value: string) => {
    if (!value) return '차량번호를 입력해주세요';
    
    const validation = vehicleValidator.validate(value);
    if (!validation.isValid) {
      return validation.error || '올바른 차량번호 형식을 입력해주세요';
    }
    return true;
  },
  driverName: (value: string) => {
    if (!value) return '기사 이름을 입력해주세요';
    if (value.length < 2) return '기사 이름을 2자 이상 입력해주세요';
    if (value.length > 20) return '기사 이름은 20자 이하로 입력해주세요';
    return true;
  },
  driverPhone: (value: string) => {
    if (!value) return '기사 전화번호를 입력해주세요';
    // 숫자만 추출하여 11자리인지 확인
    const numbers = value.replace(/\D/g, '');
    if (numbers.length !== 11 || !numbers.startsWith('010')) {
      return '올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)';
    }
    return true;
  },
  entryExitType: (value: string) => {
    if (!value) return '입차/출차를 선택해주세요';
    return true;
  },
  privacyConsent: (value: boolean) => {
    if (!value) return '개인정보 수집 및 활용에 동의해주세요';
    return true;
  }
};

// 개인정보 약관
const privacyPolicy = {
  title: '개인정보 수집 및 활용 동의',
  content: `동국R&S㈜ 개인정보처리방침

동국R&S㈜(이하 "회사")는 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리 방침을 두고 있습니다.

1. 처리하는 개인정보의 항목 및 수집방법

회사는 적법하고 공정한 수단에 의하여 서비스 제공에 직접적으로 필요한 최소한의 정보만을 수집하고 있습니다.

수집항목: 기사 이름, 기사 전화번호, 차량번호, 입출차 구분 및 시간, QR 코드 생성 및 스캔 기록

수집방법: 차량 입출차 관리 시스템 이용 시 작성

2. 개인정보의 처리 목적

회사는 개인정보를 다음의 목적을 위해 처리합니다.
- 차량 입출차 관리 및 기록
- 운전자 신원 확인 및 연락
- 출입 통제 및 보안 관리
- 상담 및 문의 사항 확인 및 답변, 처리결과 통보 등의 목적

3. 개인정보의 처리 및 보유기간

원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.

4. 개인정보의 제3자 제공

회사는 이용자의 개인정보를 개인정보의 수집 및 이용에서 고지한 범위 내에서 사용하며, 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
- 이용자들이 사전에 동의한 경우
- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

5. 개인정보처리의 위탁

회사는 원활하고 향상된 서비스를 위해 개인정보 처리를 타인에게 위탁 운영하고 있습니다.

6. 개인정보의 파기 절차 및 방법

회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다.

가. 파기절차
개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당 정보를 지체 없이 파기합니다.

나. 파기방법
전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 완전 삭제합니다.

7. 정보주체의 권리의무 및 그 행사방법

정보주체는 언제든지 등록되어 있는 본인의 개인정보를 열람하거나 정정할 수 있으며, 정보 삭제 및 처리 정지를 요청하실 수 있습니다.

8. 개인정보보호를 위한 개인정보의 안전성 확보 조치

회사는 개인정보의 안전성 확보를 위해 관리적/기술적 및 물리적 조치를 하고 있습니다.

9. 개인정보보호 책임자 및 실무자의 연락처

개인정보 보호책임자: 전준홍 차장 (총무팀)
전화번호: 051-550-5013

기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
- 개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)
- 대검찰청 인터넷범죄수사센터 (www.spo.go.kr / 국번없이 1301)
- 경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)

본 개인정보 수집 및 활용에 동의하시겠습니까?`
};

type AppState = 'form' | 'privacy' | 'qr';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('form');
  const [formData, setFormData] = useState<VehicleFormData | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyContent, setShowPrivacyContent] = useState(false);
  const [showBrightnessAlert, setShowBrightnessAlert] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<VehicleFormData>();

  const handleFormSubmit = (data: VehicleFormData, selectedType: string) => {
    // 입차/출차 선택 검증
    if (!selectedType) {
      alert('입차/출차를 선택해주세요');
      return;
    }
    
    // 폼 데이터와 선택된 타입 결합
    const formattedData = {
      vehicleNumber: data.vehicleNumber,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
      entryExitType: selectedType as 'entry' | 'exit',
      privacyConsent: data.privacyConsent
    };
    setFormData(formattedData);
    setCurrentState('privacy');
  };

  const handlePrivacyConsent = (consented: boolean) => {
    setPrivacyConsent(consented);
    
    if (consented && formData) {
      generateQRCodeData();
    }
  };

  const generateQRCodeData = async () => {
    if (!formData) return;

    setIsLoading(true);

    try {
      // 전화번호에서 하이폰 제거
      const cleanPhoneNumber = formData.driverPhone.replace(/-/g, '');
      
      // QR 코드용 JSON 데이터 생성
      const qrJsonData = {
        carNo: formData.vehicleNumber,
        type: 'userInput',
        userNm: formData.driverName,
        phoneNo: cleanPhoneNumber,
        gubun: formData.entryExitType === 'entry' ? 'in' : 'out'
      };

      // 기존 QRCodeData (화면 표시용) - 하이폰 유지
      const qrData: QRCodeData = {
        vehicleNumber: formData.vehicleNumber,
        driverName: formData.driverName,
        driverPhone: formData.driverPhone,
        entryExitType: formData.entryExitType,
        timestamp: new Date().toISOString(),
        id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // JSON 형태로 QR 코드 생성
      const qrImage = await QRCode.toDataURL(JSON.stringify(qrJsonData), {
        width: 150,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });
      
      setQrCodeData(qrData);
      setQrCodeImage(qrImage);
      setCurrentState('qr');
    } catch (error) {
      console.error('QR 코드 생성 실패:', error);
      alert('QR 코드 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setCurrentState('form');
    setFormData(null);
    setPrivacyConsent(false);
    setQrCodeData(null);
    setQrCodeImage('');
  };

  const handleDownload = () => {
    if (!qrCodeImage) return;
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = `qr_code_${qrCodeData?.vehicleNumber}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // 폼 컴포넌트
  const VehicleFormComponent = () => {
    const [selectedType, setSelectedType] = useState<'entry' | 'exit' | ''>('');
    
    const onSubmit = (data: VehicleFormData) => {
      handleFormSubmit(data, selectedType);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">차량 입출차 관리</h1>
        <p className="text-lg text-gray-600">정보를 입력하고 QR코드를 생성하세요</p>
      </div>

      {/* 차량번호 입력 */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">
          <Car className="inline w-5 h-5 mr-2" />
          차량번호
        </label>
        <input
          type="text"
          placeholder="예: 서울12가3456, 12가3456, 가12-3456"
          className="form-input"
          {...register('vehicleNumber', { validate: vehicleFormSchema.vehicleNumber })}
        />
        {errors.vehicleNumber && (
          <p className="text-red-500 text-base">{errors.vehicleNumber.message}</p>
        )}
        
      </div>

      {/* 기사 이름 입력 */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">
          <User className="inline w-5 h-5 mr-2" />
          기사 이름
        </label>
        <input
          type="text"
          placeholder="기사 이름을 입력하세요"
          className="form-input"
          {...register('driverName', { validate: vehicleFormSchema.driverName })}
        />
        {errors.driverName && (
          <p className="text-red-500 text-base">{errors.driverName.message}</p>
        )}
      </div>

      {/* 기사 전화번호 입력 */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">
          <Phone className="inline w-5 h-5 mr-2" />
          기사 전화번호
        </label>
        <input
          type="tel"
          placeholder="010-1234-5678"
          className="form-input"
          {...register('driverPhone', { 
            validate: vehicleFormSchema.driverPhone,
            onChange: (e) => {
              const value = e.target.value;
              const numbers = value.replace(/\D/g, '');
              
              // 11자리가 되면 포맷팅 적용
              if (numbers.length === 11) {
                const formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
                e.target.value = formatted;
              }
            }
          })}
          onKeyDown={(e) => {
            // 숫자(0-9), 백스페이스, 삭제, 탭, 화살표 키만 허용
            const allowedKeys = [
              'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
              'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
              'Home', 'End'
            ];
            
            const isNumber = e.key >= '0' && e.key <= '9';
            const isAllowedKey = allowedKeys.includes(e.key);
            
            if (!isNumber && !isAllowedKey) {
              e.preventDefault();
            }
          }}
          onBlur={(e) => {
            const value = e.target.value;
            const numbers = value.replace(/\D/g, '');
            
            // 11자리가 되면 포맷팅 적용
            if (numbers.length === 11) {
              const formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
              e.target.value = formatted;
            }
          }}
        />
        {errors.driverPhone && (
          <p className="text-red-500 text-base">{errors.driverPhone.message}</p>
        )}
      </div>

      {/* 입차/출차 선택 */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">
          <ArrowRightLeft className="inline w-5 h-5 mr-2" />
          입차/출차 구분
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedType === 'entry' 
              ? 'border-blue-500 bg-blue-100' 
              : 'border-gray-200 bg-blue-50 hover:border-blue-500 hover:bg-blue-100'
          }`}>
            <input
              type="radio"
              value="entry"
              className="sr-only"
              checked={selectedType === 'entry'}
              onChange={() => setSelectedType('entry')}
            />
            <div className="text-center">
              <div className="text-3xl mb-1">🚗</div>
              <div className="font-medium text-lg text-blue-800">입차</div>
            </div>
          </label>
          <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedType === 'exit' 
              ? 'border-red-500 bg-red-100' 
              : 'border-gray-200 bg-red-50 hover:border-red-500 hover:bg-red-100'
          }`}>
            <input
              type="radio"
              value="exit"
              className="sr-only"
              checked={selectedType === 'exit'}
              onChange={() => setSelectedType('exit')}
            />
            <div className="text-center">
              <div className="text-3xl mb-1">🚙</div>
              <div className="font-medium text-lg text-red-800">출차</div>
            </div>
          </label>
        </div>
        {errors.entryExitType && (
          <p className="text-red-500 text-base">{errors.entryExitType.message}</p>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        className="btn-primary"
      >
        QR코드 생성
      </button>
      </form>
    );
  };

  // 개인정보 동의 컴포넌트
  const PrivacyConsentComponent = () => (
    <div className="p-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <button
            type="button"
            onClick={() => handlePrivacyConsent(!privacyConsent)}
            className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
              privacyConsent
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            {privacyConsent && <Check className="w-4 h-4" />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{privacyPolicy.title}</h3>
              <button
                type="button"
                onClick={() => setShowPrivacyContent(!showPrivacyContent)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showPrivacyContent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {showPrivacyContent && (
              <div className="mt-3 text-base text-gray-600 whitespace-pre-line leading-relaxed">
                {privacyPolicy.content}
              </div>
            )}
            
            <p className="mt-2 text-base text-gray-500">
              {privacyConsent ? '개인정보 수집 및 활용에 동의하셨습니다.' : '개인정보 수집 및 활용에 동의해주세요.'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-0 pb-6 pt-4">
        <button
          onClick={handleBackToForm}
          className="btn-secondary mb-3"
        >
          이전으로
        </button>
        <button
          onClick={generateQRCodeData}
          disabled={!privacyConsent || isLoading}
          className="btn-primary"
        >
          {isLoading ? 'QR 코드 생성 중...' : 'QR 코드 생성'}
        </button>
      </div>
    </div>
  );

  // QR 코드 표시 컴포넌트
  const QRCodeDisplayComponent = () => {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setShowBrightnessAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }, []);

    const formatTimestamp = (timestamp: string) => {
      return new Date(timestamp).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return (
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QR 코드</h1>
          <p className="text-lg text-gray-600">QR 코드를 스캔하여 입출차를 처리하세요</p>
        </div>

        {/* QR 코드 - 맨 위로 이동 */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src={qrCodeImage}
              alt="QR Code"
              className="w-32 h-32"
            />
          </div>
          
          <div className="text-center text-base text-gray-600">
            <p>QR 코드를 스캔하여 입출차를 처리하세요</p>
          </div>
        </div>

        {/* 밝기 조절 안내 */}
        {showBrightnessAlert && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800 font-medium text-lg">QR 코드 스캔을 위해 화면 밝기를 최대한 높여주세요</p>
            </div>
          </div>
        )}

        {/* 차량 정보 */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-medium text-gray-900">차량 정보</h3>
          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <span className="text-gray-600">차량번호:</span>
              <span className="font-medium">{qrCodeData?.vehicleNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">기사:</span>
              <span className="font-medium">{qrCodeData?.driverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">전화번호:</span>
              <span className="font-medium">{qrCodeData?.driverPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">구분:</span>
              <span className="font-medium">
                {qrCodeData?.entryExitType === 'entry' ? '입차' : '출차'}
              </span>
            </div>
          </div>
          
          
          <div className="text-base text-gray-500">
            생성시간: {qrCodeData && formatTimestamp(qrCodeData.timestamp)}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>QR 코드 저장</span>
          </button>
          
          <button
            onClick={handleBackToForm}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>새로 만들기</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mobile-container">
      {currentState === 'form' && <VehicleFormComponent />}
      {currentState === 'privacy' && <PrivacyConsentComponent />}
      {currentState === 'qr' && qrCodeData && <QRCodeDisplayComponent />}
    </div>
  );
}

export default App;
