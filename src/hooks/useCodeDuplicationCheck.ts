import { useWatch, Control } from 'react-hook-form';
import { FormData } from '@/types/form';

export function useCodeDuplicationCheck(control: Control<FormData>) {
  const watchedData = useWatch({ control });

  // 모든 Component Code 수집
  const getAllComponentCodes = (): string[] => {
    const codes: string[] = [];
    if (!watchedData?.groups) return codes;

    watchedData.groups.forEach(group => {
      group.components?.forEach(component => {
        if (component.code) {
          codes.push(component.code);
        }
      });
    });

    return codes;
  };

  // 모든 SubAnswer Code 수집
  const getAllSubAnswerCodes = (): string[] => {
    const codes: string[] = [];
    if (!watchedData?.groups) return codes;

    watchedData.groups.forEach(group => {
      group.components?.forEach(component => {
        component.answers?.forEach(answer => {
          answer.subAnswers?.forEach(subAnswer => {
            if (subAnswer.code) {
              codes.push(subAnswer.code);
            }
          });
        });
      });
    });

    return codes;
  };

  // 모든 코드 수집 (Component + SubAnswer)
  const getAllCodes = (): string[] => {
    return [...getAllComponentCodes(), ...getAllSubAnswerCodes()];
  };

  // Component Code 중복 체크
  const checkComponentCodeDuplication = (
    currentCode: string,
    currentGroupIndex: number,
    currentComponentIndex: number
  ): string | null => {
    if (!currentCode) return null;

    const allCodes = getAllCodes();
    let duplicateCount = 0;

    // 현재 위치가 아닌 다른 곳에서 같은 코드가 사용되는지 확인
    watchedData?.groups?.forEach((group, gIndex) => {
      group.components?.forEach((component, cIndex) => {
        // 현재 위치가 아니고 같은 코드인 경우
        if (!(gIndex === currentGroupIndex && cIndex === currentComponentIndex) && 
            component.code === currentCode) {
          duplicateCount++;
        }
      });

      // SubAnswer에서도 같은 코드 사용하는지 확인
      group.components?.forEach(component => {
        component.answers?.forEach(answer => {
          answer.subAnswers?.forEach(subAnswer => {
            if (subAnswer.code === currentCode) {
              duplicateCount++;
            }
          });
        });
      });
    });

    return duplicateCount > 0 ? `코드 "${currentCode}"가 이미 사용 중입니다` : null;
  };

  // SubAnswer Code 중복 체크
  const checkSubAnswerCodeDuplication = (
    currentCode: string,
    currentGroupIndex: number,
    currentComponentIndex: number,
    currentAnswerIndex: number,
    currentSubAnswerIndex: number
  ): string | null => {
    if (!currentCode) return null;

    let duplicateCount = 0;

    // Component Code에서 같은 코드 사용하는지 확인
    watchedData?.groups?.forEach(group => {
      group.components?.forEach(component => {
        if (component.code === currentCode) {
          duplicateCount++;
        }
      });
    });

    // 다른 SubAnswer에서 같은 코드 사용하는지 확인
    watchedData?.groups?.forEach((group, gIndex) => {
      group.components?.forEach((component, cIndex) => {
        component.answers?.forEach((answer, aIndex) => {
          answer.subAnswers?.forEach((subAnswer, sIndex) => {
            // 현재 위치가 아니고 같은 코드인 경우
            if (!(gIndex === currentGroupIndex && 
                  cIndex === currentComponentIndex && 
                  aIndex === currentAnswerIndex && 
                  sIndex === currentSubAnswerIndex) && 
                subAnswer.code === currentCode) {
              duplicateCount++;
            }
          });
        });
      });
    });

    return duplicateCount > 0 ? `코드 "${currentCode}"가 이미 사용 중입니다` : null;
  };

  // 전체 중복 체크 결과
  const getDuplicationReport = () => {
    const allCodes = getAllCodes();
    const duplicates = allCodes.filter((code, index) => 
      allCodes.indexOf(code) !== index
    );
    
    return {
      hasDuplicates: duplicates.length > 0,
      duplicateCodes: [...new Set(duplicates)],
      totalCodes: allCodes.length,
      uniqueCodes: new Set(allCodes).size
    };
  };

  return {
    checkComponentCodeDuplication,
    checkSubAnswerCodeDuplication,
    getAllComponentCodes,
    getAllSubAnswerCodes,
    getAllCodes,
    getDuplicationReport
  };
}