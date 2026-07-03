const canvas = document.getElementById("lifeMap");
const ctx = canvas.getContext("2d");
const rankingEl = document.getElementById("ranking");
const featuredRecommendationsEl = document.getElementById("featuredRecommendations");
const weightsEl = document.getElementById("weights");
const detailPanel = document.getElementById("detailPanel");
const settingsPanel = document.getElementById("settingsPanel");
const dashboardStatsEl = document.getElementById("dashboardStats");
const privacyToggle = document.getElementById("privacyToggle");
const compareCitiesEl = document.getElementById("compareCities");
const compareTableEl = document.getElementById("compareTable");
const compareProvinceEl = document.getElementById("compareProvince");
const compareCityEl = document.getElementById("compareCity");
const compareDistrictEl = document.getElementById("compareDistrict");
const zoomLabel = document.getElementById("zoomLabel");
const citySearch = document.getElementById("citySearch");
const friendDialog = document.getElementById("friendDialog");
const friendForm = document.getElementById("friendForm");
const friendDialogTitle = friendDialog.querySelector(".dialog-head strong");
const friendDialogSubtitle = friendDialog.querySelector(".dialog-head span");
const saveFriendBtn = document.getElementById("saveFriendBtn");
const dataImportInput = document.getElementById("dataImportInput");

const strengthText = { strong: "强", medium: "中", weak: "弱" };
const strengthWeight = { strong: 1.25, medium: 0.85, weak: 0.52 };

const weights = {
  network: { label: "人际支持", value: 32 },
  work: { label: "工作机会", value: 26 },
  life: { label: "生活舒适", value: 22 },
  cost: { label: "成本友好", value: 10 },
  vibe: { label: "氛围匹配", value: 10 },
};

const cityCatalog = [
  { province: "北京", cities: [{ name: "北京", lat: 39.9, lng: 116.4, districts: ["朝阳区", "海淀区", "东城区", "西城区", "丰台区", "通州区"] }] },
  { province: "上海", cities: [{ name: "上海", lat: 31.23, lng: 121.47, districts: ["浦东新区", "黄浦区", "静安区", "徐汇区", "长宁区", "杨浦区"] }] },
  { province: "天津", cities: [{ name: "天津", lat: 39.12, lng: 117.2, districts: ["和平区", "河西区", "南开区", "滨海新区"] }] },
  { province: "重庆", cities: [{ name: "重庆", lat: 29.56, lng: 106.55, districts: ["渝中区", "江北区", "南岸区", "九龙坡区", "渝北区"] }] },
  {
    province: "广东",
    cities: [
      { name: "广州", lat: 23.13, lng: 113.26, districts: ["天河区", "越秀区", "海珠区", "番禺区", "白云区"] },
      { name: "深圳", lat: 22.54, lng: 114.06, districts: ["南山区", "福田区", "罗湖区", "宝安区", "龙岗区"] },
      { name: "佛山", lat: 23.02, lng: 113.12, districts: ["禅城区", "南海区", "顺德区"] },
      { name: "珠海", lat: 22.27, lng: 113.58, districts: ["香洲区", "金湾区", "斗门区"] },
      { name: "东莞", lat: 23.04, lng: 113.75, districts: ["南城", "东城", "松山湖"] },
    ],
  },
  {
    province: "浙江",
    cities: [
      { name: "杭州", lat: 30.27, lng: 120.15, districts: ["西湖区", "余杭区", "滨江区", "上城区", "拱墅区"] },
      { name: "宁波", lat: 29.87, lng: 121.55, districts: ["海曙区", "鄞州区", "江北区"] },
      { name: "温州", lat: 27.99, lng: 120.7, districts: ["鹿城区", "瓯海区", "龙湾区"] },
    ],
  },
  {
    province: "江苏",
    cities: [
      { name: "南京", lat: 32.06, lng: 118.8, districts: ["玄武区", "秦淮区", "建邺区", "鼓楼区", "江宁区"] },
      { name: "苏州", lat: 31.3, lng: 120.58, districts: ["姑苏区", "工业园区", "虎丘区", "吴中区"] },
      { name: "无锡", lat: 31.49, lng: 120.31, districts: ["梁溪区", "滨湖区", "新吴区"] },
    ],
  },
  {
    province: "四川",
    cities: [
      { name: "成都", lat: 30.57, lng: 104.07, districts: ["锦江区", "武侯区", "高新区", "青羊区", "成华区"] },
      { name: "绵阳", lat: 31.47, lng: 104.68, districts: ["涪城区", "游仙区", "安州区"] },
    ],
  },
  { province: "福建", cities: [{ name: "厦门", lat: 24.48, lng: 118.09, districts: ["思明区", "湖里区", "集美区"] }, { name: "福州", lat: 26.08, lng: 119.3, districts: ["鼓楼区", "台江区", "仓山区"] }] },
  { province: "湖北", cities: [{ name: "武汉", lat: 30.59, lng: 114.3, districts: ["武昌区", "江汉区", "洪山区", "光谷"] }] },
  { province: "湖南", cities: [{ name: "长沙", lat: 28.23, lng: 112.94, districts: ["岳麓区", "芙蓉区", "天心区"] }] },
  { province: "陕西", cities: [{ name: "西安", lat: 34.34, lng: 108.94, districts: ["雁塔区", "碑林区", "未央区", "高新区"] }] },
  { province: "山东", cities: [{ name: "济南", lat: 36.65, lng: 117.12, districts: ["历下区", "市中区", "高新区"] }, { name: "青岛", lat: 36.07, lng: 120.38, districts: ["市南区", "崂山区", "黄岛区"] }] },
  { province: "河南", cities: [{ name: "郑州", lat: 34.75, lng: 113.62, districts: ["金水区", "二七区", "郑东新区"] }] },
  { province: "安徽", cities: [{ name: "合肥", lat: 31.82, lng: 117.23, districts: ["蜀山区", "包河区", "庐阳区"] }] },
  { province: "江西", cities: [{ name: "南昌", lat: 28.68, lng: 115.86, districts: ["东湖区", "西湖区", "红谷滩区"] }] },
  { province: "云南", cities: [{ name: "昆明", lat: 25.04, lng: 102.71, districts: ["五华区", "盘龙区", "官渡区"] }] },
  { province: "广西", cities: [{ name: "南宁", lat: 22.82, lng: 108.37, districts: ["青秀区", "兴宁区", "良庆区"] }] },
  { province: "辽宁", cities: [{ name: "沈阳", lat: 41.8, lng: 123.43, districts: ["和平区", "沈河区", "浑南区"] }, { name: "大连", lat: 38.91, lng: 121.61, districts: ["中山区", "沙河口区", "高新区"] }] },
  { province: "吉林", cities: [{ name: "长春", lat: 43.82, lng: 125.32, districts: ["朝阳区", "南关区", "宽城区"] }] },
  { province: "黑龙江", cities: [{ name: "哈尔滨", lat: 45.8, lng: 126.53, districts: ["道里区", "南岗区", "松北区"] }] },
  { province: "河北", cities: [{ name: "石家庄", lat: 38.04, lng: 114.51, districts: ["长安区", "桥西区", "裕华区"] }] },
  { province: "山西", cities: [{ name: "太原", lat: 37.87, lng: 112.55, districts: ["小店区", "迎泽区", "杏花岭区"] }] },
  { province: "内蒙古", cities: [{ name: "呼和浩特", lat: 40.84, lng: 111.75, districts: ["新城区", "赛罕区", "回民区"] }] },
  { province: "贵州", cities: [{ name: "贵阳", lat: 26.65, lng: 106.63, districts: ["云岩区", "南明区", "观山湖区"] }] },
  { province: "海南", cities: [{ name: "海口", lat: 20.04, lng: 110.32, districts: ["龙华区", "美兰区", "秀英区"] }, { name: "三亚", lat: 18.25, lng: 109.51, districts: ["吉阳区", "天涯区", "海棠区"] }] },
  { province: "甘肃", cities: [{ name: "兰州", lat: 36.06, lng: 103.83, districts: ["城关区", "七里河区", "安宁区"] }] },
  { province: "新疆", cities: [{ name: "乌鲁木齐", lat: 43.82, lng: 87.62, districts: ["天山区", "沙依巴克区", "新市区"] }] },
  { province: "西藏", cities: [{ name: "拉萨", lat: 29.65, lng: 91.13, districts: ["城关区", "堆龙德庆区"] }] },
  { province: "青海", cities: [{ name: "西宁", lat: 36.62, lng: 101.78, districts: ["城中区", "城西区", "城北区"] }] },
  { province: "宁夏", cities: [{ name: "银川", lat: 38.49, lng: 106.23, districts: ["兴庆区", "金凤区", "西夏区"] }] },
];

const extraProvinceCities = {
  广东: [
    ["惠州", 23.11, 114.42], ["中山", 22.52, 113.39], ["江门", 22.58, 113.08], ["汕头", 23.35, 116.68], ["湛江", 21.27, 110.36],
  ],
  浙江: [["绍兴", 30.0, 120.58], ["嘉兴", 30.75, 120.75], ["金华", 29.08, 119.65], ["台州", 28.66, 121.43]],
  江苏: [["常州", 31.81, 119.97], ["南通", 31.98, 120.89], ["扬州", 32.39, 119.42], ["徐州", 34.26, 117.2]],
  四川: [["德阳", 31.13, 104.4], ["乐山", 29.57, 103.76], ["宜宾", 28.75, 104.64], ["泸州", 28.87, 105.44]],
  福建: [["泉州", 24.88, 118.67], ["漳州", 24.51, 117.65], ["莆田", 25.45, 119.01], ["龙岩", 25.08, 117.02]],
  湖北: [["宜昌", 30.69, 111.29], ["襄阳", 32.01, 112.12], ["荆州", 30.33, 112.24], ["黄石", 30.2, 115.04]],
  湖南: [["株洲", 27.83, 113.13], ["湘潭", 27.83, 112.94], ["岳阳", 29.37, 113.13], ["衡阳", 26.89, 112.57]],
  陕西: [["咸阳", 34.33, 108.71], ["宝鸡", 34.36, 107.24], ["渭南", 34.5, 109.51], ["延安", 36.59, 109.49]],
  山东: [["烟台", 37.46, 121.45], ["潍坊", 36.71, 119.16], ["临沂", 35.1, 118.35], ["淄博", 36.81, 118.05]],
  河南: [["洛阳", 34.62, 112.45], ["开封", 34.8, 114.31], ["新乡", 35.3, 113.92], ["南阳", 32.99, 112.53]],
  安徽: [["芜湖", 31.35, 118.43], ["蚌埠", 32.92, 117.39], ["安庆", 30.52, 117.05], ["阜阳", 32.89, 115.81]],
  江西: [["九江", 29.71, 116.0], ["赣州", 25.83, 114.93], ["景德镇", 29.27, 117.18], ["上饶", 28.45, 117.97]],
  云南: [["大理", 25.61, 100.27], ["丽江", 26.86, 100.23], ["曲靖", 25.49, 103.8], ["西双版纳", 22.01, 100.8]],
  广西: [["桂林", 25.27, 110.29], ["柳州", 24.33, 109.42], ["北海", 21.48, 109.12], ["玉林", 22.63, 110.16]],
  辽宁: [["鞍山", 41.1, 122.99], ["锦州", 41.1, 121.13], ["丹东", 40.13, 124.39], ["营口", 40.67, 122.23]],
  吉林: [["吉林", 43.84, 126.55], ["四平", 43.17, 124.35], ["延边", 42.9, 129.5]],
  黑龙江: [["齐齐哈尔", 47.35, 123.92], ["大庆", 46.59, 125.1], ["牡丹江", 44.55, 129.63], ["佳木斯", 46.8, 130.32]],
  河北: [["唐山", 39.63, 118.18], ["保定", 38.87, 115.46], ["秦皇岛", 39.94, 119.6], ["邯郸", 36.62, 114.54]],
  山西: [["大同", 40.08, 113.3], ["长治", 36.2, 113.12], ["运城", 35.03, 111.0], ["临汾", 36.08, 111.52]],
  内蒙古: [["包头", 40.66, 109.84], ["鄂尔多斯", 39.61, 109.78], ["赤峰", 42.26, 118.89], ["呼伦贝尔", 49.21, 119.76]],
  贵州: [["遵义", 27.73, 106.92], ["六盘水", 26.59, 104.83], ["安顺", 26.25, 105.95], ["黔东南", 26.58, 107.98]],
  海南: [["儋州", 19.52, 109.58], ["琼海", 19.25, 110.47], ["文昌", 19.54, 110.8]],
  甘肃: [["天水", 34.58, 105.72], ["酒泉", 39.73, 98.49], ["张掖", 38.93, 100.45], ["武威", 37.93, 102.64]],
  新疆: [["喀什", 39.47, 75.99], ["伊犁", 43.92, 81.32], ["克拉玛依", 45.58, 84.89], ["吐鲁番", 42.95, 89.19]],
  西藏: [["日喀则", 29.27, 88.88], ["林芝", 29.65, 94.36], ["昌都", 31.14, 97.18]],
  青海: [["海东", 36.5, 102.1], ["海西", 37.37, 97.37], ["玉树", 33.0, 97.01]],
  宁夏: [["吴忠", 37.99, 106.2], ["石嘴山", 39.02, 106.38], ["固原", 36.01, 106.28]],
};

function genericDistricts(cityName) {
  return ["通用/不清楚", "主城区", "新区", "开发区", "郊区"];
}

function normalizeCatalogOptions() {
  cityCatalog.forEach((group) => {
    const existing = new Set(group.cities.map((city) => city.name));
    (extraProvinceCities[group.province] || []).forEach(([name, lat, lng]) => {
      if (!existing.has(name)) {
        group.cities.push({ name, lat, lng, districts: genericDistricts(name) });
      }
    });
    group.cities.forEach((city) => {
      city.districts = ["通用/不清楚", ...city.districts.filter((district) => district !== "通用/不清楚")];
    });
  });
}

normalizeCatalogOptions();

const cities = [
  {
    id: "shanghai",
    name: "上海",
    lat: 31.23,
    lng: 121.47,
    work: 94,
    life: 74,
    cost: 48,
    vibe: 88,
    mood: ["国际化", "机会密集", "节奏快"],
    color: "#64e6ff",
    summary: "职业机会和跨行业连接很强，适合主动扩张，但生活成本和节奏压力偏高。",
  },
  {
    id: "beijing",
    name: "北京",
    lat: 39.9,
    lng: 116.4,
    work: 91,
    life: 70,
    cost: 52,
    vibe: 84,
    mood: ["资源集中", "文化浓", "强事业感"],
    color: "#ffd36a",
    summary: "资源层级丰富，适合深耕事业和内容、科技、文化圈层。",
  },
  {
    id: "shenzhen",
    name: "深圳",
    lat: 22.54,
    lng: 114.06,
    work: 89,
    life: 68,
    cost: 56,
    vibe: 80,
    mood: ["高效", "创业感", "年轻"],
    color: "#8dffbe",
    summary: "适合高速度成长和探索新机会，人际关系需要主动维护。",
  },
  {
    id: "hangzhou",
    name: "杭州",
    lat: 30.27,
    lng: 120.15,
    work: 86,
    life: 82,
    cost: 64,
    vibe: 83,
    mood: ["互联网", "宜居", "新消费"],
    color: "#bda2ff",
    summary: "工作机会与生活体感比较均衡，适合互联网和内容产品方向。",
  },
  {
    id: "chengdu",
    name: "成都",
    lat: 30.57,
    lng: 104.07,
    work: 73,
    life: 93,
    cost: 76,
    vibe: 91,
    mood: ["松弛", "烟火气", "社交舒服"],
    color: "#ff7fa8",
    summary: "生活支持感强，适合恢复能量、建立稳定社交和寻找更舒展的节奏。",
  },
  {
    id: "guangzhou",
    name: "广州",
    lat: 23.13,
    lng: 113.26,
    work: 81,
    life: 80,
    cost: 70,
    vibe: 78,
    mood: ["务实", "开放", "生活便利"],
    color: "#64e6ff",
    summary: "城市包容度高，生活便利，适合务实型职业发展。",
  },
  {
    id: "nanjing",
    name: "南京",
    lat: 32.06,
    lng: 118.8,
    work: 76,
    life: 84,
    cost: 72,
    vibe: 76,
    mood: ["稳定", "教育资源", "文化感"],
    color: "#ffd36a",
    summary: "平衡感不错，适合偏稳定的生活工作状态。",
  },
  {
    id: "xiamen",
    name: "厦门",
    lat: 24.48,
    lng: 118.09,
    work: 65,
    life: 90,
    cost: 66,
    vibe: 86,
    mood: ["海边", "慢节奏", "小而美"],
    color: "#8dffbe",
    summary: "生活氛围轻盈，适合创作、远程工作或阶段性探索。",
  },
];

function slugifyCityName(name) {
  const known = {
    北京: "beijing",
    上海: "shanghai",
    天津: "tianjin",
    重庆: "chongqing",
    广州: "guangzhou",
    深圳: "shenzhen",
    佛山: "foshan",
    珠海: "zhuhai",
    东莞: "dongguan",
    杭州: "hangzhou",
    宁波: "ningbo",
    温州: "wenzhou",
    南京: "nanjing",
    苏州: "suzhou",
    无锡: "wuxi",
    成都: "chengdu",
    绵阳: "mianyang",
    厦门: "xiamen",
    福州: "fuzhou",
    武汉: "wuhan",
    长沙: "changsha",
    西安: "xian",
    济南: "jinan",
    青岛: "qingdao",
    郑州: "zhengzhou",
    合肥: "hefei",
    南昌: "nanchang",
    昆明: "kunming",
    南宁: "nanning",
    沈阳: "shenyang",
    大连: "dalian",
    长春: "changchun",
    哈尔滨: "haerbin",
    石家庄: "shijiazhuang",
    太原: "taiyuan",
    呼和浩特: "huhehaote",
    贵阳: "guiyang",
    海口: "haikou",
    三亚: "sanya",
    兰州: "lanzhou",
    乌鲁木齐: "wulumuqi",
    拉萨: "lasa",
    西宁: "xining",
    银川: "yinchuan",
  };
  return known[name] || name.toLowerCase().replace(/\s+/g, "-");
}

function cityDefaults(entry, province, index) {
  const scoreSeed = (entry.name.charCodeAt(0) + entry.name.length * 17 + index * 9) % 18;
  return {
    id: slugifyCityName(entry.name),
    name: entry.name,
    province,
    lat: entry.lat,
    lng: entry.lng,
    work: 66 + scoreSeed,
    life: 70 + ((scoreSeed + 5) % 20),
    cost: 62 + ((scoreSeed + 9) % 18),
    vibe: 68 + ((scoreSeed + 3) % 18),
    mood: ["核心城市", "可探索", province],
    color: ["#64e6ff", "#ffd36a", "#ff7fa8", "#8dffbe", "#bda2ff"][index % 5],
    summary: `${province}${entry.name}是可添加关系的城市节点，录入真实朋友后会在地图上形成独立星点。`,
    districts: entry.districts,
    famous: true,
  };
}

function syncCatalogCities() {
  cityCatalog.forEach((provinceGroup, provinceIndex) => {
    provinceGroup.cities.forEach((entry, cityIndex) => {
      const id = slugifyCityName(entry.name);
      const existing = cities.find((city) => city.id === id || city.name === entry.name);
      if (existing) {
        existing.id = id;
        existing.province = provinceGroup.province;
        existing.districts = entry.districts;
        existing.famous = true;
        return;
      }
      cities.push(cityDefaults(entry, provinceGroup.province, provinceIndex + cityIndex));
    });
  });
}

syncCatalogCities();

let friends = [];
let cityNotes = {};

const storageKey = "lifemap-real-friends-v2";
const cityNotesKey = "lifemap-city-notes-v1";
const settingsKey = `${storageKey}-settings-v1`;

const recoveryStorageKey = "lifemap-recovery-friends-v1";
const recoverySnapshotPrefix = "lifemap-recovery-snapshot-";
const friendStorageCandidates = [storageKey, recoveryStorageKey, "sans-lifemap-real-friends-v1", "lifemap-blank-copy-friends-v1", "lifemap-friends"];
const cityNotesStorageCandidates = [cityNotesKey, "sans-lifemap-city-notes-v1"];
const settingsStorageCandidates = [settingsKey, "sans-lifemap-real-friends-v1-settings-v1"];

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Some file:// contexts can block localStorage. The map should still render.
  }
}

function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore blocked storage cleanup.
  }
}

function readStoredJson(key) {
  const value = storageGet(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function pickStoredArray(keys) {
  const snapshotKeys = [];
  try {
    snapshotKeys.push(...Object.keys(localStorage).filter((key) => key.startsWith(recoverySnapshotPrefix)));
  } catch {
    // Ignore blocked storage enumeration.
  }
  return [...keys, ...snapshotKeys].map((key) => readStoredJson(key)).filter(Array.isArray).sort((a, b) => b.length - a.length)[0] || [];
}

function pickStoredObject(keys) {
  return keys.map((key) => readStoredJson(key)).find((value) => value && typeof value === "object" && !Array.isArray(value)) || {};
}

friends = pickStoredArray(friendStorageCandidates);
cityNotes = pickStoredObject(cityNotesStorageCandidates);

const hadFriendsWithoutIds = friends.some((friend) => !friend.id);
friends = friends.map((friend) => ({ ...friend, id: friend.id || createFriendId() }));
if (friends.length || hadFriendsWithoutIds) saveFriends();
if (Object.keys(cityNotes).length) saveCityNotes();

let userSettings = { privacyMode: false };
userSettings = { ...userSettings, ...pickStoredObject(settingsStorageCandidates) };

let width = 0;
let height = 0;
let dpr = 1;
let view = { x: 0, y: 0, zoom: 1, targetX: 0, targetY: 0, targetZoom: 1, lon: 104, lat: 31, targetLon: 104, targetLat: 31 };
let selectedCityId = "shanghai";
let selectedFriend = null;
let compareIds = [];
let compareDistricts = {};
let editingFriendId = null;
let labelBoxes = [];
let dragging = false;
let lastPointer = { x: 0, y: 0 };
let dragDistance = 0;
let hoverCityId = null;
let query = "";
let recommendationCycle = 0;
let chinaGeoMap = { status: "loading", features: [] };
let worldGeoMap = { status: "loading", features: [] };

const demoFriends = [
  {
    name: "产品同学",
    cityId: "shanghai",
    province: "上海",
    district: "通用/不清楚",
    type: "前同事",
    strength: "strong",
    industry: "AI 产品",
    support: "介绍产品机会、行业信息",
    recent: "本月",
  },
  {
    name: "设计朋友",
    cityId: "hangzhou",
    province: "浙江",
    district: "通用/不清楚",
    type: "朋友",
    strength: "medium",
    industry: "体验设计",
    support: "生活建议、内容合作",
    recent: "上周",
  },
  {
    name: "创业伙伴",
    cityId: "shenzhen",
    province: "广东",
    district: "通用/不清楚",
    type: "合作伙伴",
    strength: "strong",
    industry: "SaaS / 创业",
    support: "介绍创业资源、合作机会",
    recent: "最近",
  },
  {
    name: "大学同学",
    cityId: "beijing",
    province: "北京",
    district: "通用/不清楚",
    type: "同学",
    strength: "strong",
    industry: "内容策略",
    support: "文化活动、职业交流",
    recent: "本周",
  },
  {
    name: "生活好友",
    cityId: "chengdu",
    province: "四川",
    district: "通用/不清楚",
    type: "朋友",
    strength: "medium",
    industry: "自由职业",
    support: "生活帮助、城市体验",
    recent: "上月",
  },
  {
    name: "内容朋友",
    cityId: "guangzhou",
    province: "广东",
    district: "天河区",
    type: "朋友",
    strength: "medium",
    industry: "内容运营",
    support: "本地生活建议、内容合作",
    recent: "本月",
  },
  {
    name: "AI 同事",
    cityId: "shanghai",
    province: "上海",
    district: "徐汇区",
    type: "同事",
    strength: "strong",
    industry: "AI 产品",
    support: "介绍工作、行业信息",
    recent: "本周",
  },
  {
    name: "研究生同学",
    cityId: "nanjing",
    province: "江苏",
    district: "鼓楼区",
    type: "同学",
    strength: "weak",
    industry: "教育科技",
    support: "学习资源、城市信息",
    recent: "上月",
  },
  {
    name: "设计搭子",
    cityId: "xiamen",
    province: "福建",
    district: "思明区",
    type: "合作伙伴",
    strength: "medium",
    industry: "品牌设计",
    support: "创意合作、生活体验",
    recent: "两周前",
  },
  {
    name: "老朋友",
    cityId: "changsha",
    province: "湖南",
    district: "岳麓区",
    type: "朋友",
    strength: "strong",
    industry: "新媒体",
    support: "陪伴聊天、城市落脚建议",
    recent: "昨天",
  },
];

const chinaGeoJsonSources = [
  "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
  "https://geo.datav.aliyun.com/areas/bound/100000_full.json",
];

const worldGeoJsonSources = [
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
];

const stars = Array.from({ length: 210 }, (_, index) => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.45 + Math.random() * 1.25,
  phase: Math.random() * Math.PI * 2,
  speed: 0.45 + Math.random() * 0.8,
  warm: index % 5 === 0,
}));

const chinaOutline = [
  [49.1, 87.0],
  [48.2, 91.5],
  [47.7, 96.2],
  [48.8, 101.8],
  [50.2, 108.5],
  [49.6, 116.0],
  [53.1, 123.2],
  [49.7, 127.8],
  [46.1, 133.0],
  [43.4, 131.2],
  [42.2, 126.0],
  [39.8, 124.2],
  [38.1, 121.7],
  [35.3, 119.7],
  [31.7, 121.9],
  [29.1, 121.5],
  [26.0, 119.8],
  [23.0, 116.8],
  [21.7, 111.4],
  [21.9, 106.7],
  [22.6, 102.0],
  [21.7, 98.6],
  [24.0, 97.5],
  [27.8, 92.0],
  [29.2, 88.0],
  [31.2, 84.2],
  [35.1, 78.1],
  [39.4, 73.8],
  [42.8, 80.1],
  [45.2, 82.5],
  [49.1, 87.0],
];

const provinceLines = [
  [[39.3, 75.0], [38.4, 81.2], [37.2, 87.0], [36.1, 91.5], [36.6, 96.5], [38.4, 101.4], [39.0, 103.5]],
  [[35.0, 78.3], [34.2, 84.8], [32.4, 89.7], [31.0, 94.6], [32.2, 100.0], [33.8, 101.8], [36.6, 96.5]],
  [[31.2, 84.2], [30.4, 90.0], [29.2, 95.0], [29.8, 99.2], [31.2, 101.5], [32.2, 100.0]],
  [[33.8, 101.8], [35.8, 104.0], [37.1, 106.0], [39.0, 103.5]],
  [[35.8, 104.0], [34.6, 107.0], [34.1, 110.0], [34.3, 113.8], [36.3, 114.6], [38.0, 113.5], [39.5, 116.2]],
  [[42.6, 111.0], [41.2, 113.7], [40.2, 116.4], [39.5, 119.2], [40.8, 122.0], [42.2, 126.0]],
  [[39.5, 116.2], [38.5, 117.4], [37.0, 118.4], [36.0, 120.0]],
  [[36.3, 114.6], [35.2, 116.0], [34.6, 118.0], [33.8, 119.4], [32.0, 120.8]],
  [[34.3, 113.8], [33.1, 114.5], [31.8, 115.6], [30.5, 116.9], [29.0, 117.8], [27.8, 118.8]],
  [[34.1, 110.0], [32.6, 110.5], [31.0, 111.8], [29.6, 112.6], [28.0, 113.0], [26.0, 113.0], [24.8, 113.4]],
  [[31.2, 101.5], [30.1, 104.2], [29.3, 106.4], [29.8, 108.8], [31.0, 111.8]],
  [[29.8, 99.2], [28.0, 101.6], [26.5, 103.8], [25.7, 106.0], [24.2, 107.8], [22.7, 106.8]],
  [[26.5, 103.8], [27.4, 106.6], [27.8, 109.2], [26.0, 111.2], [24.8, 113.4]],
  [[27.8, 118.8], [26.4, 117.0], [25.2, 115.5], [24.8, 113.4], [23.0, 112.0], [21.9, 111.4]],
  [[23.0, 112.0], [23.5, 109.0], [22.7, 106.8], [22.6, 102.0]],
  [[32.0, 120.8], [30.8, 121.4], [29.0, 120.2], [27.8, 118.8]],
  [[42.2, 126.0], [43.8, 125.0], [45.8, 126.7], [46.1, 133.0]],
  [[40.8, 122.0], [39.0, 123.2], [38.1, 121.7]],
];

const islandOutlines = [
  [[25.3, 121.6], [24.0, 121.0], [22.8, 120.8], [21.9, 120.7], [22.6, 121.3], [24.0, 121.9], [25.3, 121.6]],
  [[20.1, 109.6], [19.2, 108.8], [18.2, 109.5], [18.5, 111.0], [19.6, 111.0], [20.1, 109.6]],
];

const worldFallbackOutlines = [
  [[72, -168], [62, -150], [55, -132], [48, -124], [38, -122], [27, -112], [18, -99], [9, -84], [15, -76], [28, -82], [40, -74], [53, -60], [60, -75], [70, -95], [72, -132], [72, -168]],
  [[13, -82], [6, -78], [-4, -80], [-18, -73], [-35, -72], [-55, -68], [-52, -55], [-35, -50], [-20, -39], [-5, -35], [6, -50], [12, -65], [13, -82]],
  [[72, -10], [64, 14], [55, 32], [47, 44], [38, 32], [34, 10], [43, -8], [56, -6], [72, -10]],
  [[35, -17], [32, 10], [31, 32], [12, 43], [-10, 40], [-34, 18], [-35, -6], [-18, -16], [5, -12], [20, -16], [35, -17]],
  [[70, 45], [60, 85], [55, 120], [48, 145], [32, 122], [22, 105], [8, 78], [20, 45], [40, 38], [55, 55], [70, 45]],
  [[8, 95], [-6, 112], [-8, 135], [-2, 150], [12, 143], [20, 122], [8, 95]],
  [[-12, 112], [-28, 114], [-38, 130], [-34, 153], [-22, 150], [-14, 136], [-12, 112]],
  [[-62, -62], [-70, -20], [-72, 45], [-66, 110], [-72, 168], [-78, 80], [-76, -80], [-62, -62]],
];

const provinceLabels = [
  ["新疆", 42.4, 86.6], ["西藏", 31.2, 88.8], ["青海", 35.6, 96.4], ["甘肃", 38.2, 103.2], ["内蒙古", 43.7, 112.2],
  ["黑龙江", 47.7, 127.8], ["吉林", 43.7, 126.0], ["辽宁", 41.1, 122.7], ["北京", 40.2, 116.4], ["天津", 39.2, 117.3],
  ["河北", 38.4, 115.4], ["山西", 37.8, 112.4], ["陕西", 34.7, 108.8], ["宁夏", 37.3, 106.0], ["山东", 36.4, 118.0],
  ["河南", 33.8, 113.8], ["江苏", 32.6, 119.0], ["安徽", 31.8, 117.2], ["湖北", 30.8, 112.3], ["四川", 30.7, 102.8],
  ["重庆", 29.6, 106.6], ["贵州", 26.7, 106.7], ["湖南", 27.7, 112.8], ["江西", 27.6, 116.1], ["浙江", 29.2, 120.1],
  ["福建", 26.1, 118.4], ["广东", 23.6, 113.5], ["广西", 23.8, 108.6], ["云南", 25.3, 101.2], ["海南", 19.2, 109.8],
  ["台湾", 23.7, 121.0],
];

function geoJsonRings(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates.map((ring) => ring.map(([lng, lat]) => [lat, lng]));
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flatMap((polygon) => polygon.map((ring) => ring.map(([lng, lat]) => [lat, lng])));
  return [];
}

function ringCenter(ring) {
  if (!ring.length) return null;
  const sum = ring.reduce(
    (acc, [lat, lng]) => {
      acc.lat += lat;
      acc.lng += lng;
      return acc;
    },
    { lat: 0, lng: 0 },
  );
  return [sum.lat / ring.length, sum.lng / ring.length];
}

function normalizeProvinceName(name) {
  return String(name || "")
    .replace("省", "")
    .replace("市", "")
    .replace("壮族自治区", "")
    .replace("回族自治区", "")
    .replace("维吾尔自治区", "")
    .replace("自治区", "")
    .replace("特别行政区", "");
}

function prepareGeoJsonFeatures(data, options = {}) {
  return (data.features || [])
    .map((feature) => {
      const rings = geoJsonRings(feature.geometry);
      const outerRing = rings.reduce((longest, ring) => (ring.length > longest.length ? ring : longest), []);
      const rawName = feature.properties?.name || feature.properties?.NAME || feature.properties?.ADMIN || feature.properties?.admin;
      return {
        name: options.normalizeName ? normalizeProvinceName(rawName) : String(rawName || ""),
        rings,
        center: ringCenter(outerRing),
      };
    })
    .filter((feature) => feature.rings.length && feature.center);
}

async function loadChinaGeoJson() {
  for (const source of chinaGeoJsonSources) {
    try {
      const response = await fetch(source, { cache: "force-cache" });
      if (!response.ok) continue;
      const data = await response.json();
      const features = prepareGeoJsonFeatures(data, { normalizeName: true });
      if (features.length > 20) {
        chinaGeoMap = { status: "ready", features };
        return;
      }
    } catch {
      // Keep the built-in simplified map as a fallback.
    }
  }
  chinaGeoMap = { status: "fallback", features: [] };
}

async function loadWorldGeoJson() {
  for (const source of worldGeoJsonSources) {
    try {
      const response = await fetch(source, { cache: "force-cache" });
      if (!response.ok) continue;
      const data = await response.json();
      const features = prepareGeoJsonFeatures(data);
      if (features.length > 100) {
        worldGeoMap = { status: "ready", features };
        return;
      }
    } catch {
      // Keep the built-in continental outlines as a fallback.
    }
  }
  worldGeoMap = { status: "fallback", features: [] };
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function globeCenter() {
  return {
    x: width * 0.55 + view.x,
    y: height * 0.55 + view.y,
  };
}

function globeRadius() {
  return Math.min(width, height) * 0.43 * view.zoom;
}

function project(lat, lng) {
  const radius = globeRadius();
  const center = globeCenter();
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;
  const phi0 = (view.lat * Math.PI) / 180;
  const lambda0 = (view.lon * Math.PI) / 180;
  const delta = lambda - lambda0;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const cosPhi0 = Math.cos(phi0);
  const sinPhi0 = Math.sin(phi0);
  const z = sinPhi0 * sinPhi + cosPhi0 * cosPhi * Math.cos(delta);

  return {
    x: center.x + radius * cosPhi * Math.sin(delta),
    y: center.y - radius * (cosPhi0 * sinPhi - sinPhi0 * cosPhi * Math.cos(delta)),
    z,
    visible: z > -0.04,
    scale: clamp((z + 1) / 2, 0, 1),
  };
}

function cityFriends(cityId) {
  return friends.filter((friend) => friend.cityId === cityId);
}

function networkScore(cityId) {
  const people = cityFriends(cityId);
  const raw = people.reduce((sum, friend) => sum + strengthWeight[friend.strength] * 22, 0);
  return Math.min(98, Math.round(raw + Math.min(people.length * 6, 20)));
}

function cityScore(city) {
  const total = Object.values(weights).reduce((sum, item) => sum + item.value, 0);
  const weighted =
    (networkScore(city.id) * weights.network.value +
      city.work * weights.work.value +
      city.life * weights.life.value +
      city.cost * weights.cost.value +
      city.vibe * weights.vibe.value) /
    total;
  return Math.round(weighted);
}

function sortedCities() {
  return [...cities].sort((a, b) => cityScore(b) - cityScore(a));
}

function visibleRankingCities() {
  const ranked = sortedCities();
  const relationshipCities = ranked.filter((city) => cityFriends(city.id).length > 0);
  const fallbackCities = ranked.filter((city) => cityFriends(city.id).length === 0).slice(0, 8);
  return [...relationshipCities, ...fallbackCities];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cityRadius(city) {
  const people = cityFriends(city.id);
  const strength = people.reduce((sum, friend) => sum + strengthWeight[friend.strength], 0);
  return 5 + Math.sqrt(strength) * 5.4 + Math.min(people.length * 1.2, 8);
}

function cityHitRadius(city) {
  return Math.max(24, cityRadius(city) + 24);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hashText(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function createFriendId() {
  return `friend-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function displayFriendName(friend, index = 0) {
  if (!userSettings.privacyMode) return friend.name;
  return `${friend.type || "关系"} ${strengthText[friend.strength] || ""}${index + 1}`;
}

function saveSettings() {
  storageSet(settingsKey, JSON.stringify(userSettings));
}

function relationshipCities() {
  return cities.filter((city) => cityFriends(city.id).length > 0);
}

function strongRelationships() {
  return friends.filter((friend) => friend.strength === "strong");
}

function recommendationBreakdown(city) {
  const total = Object.values(weights).reduce((sum, item) => sum + item.value, 0);
  return [
    { label: "人际支持", value: networkScore(city.id), weight: weights.network.value, detail: `${cityFriends(city.id).length} 位关系，强关系 ${cityFriends(city.id).filter((friend) => friend.strength === "strong").length} 位` },
    { label: "工作机会", value: city.work, weight: weights.work.value, detail: city.work >= 85 ? "机会密集，适合职业扩张" : "机会稳定，适合定向探索" },
    { label: "生活舒适", value: city.life, weight: weights.life.value, detail: city.life >= 82 ? "生活体感较友好" : "需要提前确认居住和通勤压力" },
    { label: "成本友好", value: city.cost, weight: weights.cost.value, detail: city.cost >= 70 ? "成本压力相对可控" : "成本压力偏高，需要预算预案" },
    { label: "氛围匹配", value: city.vibe, weight: weights.vibe.value, detail: city.mood.join(" / ") },
  ].map((item) => ({ ...item, contribution: Math.round((item.value * item.weight) / total) }));
}

function cityRecommendationReason(city) {
  const people = cityFriends(city.id);
  const strongCount = people.filter((friend) => friend.strength === "strong").length;
  const breakdown = recommendationBreakdown(city).sort((a, b) => b.contribution - a.contribution);
  const lead = breakdown[0];
  const secondary = breakdown[1];
  if (people.length > 0) {
    return `${people.length} 位关系形成基础支持，${strongCount ? `${strongCount} 位强关系降低落地成本` : `${lead.label}贡献最高`}，同时${secondary.label}表现稳定。`;
  }
  return `${lead.label}是主要优势，${secondary.label}提供补充支撑，适合作为下一阶段探索城市。`;
}

function featuredRecommendationCities() {
  const ranked = visibleRankingCities().slice(0, 8);
  if (ranked.length <= 3) return ranked;
  const first = ranked[0];
  const rotating = ranked.slice(1);
  const start = recommendationCycle % rotating.length;
  const picked = [first];
  for (let index = 0; index < 2; index += 1) {
    picked.push(rotating[(start + index) % rotating.length]);
  }
  return picked;
}

function resetDemoData() {
  friends = demoFriends.map((friend) => ({ ...friend, id: createFriendId() }));
  cityNotes = {
    shanghai: { note: "适合观察 AI 产品、内容与商业化机会。", feeling: "机会密集，但节奏和成本需要控制。" },
    hangzhou: { note: "工作和生活平衡感不错，适合互联网与内容产品。", feeling: "可以作为舒展型职业探索城市。" },
    shenzhen: { note: "创业和效率感强，适合主动扩张资源。", feeling: "需要更高能量和稳定节奏。" },
  };
  selectedCityId = "shanghai";
  saveFriends();
  saveCityNotes();
  renderAll();
  focusCity(selectedCityId, 2.2);
}

function drawGeoPath(points, close = false) {
  let drawing = false;
  points.forEach(([lat, lng], index) => {
    const point = project(lat, lng);
    if (!point.visible) {
      drawing = false;
      return;
    }
    if (index === 0 || !drawing) {
      ctx.moveTo(point.x, point.y);
      drawing = true;
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  if (close && drawing) ctx.closePath();
}

function clipToGlobe() {
  const center = globeCenter();
  const radius = globeRadius();
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.clip();
}

function drawGeoJsonMap() {
  const innerAlpha = clamp((view.zoom - 0.8) / 1.45, 0.14, 0.42);

  ctx.save();
  clipToGlobe();

  ctx.strokeStyle = `rgba(245, 250, 255, ${innerAlpha})`;
  ctx.shadowColor = "rgba(255, 255, 255, 0.62)";
  ctx.shadowBlur = 8;
  ctx.lineWidth = clamp(0.38 * view.zoom, 0.26, 0.72);
  chinaGeoMap.features.forEach((feature) => {
    feature.rings.forEach((ring) => {
      ctx.beginPath();
      drawGeoPath(ring, true);
      ctx.stroke();
    });
  });
  ctx.shadowBlur = 0;

  const chinaLabel = project(35.2, 104.5);
  if (chinaLabel.visible) {
    ctx.globalAlpha = clamp(0.035 + chinaLabel.scale * 0.045, 0.035, 0.08);
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${clamp(46 * view.zoom, 46, 92)}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText("中国", chinaLabel.x, chinaLabel.y);
  }

  if (view.zoom > 1.05) {
    ctx.globalAlpha = clamp((view.zoom - 1.05) / 1.4, 0, 0.36);
    ctx.fillStyle = "rgba(245, 250, 255, 0.74)";
    ctx.font = `${clamp(9 * view.zoom, 9, 13)}px system-ui`;
    chinaGeoMap.features.forEach((feature) => {
      const point = project(feature.center[0], feature.center[1]);
      if (point.visible) ctx.fillText(feature.name, point.x, point.y);
    });
  }

  ctx.restore();
}

function drawWorldBoundaries() {
  ctx.save();
  clipToGlobe();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
  ctx.lineWidth = clamp(0.28 * view.zoom, 0.18, 0.6);

  if (worldGeoMap.status === "ready") {
    worldGeoMap.features.forEach((feature) => {
      feature.rings.forEach((ring) => {
        ctx.beginPath();
        drawGeoPath(ring, true);
        ctx.stroke();
      });
    });
  } else {
    worldFallbackOutlines.forEach((outline) => {
      ctx.beginPath();
      drawGeoPath(outline, true);
      ctx.stroke();
    });
  }

  if (view.zoom > 1.65 && worldGeoMap.status === "ready") {
    ctx.globalAlpha = clamp((view.zoom - 1.65) / 1.8, 0, 0.22);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = `${clamp(7 * view.zoom, 7, 11)}px system-ui`;
    ctx.textAlign = "center";
    worldGeoMap.features.forEach((feature, index) => {
      if (index % 3 !== 0 || !feature.name) return;
      const point = project(feature.center[0], feature.center[1]);
      if (point.visible && point.scale > 0.58) ctx.fillText(feature.name, point.x, point.y);
    });
  }

  ctx.restore();
}

function drawMapBoundaries() {
  if (chinaGeoMap.status === "ready") {
    drawGeoJsonMap();
    return;
  }

  ctx.save();
  clipToGlobe();
  const fillAlpha = clamp(0.08 + (view.zoom - 0.8) * 0.035, 0.08, 0.14);
  const borderAlpha = clamp(0.34 + (view.zoom - 1) * 0.14, 0.34, 0.62);
  const provinceAlpha = clamp((view.zoom - 0.72) / 1.5, 0.16, 0.44);

  ctx.beginPath();
  drawGeoPath(chinaOutline, true);
  ctx.fillStyle = `rgba(255, 255, 255, ${fillAlpha * 0.25})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(245, 250, 255, ${borderAlpha})`;
  ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
  ctx.shadowBlur = 6;
  ctx.lineWidth = clamp(0.8 * view.zoom, 0.75, 1.45);
  ctx.stroke();
  ctx.shadowBlur = 0;

  const chinaLabel = project(35.2, 104.5);
  ctx.save();
  if (chinaLabel.visible) {
    ctx.globalAlpha = clamp(0.055 + (view.zoom - 0.8) * 0.018, 0.055, 0.1);
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${clamp(46 * view.zoom, 46, 92)}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText("中国", chinaLabel.x, chinaLabel.y);
  }
  ctx.restore();

  islandOutlines.forEach((island) => {
    ctx.beginPath();
    drawGeoPath(island, true);
    ctx.fillStyle = `rgba(255, 255, 255, ${fillAlpha * 0.18})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(245, 250, 255, ${borderAlpha * 0.58})`;
    ctx.lineWidth = clamp(0.65 * view.zoom, 0.55, 1.1);
    ctx.stroke();
  });

  ctx.globalAlpha = provinceAlpha;
  ctx.strokeStyle = "rgba(245, 250, 255, 0.4)";
  ctx.lineWidth = clamp(0.45 * view.zoom, 0.38, 0.9);
  provinceLines.forEach((line) => {
    ctx.beginPath();
    drawGeoPath(line);
    ctx.stroke();
  });

  if (view.zoom > 1.05 && view.zoom < 3.8) {
    ctx.globalAlpha = clamp((view.zoom - 1.05) / 1.4, 0, 0.5);
    ctx.fillStyle = "rgba(245, 250, 255, 0.66)";
    ctx.textAlign = "center";
    ctx.font = `${clamp(9 * view.zoom, 9, 13)}px system-ui`;
    provinceLabels.forEach(([name, lat, lng]) => {
      const point = project(lat, lng);
      const box = labelBounds(point.x, point.y, Math.max(44, name.length * 16), 24);
      if (point.visible && reserveLabelBox(box)) ctx.fillText(name, point.x, point.y);
    });
  }

  ctx.restore();
}

function friendStarPosition(city, friend, index, time) {
  const cityPoint = project(city.lat, city.lng);
  const people = cityFriends(city.id);
  const seed = hashText(`${friend.name}-${friend.type}-${index}`);
  const baseAngle = (Math.PI * 2 * index) / Math.max(people.length, 1);
  const angle = baseAngle + ((seed % 31) - 15) * 0.012 + time * 0.00008 * (index % 2 ? -1 : 1);
  const detail = clamp((view.zoom - 3.4) / 3.2, 0, 1);
  const clusterRadius = 1.8 + Math.min(people.length, 8) * 0.28;
  const spreadRadius = clamp(28 / Math.sqrt(view.zoom), 8, 18) + (seed % 3);
  const distance = clusterRadius * (1 - detail) + spreadRadius * detail;
  return {
    x: cityPoint.x + Math.cos(angle) * distance * Math.sqrt(view.zoom),
    y: cityPoint.y + Math.sin(angle) * distance * Math.sqrt(view.zoom),
  };
}

function labelBounds(x, y, widthValue, heightValue = 42) {
  return {
    left: x - widthValue / 2,
    right: x + widthValue / 2,
    top: y - heightValue * 0.28,
    bottom: y + heightValue,
  };
}

function boxesOverlap(a, b, gap = 8) {
  return !(a.right + gap < b.left || a.left - gap > b.right || a.bottom + gap < b.top || a.top - gap > b.bottom);
}

function reserveLabelBox(box, priority = 0) {
  const level = Number(priority) || 0;
  const blocked = labelBoxes.some((existing) => {
    if (!boxesOverlap(box, existing)) return false;
    if (level >= 2) return existing.priority >= 2;
    if (level >= 1) return existing.priority >= 1;
    return true;
  });
  if (blocked) return false;
  labelBoxes.push({ ...box, priority: level });
  return true;
}

function drawGlobeBase(time) {
  const center = globeCenter();
  const radius = globeRadius();
  const lightAngle = time * 0.00012 + (view.lon * Math.PI) / 180;
  const lightX = center.x + Math.cos(lightAngle) * radius * 0.22;
  const lightY = center.y + Math.sin(lightAngle * 0.7) * radius * 0.18 - radius * 0.26;
  const glow = ctx.createRadialGradient(lightX, lightY, radius * 0.08, center.x, center.y, radius * 1.08);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.13)");
  glow.addColorStop(0.35, "rgba(95, 150, 190, 0.12)");
  glow.addColorStop(0.78, "rgba(8, 22, 38, 0.82)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0.15)");

  ctx.save();
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fill();

  const edgePulse = 0.5 + Math.sin(time * 0.0011) * 0.5;
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 + edgePulse * 0.22})`;
  ctx.shadowColor = "rgba(255, 255, 255, 0.65)";
  ctx.shadowBlur = 10 + edgePulse * 9;
  ctx.lineWidth = clamp(0.8 * view.zoom, 0.8, 1.7);
  for (let index = 0; index < 4; index += 1) {
    const start = lightAngle + index * Math.PI * 0.56 + time * 0.00018;
    const length = Math.PI * (0.2 + 0.08 * Math.sin(time * 0.001 + index));
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, start, start + length);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
  ctx.lineWidth = 0.7;
  for (let lat = -60; lat <= 60; lat += 30) {
    ctx.beginPath();
    for (let lon = -180; lon <= 180; lon += 4) {
      const point = project(lat, lon);
      if (!point.visible) continue;
      if (lon === -180) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }
  for (let lon = -180; lon < 180; lon += 30) {
    ctx.beginPath();
    let started = false;
    for (let lat = -80; lat <= 80; lat += 3) {
      const point = project(lat, lon);
      if (!point.visible) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(point.x, point.y);
        started = true;
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();
  }

  const sweep = (time * 0.00022) % (Math.PI * 2);
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius * 1.04, sweep, sweep + Math.PI * 0.45);
  ctx.stroke();
  ctx.restore();
}

function drawBackground(time) {
  const gradient = ctx.createRadialGradient(width * 0.62, height * 0.32, 20, width * 0.55, height * 0.35, width * 0.7);
  gradient.addColorStop(0, "#0b1624");
  gradient.addColorStop(0.45, "#060c16");
  gradient.addColorStop(1, "#05070d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  stars.forEach((star) => {
    const pulse = 0.5 + Math.sin(time * 0.001 * star.speed + star.phase) * 0.5;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${0.18 + pulse * 0.42})`;
    ctx.arc(star.x * width, star.y * height, star.r + pulse * 0.45, 0, Math.PI * 2);
    ctx.fill();
  });

  drawGlobeBase(time);
  drawWorldBoundaries();
  drawMapBoundaries();
}

function drawCity(city, time) {
  const point = project(city.lat, city.lng);
  if (!point.visible) return;
  const people = cityFriends(city.id);
  const hasRelationships = people.length > 0;
  if (view.zoom > 1.55 && !hasRelationships && selectedCityId !== city.id && hoverCityId !== city.id) return;
  const closeCityFocus = view.zoom > 3.0 && selectedCityId && selectedCityId !== city.id && !hasRelationships;
  const showFamousCity = city.famous && view.zoom > 1.28 && !closeCityFocus;
  const shouldLabel = hasRelationships || showFamousCity || selectedCityId === city.id || hoverCityId === city.id;
  if (!shouldLabel && view.zoom < 1.08) return;

  const score = cityScore(city);
  const radius = cityRadius(city) * Math.sqrt(view.zoom) * (0.68 + point.scale * 0.48);
  const selected = selectedCityId === city.id;
  const hovered = hoverCityId === city.id;
  const matches = query && (city.name.includes(query) || people.some((friend) => friend.name.toLowerCase().includes(query.toLowerCase())));
  const pulse = 0.72 + Math.sin(time * 0.0022 + people.length) * 0.28;

  ctx.save();
  ctx.globalAlpha = (people.length ? 0.72 : clamp((view.zoom - 1.18) / 1.6, 0.04, 0.12)) * point.scale;
  ctx.fillStyle = people.length ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.28)";
  ctx.beginPath();
  ctx.arc(point.x, point.y, people.length ? 2.2 : 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (closeCityFocus) {
    return;
  }

  if (people.length) {
    const clusterGlow = clamp(10 + people.length * 4.5 + view.zoom * 2.2, 16, 42);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = clamp(0.2 + people.length * 0.08, 0.24, 0.58) * point.scale;
    const cluster = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, clusterGlow);
    cluster.addColorStop(0, "rgba(255, 255, 255, 0.72)");
    cluster.addColorStop(0.26, "rgba(255, 255, 255, 0.25)");
    cluster.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = cluster;
    ctx.beginPath();
    ctx.arc(point.x, point.y, clusterGlow, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  people.forEach((friend, index) => {
    const star = friendStarPosition(city, friend, index, time);
    const strength = strengthWeight[friend.strength] || 0.6;
    const starRadius = clamp((1.15 + strength * 0.82) * Math.sqrt(view.zoom) * (0.9 + pulse * 0.12), 1.6, 6.2);
    const glow = clamp(starRadius * (2.4 + strength * 1.2), 6, 24);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glow);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.24, "rgba(255, 255, 255, 0.36)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(star.x, star.y, glow, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
    ctx.beginPath();
    ctx.arc(star.x, star.y, starRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  const cityLabelY = point.y + Math.max(radius, 12) + 18;
  const labelPriority = selected || hovered || matches ? 2 : hasRelationships ? 1 : 0;
  const showCityLabel = labelPriority >= 2 || hasRelationships || (showFamousCity && !hasRelationships && view.zoom < 1.55);
  const labelBox = labelBounds(point.x, cityLabelY, Math.max(city.name.length * 16, 88), view.zoom > 1.38 ? 58 : 40);
  if (!showCityLabel || !reserveLabelBox(labelBox, labelPriority)) return;

  ctx.save();
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
  ctx.shadowBlur = 8;
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(3, 8, 16, 0.82)";
  ctx.font = selected ? "700 15px system-ui" : "600 13px system-ui";
  ctx.strokeText(city.name, point.x, point.y + Math.max(radius, 12) + 18);
  ctx.fillStyle = selected || hovered || matches ? "#ffffff" : people.length ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.34)";
  ctx.fillText(city.name, point.x, point.y + Math.max(radius, 12) + 18);
  ctx.fillStyle = people.length ? "rgba(255, 255, 255, 0.72)" : "rgba(255, 255, 255, 0.26)";
  ctx.font = "12px system-ui";
  ctx.fillText(people.length ? `${people.length} 人 · ${score}` : `核心城市 · ${city.province || "可探索"}`, point.x, point.y + Math.max(radius, 12) + 34);

  if (view.zoom > 1.38 && (people.length || selected || hovered)) {
    const tags = city.mood.slice(0, view.zoom > 2.05 ? 3 : 2).join(" · ");
    ctx.fillStyle = people.length ? "rgba(255, 255, 255, 0.56)" : "rgba(255, 255, 255, 0.24)";
    ctx.fillText(tags, point.x, point.y + Math.max(radius, 12) + 50);
  }

  if (view.zoom > 4.25 && (selected || hovered)) {
    drawFriendOrbit(city, point, radius, time);
  }
  ctx.restore();
}

function drawFriendOrbit(city, point, radius, time) {
  const people = cityFriends(city.id);
  people.forEach((friend, index) => {
    const star = friendStarPosition(city, friend, index, time);
    const alpha = Math.min(1, (view.zoom - 4.25) / 0.9);
    const nameY = star.y + 22;
    const labelBox = labelBounds(star.x, nameY, Math.max(54, friend.name.length * 13), view.zoom > 5.4 ? 34 : 20);
    if (!reserveLabelBox(labelBox)) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.textBaseline = "alphabetic";
    ctx.font = "600 11px system-ui";
    ctx.fillText(displayFriendName(friend, index), star.x, nameY);
    if (view.zoom > 5.4) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
      ctx.font = "10px system-ui";
      ctx.fillText(`${friend.type} · ${strengthText[friend.strength]}`, star.x, nameY + 14);
    }
    ctx.restore();
  });
}

function render(time = 0) {
  view.zoom += (view.targetZoom - view.zoom) * 0.12;
  view.x += (view.targetX - view.x) * 0.12;
  view.y += (view.targetY - view.y) * 0.12;
  view.lon += (view.targetLon - view.lon) * 0.12;
  view.lat += (view.targetLat - view.lat) * 0.12;

  ctx.clearRect(0, 0, width, height);
  labelBoxes = [];
  drawBackground(time);
  sortedCities().forEach((city) => drawCity(city, time));

  zoomLabel.textContent = view.zoom < 1.25 ? "城市层" : view.zoom < 1.85 ? "氛围层" : "人物层";
  requestAnimationFrame(render);
}

function renderWeights() {
  weightsEl.innerHTML = Object.entries(weights)
    .map(
      ([key, item]) => `
        <div class="weight-row">
          <label for="weight-${key}">
            <span>${item.label}</span>
            <strong data-weight-value="${key}">${item.value}%</strong>
          </label>
          <input id="weight-${key}" data-weight="${key}" type="range" min="0" max="60" step="0.5" value="${item.value}" />
        </div>
      `,
    )
    .join("");
}

function renderFeaturedRecommendations() {
  if (!featuredRecommendationsEl) return;
  const featured = featuredRecommendationCities();
  featuredRecommendationsEl.innerHTML = `
    <div class="featured-head">
      <span>最推荐城市</span>
      <button type="button" data-shuffle-recommendations>随机切换</button>
    </div>
    <div class="featured-card-grid">
      ${featured
        .map((city, index) => {
          const people = cityFriends(city.id);
          const breakdown = recommendationBreakdown(city).sort((a, b) => b.contribution - a.contribution);
          const primary = breakdown[0];
          const secondary = breakdown[1];
          return `
            <button class="featured-city-card tone-${index % 3}" type="button" data-city="${escapeHtml(city.id)}">
              <span class="featured-kicker">${index === 0 ? "Best Match" : `Option ${index + 1}`}</span>
              <strong>${escapeHtml(city.name)}<em>${cityScore(city)}</em></strong>
              <p>${escapeHtml(cityRecommendationReason(city))}</p>
              <span class="featured-metrics">
                <i>${people.length} 位关系</i>
                <i>${escapeHtml(primary.label)} ${primary.value}</i>
                <i>${escapeHtml(secondary.label)} ${secondary.value}</i>
              </span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderRanking() {
  renderFeaturedRecommendations();
  rankingEl.innerHTML = visibleRankingCities()
    .map((city, index) => {
      const people = cityFriends(city.id);
      return `
        <button class="rank-card ${selectedCityId === city.id ? "is-active" : ""}" type="button" data-city="${city.id}">
          <span class="rank-title">${index + 1}. ${escapeHtml(city.name)}</span>
          <span class="rank-score">${cityScore(city)}</span>
          <span class="rank-meta">${people.length} 位关系 · 人脉 ${networkScore(city.id)}</span>
          <span class="rank-tags">${city.mood.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</span>
        </button>
      `;
    })
    .join("");
}

function renderSettings() {
  if (!dashboardStatsEl) return;
  const ranked = visibleRankingCities().slice(0, 5);
  dashboardStatsEl.innerHTML = `
    ${statCard("关系城市", relationshipCities().length)}
    ${statCard("总关系数", friends.length)}
    ${statCard("强关系", strongRelationships().length)}
    ${statCard("推荐最高", ranked[0] ? `${ranked[0].name} ${cityScore(ranked[0])}` : "待添加")}
    <div class="top-city-strip">${escapeHtml(ranked.map((city, index) => `${index + 1}. ${city.name} ${cityScore(city)}`).join(" · ") || "添加关系后生成推荐 Top 5")}</div>
  `;
  if (privacyToggle) privacyToggle.checked = Boolean(userSettings.privacyMode);
}

function renderDetail() {
  const city = cities.find((item) => item.id === selectedCityId) || sortedCities()[0];
  const people = cityFriends(city.id);
  const note = cityNotes[city.id] || {};
  const strongest = people.filter((friend) => friend.strength === "strong");
  const firstContacts = (strongest.length ? strongest : people).slice(0, 2).map((friend, index) => displayFriendName(friend, index)).join("、") || "先补充本地关系";
  const breakdown = recommendationBreakdown(city);

  detailPanel.innerHTML = `
    <button class="panel-rail detail-rail" data-collapse="detailPanel" type="button">城市详情</button>
    <div class="city-hero">
      <h1>${escapeHtml(city.name)}</h1>
      <div class="city-score"><strong>${cityScore(city)}</strong><span>综合推荐</span></div>
      <div class="rank-tags">${city.mood.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
    </div>
    <div class="stat-grid">
      ${statCard("人际支持", networkScore(city.id))}
      ${statCard("工作指数", city.work)}
      ${statCard("生活指数", city.life)}
      ${statCard("成本友好", city.cost)}
    </div>
    <section class="detail-section">
      <h3>城市判断</h3>
      <div class="advice-card">${escapeHtml(city.summary)}</div>
    </section>
    <section class="detail-section">
      <h3>推荐理由解释</h3>
      <div class="explain-list">
        ${breakdown
          .map(
            (item) => `
              <div class="explain-item">
                <strong>${escapeHtml(item.label)}<span>${item.value}</span></strong>
                <div class="explain-bar"><i style="width: ${clamp(item.value, 0, 100)}%"></i></div>
                <p>权重 ${item.weight}% · 贡献 ${item.contribution} · ${escapeHtml(item.detail)}</p>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
    <section class="detail-section">
      <h3>我的备注和感受</h3>
      <div class="city-note-form" data-city-note="${escapeHtml(city.id)}">
        <label>
          <span>备注</span>
          <textarea data-city-note-field="note" rows="3" placeholder="记录这里适合你的原因、担心点或待确认事项">${escapeHtml(note.note || "")}</textarea>
        </label>
        <label>
          <span>感受</span>
          <textarea data-city-note-field="feeling" rows="2" placeholder="例如：想尝试、节奏舒服、机会密集但压力大">${escapeHtml(note.feeling || "")}</textarea>
        </label>
        <button class="mini-action note-save" type="button" data-save-city-note="${escapeHtml(city.id)}">保存备注</button>
      </div>
    </section>
    <section class="detail-section">
      <h3>人际关系</h3>
      <div class="friend-list">
        ${
          people.length
            ? people
                .map(
                  (friend, index) => `
                    <article class="friend-card" data-friend-id="${escapeHtml(friend.id)}">
                      <span class="avatar">${escapeHtml(userSettings.privacyMode ? strengthText[friend.strength] : friend.name.slice(0, 1).toUpperCase())}</span>
                      <div>
                        <strong>${escapeHtml(displayFriendName(friend, index))}</strong>
                        <div class="friend-meta">${escapeHtml(friend.type)} · ${escapeHtml(friend.district || friend.province || "区域未填")} · ${escapeHtml(friend.recent || "最近联系未填")}</div>
                        <div class="friend-meta">${escapeHtml(friend.industry || "未填写职业方向")}</div>
                        <div class="friend-meta">${escapeHtml(friend.support || "支持信息未填")}</div>
                      </div>
                      <div class="friend-actions">
                        <span class="strength-pill ${friend.strength}">${strengthText[friend.strength]}</span>
                        <button class="mini-action" type="button" data-edit-friend="${escapeHtml(friend.id)}">修改</button>
                        <button class="mini-action danger" type="button" data-delete-friend="${escapeHtml(friend.id)}">删除</button>
                      </div>
                    </article>
                  `,
                )
                .join("")
            : `<div class="advice-card">这座城市还没有关系，添加一位朋友后星点会立刻变亮。</div>`
        }
      </div>
    </section>
    <section class="detail-section">
      <h3>如果我去这里</h3>
      <div class="advice-card">
        先联系 ${escapeHtml(firstContacts)}；关注${city.work >= city.life ? "职业机会和行业活动" : "居住区域和日常社交"}；主要风险是${
          city.cost < 60 ? "成本压力偏高" : cityFriends(city.id).length < 2 ? "本地强关系不足" : "需要持续维护节奏"
        }。
      </div>
    </section>
  `;
  detailPanel.classList.add("is-open");
}

function statCard(label, value) {
  return `
    <div class="stat-card">
      <div class="stat-label">${label}</div>
      <div class="stat-value">${value}</div>
    </div>
  `;
}

function renderCompare() {
  fillCompareLocationOptions();

  compareCitiesEl.innerHTML =
    compareIds.length > 0
      ? compareIds
          .map((id) => {
            const city = cities.find((item) => item.id === id);
            if (!city) return "";
            return `
              <button class="compare-chip" type="button" data-remove-compare="${city.id}">
                <span>${escapeHtml(city.name)}</span>
                <small>${escapeHtml(compareDistricts[city.id] || city.province || "")}</small>
                <strong>×</strong>
              </button>
            `;
          })
          .join("")
      : `<div class="compare-empty">从上方选择省份、城市和区域后加入对比。</div>`;

  const selected = compareIds.map((id) => cities.find((city) => city.id === id)).filter(Boolean);
  compareTableEl.innerHTML =
    selected.length >= 2
      ? selected
          .map(
            (city) => `
              <article class="compare-card">
                <strong>${escapeHtml(city.name)}<span>${cityScore(city)}</span></strong>
                <p>${escapeHtml(city.province || "")} · ${escapeHtml(compareDistricts[city.id] || "未指定区域")}</p>
                <p>人际 ${networkScore(city.id)} · ${cityFriends(city.id).length} 人</p>
                <p>工作 ${city.work} · 生活 ${city.life} · 成本 ${city.cost}</p>
                <p>${escapeHtml(city.mood.join(" / "))}</p>
              </article>
            `,
          )
          .join("")
      : `<div class="advice-card">至少选择 2 个城市进行对比。</div>`;
}

function selectedCompareProvinceGroup() {
  const provinceName = compareProvinceEl?.value;
  return cityCatalog.find((group) => group.province === provinceName) || cityCatalog[0];
}

function selectedCompareCatalogCity() {
  const cityId = compareCityEl?.value;
  const group = selectedCompareProvinceGroup();
  return group.cities.find((city) => slugifyCityName(city.name) === cityId) || group.cities[0];
}

function fillCompareLocationOptions() {
  if (!compareProvinceEl) return;
  const previousProvince = compareProvinceEl.value || cityCatalog[0].province;
  const previousCity = compareCityEl.value;
  compareProvinceEl.innerHTML = cityCatalog.map((group) => `<option value="${escapeHtml(group.province)}">${escapeHtml(group.province)}</option>`).join("");
  compareProvinceEl.value = cityCatalog.some((group) => group.province === previousProvince) ? previousProvince : cityCatalog[0].province;
  fillCompareCityOptions(previousCity);
}

function fillCompareCityOptions(preferredCityId) {
  const group = selectedCompareProvinceGroup();
  compareCityEl.innerHTML = group.cities.map((city) => `<option value="${slugifyCityName(city.name)}">${escapeHtml(city.name)}</option>`).join("");
  compareCityEl.value = group.cities.some((city) => slugifyCityName(city.name) === preferredCityId) ? preferredCityId : slugifyCityName(group.cities[0].name);
  fillCompareDistrictOptions();
}

function fillCompareDistrictOptions() {
  const city = selectedCompareCatalogCity();
  compareDistrictEl.innerHTML = city.districts.map((district) => `<option value="${escapeHtml(district)}">${escapeHtml(district)}</option>`).join("");
}

function renderAll() {
  renderWeights();
  renderRanking();
  renderDetail();
  renderSettings();
  renderCompare();
  fillLocationOptions();
}

function selectedProvinceGroup() {
  const provinceName = friendForm.elements.province?.value;
  return cityCatalog.find((group) => group.province === provinceName) || cityCatalog[0];
}

function selectedCatalogCity() {
  const cityId = friendForm.elements.city?.value;
  const group = selectedProvinceGroup();
  return group.cities.find((city) => slugifyCityName(city.name) === cityId) || group.cities[0];
}

function fillLocationOptions(friend = null) {
  const provinceSelect = friendForm.elements.province;
  if (!provinceSelect) return;
  const selectedCity = cities.find((city) => city.id === (friend?.cityId || selectedCityId)) || cities[0];
  provinceSelect.innerHTML = cityCatalog.map((group) => `<option value="${escapeHtml(group.province)}">${escapeHtml(group.province)}</option>`).join("");
  provinceSelect.value = friend?.province || selectedCity.province || cityCatalog[0].province;
  fillCityOptionsForProvince(selectedCity.id);
  if (friend?.cityId) {
    friendForm.elements.city.value = friend.cityId;
    fillDistrictOptions();
  }
  if (friend?.district) friendForm.elements.district.value = friend.district;
}

function fillCityOptionsForProvince(preferredCityId) {
  const citySelect = friendForm.elements.city;
  const group = selectedProvinceGroup();
  citySelect.innerHTML = group.cities.map((city) => `<option value="${slugifyCityName(city.name)}">${escapeHtml(city.name)}</option>`).join("");
  citySelect.value = group.cities.some((city) => slugifyCityName(city.name) === preferredCityId) ? preferredCityId : slugifyCityName(group.cities[0].name);
  fillDistrictOptions();
}

function fillDistrictOptions() {
  const districtSelect = friendForm.elements.district;
  const city = selectedCatalogCity();
  districtSelect.innerHTML = city.districts.map((district) => `<option value="${escapeHtml(district)}">${escapeHtml(district)}</option>`).join("");
}

function setFriendDialogMode(mode) {
  const editing = mode === "edit";
  friendDialogTitle.textContent = editing ? "修改人际关系" : "添加人际关系";
  friendDialogSubtitle.textContent = editing ? "更新这段关系的信息" : "让一座城市多亮一点";
  saveFriendBtn.textContent = editing ? "保存修改" : "保存";
}

function openFriendDialog(friend = null) {
  editingFriendId = friend?.id || null;
  setFriendDialogMode(friend ? "edit" : "add");
  friendForm.reset();
  fillLocationOptions(friend);

  if (friend) {
    friendForm.elements.name.value = friend.name || "";
    friendForm.elements.type.value = friend.type || "朋友";
    friendForm.elements.strength.value = friend.strength || "strong";
    friendForm.elements.industry.value = friend.industry || "";
    friendForm.elements.recent.value = friend.recent || "";
    friendForm.elements.support.value = friend.support || "";
  }

  friendDialog.showModal();
}

function friendFromFormData(data, existing = {}) {
  return {
    ...existing,
    id: existing.id || createFriendId(),
    name: String(data.get("name")).trim(),
    cityId: data.get("city"),
    province: data.get("province"),
    district: data.get("district"),
    type: data.get("type"),
    strength: data.get("strength"),
    industry: String(data.get("industry") || "").trim(),
    support: String(data.get("support") || "").trim(),
    recent: String(data.get("recent") || "").trim(),
  };
}

function focusCity(cityId, zoom = Math.max(view.targetZoom, 4.6)) {
  const city = cities.find((item) => item.id === cityId);
  if (!city) return;
  selectedCityId = cityId;
  selectedFriend = null;
  view.targetLon = city.lng;
  view.targetLat = clamp(city.lat, -58, 58);
  view.targetZoom = Math.min(12, Math.max(0.8, zoom));
  renderRanking();
  renderDetail();
}

function hitCity(x, y) {
  return [...cities].reverse().find((city) => {
    const point = project(city.lat, city.lng);
    if (!point.visible) return false;
    return Math.hypot(point.x - x, point.y - y) < cityHitRadius(city);
  });
}

function saveFriends() {
  const payload = JSON.stringify(friends);
  storageSet(storageKey, payload);
  storageSet(recoveryStorageKey, payload);
  if (friends.length) {
    storageSet(`${recoverySnapshotPrefix}${new Date().toISOString().slice(0, 10)}`, payload);
  }
}

function saveCityNotes() {
  storageSet(cityNotesKey, JSON.stringify(cityNotes));
}

function exportLifeMapData() {
  const payload = {
    app: "LifeMap",
    version: 1,
    exportedAt: new Date().toISOString(),
    friends,
    cityNotes,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `lifemap-backup-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importLifeMapData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(String(reader.result || "{}"));
      const importedFriends = Array.isArray(payload.friends) ? payload.friends : [];
      const importedNotes = payload.cityNotes && typeof payload.cityNotes === "object" ? payload.cityNotes : {};
      friends = importedFriends.map((friend) => ({ ...friend, id: friend.id || createFriendId() })).filter((friend) => friend.name && friend.cityId);
      cityNotes = importedNotes;
      saveFriends();
      saveCityNotes();
      selectedCityId = friends[0]?.cityId || selectedCityId;
      renderAll();
      if (friends[0]?.cityId) focusCity(friends[0].cityId, 2.2);
      window.alert("LifeMap 数据已导入并保存到当前浏览器。");
    } catch {
      window.alert("导入失败：请选择由 LifeMap 导出的 JSON 文件。");
    } finally {
      dataImportInput.value = "";
    }
  });
  reader.readAsText(file);
}

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const delta = event.deltaY > 0 ? 0.88 : 1.14;
  view.targetZoom = Math.min(12, Math.max(0.72, view.targetZoom * delta));
});

canvas.addEventListener("pointerdown", (event) => {
  dragging = true;
  dragDistance = 0;
  lastPointer = { x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (dragging) {
    const dx = event.clientX - lastPointer.x;
    const dy = event.clientY - lastPointer.y;
    dragDistance += Math.hypot(dx, dy);
    view.targetLon -= dx * 0.22 / view.targetZoom;
    view.targetLat = clamp(view.targetLat + dy * 0.18 / view.targetZoom, -68, 68);
    lastPointer = { x: event.clientX, y: event.clientY };
    return;
  }
  const city = hitCity(event.clientX, event.clientY);
  hoverCityId = city?.id || null;
});

canvas.addEventListener("pointerup", (event) => {
  dragging = false;
  if (dragDistance > 8) return;
  const city = hitCity(event.clientX, event.clientY);
  if (city) focusCity(city.id);
});

weightsEl.addEventListener("input", (event) => {
  const key = event.target.dataset.weight;
  if (!key) return;
  weights[key].value = Number(event.target.value);
  const valueLabel = weightsEl.querySelector(`[data-weight-value="${key}"]`);
  if (valueLabel) valueLabel.textContent = `${weights[key].value}%`;
  renderRanking();
  renderDetail();
  renderCompare();
});

rankingEl.addEventListener("click", (event) => {
  const card = event.target.closest("[data-city]");
  if (card) focusCity(card.dataset.city);
});

featuredRecommendationsEl?.addEventListener("click", (event) => {
  const shuffle = event.target.closest("[data-shuffle-recommendations]");
  if (shuffle) {
    recommendationCycle += 1;
    renderFeaturedRecommendations();
    return;
  }
  const card = event.target.closest("[data-city]");
  if (card) focusCity(card.dataset.city);
});

setInterval(() => {
  if (!featuredRecommendationsEl || document.hidden) return;
  recommendationCycle += 1;
  renderFeaturedRecommendations();
}, 5200);

compareCitiesEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-compare]");
  if (!button) return;
  const cityId = button.dataset.removeCompare;
  compareIds = compareIds.filter((id) => id !== cityId);
  delete compareDistricts[cityId];
  renderCompare();
});

document.getElementById("clearCompareBtn").addEventListener("click", () => {
  compareIds = [];
  compareDistricts = {};
  renderCompare();
});

document.getElementById("addCompareBtn").addEventListener("click", () => {
  const cityId = compareCityEl.value;
  if (!cityId || compareIds.includes(cityId) || compareIds.length >= 4) return;
  compareIds = [...compareIds, cityId];
  compareDistricts[cityId] = compareDistrictEl.value;
  renderCompare();
});

compareProvinceEl.addEventListener("change", () => {
  fillCompareCityOptions();
});

compareCityEl.addEventListener("change", () => {
  fillCompareDistrictOptions();
});

document.getElementById("resetViewBtn").addEventListener("click", () => {
  view.targetX = 0;
  view.targetY = 0;
  view.targetZoom = 1;
  view.targetLon = 104;
  view.targetLat = 31;
});

document.getElementById("addFriendBtn").addEventListener("click", () => {
  openFriendDialog();
});

document.getElementById("settingsBtn")?.addEventListener("click", () => {
  settingsPanel?.classList.toggle("is-collapsed");
});

privacyToggle?.addEventListener("change", () => {
  userSettings.privacyMode = privacyToggle.checked;
  saveSettings();
  renderAll();
});

document.getElementById("resetDemoBtn")?.addEventListener("click", () => {
  const confirmed = window.confirm("用示例数据重置当前 LifeMap？这会覆盖当前浏览器里的人际关系和城市备注。");
  if (confirmed) resetDemoData();
});

document.getElementById("exportDataBtn")?.addEventListener("click", exportLifeMapData);

document.getElementById("importDataBtn")?.addEventListener("click", () => {
  dataImportInput?.click();
});

dataImportInput?.addEventListener("change", (event) => {
  importLifeMapData(event.target.files?.[0]);
});

friendForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(friendForm);
  const existingIndex = friends.findIndex((friend) => friend.id === editingFriendId);
  const previous = existingIndex >= 0 ? friends[existingIndex] : {};
  const nextFriend = friendFromFormData(data, previous);

  if (existingIndex >= 0) {
    friends[existingIndex] = nextFriend;
  } else {
    friends.push(nextFriend);
  }

  saveFriends();
  selectedCityId = nextFriend.cityId;
  editingFriendId = null;
  friendDialog.close();
  renderAll();
  focusCity(selectedCityId, 2.05);
});

document.getElementById("closeFriendDialogBtn").addEventListener("click", () => {
  editingFriendId = null;
  friendDialog.close();
});

document.getElementById("cancelFriendBtn").addEventListener("click", () => {
  editingFriendId = null;
  friendDialog.close();
});

friendForm.elements.province.addEventListener("change", () => {
  fillCityOptionsForProvince();
});

friendForm.elements.city.addEventListener("change", () => {
  fillDistrictOptions();
});

friendDialog.addEventListener("click", (event) => {
  if (event.target === friendDialog) {
    editingFriendId = null;
    friendDialog.close();
  }
});

friendDialog.addEventListener("close", () => {
  editingFriendId = null;
});

detailPanel.addEventListener("click", (event) => {
  const saveNoteButton = event.target.closest("[data-save-city-note]");
  if (saveNoteButton) {
    const cityId = saveNoteButton.dataset.saveCityNote;
    const form = saveNoteButton.closest("[data-city-note]");
    if (!cityId || !form) return;
    cityNotes[cityId] = {
      note: form.querySelector('[data-city-note-field="note"]')?.value.trim() || "",
      feeling: form.querySelector('[data-city-note-field="feeling"]')?.value.trim() || "",
    };
    saveCityNotes();
    saveNoteButton.textContent = "已保存";
    setTimeout(() => {
      saveNoteButton.textContent = "保存备注";
    }, 900);
    return;
  }

  const editButton = event.target.closest("[data-edit-friend]");
  if (editButton) {
    const friend = friends.find((item) => item.id === editButton.dataset.editFriend);
    if (friend) openFriendDialog(friend);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-friend]");
  if (!deleteButton) return;

  const friend = friends.find((item) => item.id === deleteButton.dataset.deleteFriend);
  if (!friend) return;
  const confirmed = window.confirm(`删除 ${friend.name} 这段人际关系？`);
  if (!confirmed) return;

  friends = friends.filter((item) => item.id !== friend.id);
  saveFriends();
  selectedCityId = friend.cityId;
  renderAll();
});

function isInteractivePanelTarget(target) {
  return Boolean(target.closest("button, input, select, textarea, label, .rank-card, .friend-card, .compare-card, .weight-row, .advice-card"));
}

function togglePanelFromClick(event) {
  const rail = event.target.closest("[data-collapse]");
  if (rail) {
    const panel = document.getElementById(rail.dataset.collapse);
    if (panel) panel.classList.toggle("is-collapsed");
    return;
  }

  const panel = event.target.closest("#leftPanel, #detailPanel, #compareTray, #settingsPanel");
  if (!panel || panel.classList.contains("is-collapsed") || isInteractivePanelTarget(event.target)) return;
  panel.classList.add("is-collapsed");
}

document.addEventListener("click", togglePanelFromClick);

citySearch.addEventListener("input", (event) => {
  query = event.target.value.trim();
  const normalized = query.toLowerCase();
  const match = cities.find((city) => city.name.includes(query) || cityFriends(city.id).some((friend) => friend.name.toLowerCase().includes(normalized)));
  if (match && query.length >= 1) {
    focusCity(match.id, 1.9);
  }
});

window.addEventListener("resize", resize);

resize();
if (new URLSearchParams(window.location.search).get("demo") === "10") {
  resetDemoData();
  window.history.replaceState({}, "", window.location.pathname);
} else {
  renderAll();
}
loadChinaGeoJson();
loadWorldGeoJson();
requestAnimationFrame(render);
