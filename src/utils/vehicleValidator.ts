/**
 * 대한민국 차량 번호판 정규식 검증 스크립트
 * 일반용, 상업용, 화물용, 특수용도 등 모든 형식 지원
 */

export class KoreaLicensePlateValidator {
  private useCodes: {
    general: string[];
    commercial: string[];
    freight: string[];
    special: string[];
  };
  private patterns: {
    new: RegExp;
    old: RegExp;
    eco: RegExp;
    diplomatic: RegExp;
    usfk: RegExp;
    temporary: RegExp;
  };
  private fullPattern: RegExp;

  constructor() {

    // 용도별 분류기호
    this.useCodes = {
      // 일반용 (승용차)
      general: ['가', '나', '다', '라', '마', '거', '너', '더', '러', '머', '버', '서', '어', '저', '고', '노', '도', '로', '모', '보', '소', '오', '조', '구', '누', '두', '루', '무', '부', '수', '우', '주', '하', '허', '호'],
      // 영업용 (택시, 버스 등)
      commercial: ['아', '바', '사', '자'],
      // 화물용
      freight: ['가', '나', '다', '라', '마', '거', '너', '더', '러', '머', '버', '서', '어', '저'],
      // 특수용도
      special: ['외', '영', '국', '합']
    };

    // 통합 정규식 패턴들
    this.patterns = {
      // 신형 번호판 (2006년~): 12가1234, 123가1234
      new: /^([가-힣]{2,3})\s*(\d{2,3})([가-힣])\s*(\d{4})$/,
      
      // 구형 번호판 (~2006년): 가12-3456
      old: /^([가-힣])\s*(\d{2})\s*-\s*(\d{4})$/,
      
      // 전기차/수소차 번호판 (2021년~): 12가1234 (파란색/초록색 번호판)
      eco: /^(\d{2,3})([가-힣])\s*(\d{4})$/,
      
      // 외교관/영사관 번호판: 외1234, 영1234
      diplomatic: /^(외|영|국|합)\s*(\d{3,4})$/,
      
      // 미군 번호판: K12345
      usfk: /^[K]\d{5}$/,
      
      // 임시번호판: 임시123가1234
      temporary: /^임시\s*(\d{2,3})([가-힣])\s*(\d{4})$/
    };

    // 통합 정규식
    this.fullPattern = new RegExp([
      this.patterns.new.source,
      this.patterns.old.source,
      this.patterns.eco.source,
      this.patterns.diplomatic.source,
      this.patterns.usfk.source,
      this.patterns.temporary.source
    ].join('|'));
  }

  /**
   * 번호판 형식 검증
   * @param {string} plateNumber - 검증할 번호판 문자열
   * @returns {Object} 검증 결과 객체
   */
  validate(plateNumber: string): {
    isValid: boolean;
    type?: string;
    format?: string;
    details?: any;
    error?: string;
  } {
    if (!plateNumber || typeof plateNumber !== 'string') {
      return {
        isValid: false,
        error: '번호판을 입력해주세요.'
      };
    }

    // 공백 정리
    const cleanPlate = plateNumber.trim().replace(/\s+/g, '');
    
    // 각 패턴별 검증
    const results: {
      isValid: boolean;
      type?: string;
      format?: string;
      details?: any;
      error?: string;
    } = {
      isValid: false,
    };

    // 신형 번호판 검증
    const newMatch = cleanPlate.match(this.patterns.new);
    if (newMatch) {
      const [, region, number, useCode, serialNumber] = newMatch;
      results.isValid = true;
      results.type = '신형';
      results.format = 'new';
      results.details = {
        region,
        number,
        useCode,
        serialNumber,
        vehicleType: this.getVehicleType(useCode)
      };
      return results;
    }

    // 구형 번호판 검증
    const oldMatch = cleanPlate.match(this.patterns.old);
    if (oldMatch) {
      const [, useCode, classNumber, serialNumber] = oldMatch;
      results.isValid = true;
      results.type = '구형';
      results.format = 'old';
      results.details = {
        useCode,
        classNumber,
        serialNumber,
        vehicleType: this.getVehicleType(useCode)
      };
      return results;
    }

    // 친환경차 번호판 검증
    const ecoMatch = cleanPlate.match(this.patterns.eco);
    if (ecoMatch) {
      const [, number, useCode, serialNumber] = ecoMatch;
      results.isValid = true;
      results.type = '친환경차';
      results.format = 'eco';
      results.details = {
        number,
        useCode,
        serialNumber,
        vehicleType: '전기차/수소차'
      };
      return results;
    }

    // 외교관/영사관 번호판 검증
    const diplomaticMatch = cleanPlate.match(this.patterns.diplomatic);
    if (diplomaticMatch) {
      const [, type, number] = diplomaticMatch;
      results.isValid = true;
      results.type = '외교관/영사관';
      results.format = 'diplomatic';
      results.details = {
        diplomaticType: type,
        number,
        vehicleType: this.getDiplomaticType(type)
      };
      return results;
    }

    // 미군 번호판 검증
    if (this.patterns.usfk.test(cleanPlate)) {
      results.isValid = true;
      results.type = '미군';
      results.format = 'usfk';
      results.details = {
        vehicleType: '미군 차량'
      };
      return results;
    }

    // 임시번호판 검증
    const tempMatch = cleanPlate.match(this.patterns.temporary);
    if (tempMatch) {
      const [, number, useCode, serialNumber] = tempMatch;
      results.isValid = true;
      results.type = '임시';
      results.format = 'temporary';
      results.details = {
        number,
        useCode,
        serialNumber,
        vehicleType: '임시 등록'
      };
      return results;
    }

    results.error = '유효하지 않은 번호판 형식입니다.';
    return results;
  }

  /**
   * 차량 종류 판별
   * @param {string} useCode - 용도 분류 기호
   * @returns {string} 차량 종류
   */
  private getVehicleType(useCode: string): string {
    if (this.useCodes.commercial.includes(useCode)) {
      return '영업용 (택시, 버스 등)';
    } else if (this.useCodes.freight.includes(useCode)) {
      return '화물용';
    } else if (this.useCodes.general.includes(useCode)) {
      return '일반용 (승용차)';
    } else if (this.useCodes.special.includes(useCode)) {
      return '특수용도';
    }
    return '기타';
  }

  /**
   * 외교관 차량 종류 판별
   * @param {string} type - 외교관 분류 기호
   * @returns {string} 외교관 차량 종류
   */
  private getDiplomaticType(type: string): string {
    const types: { [key: string]: string } = {
      '외': '외교관',
      '영': '영사관',
      '국': '국제기구',
      '합': '합참'
    };
    return types[type] || '기타';
  }

  /**
   * 통합 정규식으로 간단 검증
   * @param {string} plateNumber - 검증할 번호판
   * @returns {boolean} 유효성 여부
   */
  isValid(plateNumber: string): boolean {
    if (!plateNumber) return false;
    const cleanPlate = plateNumber.trim().replace(/\s+/g, '');
    return this.fullPattern.test(cleanPlate);
  }

  /**
   * 모든 패턴 반환
   * @returns {Object} 정규식 패턴들
   */
  getPatterns() {
    return this.patterns;
  }
}

// 싱글톤 인스턴스 생성
export const vehicleValidator = new KoreaLicensePlateValidator();
