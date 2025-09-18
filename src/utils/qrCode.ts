import QRCode from 'qrcode';
import type { QRCodeData } from '../types';

export const generateQRCode = async (data: QRCodeData): Promise<string> => {
  try {
    const qrData = JSON.stringify(data);
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR 코드 생성 중 오류 발생:', error);
    throw new Error('QR 코드 생성에 실패했습니다.');
  }
};

export const generateQRCodeId = (): string => {
  return `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
