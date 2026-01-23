import { useMockData, type TargetPersona } from '../../context/MockDataContext';
import { Users, User, Globe, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminBannerManagement: React.FC = () => {
    const { banners, toggleBannerActive } = useMockData();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">轮播配置</h2>
                    <p className="text-gray-500 mt-1">管理首页顶部轮播图及人群定向策略。</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90">
                    + 新增轮播
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {banners.map(banner => (
                    <div key={banner.id} className={`bg-white rounded-xl p-4 shadow-sm border ${banner.active ? 'border-gray-200' : 'border-gray-100 opacity-75'}`}>
                        <div className="flex gap-6 items-center">
                            {/* Image Preview */}
                            <div className="w-48 aspect-video rounded-lg overflow-hidden bg-gray-100 relative group">
                                <img src={banner.image} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg text-gray-800">{banner.title}</h3>
                                    <PersonaBadge target={banner.targetPersona} />
                                </div>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <p>跳转目标: 商品 {banner.linkProductId || '无'}</p>
                                    <p>ID: {banner.id}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col items-end gap-3 px-4">
                                <button
                                    onClick={() => toggleBannerActive(banner.id)}
                                    className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-full transition-colors ${banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    {banner.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                    {banner.active ? '启用中' : '已停用'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PersonaBadge = ({ target }: { target: TargetPersona }) => {
    const config = {
        all: { icon: Globe, text: '全量用户', color: 'bg-blue-100 text-blue-700' },
        single: { icon: User, text: '单身贵族', color: 'bg-purple-100 text-purple-700' },
        family: { icon: Users, text: '三口之家', color: 'bg-orange-100 text-orange-700' },
        couple: { icon: User, text: '幸福爱侣', color: 'bg-pink-100 text-pink-700' },
        three_gens: { icon: Users, text: '三代同堂', color: 'bg-green-100 text-green-700' }
    };
    const { icon: Icon, text, color } = config[target];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
            <Icon size={12} />
            {text}
        </span>
    );
};
