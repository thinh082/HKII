const report = window.__HTTPGET_VIEW_MAP__ || { items: [] };
const dbStructure = report.dbStructure || { classes: [], edges: [] };

const overviewSections = [
  {
    title: ".NET Backend",
    summary: "Nền backend chính.",
    items: ["ASP.NET Core MVC", ".NET 7", "Razor Views", "Cookie Auth", "Dependency Injection"]
  },
  {
    title: "Data và ORM",
    summary: "Tầng truy cập dữ liệu.",
    items: ["Entity Framework Core 7", "EntityFramework 6", "Dapper", "SQL Server", "Multiple DbContext"]
  },
  {
    title: "PDF / Excel / In ấn",
    summary: "Cụm xuất file và in ấn.",
    items: ["QuestPDF", "WkHtmlToPdfDotNet", "EPPlus", "ClosedXML", "OpenXML", "iText7", "WebClientPrint"]
  },
  {
    title: "Tích hợp và hệ thống",
    summary: "Tích hợp và tiện ích hệ thống.",
    items: ["SignalR", "FluentFTP", "Swagger", "Serilog", "Google TextToSpeech", "AutoMapper", "Newtonsoft.Json"]
  },
  {
    title: "Frontend",
    summary: "Giao diện và asset client.",
    items: ["Bootstrap", "bootstrap-datepicker", "TinyMCE", "fslightbox", "jQuery-style plugins", "wwwroot/dist assets"]
  },
  {
    title: "Đầu mối cần đọc nhanh",
    summary: "Các điểm vào nên đọc trước.",
    items: ["Program.cs", "HisSoft.csproj", "Controllers", "Views", "Services", "PDFDocument", "wwwroot/dist/js"]
  },
  {
    title: "Khi sửa màn hình",
    summary: "Lần theo từ UI vào backend.",
    items: ["View .cshtml", "script trong wwwroot/dist/js", "controller action", "service xử lý", "entity / query DB"]
  },
  {
    title: "Khi sửa API hoặc fetch",
    summary: "Tìm từ nút bấm hoặc endpoint.",
    items: ["search fetch(", "search $.ajax", "search route/action", "controller HttpPost/HttpGet", "service + Dapper/EF"]
  },
  {
    title: "Khi sửa in / Excel / PDF",
    summary: "Đi theo luồng xuất file.",
    items: ["controller xuất file", "PDFDocument", "QuestPDF / WkHtmlToPdf", "EPPlus / ClosedXML", "view mẫu in"]
  },
  {
    title: "Khi sửa DB",
    summary: "Xem class gốc rồi nhìn quan hệ.",
    items: ["HissoftContext", "HasOne / WithMany", "class liên quan", "foreign key", "service đang query bảng đó"]
  }
];

const flowDefinitions = [
  {
    id: "dang-nhap",
    name: "Luồng đăng nhập",
    area: "Hệ thống",
    summary: "Từ form đăng nhập tới claim và cookie đăng nhập.",
    screen: "GET /trangchinh, GET /login",
    endpoint: "POST /api/login",
    keywords: ["/api/login", "loginWithPhanCong", "HtPhanQuyens", "DmNhanViens", "CookieAuthentication"],
    files: [
      "Views/HT_DangNhap/TrangChinh.cshtml",
      "Views/HT_DangNhap/Login.cshtml",
      "Controllers/HT_DangNhapController.cs",
      "Program.cs"
    ],
    steps: [
      {
        layer: "Màn hình",
        title: "Trang chủ / form đăng nhập",
        desc: "Người dùng vào màn hình đăng nhập, nhập tài khoản, mật khẩu, vai trò, kho, phòng hoặc quầy.",
        refs: ["Views/HT_DangNhap/TrangChinh.cshtml", "Views/HT_DangNhap/Login.cshtml"]
      },
      {
        layer: "View / Submit",
        title: "Form #loginForm và nút #btnLogin",
        desc: "Form mang các field UserName, PassWord, IdVt, IdKho, IdPhong, MaQuay rồi đẩy sang API đăng nhập.",
        refs: ["form#loginForm", "button#btnLogin", "POST /api/login"]
      },
      {
        layer: "Controller",
        title: "HT_DangNhapController.loginWithPhanCong",
        desc: "Kiểm tra tài khoản admin hoặc vai trò, dựng claims và tạo phiên đăng nhập bằng cookie.",
        refs: ["Controllers/HT_DangNhapController.cs", "loginWithPhanCong(UserLoginMap)"]
      },
      {
        layer: "Service / Hệ thống",
        title: "Khởi tạo trạng thái đăng nhập",
        desc: "Gọi addClaims, EnsureDmLoaExists, SetDmLoaActive, callStoUpdateHeThong và updateJsonHangHoa.",
        refs: ["addClaims", "EnsureDmLoaExists", "SetDmLoaActive", "callStoUpdateHeThong", "updateJsonHangHoa"]
      },
      {
        layer: "DB",
        title: "Bảng tài khoản và ngữ cảnh đăng nhập",
        desc: "Đọc nhân viên, phân quyền, kho, khu, phòng, quầy và trạng thái DM_Loa liên quan tới phiên đăng nhập.",
        refs: ["DmNhanViens", "HtPhanQuyens", "HhDmKhoHangs", "DmKhus", "DmPhongBuongs", "HtQuayTiepNhans", "DmLoa"]
      }
    ]
  },
  {
    id: "trang-chu-bieu-do",
    name: "Luồng trang chủ biểu đồ",
    area: "Dashboard",
    summary: "Từ Home view sang AJAX lấy dữ liệu biểu đồ và thủ tục DB.",
    screen: "GET /",
    endpoint: "POST /getDataBieudotrangchu",
    keywords: ["/getDataBieudotrangchu", "Home.js", "MrVu_Bieudotrangchu", "FromSqlRaw"],
    files: [
      "Views/Home/Index.cshtml",
      "wwwroot/dist/js/Home.js",
      "Controllers/HomeController.cs"
    ],
    steps: [
      {
        layer: "Màn hình",
        title: "Trang chủ sau đăng nhập",
        desc: "Người dùng vào dashboard và thấy khu vực biểu đồ cùng thông báo hệ thống.",
        refs: ["Views/Home/Index.cshtml"]
      },
      {
        layer: "JS / AJAX",
        title: "Home.js gửi request biểu đồ",
        desc: "Khi DOM ready, JS gọi AJAX tới endpoint nội bộ để lấy data chart.",
        refs: ["wwwroot/dist/js/Home.js", "url: /getDataBieudotrangchu"]
      },
      {
        layer: "Controller",
        title: "HomeController.getDataBieudotrangchu",
        desc: "Action gom dữ liệu biểu đồ rồi trả về JSON cho frontend render.",
        refs: ["Controllers/HomeController.cs", "getDataBieudotrangchu()"]
      },
      {
        layer: "Service / Query",
        title: "FunctionDBContext lấy dữ liệu báo cáo",
        desc: "Controller dùng FunctionDBContext để gọi FromSqlRaw tới nguồn dữ liệu báo cáo.",
        refs: ["_fcontext.MrVu_Bieudotrangchu", "FromSqlRaw(...)"]
      },
      {
        layer: "DB",
        title: "Stored procedure biểu đồ trang chủ",
        desc: "Nguồn chính là EXEC [dbo].[MrVu_Bieudotrangchu], sau đó map thành dữ liệu tháng và tỷ lệ.",
        refs: ["[dbo].[MrVu_Bieudotrangchu]"]
      }
    ]
  },
  {
    id: "xn-2026-dsbn",
    name: "Luồng xét nghiệm 2026 - danh sách bệnh nhân",
    area: "CLS",
    summary: "Từ tab thực hiện xét nghiệm sang controller, service và stored procedure.",
    screen: "GET /CLS/CLS_PhieuXN_2026",
    endpoint: "POST /CLS/CLS_PhieuXN_2026/th-getDSBN",
    keywords: ["th-getDSBN", "CLS_XN_TabThucHien2026.js", "ThucHien_LayDanhSachBenhNhan", "S00_XN_Taodulieulaymau"],
    files: [
      "Views/CLS_PhieuXN_2026/PhieuXN_2026.cshtml",
      "Views/CLS_PhieuXN_2026/TabDanhSachThucHien.cshtml",
      "wwwroot/dist/js/CLSJs/XetNghiem2026/CLS_XN_TabThucHien2026.js",
      "Controllers/v2026/CLS_PhieuXN_2026Controller.cs",
      "Services/CLSServices/ClsPhieuXn2026Services.cs"
    ],
    steps: [
      {
        layer: "Màn hình",
        title: "Tab danh sách thực hiện xét nghiệm",
        desc: "Người dùng lọc ngày, mã vào viện, SID, bác sĩ chỉ định rồi xem danh sách bệnh nhân xét nghiệm.",
        refs: ["Views/CLS_PhieuXN_2026/PhieuXN_2026.cshtml", "Views/CLS_PhieuXN_2026/TabDanhSachThucHien.cshtml"]
      },
      {
        layer: "JS / AJAX",
        title: "CLS_XN_TabThucHien2026.js",
        desc: "JS dựng object filter và POST tới endpoint th-getDSBN để tải danh sách.",
        refs: ["wwwroot/dist/js/CLSJs/XetNghiem2026/CLS_XN_TabThucHien2026.js", "url: /CLS/CLS_PhieuXN_2026/th-getDSBN"]
      },
      {
        layer: "Controller",
        title: "CLS_PhieuXN_2026Controller.ThucHien_LayDanhSachBenhNhan",
        desc: "Action nhận RequestThucHien rồi chuyển toàn bộ sang service.",
        refs: ["Controllers/v2026/CLS_PhieuXN_2026Controller.cs", "ThucHien_LayDanhSachBenhNhan(RequestThucHien)"]
      },
      {
        layer: "Service",
        title: "ClsPhieuXn2026Services.ThucHien_LayDanhSachBenhNhan",
        desc: "Service chạy Dapper để gọi nguồn dữ liệu xét nghiệm và chuẩn bị kết quả cho màn hình.",
        refs: ["Services/CLSServices/ClsPhieuXn2026Services.cs", "ThucHien_LayDanhSachBenhNhan(RequestThucHien)"]
      },
      {
        layer: "DB",
        title: "Stored procedure xét nghiệm",
        desc: "Điểm vào DB là EXEC S00_XN_Taodulieulaymau với các tham số ngày, hợp đồng, mã vào viện và SID.",
        refs: ["S00_XN_Taodulieulaymau", "_context.Database.GetDbConnection().ExecuteAsync(...)"]
      }
    ]
  },
  {
    id: "xn-2026-in-code",
    name: "Luồng xét nghiệm 2026 - in mã Code XN",
    area: "CLS",
    summary: "Từ nút in mã xét nghiệm tới PDF và dữ liệu vào viện / chỉ định.",
    screen: "GET /CLS/CLS_PhieuXN_2026",
    endpoint: "POST /CLS/CLS_PhieuXN_2026/lm-getPDFCodeXN",
    keywords: ["lm-getPDFCodeXN", "XetNghiem2026_BE.js", "getPDFCodeXN", "PDFCodeXN.cshtml", "QlVaoViens"],
    files: [
      "Views/CLS_PhieuXN_2026/PhieuXN_2026.cshtml",
      "Views/CLS_PhieuXN_2026/PDFCodeXN.cshtml",
      "wwwroot/dist/js/CLSJs/XetNghiem2026/XetNghiem2026_BE.js",
      "Controllers/v2026/CLS_PhieuXN_2026Controller.cs",
      "Services/CLSServices/ClsPhieuXn2026Services.cs"
    ],
    steps: [
      {
        layer: "Màn hình",
        title: "Màn hình xét nghiệm 2026",
        desc: "Người dùng đứng ở màn hình xét nghiệm và thực hiện thao tác in mã Code XN cho bệnh nhân.",
        refs: ["Views/CLS_PhieuXN_2026/PhieuXN_2026.cshtml"]
      },
      {
        layer: "JS / AJAX",
        title: "XetNghiem2026_BE.js gọi API blob",
        desc: "JS POST tới lm-getPDFCodeXN và nhận blob PDF để mở hoặc tải file in.",
        refs: ["wwwroot/dist/js/CLSJs/XetNghiem2026/XetNghiem2026_BE.js", "url: /CLS/CLS_PhieuXN_2026/lm-getPDFCodeXN"]
      },
      {
        layer: "Controller",
        title: "CLS_PhieuXN_2026Controller.getPDFCodeXN",
        desc: "Controller tìm SID, kiểm tra mẫu in, sau đó hoặc gọi service, hoặc dựng PartialView PDFCodeXN.",
        refs: ["Controllers/v2026/CLS_PhieuXN_2026Controller.cs", "getPDFCodeXN(long idvaovien, string codeXn)"]
      },
      {
        layer: "Service / PDF",
        title: "ClsPhieuXn2026Services + PDFDocument",
        desc: "Khi có mẫu in riêng, service tạo nội dung PDF từ cụm QuestPDF / PDFDocument dành cho xét nghiệm.",
        refs: ["Services/CLSServices/ClsPhieuXn2026Services.cs", "HisSoft.PDFDocument.Docs.CodeXNs", "QuestPDF"]
      },
      {
        layer: "DB",
        title: "Dữ liệu chỉ định và mẫu in",
        desc: "Luồng này đọc QlChiDinhs, QlVaoViens, PdfCaiDatMauIns và HtCaiDatThongSoIns để dựng file in.",
        refs: ["QlChiDinhs", "QlVaoViens", "PdfCaiDatMauIns", "HtCaiDatThongSoIns"]
      }
    ]
  },
  {
    id: "ton-kho-xuat-excel",
    name: "Luồng tồn kho - xuất Excel báo cáo",
    area: "Kho / Vaccine",
    summary: "Từ nút Xuất Excel tới controller, query báo cáo và EPPlus.",
    screen: "GET /HangHoa/VC_HangTonKho",
    endpoint: "POST /HangHoa/VC_HangTonKho/download/BaoCaoTongHopExcel",
    keywords: ["downloadBaoCaoTongHopExcel", "VC_HangTonKho.js", "download/BaoCaoTongHopExcel", "BC_HangTonKho", "AL_VC_HANGTONKHO"],
    files: [
      "Views/VC_HangTonKho/VC_HangTonKho.cshtml",
      "wwwroot/dist/js/QuanLyTiemChungJS/VC_HangTonKho.js",
      "Controllers/VC_HangTonKhoController.cs"
    ],
    steps: [
      {
        layer: "Màn hình",
        title: "Màn hình báo cáo tồn kho",
        desc: "Người dùng chọn kho, nhóm hàng, hàng hóa rồi bấm Xuất Excel báo cáo tổng hợp hoặc chi tiết.",
        refs: ["Views/VC_HangTonKho/VC_HangTonKho.cshtml", "button#btnBaoCaoTongHopExcel"]
      },
      {
        layer: "JS / AJAX",
        title: "VC_HangTonKho.js",
        desc: "Hàm downloadBaoCaoTongHopExcel gửi AJAX blob tới endpoint download và tạo file tải về trên trình duyệt.",
        refs: ["wwwroot/dist/js/QuanLyTiemChungJS/VC_HangTonKho.js", "url: /HangHoa/VC_HangTonKho/download/BaoCaoTongHopExcel"]
      },
      {
        layer: "Controller",
        title: "VC_HangTonKhoController.downloadBaoCaoTongHopExcel",
        desc: "Controller kiểm tra quyền xuất, gọi nguồn dữ liệu tồn kho rồi dựng workbook Excel.",
        refs: ["Controllers/VC_HangTonKhoController.cs", "downloadBaoCaoTongHopExcel(long idNhh, long idHh, long idKho, int loai)"]
      },
      {
        layer: "Service / Generate",
        title: "Query báo cáo + EPPlus",
        desc: "Luồng dùng _memoryCache lấy quyền, _fcontext.BC_HangTonKho.FromSqlRaw để lấy dữ liệu và ExcelPackage để format file.",
        refs: ["_memoryCache.getQuyenVaiTro(...)", "_fcontext.BC_HangTonKho.FromSqlRaw(...)", "ExcelPackage"]
      },
      {
        layer: "DB",
        title: "Nguồn dữ liệu tồn kho",
        desc: "Điểm vào DB là AL_VC_HANGTONKHO; ngoài ra còn đọc ThongTinDoanhNghieps để đổ header doanh nghiệp lên file Excel.",
        refs: ["AL_VC_HANGTONKHO", "BC_HangTonKho", "ThongTinDoanhNghieps"]
      }
    ]
  }
];

const MAINTAIN_NOTE_STORAGE_KEY = "daotaohis-maintain-notes-v1";
let currentSearchResults = [];

const state = {
  currentView: "overview",
  globalSearch: "",
  flowSearch: "",
  flowModalOpen: false,
  dbSearch: "",
  dbModalOpen: false,
  noteSearch: "",
  controllerSearch: "",
  folder: "",
  maintainNotes: [],
  selectedFlowId: "",
  selectedDbClass: "",
  selectedController: "",
  viewExistsOnly: false
};

const els = {
  navItems: Array.from(document.querySelectorAll("[data-view]")),
  panels: Array.from(document.querySelectorAll("[data-panel]")),
  overviewMiniStats: document.getElementById("overviewMiniStats"),
  overviewGrid: document.getElementById("overviewGrid"),
  globalSearchInput: document.getElementById("globalSearchInput"),
  searchMiniStats: document.getElementById("searchMiniStats"),
  searchResults: document.getElementById("searchResults"),
  noteSearchInput: document.getElementById("noteSearchInput"),
  noteMiniStats: document.getElementById("noteMiniStats"),
  noteForm: document.getElementById("noteForm"),
  noteTitleInput: document.getElementById("noteTitleInput"),
  noteDateInput: document.getElementById("noteDateInput"),
  noteAreaSelect: document.getElementById("noteAreaSelect"),
  noteStatusSelect: document.getElementById("noteStatusSelect"),
  notePathInput: document.getElementById("notePathInput"),
  noteIssueInput: document.getElementById("noteIssueInput"),
  noteFixInput: document.getElementById("noteFixInput"),
  noteTagsInput: document.getElementById("noteTagsInput"),
  noteTimelineList: document.getElementById("noteTimelineList"),
  flowSearchInput: document.getElementById("flowSearchInput"),
  flowMiniStats: document.getElementById("flowMiniStats"),
  flowList: document.getElementById("flowList"),
  flowModal: document.getElementById("flowModal"),
  flowModalClose: document.getElementById("flowModalClose"),
  flowModalTitle: document.getElementById("flowModalTitle"),
  flowModalIntro: document.getElementById("flowModalIntro"),
  flowSummaryBar: document.getElementById("flowSummaryBar"),
  flowChain: document.getElementById("flowChain"),
  flowKeywords: document.getElementById("flowKeywords"),
  flowFiles: document.getElementById("flowFiles"),
  dbClassSearchInput: document.getElementById("dbClassSearchInput"),
  dbMiniStats: document.getElementById("dbMiniStats"),
  dbClassList: document.getElementById("dbClassList"),
  dbModal: document.getElementById("dbModal"),
  dbModalClose: document.getElementById("dbModalClose"),
  dbDetailTitle: document.getElementById("dbDetailTitle"),
  dbDetailIntro: document.getElementById("dbDetailIntro"),
  dbSummaryBar: document.getElementById("dbSummaryBar"),
  dbRelationGrid: document.getElementById("dbRelationGrid"),
  controllerSearchInput: document.getElementById("controllerSearchInput"),
  folderFilter: document.getElementById("folderFilter"),
  viewExistsOnly: document.getElementById("viewExistsOnly"),
  sidebarStats: document.getElementById("sidebarStats"),
  controllerList: document.getElementById("controllerList"),
  contentTitle: document.getElementById("contentTitle"),
  contentIntro: document.getElementById("contentIntro"),
  summaryBar: document.getElementById("summaryBar"),
  reportBody: document.getElementById("reportBody")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getTodayValue() {
  return new Date().toISOString().slice(0, 10);
}

function createId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadMaintainNotes() {
  try {
    const raw = localStorage.getItem(MAINTAIN_NOTE_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && item.id && item.title)
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  } catch {
    return [];
  }
}

function saveMaintainNotes() {
  try {
    localStorage.setItem(MAINTAIN_NOTE_STORAGE_KEY, JSON.stringify(state.maintainNotes));
  } catch {
    // Bỏ qua nếu môi trường hiện tại không cho lưu localStorage.
  }
}

function formatNoteDate(value) {
  if (!value) {
    return "Không rõ ngày";
  }

  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}-${month}-${year}`;
}

function getStatusTone(status) {
  switch (status) {
    case "Đã xử lý":
      return "status-done";
    case "Đang theo dõi":
      return "status-watch";
    default:
      return "status-verify";
  }
}

function tokenizeTags(value) {
  return compactList(String(value || "").split(",").map((item) => item.trim()), 12);
}

function uniqueControllers() {
  const grouped = new Map();

  for (const item of report.items) {
    if (!grouped.has(item.controller)) {
      grouped.set(item.controller, {
        controller: item.controller,
        folder: item.folder,
        actionCount: 0,
        viewCount: 0
      });
    }

    const current = grouped.get(item.controller);
    current.actionCount += 1;
    if (item.viewExists) {
      current.viewCount += 1;
    }
  }

  return [...grouped.values()].sort((a, b) => a.controller.localeCompare(b.controller));
}

function uniqueValues(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/controller$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function compactList(values, limit = 6) {
  return uniqueValues(values).slice(0, limit);
}

function extractControllerNamesFromManualFlows() {
  const controllersInManualFlows = new Set();

  for (const flow of flowDefinitions) {
    for (const file of flow.files || []) {
      const match = String(file).match(/Controllers\/(?:.+\/)?([^/]+Controller)\.cs/i);
      if (match) {
        controllersInManualFlows.add(match[1]);
      }
    }
  }

  return controllersInManualFlows;
}

function buildAutoControllerFlows() {
  const manualControllers = extractControllerNamesFromManualFlows();
  const grouped = new Map();

  for (const item of report.items || []) {
    if (!item.controller || manualControllers.has(item.controller)) {
      continue;
    }

    if (!grouped.has(item.controller)) {
      grouped.set(item.controller, []);
    }

    grouped.get(item.controller).push(item);
  }

  const autoFlows = [];

  for (const [controllerName, items] of grouped.entries()) {
    const first = items[0];
    const controllerBase = first.controllerBase || controllerName.replace(/Controller$/i, "");
    const actionNames = compactList(items.map((item) => item.action), 8);
    const routes = compactList(items.map((item) => item.route), 8);
    const viewPaths = compactList(items.map((item) => item.viewPath).filter(Boolean), 8);
    const jsRefs = compactList(items.flatMap((item) => item.jsRefs || []), 8);
    const fetchRefs = compactList(items.flatMap((item) => item.fetchSnippets || []), 8);
    const classRoutes = compactList(items.map((item) => item.classRoute).filter(Boolean), 4);
    const folderName = first.folder && first.folder !== "(root)"
      ? first.folder
      : (classRoutes[0] ? classRoutes[0].split("/")[0] : "Controller");

    autoFlows.push({
      id: `controller-${slugify(controllerName)}`,
      name: `Luồng ${controllerBase}`,
      area: folderName,
      summary: `${items.length} action [HttpGet] có return View(...) trong ${controllerName}.`,
      screen: viewPaths.length === 1
        ? viewPaths[0]
        : `${viewPaths.length} view / action trong ${controllerBase}`,
      endpoint: routes.length === 1
        ? routes[0]
        : `${routes.length} route / action trong ${controllerBase}`,
      keywords: compactList([
        controllerName,
        controllerBase,
        ...actionNames,
        ...routes,
        ...jsRefs,
        ...fetchRefs
      ], 14),
      files: compactList([
        first.controllerFile,
        ...viewPaths,
        ...jsRefs
      ], 10),
      steps: [
        {
          layer: "Màn hình",
          title: `Các view của ${controllerBase}`,
          desc: viewPaths.length
            ? `Controller này đang trả về ${viewPaths.length} view chính. Đây là điểm vào đầu tiên khi cần sửa màn hình hoặc layout.`
            : "Chưa map được đường dẫn view cụ thể, nhưng action vẫn có return View(...).",
          refs: viewPaths.length ? viewPaths : actionNames
        },
        {
          layer: "JS / Fetch",
          title: "Script và gọi AJAX liên quan",
          desc: jsRefs.length
            ? "Đây là các file JS ngoài đang gắn với view của controller này. Hãy mở chúng trước khi lần sang endpoint."
            : "Chưa thấy file JS ngoài theo map hiện tại. Nếu màn hình vẫn có tương tác, hãy kiểm tra script inline trong .cshtml.",
          refs: jsRefs.length ? jsRefs : (fetchRefs.length ? fetchRefs : ["Kiểm tra script inline trong view"])
        },
        {
          layer: "Controller",
          title: controllerName,
          desc: `Điểm trung tâm để lần theo flow là file controller và các action [HttpGet] đang trả view của màn hình này.`,
          refs: compactList([
            first.controllerFile,
            ...actionNames,
            ...routes
          ], 10)
        },
        {
          layer: "Service / Query",
          title: "Lần tiếp từ action sang service",
          desc: "Từ action đang xem, hãy mở constructor hoặc phần thân method để tìm service được inject, method nghiệp vụ hoặc các câu query/FromSqlRaw/ExecuteAsync.",
          refs: compactList([
            `Search: ${controllerBase}`,
            `Search action: ${actionNames[0] || controllerBase}`,
            "Search: FromSqlRaw",
            "Search: ExecuteAsync",
            "Search: DbSet"
          ], 5)
        },
        {
          layer: "DB",
          title: "Điểm chạm DB cần lần tiếp",
          desc: "Sau khi tìm được service hoặc query, đối chiếu thêm entity và quan hệ trong mục Cấu trúc DB để biết bảng nào bị ảnh hưởng.",
          refs: compactList([
            "HissoftContext",
            ...classRoutes,
            ...fetchRefs
          ], 6)
        }
      ]
    });
  }

  return autoFlows.sort((a, b) => a.name.localeCompare(b.name));
}

const controllers = uniqueControllers();
const flows = [...flowDefinitions, ...buildAutoControllerFlows()];
state.maintainNotes = loadMaintainNotes();
if (!state.selectedController && controllers.length > 0) {
  state.selectedController = controllers[0].controller;
}
if (!state.selectedFlowId && flows.length > 0) {
  state.selectedFlowId = flows[0].id;
}
if (!state.selectedDbClass && dbStructure.classes.length > 0) {
  state.selectedDbClass = dbStructure.classes[0].name;
}

function renderOverview() {
  els.overviewMiniStats.innerHTML = [
    ["Framework", ".NET 7"],
    ["ORM", "EF Core + Dapper"],
    ["PDF/Excel", "QuestPDF + EPPlus"],
    ["Frontend", "Razor + Bootstrap"]
  ].map(([label, value]) => `
    <article class="mini-stat">
      <p class="mini-stat-label">${escapeHtml(label)}</p>
      <p class="mini-stat-value">${escapeHtml(value)}</p>
    </article>
  `).join("");

  els.overviewGrid.innerHTML = overviewSections.map((section) => `
    <article class="overview-card">
      <p class="panel-box-kicker">Nhóm</p>
      <h3>${escapeHtml(section.title)}</h3>
      <p>${escapeHtml(section.summary)}</p>
      <div class="pill-list">
        ${section.items.map((item) => `<span class="overview-pill">${escapeHtml(item)}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

function getFilteredNotes() {
  const q = state.noteSearch.trim().toLowerCase();
  if (!q) {
    return state.maintainNotes;
  }

  return state.maintainNotes.filter((item) => {
    const haystack = [
      item.title,
      item.area,
      item.status,
      item.path,
      item.issue,
      item.fix,
      ...(item.tags || [])
    ].join(" ").toLowerCase();

    return haystack.includes(q);
  });
}

function renderNoteMiniStats() {
  const filtered = getFilteredNotes();
  const openCount = filtered.filter((item) => item.status !== "Đã xử lý").length;
  els.noteMiniStats.innerHTML = [
    ["Note", filtered.length],
    ["Cần xem", openCount]
  ].map(([label, value]) => `
    <article class="mini-stat">
      <p class="mini-stat-label">${escapeHtml(label)}</p>
      <p class="mini-stat-value">${escapeHtml(value)}</p>
    </article>
  `).join("");
}

function renderTimeline() {
  const filtered = getFilteredNotes();
  renderNoteMiniStats();

  if (!filtered.length) {
    els.noteTimelineList.innerHTML = `<div class="empty">Chưa có note lỗi nào. Hãy thêm note đầu tiên cho team maintain.</div>`;
    return;
  }

  els.noteTimelineList.innerHTML = filtered.map((item) => `
    <article class="note-card">
      <div class="note-card-head">
        <div>
          <p class="panel-box-kicker">${escapeHtml(item.area || "Tổng quát")}</p>
          <h4>${escapeHtml(item.title)}</h4>
        </div>
        <div class="note-card-meta">
          <span class="status-pill ${escapeHtml(getStatusTone(item.status))}">${escapeHtml(item.status || "Cần xác minh")}</span>
          <span class="path-pill">${escapeHtml(formatNoteDate(item.date))}</span>
        </div>
      </div>
      ${item.path ? `<p class="meta">Điểm chạm: ${escapeHtml(item.path)}</p>` : ""}
      <div class="note-section">
        <strong>Lỗi:</strong>
        <p>${escapeHtml(item.issue)}</p>
      </div>
      <div class="note-section">
        <strong>Cách sửa:</strong>
        <p>${escapeHtml(item.fix)}</p>
      </div>
      ${item.tags && item.tags.length ? `
        <div class="pill-list">
          ${item.tags.map((tag) => `<span class="overview-pill">${escapeHtml(tag)}</span>`).join("")}
        </div>
      ` : ""}
      <div class="note-card-actions">
        <button class="ghost-btn" type="button" data-note-delete="${escapeHtml(item.id)}">Xóa note</button>
      </div>
    </article>
  `).join("");

  for (const button of els.noteTimelineList.querySelectorAll("[data-note-delete]")) {
    button.addEventListener("click", () => {
      state.maintainNotes = state.maintainNotes.filter((item) => item.id !== button.dataset.noteDelete);
      saveMaintainNotes();
      render();
    });
  }
}

function buildSearchResults() {
  const q = state.globalSearch.trim().toLowerCase();
  if (!q) {
    return [];
  }

  const results = [];

  for (const section of overviewSections) {
    const haystack = [section.title, section.summary, ...(section.items || [])].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        kind: "overview",
        typeLabel: "Tổng quan",
        title: section.title,
        summary: section.summary,
        refs: section.items || [],
        actionText: "Mở tổng quan"
      });
    }
  }

  for (const flow of flows) {
    const haystack = [flow.name, flow.area, flow.summary, flow.screen, flow.endpoint, ...(flow.keywords || [])].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        kind: "flow",
        key: flow.id,
        typeLabel: "Luồng",
        title: flow.name,
        summary: flow.summary,
        refs: compactList([flow.screen, flow.endpoint, ...(flow.files || [])], 5),
        actionText: "Mở luồng"
      });
    }
  }

  for (const controller of controllers) {
    const haystack = [controller.controller, controller.folder].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        kind: "controller",
        key: controller.controller,
        typeLabel: "Controller",
        title: controller.controller,
        summary: `${controller.folder} | ${controller.actionCount} action | ${controller.viewCount} view tồn tại`,
        refs: [],
        actionText: "Mở controller"
      });
    }
  }

  for (const item of report.items || []) {
    const haystack = [
      item.controller,
      item.action,
      item.route,
      item.viewPath,
      item.controllerFile,
      ...(item.jsRefs || []),
      ...(item.fetchSnippets || [])
    ].join(" ").toLowerCase();

    if (haystack.includes(q)) {
      results.push({
        kind: "action",
        key: `${item.controller}::${item.action}`,
        controller: item.controller,
        typeLabel: "Action / View",
        title: `${item.controller} :: ${item.action}`,
        summary: `${item.route} | ${item.viewExists ? "Có view" : "Chưa thấy view"}`,
        refs: compactList([item.viewPath, ...(item.jsRefs || []), ...(item.fetchSnippets || [])], 5),
        actionText: "Mở action"
      });
    }
  }

  for (const dbClass of dbStructure.classes || []) {
    const haystack = [
      dbClass.name,
      ...(dbClass.relations || []).map((item) => `${item.relatedClass} ${item.foreignKey} ${item.navigation} ${item.label}`)
    ].join(" ").toLowerCase();

    if (haystack.includes(q)) {
      results.push({
        kind: "db",
        key: dbClass.name,
        typeLabel: "DB Class",
        title: dbClass.name,
        summary: `${dbClass.relationCount} quan hệ | ${dbClass.oneToManyCount} x 1-n | ${dbClass.manyToOneCount} x n-1`,
        refs: compactList((dbClass.relations || []).map((item) => item.relatedClass), 5),
        actionText: "Mở DB"
      });
    }
  }

  for (const note of state.maintainNotes) {
    const haystack = [
      note.title,
      note.area,
      note.path,
      note.issue,
      note.fix,
      ...(note.tags || [])
    ].join(" ").toLowerCase();

    if (haystack.includes(q)) {
      results.push({
        kind: "note",
        key: note.id,
        typeLabel: "Note lỗi",
        title: note.title,
        summary: `${note.area} | ${note.status} | ${formatNoteDate(note.date)}`,
        refs: compactList([note.path, ...(note.tags || [])], 5),
        actionText: "Mở timeline"
      });
    }
  }

  return results.slice(0, 160);
}

function renderSearch() {
  const query = state.globalSearch.trim();
  currentSearchResults = buildSearchResults();

  const groups = new Set(currentSearchResults.map((item) => item.typeLabel)).size;
  els.searchMiniStats.innerHTML = [
    ["Kết quả", currentSearchResults.length],
    ["Nhóm", groups]
  ].map(([label, value]) => `
    <article class="mini-stat">
      <p class="mini-stat-label">${escapeHtml(label)}</p>
      <p class="mini-stat-value">${escapeHtml(value)}</p>
    </article>
  `).join("");

  if (!query) {
    els.searchResults.innerHTML = `<div class="empty search-empty">Nhập từ khóa để tìm qua flow, controller, action, view, JS, DB class và note lỗi.</div>`;
    return;
  }

  if (!currentSearchResults.length) {
    els.searchResults.innerHTML = `<div class="empty search-empty">Không tìm thấy kết quả nào cho từ khóa này.</div>`;
    return;
  }

  els.searchResults.innerHTML = currentSearchResults.map((item, index) => `
    <article class="search-result-card">
      <div class="search-result-head">
        <span class="relation-type">${escapeHtml(item.typeLabel)}</span>
        <button class="ghost-btn" type="button" data-search-result="${index}">${escapeHtml(item.actionText)}</button>
      </div>
      <h4>${escapeHtml(item.title)}</h4>
      <p>${escapeHtml(item.summary)}</p>
      ${item.refs && item.refs.length ? `
        <div class="search-ref-list">
          ${item.refs.map((ref) => `<span class="path-pill">${escapeHtml(ref)}</span>`).join("")}
        </div>
      ` : ""}
    </article>
  `).join("");

  for (const button of els.searchResults.querySelectorAll("[data-search-result]")) {
    button.addEventListener("click", () => {
      const result = currentSearchResults[Number(button.dataset.searchResult)];
      if (!result) {
        return;
      }

      state.flowModalOpen = false;
      state.dbModalOpen = false;

      if (result.kind === "overview") {
        state.currentView = "overview";
      } else if (result.kind === "flow") {
        state.currentView = "flows";
        state.selectedFlowId = result.key || "";
        state.flowModalOpen = true;
      } else if (result.kind === "db") {
        state.currentView = "db";
        state.selectedDbClass = result.key || "";
        state.dbModalOpen = true;
      } else if (result.kind === "controller") {
        state.currentView = "controllers";
        state.selectedController = result.key || "";
      } else if (result.kind === "action") {
        state.currentView = "controllers";
        state.selectedController = result.controller || "";
      } else if (result.kind === "note") {
        state.currentView = "timeline";
      }

      render();
    });
  }
}

function resetNoteForm() {
  els.noteForm.reset();
  els.noteDateInput.value = getTodayValue();
  els.noteAreaSelect.value = "Tổng quát";
  els.noteStatusSelect.value = "Đã xử lý";
}

function getVisibleFlows() {
  const q = state.flowSearch.trim().toLowerCase();
  if (!q) {
    return flows;
  }

  return flows.filter((item) => {
    const haystack = [
      item.name,
      item.area,
      item.summary,
      item.screen,
      item.endpoint,
      ...(item.keywords || [])
    ].join(" ").toLowerCase();

    return haystack.includes(q);
  });
}

function ensureSelectedFlowVisible(list) {
  if (!list.length) {
    if (!state.flowModalOpen) {
      state.selectedFlowId = "";
    }
    return;
  }

  if (!state.selectedFlowId) {
    state.selectedFlowId = list[0].id;
    return;
  }

  const hasSelected = list.some((item) => item.id === state.selectedFlowId);
  if (!hasSelected && !state.flowModalOpen) {
    state.selectedFlowId = list[0].id;
  }
}

function renderFlowMiniStats(visibleFlows) {
  const visibleAreas = new Set(visibleFlows.map((item) => item.area)).size;
  els.flowMiniStats.innerHTML = [
    ["Luồng", visibleFlows.length],
    ["Nhóm", visibleAreas]
  ].map(([label, value]) => `
    <article class="mini-stat">
      <p class="mini-stat-label">${escapeHtml(label)}</p>
      <p class="mini-stat-value">${escapeHtml(value)}</p>
    </article>
  `).join("");
}

function renderFlowList() {
  const visibleFlows = getVisibleFlows();
  ensureSelectedFlowVisible(visibleFlows);
  renderFlowMiniStats(visibleFlows);

  if (!visibleFlows.length) {
    els.flowList.innerHTML = `<div class="empty db-empty-state">Không tìm thấy luồng nào.</div>`;
    return;
  }

  els.flowList.innerHTML = visibleFlows.map((item) => `
    <button
      class="flow-card ${item.id === state.selectedFlowId ? "active" : ""}"
      type="button"
      data-flow-id="${escapeHtml(item.id)}"
    >
      <div class="flow-card-top">
        <span class="relation-type">${escapeHtml(item.area)}</span>
        <span class="db-class-open">Xem luồng</span>
      </div>
      <h4>${escapeHtml(item.name)}</h4>
      <p>${escapeHtml(item.summary)}</p>
      <div class="flow-card-meta">
        <span class="path-pill">${escapeHtml(item.screen)}</span>
        <span class="path-pill">${escapeHtml(item.endpoint)}</span>
      </div>
    </button>
  `).join("");

  for (const button of els.flowList.querySelectorAll("[data-flow-id]")) {
    button.addEventListener("click", () => {
      state.selectedFlowId = button.dataset.flowId || "";
      state.flowModalOpen = true;
      render();
    });
  }
}

function renderFlowModal() {
  if (!state.selectedFlowId) {
    els.flowModalTitle.textContent = "Chọn luồng";
    els.flowModalIntro.textContent = "Mở một luồng để xem từ màn hình tới DB.";
    els.flowSummaryBar.innerHTML = "";
    els.flowChain.innerHTML = `<div class="empty">Chưa có dữ liệu luồng.</div>`;
    els.flowKeywords.innerHTML = "";
    els.flowFiles.innerHTML = "";
    return;
  }

  const selected = flows.find((item) => item.id === state.selectedFlowId);
  if (!selected) {
    els.flowModalTitle.textContent = "Không tìm thấy luồng";
    els.flowModalIntro.textContent = "Luồng đang chọn không còn trong danh sách.";
    els.flowSummaryBar.innerHTML = "";
    els.flowChain.innerHTML = `<div class="empty">Chưa có dữ liệu luồng.</div>`;
    els.flowKeywords.innerHTML = "";
    els.flowFiles.innerHTML = "";
    return;
  }

  els.flowModalTitle.textContent = selected.name;
  els.flowModalIntro.textContent = selected.summary;
  els.flowSummaryBar.innerHTML = `
    <div><strong>${escapeHtml(selected.screen)}</strong></div>
    <div><strong>${selected.steps.length}</strong> chặng | endpoint chính: <strong>${escapeHtml(selected.endpoint)}</strong></div>
  `;

  els.flowChain.innerHTML = selected.steps.map((step, index) => `
    <article class="flow-step-card">
      <div class="flow-step-head">
        <span class="flow-step-index">${index + 1}</span>
        <div>
          <p class="panel-box-kicker">${escapeHtml(step.layer)}</p>
          <h4>${escapeHtml(step.title)}</h4>
        </div>
      </div>
      <p>${escapeHtml(step.desc)}</p>
      <div class="flow-step-refs">
        ${(step.refs || []).map((ref) => `<span class="path-pill">${escapeHtml(ref)}</span>`).join("")}
      </div>
    </article>
  `).join("");

  els.flowKeywords.innerHTML = (selected.keywords || [])
    .map((item) => `<span class="overview-pill">${escapeHtml(item)}</span>`)
    .join("");

  els.flowFiles.innerHTML = (selected.files || [])
    .map((item) => `<div class="flow-file-item">${escapeHtml(item)}</div>`)
    .join("");
}

function getVisibleDbClasses() {
  const q = state.dbSearch.trim().toLowerCase();
  if (!q) {
    return dbStructure.classes;
  }

  return dbStructure.classes.filter((item) => item.name.toLowerCase().includes(q));
}

function ensureSelectedDbClassVisible(list) {
  if (!list.length) {
    if (!state.dbModalOpen) {
      state.selectedDbClass = "";
    }
    return;
  }

  if (!state.selectedDbClass) {
    state.selectedDbClass = list[0].name;
    return;
  }

  const hasSelected = list.some((item) => item.name === state.selectedDbClass);
  if (!hasSelected && !state.dbModalOpen) {
    state.selectedDbClass = list[0].name;
  }
}

function renderDbMiniStats(visibleClasses) {
  const relatedVisible = visibleClasses.filter((item) => item.relationCount > 0).length;
  els.dbMiniStats.innerHTML = [
    ["Class", visibleClasses.length],
    ["Có quan hệ", relatedVisible]
  ].map(([label, value]) => `
    <article class="mini-stat">
      <p class="mini-stat-label">${escapeHtml(label)}</p>
      <p class="mini-stat-value">${escapeHtml(value)}</p>
    </article>
  `).join("");
}

function renderDbClassList() {
  const visibleClasses = getVisibleDbClasses();
  ensureSelectedDbClassVisible(visibleClasses);
  renderDbMiniStats(visibleClasses);

  if (!visibleClasses.length) {
    els.dbClassList.innerHTML = `<div class="empty db-empty-state">Không tìm thấy class nào.</div>`;
    return;
  }

  els.dbClassList.innerHTML = visibleClasses.map((item) => `
    <button
      class="db-class-card ${item.name === state.selectedDbClass ? "active" : ""}"
      type="button"
      data-db-class="${escapeHtml(item.name)}"
    >
      <div class="db-class-card-top">
        <p class="controller-item-title">${escapeHtml(item.name)}</p>
        <span class="db-class-open">Xem cây</span>
      </div>
      <p class="controller-item-meta">${escapeHtml(item.relationCount)} quan hệ tổng</p>
      <div class="db-class-card-stats">
        <span class="path-pill">${escapeHtml(item.oneToManyCount)} x 1-n</span>
        <span class="path-pill">${escapeHtml(item.manyToOneCount)} x n-1</span>
        <span class="path-pill">${escapeHtml(item.oneToOneCount)} x 1-1</span>
      </div>
    </button>
  `).join("");

  for (const button of els.dbClassList.querySelectorAll("[data-db-class]")) {
    button.addEventListener("click", () => {
      state.selectedDbClass = button.dataset.dbClass || "";
      state.dbModalOpen = true;
      render();
    });
  }
}

function renderDbDetail() {
  if (!state.selectedDbClass) {
    els.dbDetailTitle.textContent = "Không có class";
    els.dbDetailIntro.textContent = "Thử search tên class khác.";
    els.dbSummaryBar.innerHTML = "";
    els.dbRelationGrid.innerHTML = `<div class="empty">Không có dữ liệu quan hệ.</div>`;
    return;
  }

  const selected = dbStructure.classes.find((item) => item.name === state.selectedDbClass);
  if (!selected) {
    els.dbDetailTitle.textContent = state.selectedDbClass;
    els.dbDetailIntro.textContent = "Chưa thấy dữ liệu.";
    els.dbSummaryBar.innerHTML = "";
    els.dbRelationGrid.innerHTML = `<div class="empty">Không có dữ liệu quan hệ.</div>`;
    return;
  }

  els.dbDetailTitle.textContent = selected.name;
  els.dbDetailIntro.textContent = `${selected.relationCount} quan hệ tìm thấy cho class này.`;
  els.dbSummaryBar.innerHTML = `
    <div><strong>${selected.relationCount}</strong> quan hệ tổng</div>
    <div><strong>${selected.oneToManyCount}</strong> x 1-n, <strong>${selected.manyToOneCount}</strong> x n-1, <strong>${selected.oneToOneCount}</strong> x 1-1</div>
  `;

  if (!selected.relations.length) {
    els.dbRelationGrid.innerHTML = `<div class="empty">Class này chưa thấy quan hệ trong map hiện tại.</div>`;
    return;
  }

  const relationGroups = [
    {
      key: "1-n",
      title: "1 -> n",
      description: "Từ class gốc đi ra nhiều bản ghi con.",
      items: selected.relations.filter((item) => item.type === "1-n")
    },
    {
      key: "n-1",
      title: "n -> 1",
      description: "Class gốc đang phụ thuộc vào bảng cha.",
      items: selected.relations.filter((item) => item.type === "n-1")
    },
    {
      key: "1-1",
      title: "1 -> 1",
      description: "Quan hệ một - một.",
      items: selected.relations.filter((item) => item.type === "1-1")
    }
  ].filter((group) => group.items.length > 0);

  els.dbRelationGrid.innerHTML = `
    <div class="db-tree">
      <div class="tree-root-wrap">
        <article class="tree-root-card">
          <p class="panel-box-kicker">Class gốc</p>
          <h4>${escapeHtml(selected.name)}</h4>
          <p>${selected.relationCount} quan hệ | ${selected.oneToManyCount} x 1-n | ${selected.manyToOneCount} x n-1 | ${selected.oneToOneCount} x 1-1</p>
        </article>
      </div>
      <div class="tree-groups">
        ${relationGroups.map((group) => `
          <section class="tree-group">
            <div class="tree-group-head">
              <span class="relation-type">${escapeHtml(group.title)}</span>
              <p>${escapeHtml(group.description)}</p>
            </div>
            <div class="tree-branch-list">
              ${group.items.map((item) => `
                <button class="relation-card tree-branch-card tree-branch-button" type="button" data-jump-class="${escapeHtml(item.relatedClass)}">
                  <div class="relation-pills">
                    <span class="relation-type">${escapeHtml(item.type)}</span>
                    ${item.foreignKey ? `<span class="path-pill">FK: ${escapeHtml(item.foreignKey)}</span>` : ""}
                  </div>
                  <h4>${escapeHtml(item.relatedClass)}</h4>
                  <p>${escapeHtml(item.label)}</p>
                  ${item.navigation ? `<p style="margin-top:8px">navigation: ${escapeHtml(item.navigation)}</p>` : ""}
                </button>
              `).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    </div>
  `;

  for (const button of els.dbRelationGrid.querySelectorAll("[data-jump-class]")) {
    button.addEventListener("click", () => {
      state.selectedDbClass = button.dataset.jumpClass || state.selectedDbClass;
      render();
    });
  }
}

function renderDbModalState() {
  const isOpen = state.dbModalOpen && Boolean(state.selectedDbClass);
  els.dbModal.classList.toggle("open", isOpen);
  els.dbModal.setAttribute("aria-hidden", String(!isOpen));
}

function closeDbModal() {
  state.dbModalOpen = false;
  render();
}

function renderFlowModalState() {
  const isOpen = state.flowModalOpen && Boolean(state.selectedFlowId);
  els.flowModal.classList.toggle("open", isOpen);
  els.flowModal.setAttribute("aria-hidden", String(!isOpen));
}

function closeFlowModal() {
  state.flowModalOpen = false;
  render();
}

function syncBodyModalState() {
  const hasOpenModal =
    (state.dbModalOpen && Boolean(state.selectedDbClass)) ||
    (state.flowModalOpen && Boolean(state.selectedFlowId));

  document.body.classList.toggle("modal-open", hasOpenModal);
}

function syncNavigation() {
  for (const item of els.navItems) {
    item.classList.toggle("active", item.dataset.view === state.currentView);
  }

  for (const panel of els.panels) {
    panel.classList.toggle("active", panel.dataset.panel === state.currentView);
  }
}

function populateFolderFilter() {
  const folders = [...new Set(report.items.map((item) => item.folder).filter(Boolean))];
  for (const folder of folders) {
    els.folderFilter.insertAdjacentHTML(
      "beforeend",
      `<option value="${escapeHtml(folder)}">${escapeHtml(folder)}</option>`
    );
  }
}

function renderMiniStats(visibleControllers) {
  const visibleNames = new Set(visibleControllers.map((item) => item.controller));
  const visibleItems = report.items.filter((item) => visibleNames.has(item.controller));

  els.sidebarStats.innerHTML = [
    ["Controller", visibleControllers.length],
    ["Action", visibleItems.length]
  ].map(([label, value]) => `
    <article class="mini-stat">
      <p class="mini-stat-label">${escapeHtml(label)}</p>
      <p class="mini-stat-value">${escapeHtml(value)}</p>
    </article>
  `).join("");
}

function getVisibleControllers() {
  const q = state.controllerSearch.trim().toLowerCase();

  return controllers.filter((item) => {
    if (state.folder && item.folder !== state.folder) {
      return false;
    }

    if (state.viewExistsOnly && item.viewCount === 0) {
      return false;
    }

    if (!q) {
      return true;
    }

    return `${item.controller} ${item.folder}`.toLowerCase().includes(q);
  });
}

function ensureSelectedControllerVisible(list) {
  if (!list.length) {
    state.selectedController = "";
    return;
  }

  const hasSelected = list.some((item) => item.controller === state.selectedController);
  if (!hasSelected) {
    state.selectedController = list[0].controller;
  }
}

function renderControllerList() {
  const visibleControllers = getVisibleControllers();
  ensureSelectedControllerVisible(visibleControllers);
  renderMiniStats(visibleControllers);

  if (!visibleControllers.length) {
    els.controllerList.innerHTML = `<div class="empty">Không tìm thấy controller nào khớp bộ lọc hiện tại.</div>`;
    return;
  }

  els.controllerList.innerHTML = visibleControllers.map((item) => `
    <button
      class="controller-item ${item.controller === state.selectedController ? "active" : ""}"
      type="button"
      data-controller="${escapeHtml(item.controller)}"
    >
      <p class="controller-item-title">${escapeHtml(item.controller)}</p>
      <p class="controller-item-meta">${escapeHtml(item.folder)} | ${escapeHtml(item.actionCount)} action | ${escapeHtml(item.viewCount)} view tồn tại</p>
    </button>
  `).join("");

  for (const button of els.controllerList.querySelectorAll("[data-controller]")) {
    button.addEventListener("click", () => {
      state.selectedController = button.dataset.controller || "";
      render();
    });
  }
}

function getFilteredItems() {
  return report.items.filter((item) => {
    if (state.selectedController && item.controller !== state.selectedController) {
      return false;
    }

    if (state.folder && item.folder !== state.folder) {
      return false;
    }

    if (state.viewExistsOnly && !item.viewExists) {
      return false;
    }

    return true;
  });
}

function renderHeader(items) {
  if (!state.selectedController) {
    els.contentTitle.textContent = "Không có controller";
    els.contentIntro.textContent = "Thử đổi bộ lọc.";
    return;
  }

  const selected = controllers.find((item) => item.controller === state.selectedController);
  const folderText = selected ? `Folder: ${selected.folder}` : "Không rõ folder";

  els.contentTitle.textContent = state.selectedController;
  els.contentIntro.textContent = `${folderText} | ${items.length} action [HttpGet] có return View(...).`;
}

function renderSummary(items) {
  const viewMissing = items.filter((item) => !item.viewExists).length;
  const withJs = items.filter((item) => item.jsRefs.length > 0).length;

  els.summaryBar.innerHTML = `
    <div><strong>${items.length}</strong> action đang hiển thị</div>
    <div><strong>${withJs}</strong> action có script JS, <strong>${viewMissing}</strong> action chưa tìm thấy view theo map hiện tại</div>
  `;
}

function renderRows(items) {
  if (!items.length) {
    els.reportBody.innerHTML = `<tr><td class="empty" colspan="5">Không có action nào khớp bộ lọc hiện tại.</td></tr>`;
    return;
  }

  els.reportBody.innerHTML = items.map((item) => {
    const attrs = (item.methodAttributes || [])
      .map((value) => `<span class="tag">${escapeHtml(value)}</span>`)
      .join("");
    const jsRefs = item.jsRefs.length
      ? item.jsRefs.map((value) => `<span class="path-pill">${escapeHtml(value)}</span>`).join("")
      : `<span class="meta">Không thấy script ngoài</span>`;
    const fetchRefs = item.fetchSnippets.length
      ? item.fetchSnippets.map((value) => `<span class="path-pill">${escapeHtml(value)}</span>`).join("")
      : `<span class="meta">Không thấy fetch() trong view</span>`;

    return `
      <tr>
        <td>
          <p class="name">${escapeHtml(item.folder)}</p>
          <p class="meta">${escapeHtml(item.controllerFile)}:${escapeHtml(item.controllerLine)}</p>
        </td>
        <td>
          <p class="name">${escapeHtml(item.action)}</p>
          <p class="meta">dòng ${escapeHtml(item.controllerLine)}-${escapeHtml(item.endLine)}</p>
          <div class="tag-list">${attrs}</div>
        </td>
        <td>
          <p class="name">${escapeHtml(item.route)}</p>
          <p class="meta">${item.classRoute ? `class route: ${escapeHtml(item.classRoute)}` : "route quy ước / suy đoán"}</p>
        </td>
        <td>
          <p class="name ${item.viewExists ? "status-ok" : "status-miss"}">${item.viewExists ? "Tìm thấy view" : "Chưa thấy view"}</p>
          <p class="meta">${escapeHtml(item.viewPath || "(không suy ra được)")}</p>
        </td>
        <td>
          <div class="code-list">${jsRefs}</div>
          <div class="code-list" style="margin-top:8px">${fetchRefs}</div>
        </td>
      </tr>
    `;
  }).join("");
}

function render() {
  syncNavigation();
  renderOverview();
  renderSearch();
  renderTimeline();
  renderFlowList();
  renderFlowModal();
  renderDbClassList();
  renderDbDetail();
  renderDbModalState();
  renderFlowModalState();
  syncBodyModalState();
  renderControllerList();
  const items = getFilteredItems();
  renderHeader(items);
  renderSummary(items);
  renderRows(items);
}

for (const item of els.navItems) {
  item.addEventListener("click", () => {
    state.currentView = item.dataset.view || "controllers";
    if (state.currentView !== "db") {
      state.dbModalOpen = false;
    }
    if (state.currentView !== "flows") {
      state.flowModalOpen = false;
    }
    render();
  });
}

els.globalSearchInput.addEventListener("input", (event) => {
  state.globalSearch = event.target.value;
  render();
});

els.noteSearchInput.addEventListener("input", (event) => {
  state.noteSearch = event.target.value;
  render();
});

els.noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = els.noteTitleInput.value.trim();
  const issue = els.noteIssueInput.value.trim();
  const fix = els.noteFixInput.value.trim();

  if (!title || !issue || !fix) {
    return;
  }

  state.maintainNotes = [
    {
      id: createId("note"),
      title,
      date: els.noteDateInput.value || getTodayValue(),
      area: els.noteAreaSelect.value || "Tổng quát",
      status: els.noteStatusSelect.value || "Đã xử lý",
      path: els.notePathInput.value.trim(),
      issue,
      fix,
      tags: tokenizeTags(els.noteTagsInput.value)
    },
    ...state.maintainNotes
  ].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  saveMaintainNotes();
  resetNoteForm();
  state.currentView = "timeline";
  render();
});

els.flowSearchInput.addEventListener("input", (event) => {
  state.flowSearch = event.target.value;
  render();
});

els.flowModalClose.addEventListener("click", () => {
  closeFlowModal();
});

for (const element of els.flowModal.querySelectorAll("[data-flow-modal-close]")) {
  element.addEventListener("click", () => {
    closeFlowModal();
  });
}

els.dbClassSearchInput.addEventListener("input", (event) => {
  state.dbSearch = event.target.value;
  render();
});

els.dbModalClose.addEventListener("click", () => {
  closeDbModal();
});

for (const element of els.dbModal.querySelectorAll("[data-modal-close]")) {
  element.addEventListener("click", () => {
    closeDbModal();
  });
}

els.controllerSearchInput.addEventListener("input", (event) => {
  state.controllerSearch = event.target.value;
  render();
});

els.folderFilter.addEventListener("change", (event) => {
  state.folder = event.target.value;
  render();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (state.flowModalOpen) {
      closeFlowModal();
      return;
    }
    if (state.dbModalOpen) {
      closeDbModal();
    }
  }
});

els.viewExistsOnly.addEventListener("change", (event) => {
  state.viewExistsOnly = event.target.checked;
  render();
});

resetNoteForm();
populateFolderFilter();
render();
