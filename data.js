// 청담리온 X 수멕스 납품 데이터 (환자명은 가운데 글자 마스킹)
window.CONFIG = {
  api: "https://script.google.com/macros/s/AKfycbytxuRVtFAS7JspLvc92OJrqfpf-GbUcYNq1qDmUTGnaXqt78DXo8qr94zTmbyjXwCE/exec",
  owner: "최은성",
  ownerTel: "010-7908-3240",
  bj: { name: "(주)비엔제이홀딩스", mail: "bnjholdings@naver.com" },
  supplier: "(주)수멕스"
};

// 병원 거래명세서 품명/규격 그대로, 단가는 VAT 포함
window.PRODUCTS = {
  C65:   { ins: "D1213031", name: "DRI-LOK Threaded Cannula", spec: "6.5mm", ec: "3910075650", hp: 45440,  bj: 43160 },
  C80:   { ins: "D1213031", name: "DRI-LOK Threaded Cannula", spec: "8.0mm", ec: "3910075800", hp: 45440,  bj: 43160 },
  SP:    { ins: "D0303031", name: "ICONIX ANCHOR Speed", spec: "2.3mm", ec: "3910500931", hp: 205340, bj: 195070 },
  S3:    { ins: "D0303031", name: "ICONIX ANCHOR 3 Strands", spec: "2.3mm", ec: "3910500532", hp: 205340, bj: 195070 },
  S2:    { ins: "D0303031", name: "ICONIX ANCHOR 2 Strands", spec: "2.3mm", ec: "3910500522", hp: 205340, bj: 195070 },
  S1:    { ins: "D0303031", name: "ICONIX ANCHOR 1 Strands", spec: "1.4mm", ec: "3910500512", hp: 205340, bj: 195070 },
  TT:    { ins: "D0303031", name: "ICONIX ANCHOR 1 TT (XBraid TT)", spec: "1.4mm", ec: "3910500312", hp: 205340, bj: 195070 },
  ND:    { ins: "D0303031", name: "ICONIX ANCHOR Needles", spec: "2.3mm", ec: "3910500422", hp: 205340, bj: 195070 },
  DRILL: { ins: "-", name: "ICONIX 1.4MM DISPOSABLE DRILL", spec: "1.4mm", ec: "3910500568", hp: 0, bj: 0 }
};

window.DELIVERIES = [
  {
    id: "2026-11-04",
    date: "2026-11-04",
    fixed: { status: "done", by: "최은성", at: "2026-11-04" },
    patients: [
      { date: "2026-11-03", name: "김O재", chart: "29945", lines: [["ND", 1]] },
      { date: "2026-11-03", name: "이O명", chart: "763",   lines: [["ND", 1]] }
    ],
    extra: []
  },
  {
    id: "2026-11-10",
    date: "2026-11-10",
    patients: [
      { date: "2026-11-03", name: "김O준", chart: "29011", lines: [["C65", 1], ["C80", 2], ["SP", 1]] },
      { date: "2026-11-04", name: "김O영", chart: "30111", lines: [["C80", 1], ["S3", 1], ["SP", 1]] },
      { date: "2026-11-04", name: "박O현", chart: "29841", lines: [["C80", 2], ["S1", 2], ["S2", 1]] },
      { date: "2026-11-04", name: "박O성", chart: "20708", lines: [["C65", 1], ["C80", 2], ["S1", 2]] },
      { date: "2026-11-06", name: "전O빈", chart: "29851", lines: [["C65", 1], ["C80", 2], ["SP", 2], ["TT", 4]] }
    ],
    extra: [
      { p: "S1", kind: "보충분", qty: 1, note: "간호사 요청" },
      { p: "DRILL", kind: "샘플", qty: 3, note: "샘플" }
    ]
  }
];
