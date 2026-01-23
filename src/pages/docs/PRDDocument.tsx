import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Users, ShoppingBag, LayoutGrid, Sparkles, Settings, Package, Truck, Tag, Gift, UserCircle } from 'lucide-react';

export const PRDDocument: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/app/home" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <ArrowLeft size={20} className="text-slate-600" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200">
                                <FileText size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">LifeSelect PRD</h1>
                                <p className="text-xs text-slate-400">产品需求文档 v2.0</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400">
                        更新日期：2026-01-23
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">

                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium">
                        <Sparkles size={16} />
                        家居严选电商平台
                    </div>
                    <h2 className="text-4xl font-bold text-slate-800 leading-tight">
                        LifeSelect<br />
                        <span className="text-orange-500">千人千面的居家生活方式</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        基于用户"生活身份"的场景化家居电商平台，通过人群标签与空间标签的智能匹配，
                        为不同生活方式的用户提供个性化的商品推荐与内容种草体验。
                    </p>
                </section>

                {/* Quick Navigation */}
                <nav className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">目录导航</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: '产品概述', href: '#overview' },
                            { label: '用户角色', href: '#personas' },
                            { label: 'App功能', href: '#app-features' },
                            { label: '管理后台', href: '#admin-features' },
                            { label: '会员体系', href: '#membership' },
                            { label: '数据模型', href: '#data-model' },
                            { label: '技术架构', href: '#tech-stack' },
                            { label: '里程碑', href: '#milestones' },
                        ].map(item => (
                            <a key={item.href} href={item.href} className="px-4 py-3 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 rounded-xl text-sm font-medium transition-colors text-center">
                                {item.label}
                            </a>
                        ))}
                    </div>
                </nav>

                {/* Section 1: Overview */}
                <section id="overview" className="space-y-8">
                    <SectionHeader icon={<FileText />} title="一、产品概述" />

                    <div className="grid md:grid-cols-2 gap-6">
                        <InfoCard title="产品定位">
                            <p>LifeSelect 是一款面向中国家庭用户的<strong>场景化家居电商平台</strong>。</p>
                            <p>核心差异点：基于用户"生活身份"进行个性化的商品推荐与内容展示，而非传统的搜索+类目导购模式。</p>
                        </InfoCard>

                        <InfoCard title="目标用户">
                            <ul className="list-disc list-inside space-y-1">
                                <li>25-45岁城市中产阶级</li>
                                <li>追求生活品质的年轻人</li>
                                <li>有明确家居改造需求的家庭</li>
                                <li>偏好"种草"式消费决策的用户</li>
                            </ul>
                        </InfoCard>
                    </div>

                    <InfoCard title="核心价值主张" fullWidth>
                        <div className="grid md:grid-cols-3 gap-6">
                            <ValueItem
                                title="千人千面"
                                desc="根据用户生活方式推荐契合的商品与内容"
                            />
                            <ValueItem
                                title="场景驱动"
                                desc="以居家空间（客厅、卧室等）组织商品展示"
                            />
                            <ValueItem
                                title="内容种草"
                                desc="UGC/PGC内容激发购买欲望，缩短决策路径"
                            />
                        </div>
                    </InfoCard>
                </section>

                {/* Section 2: Personas */}
                <section id="personas" className="space-y-8">
                    <SectionHeader icon={<Users />} title="二、用户角色定义" />

                    <p className="text-slate-600">系统预设四种"生活身份"标签，每种身份关联不同的居家空间：</p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <PersonaCard
                            name="单身贵族"
                            id="single"
                            icon="👤"
                            spaces={['客厅', '厨房', '浴室', '卧室']}
                            desc="独居用户，注重个人生活品质，偏好精致小物件"
                        />
                        <PersonaCard
                            name="幸福爱侣"
                            id="couple"
                            icon="💕"
                            spaces={['客厅', '卧室', '厨房', '浴室']}
                            desc="二人世界，关注浪漫与舒适，追求高颜值家居"
                        />
                        <PersonaCard
                            name="三口之家"
                            id="family"
                            icon="👨‍👩‍👧"
                            spaces={['客厅', '卧室', '儿童房', '厨房', '阳台', '浴室']}
                            desc="有孩家庭，需要安全实用的儿童专属空间"
                        />
                        <PersonaCard
                            name="三代同堂"
                            id="three_gens"
                            icon="🏠"
                            spaces={['客厅', '卧室', '儿童房', '厨房', '阳台', '浴室']}
                            desc="多代同居，全场景覆盖，注重全家舒适"
                        />
                    </div>

                    <InfoCard title="空间分类（Space）" fullWidth>
                        <div className="flex flex-wrap gap-2">
                            {['客厅 living', '卧室 bedroom', '厨房 kitchen', '书房 workspace', '儿童房 kids_room', '浴室 bathroom', '阳台 balcony'].map(s => (
                                <span key={s} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">{s}</span>
                            ))}
                        </div>
                    </InfoCard>
                </section>

                {/* Section 3: App Features */}
                <section id="app-features" className="space-y-8">
                    <SectionHeader icon={<ShoppingBag />} title="三、App端功能模块" />

                    <div className="space-y-4">
                        <FeatureRow
                            icon={<LayoutGrid />}
                            title="首页 /app/home"
                            features={[
                                '身份切换胶囊按钮',
                                '空间Tab动态导航',
                                '轮播Banner（人群定向）',
                                '推荐商品瀑布流',
                            ]}
                        />
                        <FeatureRow
                            icon={<Tag />}
                            title="分类页 /app/category"
                            features={[
                                '左侧一级类目导航',
                                '右侧二级类目网格',
                                '点击跳转商品列表',
                            ]}
                        />
                        <FeatureRow
                            icon={<Sparkles />}
                            title="灵感社区 /app/inspiration"
                            features={[
                                '瀑布流帖子展示',
                                '图片/视频混合内容',
                                '"文中同款"商品关联',
                                '评论区+官方回复',
                            ]}
                        />
                        <FeatureRow
                            icon={<Package />}
                            title="商品详情 /app/product/:id"
                            features={[
                                '商品大图+信息展示',
                                '场景搭配推荐算法',
                                '加入购物车',
                            ]}
                        />
                        <FeatureRow
                            icon={<ShoppingBag />}
                            title="购物车 /app/cart"
                            features={[
                                '商品列表+数量调整',
                                '会员折扣自动计算',
                                '优惠券选择与抵扣',
                                '模拟结算流程',
                            ]}
                        />
                        <FeatureRow
                            icon={<UserCircle />}
                            title="个人中心 /app/profile"
                            features={[
                                '3D翻转会员卡片',
                                '等级进度与权益',
                                '订单快捷入口',
                                '发布笔记/意见反馈',
                            ]}
                        />
                        <FeatureRow
                            icon={<Truck />}
                            title="订单管理 /app/orders"
                            features={[
                                '五状态Tab筛选',
                                '付款/确认收货操作',
                                '订单详情查看',
                            ]}
                        />
                        <FeatureRow
                            icon={<Gift />}
                            title="领券中心 /app/coupon"
                            features={[
                                '现金券/折扣券展示',
                                '一键领取',
                                '等级限制提示',
                            ]}
                        />
                    </div>
                </section>

                {/* Section 4: Admin Features */}
                <section id="admin-features" className="space-y-8">
                    <SectionHeader icon={<Settings />} title="四、管理后台功能" />

                    <div className="grid md:grid-cols-2 gap-4">
                        <AdminCard
                            title="标签配置"
                            path="/admin/tags"
                            desc="人群与空间的映射关系配置，实时同步App端导航"
                        />
                        <AdminCard
                            title="商品管理"
                            path="/admin/products"
                            desc="商品CRUD、库存管理、上下架控制"
                        />
                        <AdminCard
                            title="订单履约"
                            path="/admin/orders"
                            desc="订单状态监控、发货操作、售后处理"
                        />
                        <AdminCard
                            title="社区运营"
                            path="/admin/content"
                            desc="帖子审核、评论控评、官方回复"
                        />
                        <AdminCard
                            title="轮播配置"
                            path="/admin/banners"
                            desc="首页Banner管理，支持人群定向"
                        />
                        <AdminCard
                            title="营销活动"
                            path="/admin/marketing"
                            desc="优惠券创建与发放管理"
                        />
                        <AdminCard
                            title="用户管理"
                            path="/admin/users"
                            desc="用户信息查看、等级管理"
                        />
                    </div>
                </section>

                {/* Section 5: Membership */}
                <section id="membership" className="space-y-8">
                    <SectionHeader icon={<Gift />} title="五、会员等级体系" />

                    <div className="grid md:grid-cols-4 gap-4">
                        <TierCard
                            tier="居家新人"
                            condition="累计消费 < ¥500"
                            discount="无折扣"
                            color="gray"
                        />
                        <TierCard
                            tier="主理人 Lv1"
                            condition="累计消费 ≥ ¥500"
                            discount="95折"
                            color="blue"
                        />
                        <TierCard
                            tier="主理人 Lv2"
                            condition="年消费 ≥ ¥1000"
                            discount="9折"
                            color="purple"
                        />
                        <TierCard
                            tier="空间之神"
                            condition="年消费 ≥ ¥2000"
                            discount="8折"
                            color="amber"
                        />
                    </div>

                    <InfoCard title="等级规则说明" fullWidth>
                        <ul className="space-y-2 text-sm">
                            <li><strong>升级条件</strong>：达到累计/年消费门槛自动升级</li>
                            <li><strong>保级规则</strong>：每年1月1日根据上年消费重新计算</li>
                            <li><strong>降级规则</strong>：年消费未达当前等级门槛则降一级</li>
                            <li><strong>折扣叠加</strong>：会员折扣与优惠券可叠加使用</li>
                        </ul>
                    </InfoCard>
                </section>

                {/* Section 6: Data Model */}
                <section id="data-model" className="space-y-8">
                    <SectionHeader icon={<LayoutGrid />} title="六、核心数据模型" />

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-x-auto">
                        <div className="font-mono text-sm space-y-6 text-slate-700">
                            <CodeBlock title="Product 商品">
                                {`{
  id: string
  name: string
  price: number
  image: string
  categoryId: string      // 二级类目
  personaIds: PersonaId[] // 适用人群
  spaceIds: SpaceId[]     // 适用空间
  stock: number
  isOnShelf: boolean
}`}
                            </CodeBlock>

                            <CodeBlock title="Order 订单">
                                {`{
  id: string
  user: string
  status: 'unpaid' | 'pending_shipment' | 'shipped' | 'completed' | 'refunded'
  items: CartItem[]
  total: number
  date: string
  trackingNumber?: string
}`}
                            </CodeBlock>

                            <CodeBlock title="Post 帖子">
                                {`{
  id: string
  user: string
  userAvatar: string
  title: string
  content: string
  media: MediaItem[]      // 图片/视频
  linkedProductIds: string[]
  likes: number
  date: string
}`}
                            </CodeBlock>
                        </div>
                    </div>
                </section>

                {/* Section 7: Tech Stack */}
                <section id="tech-stack" className="space-y-8">
                    <SectionHeader icon={<Settings />} title="七、技术架构" />

                    <div className="grid md:grid-cols-3 gap-4">
                        <TechCard category="前端框架" items={['React 18', 'TypeScript', 'Vite', 'React Router 6']} />
                        <TechCard category="样式方案" items={['Tailwind CSS', 'Lucide Icons', 'CSS动画']} />
                        <TechCard category="状态管理" items={['React Context', 'MockDataProvider', 'LocalStorage（规划）']} />
                    </div>
                </section>

                {/* Section 8: Milestones */}
                <section id="milestones" className="space-y-8">
                    <SectionHeader icon={<Sparkles />} title="八、版本迭代计划" />

                    <div className="space-y-4">
                        <MilestoneCard
                            version="v1.0"
                            status="已完成"
                            title="MVP基础版"
                            items={['首页场景化导航', '商品详情与加购', '购物车与模拟结算', '分类浏览']}
                        />
                        <MilestoneCard
                            version="v2.0"
                            status="当前版本"
                            title="社区与运营"
                            items={['灵感社区（图文/视频）', '会员等级体系', '优惠券系统', '订单全流程', '管理后台全功能']}
                        />
                        <MilestoneCard
                            version="v3.0"
                            status="规划中"
                            title="智能推荐"
                            items={['基于行为的个性化推荐', '搜索功能', '收藏夹', '真实支付接入', '物流追踪']}
                        />
                    </div>
                </section>

                {/* Footer */}
                <footer className="pt-12 pb-8 border-t border-slate-200 text-center text-sm text-slate-400">
                    <p>LifeSelect PRD v2.0 · 产品团队出品</p>
                    <p className="mt-2">
                        <Link to="/app/home" className="text-orange-500 hover:underline">进入App</Link>
                        {' · '}
                        <Link to="/admin" className="text-orange-500 hover:underline">进入后台</Link>
                    </p>
                </footer>
            </main>
        </div>
    );
};

// ========== Helper Components ==========

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
            {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
);

const InfoCard = ({ title, children, fullWidth }: { title: string; children: React.ReactNode; fullWidth?: boolean }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${fullWidth ? '' : ''}`}>
        <h3 className="font-bold text-slate-700 mb-3">{title}</h3>
        <div className="text-sm text-slate-600 space-y-2">{children}</div>
    </div>
);

const ValueItem = ({ title, desc }: { title: string; desc: string }) => (
    <div className="text-center">
        <div className="text-lg font-bold text-orange-500">{title}</div>
        <p className="text-sm text-slate-500 mt-1">{desc}</p>
    </div>
);

const PersonaCard = ({ name, id, icon, spaces, desc }: { name: string; id: string; icon: string; spaces: string[]; desc: string }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{icon}</span>
            <div>
                <h4 className="font-bold text-slate-800">{name}</h4>
                <code className="text-xs text-slate-400">{id}</code>
            </div>
        </div>
        <p className="text-sm text-slate-500 mb-3">{desc}</p>
        <div className="flex flex-wrap gap-1">
            {spaces.map(s => (
                <span key={s} className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-xs">{s}</span>
            ))}
        </div>
    </div>
);

const FeatureRow = ({ icon, title, features }: { icon: React.ReactNode; title: string; features: string[] }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-slate-700 mb-2">{title}</h4>
            <div className="flex flex-wrap gap-2">
                {features.map(f => (
                    <span key={f} className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs">{f}</span>
                ))}
            </div>
        </div>
    </div>
);

const AdminCard = ({ title, path, desc }: { title: string; path: string; desc: string }) => (
    <Link to={path} className="block bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-orange-200 transition-all">
        <h4 className="font-bold text-slate-700">{title}</h4>
        <code className="text-xs text-slate-400">{path}</code>
        <p className="text-sm text-slate-500 mt-2">{desc}</p>
    </Link>
);

const TierCard = ({ tier, condition, discount, color }: { tier: string; condition: string; discount: string; color: string }) => {
    const colorMap: Record<string, string> = {
        gray: 'from-gray-400 to-gray-500',
        blue: 'from-blue-500 to-sky-600',
        purple: 'from-purple-600 to-indigo-700',
        amber: 'from-amber-500 to-orange-600',
    };
    return (
        <div className={`rounded-2xl p-5 text-white bg-gradient-to-br ${colorMap[color]} shadow-lg`}>
            <h4 className="font-bold text-lg">{tier}</h4>
            <p className="text-sm opacity-80 mt-1">{condition}</p>
            <div className="mt-4 text-2xl font-bold">{discount}</div>
        </div>
    );
};

const TechCard = ({ category, items }: { category: string; items: string[] }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h4 className="font-bold text-slate-700 mb-3">{category}</h4>
        <div className="space-y-1">
            {items.map(item => (
                <div key={item} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                    {item}
                </div>
            ))}
        </div>
    </div>
);

const CodeBlock = ({ title, children }: { title: string; children: string }) => (
    <div>
        <div className="text-xs text-orange-500 font-bold mb-1">{title}</div>
        <pre className="bg-slate-50 p-3 rounded-lg overflow-x-auto text-slate-700">
            {children}
        </pre>
    </div>
);

const MilestoneCard = ({ version, status, title, items }: { version: string; status: string; title: string; items: string[] }) => {
    const isComplete = status === '已完成';
    const isCurrent = status === '当前版本';
    return (
        <div className={`bg-white rounded-xl p-5 shadow-sm border-2 ${isCurrent ? 'border-orange-400' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${isCurrent ? 'text-orange-500' : 'text-slate-700'}`}>{version}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${isComplete ? 'bg-green-100 text-green-600' :
                        isCurrent ? 'bg-orange-100 text-orange-600' :
                            'bg-slate-100 text-slate-500'
                        }`}>{status}</span>
                </div>
                <span className="font-medium text-slate-600">{title}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map(item => (
                    <span key={item} className={`px-2 py-1 rounded text-xs ${isComplete ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'}`}>
                        {isComplete ? '✓ ' : ''}{item}
                    </span>
                ))}
            </div>
        </div>
    );
};
