import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';

const DOCS_MAP: Record<string, string> = {
    '/app/home': `
## 1. 首页 (Home)
**路径**: \`/app/home\`

### 1. 功能名称
动态场景化首页 (Dynamic Scenario Home)

### 2. 需求描述
作为流量分发核心页，根据用户当前的“生活状态（身份）”，动态重组导航结构（Tab）和推荐内容，实现“千人千面”的严选体验。

### 3. 前置条件
- 用户本地存储 (LocalStorage) 中必须有默认身份 ID（如 persona_id: 'single'）。
- 后台必须已配置好该身份关联的空间列表。

### 4. 逻辑描述
- **初始化渲染**： 页面加载时读取当前身份 ID。
- **Tab 栏构建**： 根据身份 ID，从 Mock 数据中获取关联的空间列表（如：单身 -> [推荐, 客厅, 卧室]），动态渲染顶部 Tab。
- **内容过滤 (Feed流)**：
  - 获取 Mock 商品库。
  - **筛选规则**： 商品.适用人群 包含当前身份 AND 商品.适用空间 包含当前选中 Tab。
- **Banner 逻辑**： 展示标记为 featured 且符合当前过滤条件的商品，点击跳转详情页。
- **身份切换**： 点击右上角胶囊按钮，呼出底部弹窗。切换后，写入新的身份 ID 并强制刷新页面 Tab 和 Feed。

### 5. 异常情况
- **空数据**： 若当前组合下无匹配商品，展示缺省插画（“暂无推荐”），隐藏 Feed 流。
`,
    '/app/category': `
## 2. 分类页 (Category)
**路径**: \`/app/category\`

### 1. 功能名称
物理类目导航 (Physical Category Navigation)

### 2. 需求描述
提供基于商品物理属性（如桌、椅、床）的查找路径，覆盖全量商品，不受身份标签限制。

### 3. 前置条件
- 后台已配置好层级化的类目树（一级 -> 二级）。

### 4. 逻辑描述
- **布局渲染**： 采用“左侧一级导航 + 右侧二级网格”的经典双栏布局。
- **一级导航**： 默认选中列表的第一项，高亮显示。
- **二级联动**： 点击左侧一级类目，右侧实时过滤并渲染对应的二级类目图标。
- **跳转逻辑**： 点击右侧二级图标，跳转至【通用商品列表页】，并传递 category_id 参数。

### 5. 异常情况
- **无子类目**： 若某一级类目下无二级配置，右侧显示“暂无分类”。
`,
    '/app/cart': `
## 3. 购物车 (Cart)
**路径**: \`/app/cart\`

### 1. 功能名称
购物车与模拟结算 (Cart & Checkout)

### 2. 需求描述
展示用户意向商品，提供数量增减、删除及模拟支付功能。

### 3. 前置条件
- 全局状态 CartStore 中存有已加购的商品数据。

### 4. 逻辑描述
- **列表渲染**： 遍历 CartStore，计算每项小计（单价 x 数量）。
- **编辑操作**： 支持步进器（+/-）修改数量；支持左滑删除商品。
- **合计计算**： 实时计算所有勾选商品的总金额。
- **模拟结算**： 点击“去结算”按钮 -> 弹出 Loading -> 2秒后提示“支付成功” -> 清空购物车 -> 跳转至【我的】页面。

### 5. 异常情况
- **空购物车**： 若 CartStore 长度为 0，展示空状态插画及“去逛逛”按钮（跳转首页）。
`,
    '/app/product': `
## 4. 商品详情页 (Product Detail)
**路径**: \`/app/product/:id\`

### 1. 功能名称
商品详情与搭配推荐 (PDP & Scenario Match)

### 2. 需求描述
展示商品详细信息，并利用算法推荐“同场景”下的搭配商品，促进连带销售。

### 3. 前置条件
- URL 中包含有效的 product_id。

### 4. 逻辑描述
- **基础展示**： 渲染图、标题、价格、规格。
- **场景搭配 (核心)**：
  - **算法逻辑**：在商品库中查找 适用人群 与 适用空间 与当前商品完全一致的其他商品（排除自身）。
  - **展示**：横向滚动卡片列表。
- **加购**： 点击底部“加入购物车”，更新全局 CartStore，图标数字 +1。

### 5. 异常情况
- **商品不存在**： URL 参数错误时，显示 404 页面或自动返回首页。
`,
    '/admin/tags': `
## 1. 标签配置管理 (Tag Config)
**路径**: \`/admin/tags\`

### 1. 功能名称
场景映射配置 (Scenario Logic Configuration)

### 2. 需求描述
系统的“核心大脑”，定义“人群”与“空间”的映射关系，直接决定 App 端的导航结构。

### 3. 前置条件
- 无特殊前置，加载默认 Mock 配置。

### 4. 逻辑描述
- **空间管理**： 简单的增删改查（CRUD）空间标签池（如客厅、卧室）。
- **人群关联**：
  - 左侧选择一个“人群”（如单身贵族）。
  - 右侧展示所有“空间”的复选框 (Checkbox)。
- **保存逻辑**： 勾选/取消勾选后，更新 Mock 数据的映射关系。
- **实时同步**： 此处的修改必须实时反映在 App 端的首页 Tab 栏中（基于共享状态）。

### 5. 异常情况
- **删除校验**： 若某空间已被关联到商品，删除时应给予警告提示。
`,
    '/app/inspiration': `
## 灵感社区 (Inspiration)
**路径**: \`/app/inspiration\`

### 1. 功能名称
灵感社区与种草 (Community & Seeds)

### 2. 需求描述
核心内容板块。通过 UGC/PGC 图文内容激发用户购买欲望，并提供“文中同款”的直接转化链路。

### 3. 前置条件
Mock 数据中需包含带有 linkedProductIds 的帖子数据。

### 4. 逻辑描述
- **瀑布流渲染**： 按热度（点赞数）或时间倒序展示帖子卡片。
- **转化链路**： 详情页文案下方自动渲染“文中同款”商品列表。点击商品卡片 -> 跳转至商品详情页 (PDP)。
- **评论展示**： 读取评论列表。若字段 isHidden=true（后台已控评），则前端不予展示；若 reply 字段有值，则高亮展示“官方回复”区域。

### 5. 异常情况
- **若关联的商品已下架**： 列表中应自动隐藏该商品卡片。
`,
    '/admin/products': `
## 商品管理 (Product Lifecycle)
**路径**: \`/admin/products\`

### 1. 功能名称
商品全生命周期管理

### 2. 需求描述
提供商品的查询、库存调整及上下架控制，是运营人员最高频使用的页面。

### 3. 逻辑描述
- **筛选查询**： 支持按“商品名称”模糊搜索，或按“物理类目”筛选。
- **库存管理**： 支持在列表直接修改库存数值，失去焦点自动保存。
- **上下架**： 切换开关。关闭后，App 端首页 Feed 流及搜索结果中将隐藏该商品。

### 4. 异常情况
- **关联推广**： 若商品参与了“首页 Banner”推广，尝试下架时应弹出警告：“该商品正在推广中，请先下线轮播图”。
`,
    '/admin/orders': `
## 订单管理 (Order Fulfillment)
**路径**: \`/admin/orders\`

### 1. 功能名称
订单履约中心

### 2. 需求描述
监控全平台订单状态，执行发货履约及售后审核操作。

### 3. 逻辑描述
- **状态流转**： 待支付 -> 待发货 -> (运营点击发货) -> 已发货 -> 交易完成。
- **发货操作**： 仅“待发货”状态订单可操作。点击弹出模态框，填写物流单号后，状态变更为“已发货”，并写入发货时间。
- **售后处理**： “售后”Tab 下展示申请退款的订单，点击“同意退款”可终结订单状态。
`,
    '/admin/content': `
## 社区运营 (Content Moderation)
**路径**: \`/admin/content\`

### 1. 功能名称
内容风控与互动管理

### 2. 需求描述
维护社区氛围，审核 UGC 内容合规性，并对用户评论进行官方回复或风险屏蔽。

### 3. 逻辑描述
- **帖子审核**： 违规内容点击“下架”，前台灵感流不再展示。
- **评论控评**： 点击“隐藏”开关，设置 isHidden=true，前台即时消失。
- **官方回复**： 针对用户差评或咨询，管理员输入回复内容。保存后，前台评论区显示带有“商家”标识的回复气泡。
`,
    '/admin/banners': `
## 轮播配置 (Traffic Distribution)
**路径**: \`/admin/banners\`

### 1. 功能名称
精细化流量分发

### 2. 需求描述
管理 App 首页顶部轮播位，支持基于“人群标签”的定向展示逻辑。

### 3. 逻辑描述
- **人群定向**： 新增 Banner 时需选择可见人群（如：单身贵族）。
- **前台联动**： 当 App 用户处于“单身模式”时，仅能看到后台配置为“单身”或“全部”的 Banner。
- **跳转配置**： 必须关联一个有效的 Product ID 或 文章链接。
`
};

// Default fallback
const DEFAULT_DOC = "在此处展示该页面的功能需求说明。\n(暂无特定文档)";

interface ReqSidebarProps {
    position?: 'fixed' | 'absolute';
}

export const ReqSidebar: React.FC<ReqSidebarProps> = ({ position = 'fixed' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Basic path matching (ignoring IDs for now if simplest)
    // For /app/product/:id we might need partial match
    const pathname = location.pathname;
    let docContent = DOCS_MAP[pathname];

    if (!docContent) {
        if (pathname.startsWith('/app/product/')) docContent = DOCS_MAP['/app/product'];
        else if (pathname === '/' || pathname === '/app') docContent = DOCS_MAP['/app/home']; // Default to home doc
        else docContent = DEFAULT_DOC;
    }

    const posClass = position === 'fixed' ? 'fixed' : 'absolute';

    return (
        <>
            {/* Floating Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className={`${posClass} top-24 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border border-l-stone rounded-l-full px-3 py-2 flex items-center gap-2 text-sm font-medium text-text hover:bg-stone transition-all transform hover:translate-x-[-4px]`}
                title="需求说明"
            >
                <FileText size={18} className="text-primary" />
                <span className="hidden sm:inline">需求说明</span>
            </button>

            {/* Overlay Backdrop */}
            {isOpen && (
                <div
                    className={`${posClass} inset-0 bg-black/20 z-[60] backdrop-blur-sm`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer Panel */}
            <div className={`${posClass} right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-[70] transform transition-transform duration-300 ease-out border-l border-stone p-6 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-text">
                        <span className="w-2 h-6 bg-primary rounded-full" />
                        需求说明
                    </h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-stone rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide -mx-2 px-2">
                    <div className="prose prose-sm prose-stone max-w-none">
                        <div className="text-sm leading-relaxed text-gray-600 bg-background p-4 rounded-xl border border-stone">
                            <ReactMarkdown>{docContent}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-6 border-t border-stone shrink-0">
                    <p className="text-xs text-gray-400">当前路径: {pathname}</p>
                </div>
            </div>
        </>
    );
};
