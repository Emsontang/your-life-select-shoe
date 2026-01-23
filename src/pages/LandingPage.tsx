import React from 'react';
import { LayoutDashboard, Smartphone, Book, ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#18181B] font-sans selection:bg-orange-100 flex flex-col justify-center items-center p-6 md:p-12">

            <div className="max-w-6xl w-full grid md:grid-cols-5 gap-12 items-start">

                {/* Left Column: Personal Intro */}
                <div className="md:col-span-2 space-y-8 md:sticky md:top-12 animate-fade-in-up">
                    <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-8 group">
                        <img
                            src="/assets/creative_idea_process.png"
                            alt="Creative Idea Process"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">邓健聪</h1>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200/50">9年岗位经验</span>
                        </div>
                        <p className="text-lg text-gray-500 font-medium">产品经理 · 需求分析师</p>
                    </div>

                    <div className="space-y-4 text-gray-600 leading-relaxed">
                        <p>
                            深耕产品领域 9 年，专注于构建复杂业务系统与流畅的用户体验。
                            曾在在线教育 K12、软硬件结合等领域主导多个平台级项目。
                        </p>
                        <p>
                            擅长从 0 到 1 搭建产品体系，涵盖在线作业系统、教辅数字化平台、
                            智能书柜 IoT 系统以及智慧课堂解决方案。
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <a href="mailto:contact@portfolio.com" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
                            <Mail size={18} />
                            <span className="font-medium group-hover:underline decoration-gray-300 underline-offset-4">contact@portfolio.com</span>
                        </a>
                    </div>
                </div>

                {/* Right Column: Prototype Showcase */}
                <div className="md:col-span-3 bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] border border-gray-100 md:min-h-[600px] flex flex-col justify-center animate-fade-in-up delay-100">

                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">示例原型</h2>
                            <span className="h-px flex-1 bg-gray-100"></span>
                        </div>
                        <p className="text-xl italic font-serif text-gray-600 mb-6">LifeSelect - Japandi Lifestyle Shop</p>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100/50">
                            <h3 className="text-xs font-bold text-orange-600 tracking-wider uppercase mb-3">Project Brief</h3>
                            <p className="text-gray-600 text-sm leading-7 mb-4">
                                此原型完全由 Google Gemini 驱动的 Agentic Coding 工具 <strong>Antigravity</strong> 开发。
                                <br />
                                针对不同的居家“人设”，提供不同的家具或生活用品严选电商。设计风格追求日式简约 (Japandi)，强调温暖、自然与秩序感。
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {['E-commerce', 'Minimalist', 'Prototype', 'React', 'Tailwind'].map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-medium text-gray-500">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <PrototypeCard
                            icon={<Smartphone />}
                            title="APP 端展示"
                            desc="移动端响应式商城，包含个性化首页、购物车、个人中心"
                            link="/app"
                        />
                        <PrototypeCard
                            icon={<LayoutDashboard />}
                            title="管理后台"
                            desc="运营中心 Dashboard，包含数据可视化、订单管理、内容审核"
                            link="/admin"
                            highlight
                        />
                        <PrototypeCard
                            icon={<Book />}
                            title="PRD 文档"
                            desc="在线产品需求文档，包含原型交互说明"
                            link="/docs/prd"
                        />
                    </div>

                </div>

            </div>
        </div>
    );
};

interface PrototypeCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    link: string;
    highlight?: boolean;
}

const PrototypeCard: React.FC<PrototypeCardProps> = ({ icon, title, desc, link, highlight }) => {
    return (
        <Link
            to={link}
            className={`group relative flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-100/50 ${highlight ? 'bg-orange-50 border-orange-100/50' : 'bg-white border-gray-100 hover:border-gray-200'}`}
        >
            <div className={`p-3 rounded-xl transition-colors ${highlight ? 'bg-white text-orange-500 shadow-sm' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute md:static md:block">{desc}</p>
            </div>
            <div className="text-gray-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1">
                <ArrowRight size={20} />
            </div>
        </Link>
    );
}
