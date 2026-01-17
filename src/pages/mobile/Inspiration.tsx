import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Heart, X, Store, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MobileInspiration: React.FC = () => {
    const { posts, products, comments } = useMockData();
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const activePost = selectedPostId ? posts.find(p => p.id === selectedPostId) : null;
    const postComments = activePost ? comments.filter(c => c.postId === activePost.id && !c.isHidden) : [];
    const linkedProducts = activePost ? products.filter(p => activePost.linkedProductIds.includes(p.id)) : [];

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-center">
                <h1 className="text-lg font-bold text-gray-900">灵感社区</h1>
            </header>

            {/* Masonry Grid */}
            <div className="p-2 grid grid-cols-2 gap-2">
                {posts.map(post => (
                    <div
                        key={post.id}
                        onClick={() => setSelectedPostId(post.id)}
                        className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-95"
                    >
                        <div className="relative aspect-[3/4]">
                            <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                            <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{post.title}</h3>
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <img src={post.userAvatar} alt={post.user} className="w-5 h-5 rounded-full" />
                                    <span className="text-xs text-gray-500 truncate max-w-[60px]">{post.user}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Heart size={14} />
                                    <span className="text-xs">{post.likes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {activePost && (
                <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                    {/* Sticky Header */}
                    <div className="sticky top-0 flex items-center justify-between px-4 h-14 bg-white/95 backdrop-blur z-10 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <img src={activePost.userAvatar} alt="" className="w-8 h-8 rounded-full" />
                            <span className="font-bold text-sm text-gray-800">{activePost.user}</span>
                        </div>
                        <button onClick={() => setSelectedPostId(null)} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={24} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="pb-24">
                        {/* Images Carousel (Simplified) */}
                        <div className="w-full aspect-[4/5] bg-gray-100">
                            <img src={activePost.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>

                        <div className="p-4">
                            <h1 className="text-xl font-bold text-gray-900 mb-3">{activePost.title}</h1>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{activePost.content}</p>
                            <p className="mt-4 text-xs text-gray-400">{activePost.date}</p>
                        </div>

                        {/* Linked Products */}
                        {linkedProducts.length > 0 && (
                            <div className="px-4 py-6 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Store size={16} className="text-primary" />
                                    文中同款
                                </h3>
                                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                    {linkedProducts.map(p => (
                                        <Link
                                            key={p.id}
                                            to={`/app/product/${p.id}`}
                                            className="shrink-0 w-64 flex gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100 active:bg-gray-100"
                                        >
                                            <img src={p.image} className="w-16 h-16 rounded-md object-cover bg-white" />
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{p.name}</h4>
                                                <span className="text-sm font-bold text-primary mt-1">¥{p.price}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comments */}
                        <div className="px-4 py-6 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">共 {postComments.length} 条评论</h3>
                            <div className="space-y-6">
                                {postComments.map(c => (
                                    <div key={c.id} className="flex gap-3">
                                        <img src={c.userAvatar} className="w-8 h-8 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-medium text-gray-500">{c.user}</span>
                                                <span className="text-[10px] text-gray-300">{c.date}</span>
                                            </div>
                                            <p className="text-sm text-gray-800 leading-relaxed">{c.content}</p>

                                            {/* Official Reply */}
                                            {c.reply && (
                                                <div className="mt-2 bg-primary/5 rounded-lg p-3 text-xs">
                                                    <span className="font-bold text-primary mr-1">商家回复:</span>
                                                    <span className="text-gray-600">{c.reply}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 flex items-center gap-4">
                        <div className="flex-1 bg-gray-100 rounded-full h-10 px-4 flex items-center text-sm text-gray-400">
                            说点什么...
                        </div>
                        <div className="flex items-center gap-4 px-2">
                            <div className="flex flex-col items-center gap-0.5">
                                <Heart size={20} className={activePost.likes > 0 ? "text-red-500 fill-red-500" : "text-gray-600"} />
                                <span className="text-[10px] text-gray-500">{activePost.likes}</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <MessageCircle size={20} className="text-gray-600" />
                                <span className="text-[10px] text-gray-500">{postComments.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
