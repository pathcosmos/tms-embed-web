import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car, User, Phone, ArrowRightLeft } from 'lucide-react';
import { vehicleFormSchema, type VehicleFormSchema } from '../utils/validation';

interface VehicleFormProps {
  onSubmit: (data: VehicleFormSchema) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormSchema>({
    resolver: zodResolver(vehicleFormSchema),
  });

  const currentPhone = watch('driverPhone') || '';

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');

    // 11자리까지만 허용
    const limitedNumbers = numbers.slice(0, 11);

    // 형식에 맞게 하이픈 추가
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 입력값에서 숫자만 추출하여 포맷팅
    const inputValue = e.target.value;
    const numbersOnly = inputValue.replace(/[^\d]/g, '');
    const formatted = formatPhoneNumber(numbersOnly);
    setValue('driverPhone', formatted);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">차량 입출차 관리</h1>
        <p className="text-gray-600">정보를 입력하고 QR코드를 생성하세요</p>
      </div>

      {/* 차량번호 입력 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Car className="inline w-4 h-4 mr-2" />
          차량번호
        </label>
        <input
          type="text"
          placeholder="예: 12가3456"
          className="form-input"
          {...register('vehicleNumber')}
        />
        {errors.vehicleNumber && (
          <p className="text-red-500 text-sm">{errors.vehicleNumber.message}</p>
        )}
      </div>

      {/* 기사 이름 입력 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <User className="inline w-4 h-4 mr-2" />
          기사 이름
        </label>
        <input
          type="text"
          placeholder="기사 이름을 입력하세요"
          className="form-input"
          {...register('driverName')}
        />
        {errors.driverName && (
          <p className="text-red-500 text-sm">{errors.driverName.message}</p>
        )}
      </div>

      {/* 기사 전화번호 입력 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Phone className="inline w-4 h-4 mr-2" />
          기사 전화번호
        </label>
        <input
          type="tel"
          placeholder="010-1234-5678"
          className="form-input"
          maxLength={13}
          value={currentPhone}
          onChange={handlePhoneChange}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        {errors.driverPhone && (
          <p className="text-red-500 text-sm">{errors.driverPhone.message}</p>
        )}
      </div>

      {/* 입차/출차 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <ArrowRightLeft className="inline w-4 h-4 mr-2" />
          입차/출차 구분
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="radio"
              value="entry"
              className="sr-only"
              {...register('entryExitType')}
            />
            <div className="text-center">
              <div className="text-2xl mb-1">🚗</div>
              <div className="font-medium">입차</div>
            </div>
          </label>
          <label className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="radio"
              value="exit"
              className="sr-only"
              {...register('entryExitType')}
            />
            <div className="text-center">
              <div className="text-2xl mb-1">🚙</div>
              <div className="font-medium">출차</div>
            </div>
          </label>
        </div>
        {errors.entryExitType && (
          <p className="text-red-500 text-sm">{errors.entryExitType.message}</p>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? '처리 중...' : 'QR코드 생성'}
      </button>
    </form>
  );
};

export default VehicleForm;
