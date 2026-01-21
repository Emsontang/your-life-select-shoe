import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockData, type MediaItem } from '../../context/MockDataContext';
import { ArrowLeft, Play, Trash2, Store, MessageCircle, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminPostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { posts, products, comments, deletePost, hideComment, replyComment } = useMockData();

    const post = posts.find(p => p.id === id);
    const postComments = post ? comments.filter(c => c.postId === post.id) : [];
    const linkedProducts = post ? products.filter(p => post.linkedProductIds.includes(p.id)) : [];

    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <p className="text-gray-500">帖子不存在或已被删除</p>
                <button
                    onClick={() => navigate('/admin/content')}
                    className="mt-4 text-primary hover:underline"
                >
                    返回列表
                </button>
            </div>
        );
    }

    const media = post.media.length > 0 ? post.media : post.images.map(url => ({ type: 'image' as const, url }));

    const handleDelete = () => {
        if (confirm('确认下架此帖子？下架后用户将无法看到此帖子。')) {
            deletePost(post.id);
            navigate('/admin/content');
        }
    };

    const handleReply = (commentId: string) => {
        const text = replyInputs[commentId];
        if (text?.trim()) {
            replyComment(commentId, text.trim());
            setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
        }
    };

    const nextMedia = () => setCurrentMediaIndex(i => (i + 1) % media.length);
    const prevMedia = () => setCurrentMediaIndex(i => (i - 1 + media.length) % media.length);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/admin/content')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>返回帖子列表</span>
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                    <Trash2 size={16} />
                    <span>下架处理</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: Media & Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Media Carousel */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="relative aspect-[4/3] bg-gray-100">
                            <MediaRenderer item={media[currentMediaIndex]} />

                            {/* Navigation Arrows */}
                            {media.length > 1 && (
                                <>
                                    <button
                                        onClick={prevMedia}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextMedia}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            {/* Media Counter */}
                            {media.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                                    {currentMediaIndex + 1} / {media.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {media.length > 1 && (
                            <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide bg-gray-50">
                                {media.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentMediaIndex(idx)}
                                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === currentMediaIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        {item.type === 'video' ? (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                                                {item.thumbnail ? (
                                                    <img src={item.thumbnail} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-300" />
                                                )}
                                                <Play size={16} className="absolute text-white drop-shadow" />
                                            </div>
                                        ) : (
                                            <img src={item.url} className="w-full h-full object-cover" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Post Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={post.userAvatar} className="w-12 h-12 rounded-full" />
                            <div>
                                <h3 className="font-bold text-gray-800">{post.user}</h3>
                                <p className="text-sm text-gray-400">{post.date}</p>
                            </div>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h1>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                            <span>❤️ {post.likes} 点赞</span>
                            <span>💬 {postComments.length} 评论</span>
                            <span className="ml-auto text-xs text-gray-400">ID: {post.id}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Products & Comments */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Linked Products */}
                    {linkedProducts.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Store size={16} className="text-primary" />
                                关联商品 ({linkedProducts.length})
                            </h3>
                            <div className="space-y-3">
                                {linkedProducts.map(p => (
                                    <div key={p.id} className="flex gap-3 p-2 bg-gray-50 rounded-lg">
                                        <img src={p.image} className="w-14 h-14 rounded-md object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-800 truncate">{p.name}</h4>
                                            <p className="text-sm font-bold text-primary mt-1">¥{p.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comments */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MessageCircle size={16} className="text-primary" />
                            评论管理 ({postComments.length})
                        </h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {postComments.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-8">暂无评论</p>
                            ) : (
                                postComments.map(c => (
                                    <div
                                        key={c.id}
                                        className={`p-3 rounded-lg border ${c.isHidden ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <img src={c.userAvatar} className="w-6 h-6 rounded-full" />
                                            <span className="text-sm font-medium text-gray-700">{c.user}</span>
                                            <span className="text-xs text-gray-400 ml-auto">{c.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{c.content}</p>

                                        {/* Reply */}
                                        {c.reply ? (
                                            <div className="bg-primary/5 p-2 rounded text-xs text-gray-600 mb-2">
                                                <span className="font-bold text-primary mr-1">官方回复:</span>
                                                {c.reply}
                                            </div>
                                        ) : !c.isHidden && (
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    value={replyInputs[c.id] || ''}
                                                    onChange={e => setReplyInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                                                    placeholder="输入官方回复..."
                                                    className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-primary"
                                                />
                                                <button
                                                    onClick={() => handleReply(c.id)}
                                                    className="text-xs px-3 py-1.5 bg-primary text-white rounded hover:bg-primary/90"
                                                >
                                                    回复
                                                </button>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <button
                                            onClick={() => hideComment(c.id)}
                                            className={`text-xs flex items-center gap-1 ${c.isHidden ? 'text-gray-500' : 'text-amber-600 hover:text-amber-700'}`}
                                        >
                                            {c.isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {c.isHidden ? '取消隐藏' : '隐藏评论'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Media Renderer Component
const MediaRenderer: React.FC<{ item: MediaItem }> = ({ item }) => {
    if (item.type === 'video') {
        return (
            <video
                src={item.url}
                controls
                className="w-full h-full object-contain bg-black"
                poster={item.thumbnail}
            />
        );
    }
    return <img src={item.url} className="w-full h-full object-contain" />;
};
