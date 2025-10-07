#!/usr/bin/env node

/**
 * Pretendard Variable 폰트 서브셋 생성 스크립트
 * 한글 완성형 + 영문/숫자만 포함하여 파일 크기 축소
 */

const subsetFont = require("subset-font");
const fs = require("fs");
const path = require("path");

async function generateSubset() {
  const inputPath = path.join(
    __dirname,
    "../apps/web/public/fonts/PretendardVariable.woff2"
  );
  const outputPath = path.join(
    __dirname,
    "../apps/web/public/fonts/PretendardVariable-subset.woff2"
  );

  console.log("📦 폰트 서브셋 생성 시작...");
  console.log(`입력: ${inputPath}`);
  console.log(`출력: ${outputPath}`);

  try {
    // 원본 파일 읽기
    const fontBuffer = fs.readFileSync(inputPath);
    console.log(
      `✅ 원본 파일 크기: ${(fontBuffer.length / 1024 / 1024).toFixed(2)}MB`
    );

    // 서브셋 생성
    // 한글 완성형 (가-힣) + 영문/숫자/기호
    const koreanChars = Array.from({ length: 0xd7a3 - 0xac00 + 1 }, (_, i) =>
      String.fromCharCode(0xac00 + i)
    ).join("");

    const latinChars = Array.from({ length: 0x007f - 0x0020 + 1 }, (_, i) =>
      String.fromCharCode(0x0020 + i)
    ).join("");

    const textToInclude = latinChars + koreanChars;
    console.log(`✅ 포함할 문자 수: ${textToInclude.length}자`);

    const subsetBuffer = await subsetFont(fontBuffer, textToInclude, {
      targetFormat: "woff2",
    });

    // 결과 저장
    fs.writeFileSync(outputPath, subsetBuffer);
    console.log(
      `✅ 서브셋 파일 크기: ${(subsetBuffer.length / 1024 / 1024).toFixed(2)}MB`
    );
    console.log(
      `✅ 용량 절감: ${((1 - subsetBuffer.length / fontBuffer.length) * 100).toFixed(1)}%`
    );
    console.log("✅ 서브셋 생성 완료");
  } catch (error) {
    console.error("❌ 오류 발생:", error.message);
    process.exit(1);
  }
}

generateSubset();
