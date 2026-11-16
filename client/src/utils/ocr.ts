// 브라우저 전용 OCR 유틸 (Tesseract.js CDN 동적 로드, 서버/API 키 불필요)
// Metro 번들링 문제를 피하려고 npm 설치 대신 <script>로 불러와 window.Tesseract를 사용합니다.

const TESSERACT_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
const MAX_SIDE = 1600;

let tesseractPromise: Promise<any> | null = null;

export const loadTesseract = (): Promise<any> => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("웹 브라우저에서만 글자 인식을 사용할 수 있어요."));
  }
  const w = window as any;
  if (w.Tesseract) return Promise.resolve(w.Tesseract);
  if (tesseractPromise) return tesseractPromise;

  tesseractPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TESSERACT_CDN;
    script.async = true;
    script.onload = () => (w.Tesseract ? resolve(w.Tesseract) : reject(new Error("Tesseract 로드 실패")));
    script.onerror = () => {
      tesseractPromise = null; // 재시도 허용
      reject(new Error("글자 인식 엔진을 불러오지 못했어요. 인터넷 연결을 확인해 주세요."));
    };
    document.head.appendChild(script);
  });
  return tesseractPromise;
};

// 긴 변 1600px로 맞추고 흑백 + 대비 강화
export const preprocessImage = (src: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new (window as any).Image() as HTMLImageElement;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const scale = MAX_SIDE / Math.max(img.width, img.height);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas 사용 불가");
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h);
        const px = data.data;
        const contrast = 1.6;
        for (let i = 0; i < px.length; i += 4) {
          const gray = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
          const v = Math.max(0, Math.min(255, (gray - 128) * contrast + 128));
          px[i] = px[i + 1] = px[i + 2] = v;
        }
        ctx.putImageData(data, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("사진을 불러오지 못했어요."));
    img.src = src;
  });

export interface OcrProgress {
  status: string;
  progress: number; // 0~1
}

export const recognizeText = async (
  imageSrc: string,
  onProgress: (p: OcrProgress) => void
): Promise<string> => {
  const Tesseract = await loadTesseract();
  const processed = await preprocessImage(imageSrc);
  const result = await Tesseract.recognize(processed, "kor+eng", {
    logger: (m: any) => {
      if (m && typeof m.progress === "number") {
        onProgress({ status: String(m.status || ""), progress: m.progress });
      }
    },
  });
  return String(result?.data?.text ?? "");
};

// ---------- 텍스트에서 정보 뽑기 ----------

export const KEYWORDS = ["임대", "매매", "전세", "월세", "보증금", "평", "층", "무권리", "협의"];

export interface ParsedInfo {
  phone: string; // 010-1234-5678 형식, 없으면 ""
  deposit: string; // 만원 단위 숫자 문자열, 없으면 ""
  monthly: string;
  pyeong: string;
  keywords: string[];
}

const formatPhone = (raw: string): string => {
  const d = raw.replace(/\D/g, "");
  const areaLen = d.startsWith("02") ? 2 : 3;
  const last = d.slice(-4);
  const mid = d.slice(areaLen, -4);
  return `${d.slice(0, areaLen)}-${mid}-${last}`;
};

// 한글 사이에 OCR이 넣은 공백을 허용하는 패턴 ("보 증 금")
const spaced = (word: string) => word.split("").join("\\s*");

const findAmount = (text: string, label: string): string => {
  const re = new RegExp(`${spaced(label)}\\s*[:：]?\\s*([0-9][0-9,]*)`);
  const m = text.match(re);
  return m ? m[1].replace(/,/g, "") : "";
};

export const countMeaningfulChars = (text: string): number =>
  (text.match(/[가-힣A-Za-z0-9]/g) || []).length;

export const extractInfo = (text: string): ParsedInfo => {
  const phoneRe = /(?:^|\D)(0(?:1[016789]|2|[3-6][1-5]|70|80)[\s.\-]*\d{3,4}[\s.\-]*\d{4})(?!\d)/;
  const phoneMatch = text.match(phoneRe);

  const compact = text.replace(/\s+/g, "");
  const keywords = KEYWORDS.filter((k) => compact.includes(k));

  const pyeongMatch = text.match(/(\d+(?:\.\d+)?)\s*평/);

  return {
    phone: phoneMatch ? formatPhone(phoneMatch[1]) : "",
    deposit: findAmount(text, "보증금"),
    monthly: findAmount(text, "월세"),
    pyeong: pyeongMatch ? pyeongMatch[1] : "",
    keywords,
  };
};

// "철암동" 같은 동 이름 추출 (태백시 동 기준)
export const extractNeighborhood = (text: string): string => {
  const m = text.match(/([가-힣]{1,4}동)(?![가-힣])/);
  return m ? m[1] : "";
};
