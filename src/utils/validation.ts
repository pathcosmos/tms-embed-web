import { z } from 'zod';

export const vehicleFormSchema = z.object({
  vehicleNumber: z
    .string()
    .min(1, '차량번호를 입력해주세요')
    .regex(/^[0-9가-힣]{2,3}[0-9]{2}[가-힣][0-9]{4}$/, '올바른 차량번호 형식을 입력해주세요 (예: 12가3456)'),
  driverName: z
    .string()
    .min(2, '기사 이름을 2자 이상 입력해주세요')
    .max(20, '기사 이름은 20자 이하로 입력해주세요'),
  driverPhone: z
    .string()
    .min(1, '기사 전화번호를 입력해주세요')
    .regex(/^010-\d{4}-\d{4}$/, '올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)'),
  entryExitType: z.enum(['entry', 'exit'], {
    message: '입차/출차를 선택해주세요',
  }),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: '개인정보 수집 및 활용에 동의해주세요',
  }),
});

export type VehicleFormSchema = z.infer<typeof vehicleFormSchema>;
