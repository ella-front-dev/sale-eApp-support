import { useWatch, Control } from 'react-hook-form';

import { FormData } from '@/types/form';

export function useCodeDuplicationCheck(control: Control<FormData>) {
  const watchedData = useWatch({ control });

  // 모든 Group Code 수집
  const getAllGroupCodes = (): string[] => {
    const codes: string[] = [];
    if (!watchedData?.groups) {
return codes;
}

    watchedData.groups.forEach(group => {
      if (group.code) {
        codes.push(group.code);
      }
    });

    return codes;
  };

  // 모든 Component Code 수집
  const getAllComponentCodes = (): string[] => {
    const codes: string[] = [];
    if (!watchedData?.groups) {
return codes;
}

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
    if (!watchedData?.groups) {
return codes;
}

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

  // Component + SubAnswer 코드 수집 (서로 중복 체크용)
  const getComponentAndSubAnswerCodes = (): string[] => {
    return [...getAllComponentCodes(), ...getAllSubAnswerCodes()];
  };

  // 모든 코드 수집 (Group + Component + SubAnswer) - 전체 통계용
  const getAllCodes = (): string[] => {
    return [...getAllGroupCodes(), ...getAllComponentCodes(), ...getAllSubAnswerCodes()];
  };

  // Group Code 중복 체크 (Group끼리만)
  const checkGroupCodeDuplication = (
    currentCode: string,
    currentGroupIndex: number
  ): string | null => {
    if (!currentCode) {
return null;
}

    let duplicateCount = 0;

    // 다른 Group에서 같은 코드 사용하는지 확인
    watchedData?.groups?.forEach((group, gIndex) => {
      if (gIndex !== currentGroupIndex && group.code === currentCode) {
        duplicateCount++;
      }
    });

    return duplicateCount > 0 ? `그룹 코드 "${currentCode}"가 이미 사용 중입니다` : null;
  };

  // Component Code 중복 체크 (Component + SubAnswer와만)
  const checkComponentCodeDuplication = (
    currentCode: string,
    currentGroupIndex: number,
    currentComponentIndex: number
  ): string | null => {
    if (!currentCode) {
return null;
}

    let duplicateCount = 0;

    // 다른 Component에서 같은 코드 사용하는지 확인
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

    return duplicateCount > 0 ? `구성 코드 "${currentCode}"가 이미 사용 중입니다` : null;
  };

  // SubAnswer Code 중복 체크 (Component + SubAnswer와만)
  const checkSubAnswerCodeDuplication = (
    currentCode: string,
    currentGroupIndex: number,
    currentComponentIndex: number,
    currentAnswerIndex: number,
    currentSubAnswerIndex: number
  ): string | null => {
    if (!currentCode) {
return null;
}

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

    return duplicateCount > 0 ? `하위답변 코드 "${currentCode}"가 이미 사용 중입니다` : null;
  };

  // 전체 중복 체크 결과
  const getDuplicationReport = () => {
    const groupCodes = getAllGroupCodes();
    const componentAndSubAnswerCodes = getComponentAndSubAnswerCodes();
    
    // Group 코드 중복
    const groupDuplicates = groupCodes.filter((code, index) => 
      groupCodes.indexOf(code) !== index
    );
    
    // Component + SubAnswer 코드 중복
    const componentSubAnswerDuplicates = componentAndSubAnswerCodes.filter((code, index) => 
      componentAndSubAnswerCodes.indexOf(code) !== index
    );
    
    const allDuplicates = [...groupDuplicates, ...componentSubAnswerDuplicates];
    
    return {
      hasDuplicates: allDuplicates.length > 0,
      duplicateCodes: Array.from(new Set(allDuplicates)),
      groupDuplicates: Array.from(new Set(groupDuplicates)),
      componentSubAnswerDuplicates: Array.from(new Set(componentSubAnswerDuplicates)),
      totalCodes: getAllCodes().length,
      uniqueCodes: new Set(getAllCodes()).size,
      groupCodesCount: groupCodes.length,
      componentCodesCount: getAllComponentCodes().length,
      subAnswerCodesCount: getAllSubAnswerCodes().length
    };
  };

  return {
    checkGroupCodeDuplication,
    checkComponentCodeDuplication,
    checkSubAnswerCodeDuplication,
    getAllGroupCodes,
    getAllComponentCodes,
    getAllSubAnswerCodes,
    getComponentAndSubAnswerCodes,
    getAllCodes,
    getDuplicationReport
  };
}