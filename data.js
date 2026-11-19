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
  C65:   { ins: "D1213031", name: "DRI-LOK Threaded Cannula", spec: "6.5mm", ec: "3910075650", },
  C80:   { ins: "D1213031", name: "DRI-LOK Threaded Cannula", spec: "8.0mm", ec: "3910075800", },
  SP:    { ins: "D0303031", name: "ICONIX ANCHOR Speed", spec: "2.3mm", ec: "3910500931", },
  S3:    { ins: "D0303031", name: "ICONIX ANCHOR 3 Strands", spec: "2.3mm", ec: "3910500532", },
  S2:    { ins: "D0303031", name: "ICONIX ANCHOR 2 Strands", spec: "2.3mm", ec: "3910500522", },
  S1:    { ins: "D0303031", name: "ICONIX ANCHOR 1 Strands", spec: "1.4mm", ec: "3910500512", },
  TT:    { ins: "D0303031", name: "ICONIX ANCHOR 1 TT (XBraid TT)", spec: "1.4mm", ec: "3910500312", },
  ND:    { ins: "D0303031", name: "ICONIX ANCHOR Needles", spec: "2.3mm", ec: "3910500422", },
  AFF:   { ins: "D0301831", name: "Alphavent (Force Fiber)", spec: "4.75mm", ec: "3910947032" },
  ATT:   { ins: "D0301831", name: "Alphavent (Tape Type)", spec: "4.75mm", ec: "3910947031" },
  DRILL: { ins: "-", name: "ICONIX 1.4MM DISPOSABLE DRILL", spec: "1.4mm", ec: "3910500568", }
};

window.DELIVERIES = [
  {
    id: "2026-11-25",
    date: "2026-11-25",
    title: "11/25(수) 납품 예정 (11/19 사용분)",
    patients: [
      { date: "2026-11-19", name: "박O후", chart: "30410", lines: [["S3", 1], ["SP", 1]] }
    ],
    extra: []
  },
  {
    id: "2026-11-19",
    date: "2026-11-19",
    title: "11/19(목) 납품 (11/13·11/17·11/18 사용분 4명 + 11/11 전O민 보충분)",
    patients: [
      { date: "2026-11-13", name: "김O혁", chart: "30178", lines: [["C65", 1], ["C80", 2], ["SP", 1], ["S1", 2]] },
      { date: "2026-11-17", name: "박O철", chart: "30288", lines: [["SP", 2], ["S3", 1]] },
      { date: "2026-11-17", name: "이O균", chart: "30122", lines: [["C65", 1], ["C80", 2]] },
      { date: "2026-11-18", name: "구O숙", chart: "29831", lines: [["C65", 1], ["C80", 2], ["ATT", 2], ["AFF", 1]] }
    ],
    extra: [
      { p: "S1", kind: "보충분", qty: 2, note: "11/11 전O민 ICONIX 1 1.4mm 2개 (알파벤트 회수 대체분)" }
    ]
  },
  {
    id: "2026-11-17",
    date: "2026-11-16",
    title: "11/16(월) 납품 예정 (11/10·11/11 미출고 보충 포함)",
    patients: [
      { date: "2026-11-12", name: "장O준", chart: "29494", lines: [["C80", 2], ["S1", 4], ["SP", 2]] },
      { date: "2026-11-12", name: "이O직", chart: "29864", lines: [["C65", 1], ["C80", 2], ["ATT", 1], ["AFF", 1], ["SP", 1]] },
      { date: "2026-11-13", name: "신O훈", chart: "18542", lines: [["C65", 1], ["C80", 2], ["ATT", 1], ["AFF", 1]] }
    ],
    extra: [
      { p: "ND", kind: "보충분", qty: 1, note: "11/10 이O화 미출고분" },
      { p: "SP", kind: "보충분", qty: 2, note: "11/10 강O훈 미출고분" },
      { p: "C80", kind: "보충분", qty: 2, note: "11/10 강O훈 미출고분" },
      { p: "S1", kind: "보충분", qty: 5, note: "11/10 강O훈 미출고분" },
      { p: "AFF", kind: "회수", qty: 2, note: "11/11 전O민 ICONIX 1 대신 잘못 들어간 알파벤트 #2 회수 (11/16 회수 완료)" }
    ]
  },
  {
    id: "2026-11-11",
    date: "2026-11-11",
    title: "11/11 납품 예정",
    patients: [
      { date: "2026-11-10", name: "김O웅", chart: "30230", lines: [["S3", 1], ["SP", 1]] },
      { date: "2026-11-10", name: "박O자", chart: "29639", lines: [["C65", 1], ["C80", 2], ["S2", 1], ["AFF", 1]] },
      { date: "2026-11-10", name: "이O화", chart: "29451", lines: [["ND", 1]] },
      { date: "2026-11-10", name: "강O훈", chart: "30229", lines: [["C80", 2], ["SP", 2], ["S1", 5]] },
      { date: "2026-11-11", name: "전O민", chart: "28972", lines: [["C65", 1], ["C80", 2], ["S1", 2, "메모: ICONIX 1 대신 알파벤트 #2 2개가 잘못 들어가 11/16 회수함 · ICONIX 1 2개는 다음 납품 때 전달 예정"]] }
    ],
    extra: [
      { p: "TT", kind: "교환", qty: 1, note: "1줄 테이프타입 불량 교환" },
      { p: "TT", kind: "가납랜딩", qty: 5, note: "랜딩 5개 추가" }
    ]
  },
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
