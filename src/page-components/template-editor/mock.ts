"use client";

import { NodeItem, NodeType } from "./types";

// 클라이언트 전용 ID 생성
let idCounter = 1;
const mkId = () => `node_${idCounter++}_${Date.now()}`;

export interface MockConfig {
  forms?: number;
  groupsPerForm?: number;
  configsPerGroup?: number;
  answersPerConfig?: number;
  subAnswersPerAnswer?: number;
}

const DEFAULT_MOCK: Required<MockConfig> = {
  forms: 2,
  groupsPerForm: 3,
  configsPerGroup: 4,
  answersPerConfig: 3,
  subAnswersPerAnswer: 2,
};

export function buildMockTree(cfg: MockConfig = {}): NodeItem[] {
  const {
    forms,
    groupsPerForm,
    configsPerGroup,
    answersPerConfig,
    subAnswersPerAnswer,
  } = { ...DEFAULT_MOCK, ...cfg };

  const nodes: NodeItem[] = [];

  // Root FORM nodes (서식폼)
  const formNodes: NodeItem[] = Array.from({ length: forms }).map((_, fi) => ({
    id: mkId(),
    parentId: null,
    title: fi === 0 ? "📋 고객 설문 서식폼" : `📋 서식폼 ${fi + 1}`,
    type: "FORM" as NodeType,
    description: `${fi + 1}번째 서식 폼입니다`,
    status: "ACTIVE",
    order: fi + 1,
  }));
  nodes.push(...formNodes);

  formNodes.forEach((form) => {
    // GROUPs under each FORM (그룹)
    const groups: NodeItem[] = Array.from({ length: groupsPerForm }).map((_, gi) => ({
      id: mkId(),
      parentId: form.id,
      title: `📁 그룹 ${gi + 1}`,
      type: "GROUP" as NodeType,
      description: `${form.title}의 ${gi + 1}번째 그룹`,
      status: "ACTIVE",
      order: gi + 1,
    }));
    nodes.push(...groups);

    groups.forEach((group) => {
      // CONFIGs under each GROUP (구성)
      const configs: NodeItem[] = Array.from({ length: configsPerGroup }).map((_, ci) => ({
        id: mkId(),
        parentId: group.id,
        title: `⚙️ 구성 ${ci + 1}`,
        type: "CONFIG" as NodeType,
        description: `${group.title}의 ${ci + 1}번째 구성 항목`,
        isRequired: ci % 2 === 0,
        options: ci % 2 === 0 ? ["옵션A", "옵션B", "옵션C"] : undefined,
        status: ci % 3 === 0 ? "INACTIVE" : "ACTIVE",
        order: ci + 1,
      }));
      nodes.push(...configs);

      configs.forEach((config) => {
        // ANSWERs under each CONFIG (대답)
        const answers: NodeItem[] = Array.from({ length: answersPerConfig }).map((_, ai) => ({
          id: mkId(),
          parentId: config.id,
          title: `💬 대답 ${ai + 1}`,
          type: "ANSWER" as NodeType,
          description: `${config.title}에 대한 ${ai + 1}번째 답변`,
          isRequired: ai % 2 === 0,
          status: "ACTIVE",
          order: ai + 1,
        }));
        nodes.push(...answers);

        answers.forEach((ans) => {
          // Sub-Answers (하위대답) - 명확히 SUB_ANSWER 타입 사용
          if (subAnswersPerAnswer > 0) {
            const subs: NodeItem[] = Array.from({ length: subAnswersPerAnswer }).map((_, si) => ({
              id: mkId(),
              parentId: ans.id,
              title: `  ↳ 하위대답 ${si + 1}`,
              type: "SUB_ANSWER" as NodeType,
              description: `${ans.title}의 ${si + 1}번째 하위 답변`,
              status: "ACTIVE",
              order: si + 1,
            }));
            nodes.push(...subs);
          }
        });
      });
    });
  });

  return nodes;
}

export function getRootNodes(all: NodeItem[]): NodeItem[] {
  return all.filter((n) => n.parentId === null).sort(byOrderThenTitle);
}

export function getChildren(all: NodeItem[], parentId: string): NodeItem[] {
  return all.filter((n) => n.parentId === parentId).sort(byOrderThenTitle);
}

export function findNodeById(all: NodeItem[], id?: string | null): NodeItem | undefined {
  if (!id) {
return undefined;
}

  return all.find((n) => n.id === id);
}

function byOrderThenTitle(a: NodeItem, b: NodeItem): number {
  const ao = a.order ?? 0;
  const bo = b.order ?? 0;
  if (ao !== bo) {
return ao - bo;
}

  return a.title.localeCompare(b.title);
}
