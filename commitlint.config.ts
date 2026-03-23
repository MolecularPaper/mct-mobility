import {
  RuleConfigCondition,
  RuleConfigSeverity,
  TargetCaseType,
} from "@commitlint/types";

export default {
  parserPreset: "conventional-changelog-conventionalcommits",
  rules: {
    "body-leading-blank": [RuleConfigSeverity.Warning, "always"] as const,
    "body-max-line-length": [RuleConfigSeverity.Error, "always", 100] as const,
    "footer-leading-blank": [RuleConfigSeverity.Warning, "always"] as const,
    "footer-max-line-length": [
      RuleConfigSeverity.Error,
      "always",
      100,
    ] as const,
    "header-max-length": [RuleConfigSeverity.Error, "always", 100] as const,
    "header-trim": [RuleConfigSeverity.Error, "always"] as const,
    "subject-case": [
      RuleConfigSeverity.Error,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ] as [RuleConfigSeverity, RuleConfigCondition, TargetCaseType[]],
    "subject-empty": [RuleConfigSeverity.Error, "never"] as const,
    "subject-full-stop": [RuleConfigSeverity.Error, "never", "."] as const,
    "type-case": [RuleConfigSeverity.Error, "always", "lower-case"] as const,
    "type-empty": [RuleConfigSeverity.Error, "never"] as const,
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ] as [RuleConfigSeverity, RuleConfigCondition, string[]],
  },
  prompt: {
    questions: {
      type: {
        description: "커밋 유형을 선택해 주세요",
        enum: {
          feat: {
            description: "새 기능",
            title: "기능",
            emoji: "✨",
          },
          fix: {
            description: "버그 수정",
            title: "버그 수정",
            emoji: "🐛",
          },
          docs: {
            description: "문서 변경 사항",
            title: "문서",
            emoji: "📚",
          },
          style: {
            description:
              "코드의 의미에 영향을 미치지 않는 변경 사항(공백, 서식, 누락된 세미콜론 등)",
            title: "Styles",
            emoji: "💎",
          },
          refactor: {
            description: "버그 수정, 기능을 추가가 없는 코드 변경",
            title: "코드 리팩토링",
            emoji: "📦",
          },
          perf: {
            description: "성능 개선을 위한 코드 변경",
            title: "성능 개선",
            emoji: "🚀",
          },
          test: {
            description: "누락된 테스트 추가 또는 기존 테스트 수정",
            title: "테스트",
            emoji: "🚨",
          },
          build: {
            description:
              "빌드 시스템 또는 외부 종속성에 영향을 미치는 변경 사항 (예: npm, yarn, gulp)",
            title: "빌드",
            emoji: "🛠",
          },
          ci: {
            description:
              "CI 구성 파일 및 스크립트 변경 사항 (예: Travis, Circle, BrowserStack, SauceLabs)",
            title: "지속적 통합",
            emoji: "⚙️",
          },
          chore: {
            description: "코드나 테스트를 수정하지 않는 변경 사항",
            title: "기타",
            emoji: "♻️",
          },
          revert: {
            description: "이전 커밋을 되돌림",
            title: "되돌리기",
            emoji: "🗑",
          },
        },
      },
      scope: {
        description:
          "이 변경 사항의 범위(예: 컴포넌트 또는 파일 이름)는 무엇인가요?",
      },
      subject: {
        description: "변경 사항을 지시적 어조로 짧고 간결하게 기술하세요.",
      },
      body: {
        description: "변경 사항에 대한 더 긴 설명을 제공해 주세요.",
      },
      isBreaking: {
        description: "주요 변경 사항(BREAKING CHANGE)이 있나요?",
      },
      breakingBody: {
        description:
          "주요 변경 사항(BREAKING CHANGE) 커밋에는 본문이 필요합니다. 커밋 자체에 대한 더 긴 설명을 입력해 주세요.",
      },
      breaking: {
        description: "주요 변경 사항(BREAKING CHANGE)을 설명해 주세요",
      },
      isIssueAffected: {
        description: "이 변경 사항이 진행 중인 이슈에 영향을 미치나요?",
      },
      issuesBody: {
        description:
          "이슈가 닫힌 경우 커밋에는 본문이 필요합니다. 커밋 자체에 대한 더 긴 설명을 입력해 주세요.",
      },
      issues: {
        description: "이슈 참조를 추가하세요(예: “fix #123”, “re #123”)",
      },
    },
  },
};
