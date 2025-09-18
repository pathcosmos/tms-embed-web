import React, { useState } from 'react';
import { vehicleValidator } from '../utils/vehicleValidator';
import { Car, CheckCircle, XCircle, Info } from 'lucide-react';

const VehicleValidatorDemo: React.FC = () => {
  const [testInput, setTestInput] = useState('');
  const [result, setResult] = useState<any>(null);

  const testCases = [
    '서울12가3456',    // 신형 일반
    '부산123나4567',   // 신형 일반 (3자리)
    '경기12아1234',    // 신형 영업용
    '인천12바5678',    // 신형 영업용
    '대전12거9012',    // 신형 화물
    '가12-3456',       // 구형
    '12가1234',        // 친환경차
    '123나5678',       // 친환경차 (3자리)
    '외1234',          // 외교관
    '영123',           // 영사관
    'K12345',          // 미군
    '임시12가1234',    // 임시
    '잘못된번호판',    // 잘못된 형식
  ];

  const handleTest = (plateNumber: string) => {
    setTestInput(plateNumber);
    const validation = vehicleValidator.validate(plateNumber);
    setResult(validation);
  };

  const handleCustomTest = () => {
    if (testInput.trim()) {
      const validation = vehicleValidator.validate(testInput);
      setResult(validation);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">차량번호 검증 데모</h1>
        <p className="text-gray-600">다양한 차량번호 형식을 테스트해보세요</p>
      </div>

      {/* 커스텀 테스트 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-900 mb-3">직접 테스트</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="차량번호를 입력하세요"
            className="flex-1 form-input"
          />
          <button
            onClick={handleCustomTest}
            className="btn-primary px-6"
          >
            테스트
          </button>
        </div>
      </div>

      {/* 결과 표시 */}
      {result && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-900 mb-3">검증 결과</h3>
          <div className="flex items-center space-x-2 mb-3">
            {result.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className={`font-medium ${result.isValid ? 'text-green-700' : 'text-red-700'}`}>
              {result.isValid ? '유효한 차량번호' : '유효하지 않은 차량번호'}
            </span>
          </div>
          
          {result.isValid && result.details && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">상세 정보:</p>
                  <p>• 타입: {result.type}</p>
                  {result.details.vehicleType && (
                    <p>• 용도: {result.details.vehicleType}</p>
                  )}
                  {result.details.region && (
                    <p>• 지역: {result.details.region}</p>
                  )}
                  {result.details.diplomaticType && (
                    <p>• 외교관 타입: {result.details.diplomaticType}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {result.error && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-red-800 text-sm">{result.error}</p>
            </div>
          )}
        </div>
      )}

      {/* 테스트 케이스 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-900 mb-3">테스트 케이스</h3>
        <div className="grid grid-cols-2 gap-2">
          {testCases.map((testCase, index) => (
            <button
              key={index}
              onClick={() => handleTest(testCase)}
              className="text-left p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-gray-500" />
                <span className="font-mono">{testCase}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleValidatorDemo;
