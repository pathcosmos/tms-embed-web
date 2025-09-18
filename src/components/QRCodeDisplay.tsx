import React, { useEffect, useState } from 'react';
import { Sun, RotateCcw, Download } from 'lucide-react';
import type { QRCodeData } from '../types';

interface QRCodeDisplayProps {
  qrCodeData: QRCodeData;
  qrCodeImage: string;
  onBack: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCodeData, qrCodeImage, onBack }) => {
  const [showBrightnessAlert, setShowBrightnessAlert] = useState(true);

  useEffect(() => {
    // QR코드 표시 시 밝기 조절 안내 메시지 표시
    const timer = setTimeout(() => {
      setShowBrightnessAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = `qr_code_${qrCodeData.vehicleNumber}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            className="w-64 h-64"
          />
        </div>
        
        <div className="text-center text-base text-gray-600">
          <p>QR 코드를 스캔하여 입출차를 처리하세요</p>
          <p className="mt-1">QR 코드 ID: {qrCodeData.id}</p>
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
            <span className="font-medium">{qrCodeData.vehicleNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">기사:</span>
            <span className="font-medium">{qrCodeData.driverName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">전화번호:</span>
            <span className="font-medium">{qrCodeData.driverPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">구분:</span>
            <span className="font-medium">
              {qrCodeData.entryExitType === 'entry' ? '입차' : '출차'}
            </span>
          </div>
        </div>
        <div className="text-base text-gray-500">
          생성시간: {formatTimestamp(qrCodeData.timestamp)}
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
          onClick={onBack}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>처음으로 돌아가기</span>
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
