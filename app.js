(function () {
  var C = window.CONFIG, P = window.PRODUCTS, D = window.DELIVERIES || [];
  var API = C.api;
  var state = { deliveries: {}, closings: {} };
  var $ = function (id) { return document.getElementById(id); };
  var won = function (n) { return (n || 0).toLocaleString("ko-KR"); };
  var pad = function (n) { return String(n).padStart(2, "0"); };

  function kstNow() { return new Date(Date.now() + 9 * 3600 * 1000); }
  function kstStamp() { var d = kstNow(); return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + " " + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()); }
  function kstYM() { var d = kstNow(); return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1); }
  function monthOf(dl) { return dl.date.slice(0, 7); }
  function nextMonthFirst(ym) { var y = +ym.slice(0, 4), m = +ym.slice(5, 7); m++; if (m > 12) { m = 1; y++; } return y + "-" + pad(m) + "-01"; }
  function monthEnd(ym) { var y = +ym.slice(0, 4), m = +ym.slice(5, 7); return ym + "-" + pad(new Date(Date.UTC(y, m, 0)).getUTCDate()); }
  function canClose(ym) { var d = kstNow(); var today = d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); return today >= nextMonthFirst(ym); }
  function kLabel(ym) { return ym.slice(0, 4) + "년 " + (+ym.slice(5, 7)) + "월"; }

  function itemsOf(dl) {
    var map = {}, order = [];
    dl.patients.forEach(function (pt) {
      pt.lines.forEach(function (l) {
        var k = l[0] + "|사용분";
        if (!map[k]) { map[k] = { p: l[0], kind: "사용분", qty: 0, who: [] }; order.push(k); }
        map[k].qty += l[1]; map[k].who.push(pt.name + " " + l[1]);
      });
    });
    var out = order.map(function (k) { return map[k]; });
    (dl.extra || []).forEach(function (e) { out.push({ p: e.p, kind: e.kind, qty: e.qty, who: [e.note || ""] }); });
    return out;
  }
  function statusOf(dl) { return dl.fixed || state.deliveries[dl.id] || { status: "pending" }; }

  var months = [];
  D.forEach(function (d) { var m = monthOf(d); if (months.indexOf(m) < 0) months.push(m); });
  if (months.indexOf(kstYM()) < 0) months.push(kstYM());
  months.sort();
  var qs = new URLSearchParams(location.search);
  var cur = qs.get("m") && months.indexOf(qs.get("m")) >= 0 ? qs.get("m") : (months.indexOf(kstYM()) >= 0 ? kstYM() : months[months.length - 1]);

  function renderMonths() {
    $("today").textContent = "오늘 " + kstStamp().slice(0, 10);
    $("months").innerHTML = months.map(function (m) {
      return '<button class="mbtn' + (m === cur ? " on" : "") + '" data-m="' + m + '">' + kLabel(m) + "</button>";
    }).join("");
    Array.prototype.forEach.call($("months").querySelectorAll("button"), function (b) {
      b.onclick = function () { cur = b.getAttribute("data-m"); history.replaceState(null, "", "?m=" + cur); render(); };
    });
  }

  function monthRows(ym) {
    var rows = [];
    D.filter(function (d) { return monthOf(d) === ym; }).forEach(function (dl) {
      dl.patients.forEach(function (pt) {
        pt.lines.forEach(function (l) { rows.push({ date: pt.date, pr: P[l[0]], qty: l[1], name: pt.name, chart: pt.chart, dl: dl.id }); });
      });
    });
    rows.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    return rows;
  }

  function render() {
    renderMonths();
    var list = D.filter(function (d) { return monthOf(d) === cur; });
    var rows = monthRows(cur);
    var hp = 0, bj = 0, q = 0;
    rows.forEach(function (r) { hp += r.pr.hp * r.qty; bj += r.pr.bj * r.qty; q += r.qty; });
    var doneN = list.filter(function (d) { return statusOf(d).status === "done"; }).length;
    var pats = 0; list.forEach(function (d) { pats += d.patients.length; });

    $("mTitle").textContent = kLabel(cur) + " 납품 현황";
    $("tiles").innerHTML =
      '<div class="tile p">납품 완료<b>' + doneN + " / " + list.length + " 건</b></div>" +
      '<div class="tile">사용 환자<b>' + pats + " 명</b></div>" +
      '<div class="tile m">사용분 수량<b>' + q + " 개</b></div>";

    var cl = state.closings[cur];
    var badge = $("closeBadge"), btn = $("btnClose"), note = $("closeNote");
    if (cl && cl.status === "sent") { badge.className = "badge done"; badge.textContent = "마감 완료"; }
    else if (cl) { badge.className = "badge req"; badge.textContent = "마감 요청됨"; }
    else { badge.className = "badge pending"; badge.textContent = "마감 전"; }
    if (cl) {
      btn.disabled = true;
      note.textContent = (cl.status === "sent" ? "비엔제이홀딩스로 발송 완료 " + (cl.sentAt || "") : cl.at + " 마감 요청됨 · 수멕스가 비엔제이홀딩스로 마감 서류를 보내드려요.");
    } else if (!canClose(cur)) {
      btn.disabled = true; note.textContent = nextMonthFirst(cur) + "부터 누를 수 있어요.";
    } else {
      btn.disabled = false; note.textContent = "누르면 마감 서류가 만들어지고 비엔제이홀딩스로 보내져요.";
    }
    if (cl || previewOn) renderDocs(); else { $("docCard").className = "card docs hide"; }

    $("dlist").innerHTML = list.length ? "" : '<div class="card note">이 달에는 아직 납품이 없어요.</div>';
    list.slice().reverse().forEach(function (dl) {
      var st = statusOf(dl), done = st.status === "done";
      var items = itemsOf(dl), tot = 0;
      var tr = items.map(function (it, i) {
        tot += it.qty;
        var pr = P[it.p];
        var cls = it.kind === "샘플" ? "t-smp" : it.kind === "보충분" ? "t-sup" : "t-use";
        return '<tr><td class="n">' + (i + 1) + "</td><td>" + pr.name + ' <span class="note">' + pr.spec + '</span></td><td class="hide-s">' + pr.ec +
          '</td><td class="n"><span class="tag ' + cls + '">' + it.kind + '</span></td><td class="n"><b>' + it.qty + '</b></td><td class="hide-s note">' + it.who.join(", ") + "</td></tr>";
      }).join("");
      var pt = dl.patients.map(function (p) {
        return '<tr><td class="n">' + p.date.slice(5).replace("-", "/") + "</td><td>" + p.name + '</td><td class="n">' + p.chart + "</td><td>" +
          p.lines.map(function (l) { return P[l[0]].name + " " + P[l[0]].spec + " x" + l[1]; }).join(", ") + "</td></tr>";
      }).join("");
      var card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        '<div class="dl"><div class="dtitle">' + (dl.title || (dl.date.slice(5).replace("-", "/") + " 납품")) + ' <span class="note">담당 ' + C.owner + '</span></div>' +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="badge ' + (done ? "done" : "pending") + '">' + (done ? "납품 완료" : "납품 대기") + "</span>" +
        (done ? '<span class="note">' + (st.at || "") + " " + (st.by || "") + "</span>" : "") +
        (!dl.fixed ? (done ? '<button class="b-soft noprint" data-undo="' + dl.id + '" style="padding:7px 12px">완료 취소</button>'
                           : '<button class="b-pink noprint" data-done="' + dl.id + '">납품완료</button>') : "") +
        "</div></div>" +
        '<table><thead><tr><th class="n">No</th><th>품목</th><th class="hide-s">품목코드</th><th class="n">구분</th><th class="n">수량</th><th class="hide-s">비고</th></tr></thead><tbody>' + tr +
        '</tbody><tfoot><tr><td></td><td colspan="2">합계</td><td></td><td class="n">' + tot + '</td><td class="hide-s"></td></tr></tfoot></table>' +
        '<div style="margin-top:12px;font-weight:800;color:#b0466f">환자별 사용분</div>' +
        '<table><thead><tr><th class="n">사용일</th><th>환자</th><th class="n">차트번호</th><th>사용 품목</th></tr></thead><tbody>' + pt + "</tbody></table>";
      $("dlist").appendChild(card);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-done]"), function (b) {
      b.onclick = function () { if (!confirm("납품 완료로 표시할까요?")) return; guard(function (pin) { setDelivery(b.getAttribute("data-done"), { status: "done", by: C.owner, at: kstStamp() }, "납품 완료로 표시했어요.", pin); }); };
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-undo]"), function (b) {
      b.onclick = function () { if (!confirm("납품 완료를 취소할까요?")) return; guard(function (pin) { setDelivery(b.getAttribute("data-undo"), { status: "pending" }, "납품 대기로 되돌렸어요.", pin); }); };
    });
  }

  function docTables(ym) {
    var rows = monthRows(ym), t1 = "", s = { q: 0, bj: 0, hp: 0 };
    rows.forEach(function (r, i) {
      s.q += r.qty; s.bj += r.pr.bj * r.qty; s.hp += r.pr.hp * r.qty;
      t1 += "<tr><td>" + (i + 1) + "</td><td>" + r.date + "</td><td>" + r.pr.ins + "</td><td>" + r.pr.name + "</td><td>" + r.pr.spec + "</td><td>" + r.qty + "</td><td>" + r.name + "</td><td>" + r.chart + "</td></tr>";
    });
    var h1 = "<h3>" + ym.slice(0, 4) + "년 " + (+ym.slice(5, 7)) + "월 " + C.bj.name + " 납품내역 (청담리온정형외과)</h3>" +
      "<table border='1'><thead><tr><th>NO</th><th>수술일</th><th>보험코드</th><th>품명</th><th>규격</th><th>수량</th><th>환자정보</th><th>PID</th></tr></thead><tbody>" + t1 +
      "</tbody><tfoot><tr><td colspan='5'>합계</td><td>" + s.q + "</td><td colspan='2'></td></tr></tfoot></table>";
    var agg = {}, order = [];
    rows.forEach(function (r) { var k = r.pr.name + "|" + r.pr.spec; if (!agg[k]) { agg[k] = { pr: r.pr, q: 0 }; order.push(k); } agg[k].q += r.qty; });
    var t2 = "", tot = 0, tq = 0;
    order.forEach(function (k, i) { var a = agg[k]; tot += a.pr.bj * a.q; t2 += "<tr><td>" + (i + 1) + "</td><td>" + a.pr.name + "</td><td>" + a.pr.spec + "</td><td>EA</td><td>" + a.q + "</td></tr>"; tq += a.q; });
    var h2 = "<h3>거래명세서 · " + C.supplier + " → " + C.bj.name + "</h3><div class='note'>일자 " + monthEnd(ym) + " · 청담리온정형외과 " + (+ym.slice(5, 7)) + "월 마감 · 담당자 " + C.owner + " / " + C.ownerTel + "</div>" +
      "<table border='1'><thead><tr><th>No</th><th>품명</th><th>규격</th><th>단위</th><th>수량</th></tr></thead><tbody>" + t2 +
      "</tbody><tfoot><tr><td colspan='4'>합계</td><td>" + tq + "</td></tr></tfoot></table><div class='note' style='margin-top:6px'>금액은 수멕스가 비엔제이홀딩스로 보내는 정식 마감 서류에만 들어가요.</div>";
    return { h1: h1, h2: h2 };
  }
  function renderDocs() {
    var d = docTables(cur);
    $("docOut").innerHTML = d.h1 + d.h2 + "<div class='note' style='margin-top:10px'>받는 곳: " + C.bj.name + " (" + C.bj.mail + ")</div>";
    $("docCard").className = "card docs";
    $("dl1").onclick = function () { xls("BJ 납품내역(리온) " + cur, d.h1); };
    $("dl2").onclick = function () { xls("거래명세서 수멕스_비엔제이 리온 " + cur, d.h2); };
  }
  function xls(name, html) {
    var doc = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'><head><meta charset='utf-8'></head><body>" + html + "</body></html>";
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + doc], { type: "application/vnd.ms-excel" }));
    a.download = name + ".xls"; document.body.appendChild(a); a.click(); a.remove();
  }

  function guard(cb) {
    var pin = prompt(C.owner + " 확인 번호를 입력하세요.");
    if (!pin) return;
    cb(pin.trim());
  }
  function apply(d) { d = d || {}; state.deliveries = d.deliveries || {}; state.closings = d.closings || {}; }
  function load(cb) {
    return fetch(API, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) apply(j.data);
      if (cb) cb();
    }).catch(function () { if (cb) cb(); });
  }
  function post(body, msg) {
    return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.ok) { alert(j.error === "pin" ? "확인 번호가 맞지 않아요." : "저장하지 못했어요."); return; }
        apply(j.data); render(); alert(msg);
      })
      .catch(function () { alert("저장하지 못했어요. 잠시 후 다시 시도해 주세요."); });
  }
  function setDelivery(id, v, msg, pin) { post({ pin: pin, action: "delivery", id: id, value: v }, msg); }

  var previewOn = false;
  $("btnPrev").onclick = function () { previewOn = !previewOn; render(); if (previewOn) $("docCard").scrollIntoView({ behavior: "smooth" }); };
  $("btnClose").onclick = function () {
    if (!canClose(cur)) return;
    guard(function (pin) {
      var pend = D.filter(function (d) { return monthOf(d) === cur && statusOf(d).status !== "done"; }).length;
      var msg = kLabel(cur) + " 마감을 요청할까요?" + (pend ? "\n(아직 납품 대기 " + pend + "건이 있어요)" : "");
      if (!confirm(msg)) return;
      post({ pin: pin, action: "close", month: cur, value: { status: "requested", at: kstStamp(), by: C.owner } }, "마감 요청이 접수됐어요. 마감 서류가 만들어졌어요.");
    });
  };

  load(render);
  setInterval(function () { if (!document.hidden) load(render); }, 30000);
})();
