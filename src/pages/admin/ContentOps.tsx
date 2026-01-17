import React, { useState } from 'react';
import { useMockData, type Post, type Comment } from '../../context/MockDataContext';
import { Trash2, EyeOff, AlertTriangle } from 'lucide-react';

export const AdminContentOps: React.FC = () => {
    const { posts, comments, deletePost, hideComment, replyComment } = useMockData();
    const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">社区运营</h2>
                <p className="text-gray-500 mt-1">审核 UGC 内容，管理评论互动。</p>
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
                >
                    帖子审核 ({posts.length})
                </button>
                <button
                    onClick={() => setActiveTab('comments')}
                    className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
                >
                    评论管理 ({comments.length})
                </button>
            </div>

            {activeTab === 'posts' ? (
                <PostList posts={posts} onDelete={deletePost} />
            ) : (
                <CommentList comments={comments} onHide={hideComment} onReply={replyComment} />
            )}
        </div>
    );
};

const PostList = ({ posts, onDelete }: { posts: Post[], onDelete: (id: string) => void }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="relative h-48">
                    <img src={post.images[0]} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {post.date}
                    </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                        <img src={post.userAvatar} className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-gray-600">{post.user}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{post.content}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div className="text-xs text-gray-400">ID: {post.id}</div>
                        <button
                            onClick={() => { if (confirm('确认下架违规帖子？')) onDelete(post.id); }}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg flex items-center gap-1 text-xs font-medium transition-colors"
                        >
                            <Trash2 size={14} /> 下架处理
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const CommentList = ({ comments, onHide, onReply }: { comments: Comment[], onHide: (id: string) => void, onReply: (id: string, text: string) => void }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
            {comments.map(comment => (
                <div key={comment.id} className={`p-6 flex gap-4 ${comment.isHidden ? 'bg-gray-50 opacity-60' : ''}`}>
                    <img src={comment.userAvatar} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <span className="font-bold text-sm text-gray-800 mr-2">{comment.user}</span>
                                <span className="text-xs text-gray-400">在帖子 {comment.postId}</span>
                            </div>
                            <span className="text-xs text-gray-400">{comment.date}</span>
                        </div>

                        <p className="text-gray-700 mb-3">{comment.content}</p>

                        {/* Reply Area */}
                        {comment.reply ? (
                            <div className="bg-primary/5 p-3 rounded-lg text-sm text-gray-600 mb-3 border border-primary/10">
                                <span className="font-bold text-primary mr-2">官方回复:</span>
                                {comment.reply}
                            </div>
                        ) : !comment.isHidden && (
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    placeholder="输入官方回复..."
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            const val = e.currentTarget.value;
                                            if (val) onReply(comment.id, val);
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={() => onHide(comment.id)}
                                className={`text-xs flex items-center gap-1 font-medium ${comment.isHidden ? 'text-gray-500' : 'text-amber-600 hover:text-amber-700'}`}
                            >
                                <EyeOff size={14} /> {comment.isHidden ? '已隐藏' : '隐藏评论'}
                            </button>
                            {comment.isHidden && <span className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={12} /> 风险屏蔽</span>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
