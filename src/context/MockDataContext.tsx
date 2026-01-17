import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Types
export type PersonaId = 'single' | 'family';
export type SpaceId = 'living' | 'bedroom' | 'kitchen' | 'workspace' | 'kids_room' | 'bathroom' | 'balcony';

// New Ops Types
export type OrderStatus = 'pending' | 'shipped' | 'refunded';
export type TargetPersona = 'all' | 'single' | 'family';

export interface Persona {
    id: PersonaId;
    name: string;
    icon: string; // Icon name from Lucide
    linkedSpaces: SpaceId[];
}

export interface Space {
    id: SpaceId;
    name: string; // Chinese name
}

export interface Category {
    id: string;
    name: string;
    parentId?: string;
    children?: Category[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    categoryId: string; // Level 2 category
    personaIds: PersonaId[];
    spaceIds: SpaceId[];
    description?: string;
    stock: number; // Added stock
    isOnShelf: boolean; // Added on/off shelf
}

export interface CartItem {
    product: Product;
    quantity: number;
}

// New Entities
export interface Order {
    id: string;
    user: string;
    status: OrderStatus;
    items: CartItem[];
    total: number;
    date: string;
    trackingNumber?: string;
}

export interface Banner {
    id: string;
    image: string;
    title: string;
    linkProductId?: string; // Or link to article
    targetPersona: TargetPersona;
    active: boolean;
}

export interface Post {
    id: string;
    user: string;
    userAvatar: string;
    title: string;
    content: string;
    images: string[];
    linkedProductIds: string[];
    likes: number;
    date: string;
}

export interface Comment {
    id: string;
    postId: string;
    user: string;
    userAvatar: string;
    content: string;
    reply?: string; // Official reply
    isHidden: boolean; // Moderation
    date: string;
}

interface MockDataContextType {
    personas: Persona[];
    spaces: Space[];
    categories: Category[];
    products: Product[];
    cart: CartItem[];
    orders: Order[];
    banners: Banner[];
    posts: Post[];
    comments: Comment[];

    // Actions
    updatePersonaSpaces: (personaId: PersonaId, spaceIds: SpaceId[]) => void;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    addToCart: (productId: string) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;

    // Ops Actions
    shipOrder: (orderId: string, trackingNumber: string) => void;
    refundOrder: (orderId: string) => void;
    toggleProductShelf: (productId: string) => void;
    toggleBannerActive: (bannerId: string) => void;
    addPost: (post: Post) => void;
    deletePost: (postId: string) => void;
    hideComment: (commentId: string) => void;
    replyComment: (commentId: string, reply: string) => void;

    // Helpers
    getProductsByPersonaAndSpace: (personaId: PersonaId, spaceId: SpaceId) => Product[];
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

// Initial Data
const INITIAL_SPACES: Space[] = [
    { id: 'living', name: '客厅' },
    { id: 'bedroom', name: '卧室' },
    { id: 'kitchen', name: '厨房' },
    { id: 'workspace', name: '书房' },
    { id: 'kids_room', name: '儿童房' },
    { id: 'bathroom', name: '浴室' },
    { id: 'balcony', name: '阳台' },
];

const INITIAL_PERSONAS: Persona[] = [
    { id: 'single', name: '单身贵族', icon: 'User', linkedSpaces: ['living', 'bedroom', 'workspace'] },
    { id: 'family', name: '三口之家', icon: 'Users', linkedSpaces: ['living', 'kitchen', 'kids_room'] },
];

const INITIAL_CATEGORIES: Category[] = [
    { id: 'tables', name: '桌几类' },
    { id: 'sofas', name: '沙发类' },
    { id: 'storage', name: '收纳类' },
    { id: 'beds', name: '床具类' },

    // Level 2
    { id: 'dining_table', name: '餐桌', parentId: 'tables' },
    { id: 'coffee_table', name: '茶几', parentId: 'tables' },
    { id: 'desk', name: '书桌', parentId: 'tables' },

    { id: 'leather_sofa', name: '真皮沙发', parentId: 'sofas' },
    { id: 'fabric_sofa', name: '布艺沙发', parentId: 'sofas' },

    { id: 'wardrobe', name: '衣柜', parentId: 'storage' },
    { id: 'bookshelf', name: '书柜', parentId: 'storage' },

    { id: 'double_bed', name: '双人床', parentId: 'beds' },
    { id: 'single_bed', name: '单人床', parentId: 'beds' },
];

// Mock Products (Updated with stock & status)
const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'p1', name: '电竞工学椅', price: 1299,
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800',
        categoryId: 'desk', personaIds: ['single'], spaceIds: ['workspace'],
        stock: 50, isOnShelf: true
    },
    {
        id: 'p2', name: '全家福大餐桌 (6人座)', price: 3599,
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800',
        categoryId: 'dining_table', personaIds: ['family'], spaceIds: ['kitchen', 'living'],
        stock: 12, isOnShelf: true
    },
    {
        id: 'p3', name: '极简茶几', price: 899,
        image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800',
        categoryId: 'coffee_table', personaIds: ['single', 'family'], spaceIds: ['living'],
        stock: 100, isOnShelf: true
    },
    {
        id: 'p4', name: '人体工学办公桌', price: 2100,
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
        categoryId: 'desk', personaIds: ['single'], spaceIds: ['workspace', 'bedroom'],
        stock: 25, isOnShelf: true
    },
    {
        id: 'p5', name: '儿童上下铺', price: 4200,
        image: 'https://images.unsplash.com/photo-1505693416388-b03463121f29?auto=format&fit=crop&q=80&w=800',
        categoryId: 'single_bed', personaIds: ['family'], spaceIds: ['kids_room'],
        stock: 8, isOnShelf: true
    },
    {
        id: 'p6', name: '意式真皮沙发', price: 8999,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
        categoryId: 'leather_sofa', personaIds: ['family'], spaceIds: ['living'],
        stock: 5, isOnShelf: true
    },
    {
        id: 'p7', name: '温馨布艺沙发', price: 3200,
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
        categoryId: 'fabric_sofa', personaIds: ['single'], spaceIds: ['living', 'bedroom'],
        stock: 30, isOnShelf: true
    },
    {
        id: 'p8', name: '模块化书柜', price: 1500,
        image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800',
        categoryId: 'bookshelf', personaIds: ['single', 'family'], spaceIds: ['workspace', 'living'],
        stock: 60, isOnShelf: true
    },
    {
        id: 'p9', name: '豪华双人床', price: 5600,
        image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800',
        categoryId: 'double_bed', personaIds: ['family', 'single'], spaceIds: ['bedroom'],
        stock: 15, isOnShelf: true
    },
    {
        id: 'p10', name: '紧凑型衣柜', price: 2200,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
        categoryId: 'wardrobe', personaIds: ['single'], spaceIds: ['bedroom'],
        stock: 45, isOnShelf: true
    },
    {
        id: 'p11', name: '户外休闲桌椅', price: 2500,
        image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800',
        categoryId: 'dining_table', personaIds: ['family'], spaceIds: ['balcony'],
        stock: 20, isOnShelf: true
    }
];

// Mock Banners
const INITIAL_BANNERS: Banner[] = [
    {
        id: 'b1',
        title: '独居好物节',
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200',
        targetPersona: 'single',
        active: true,
        linkProductId: 'p1'
    },
    {
        id: 'b2',
        title: '家庭焕新季',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=1200',
        targetPersona: 'family',
        active: true,
        linkProductId: 'p2'
    },
    {
        id: 'b3',
        title: '全场通用大促',
        image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1200',
        targetPersona: 'all',
        active: true,
        linkProductId: 'p6'
    }
];

// Mock Orders
const INITIAL_ORDERS: Order[] = [
    {
        id: 'ORD-20231024-001',
        user: 'UserA',
        status: 'pending',
        items: [{ product: INITIAL_PRODUCTS[0], quantity: 1 }],
        total: 1299,
        date: '2025-05-20'
    },
    {
        id: 'ORD-20231023-002',
        user: 'UserB',
        status: 'shipped',
        items: [{ product: INITIAL_PRODUCTS[5], quantity: 1 }],
        total: 8999,
        date: '2025-05-19',
        trackingNumber: 'SF1234567890'
    },
    {
        id: 'ORD-20231022-003',
        user: 'UserC',
        status: 'refunded',
        items: [{ product: INITIAL_PRODUCTS[2], quantity: 2 }],
        total: 1798,
        date: '2025-05-18'
    }
];

// Mock Posts
const INITIAL_POSTS: Post[] = [
    {
        id: 'post1',
        user: '爱生活的小张',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        title: '我的极简书房改造',
        content: '终于把书房弄成了理想的样子，工学椅真的太舒服了！',
        images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800'],
        linkedProductIds: ['p1', 'p4'],
        likes: 128,
        date: '2025-06-01'
    },
    {
        id: 'post2',
        user: 'Molly',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Molly',
        title: '周末的家庭聚餐',
        content: '大餐桌即使坐6个人也完全不拥挤，质量超好。',
        images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800'],
        linkedProductIds: ['p2'],
        likes: 85,
        date: '2025-06-02'
    },
    {
        id: 'post3',
        user: 'TechBro',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        title: '避坑指南：这款椅子不行',
        content: '坐久了腰疼，不推荐购买。',
        images: ['https://images.unsplash.com/photo-1505693416388-b03463121f29?auto=format&fit=crop&q=80&w=800'],
        linkedProductIds: ['p5'],
        likes: 2,
        date: '2025-06-03'
    }
];

// Mock Comments
const INITIAL_COMMENTS: Comment[] = [
    {
        id: 'c1', postId: 'post1', user: '路人甲', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        content: '链接在哪里？', isHidden: false, date: '2025-06-01'
    },
    {
        id: 'c2', postId: 'post3', user: '黑粉', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        content: '垃圾质量，退货！', isHidden: false, date: '2025-06-03'
    },
    {
        id: 'c3', postId: 'post2', user: 'Admin', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        content: '感谢您的好评！', isHidden: false, date: '2025-06-02', reply: '感谢支持！'
    }
];

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
    const [spaces] = useState<Space[]>(INITIAL_SPACES);
    const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [cart, setCart] = useState<CartItem[]>([]);

    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
    const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);

    // Update logic: Persona <-> Spaces
    const updatePersonaSpaces = (personaId: PersonaId, spaceIds: SpaceId[]) => {
        setPersonas(prev => prev.map(p =>
            p.id === personaId ? { ...p, linkedSpaces: spaceIds } : p
        ));
    };

    const addProduct = (product: Product) => {
        setProducts(prev => [...prev, product]);
    };

    const updateProduct = (product: Product) => {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    };

    const toggleProductShelf = (productId: string) => {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, isOnShelf: !p.isOnShelf } : p));
    };

    const addToCart = (productId: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === productId);
            if (existing) {
                return prev.map(item =>
                    item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            const product = products.find(p => p.id === productId);
            if (!product) return prev;
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateCartQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const clearCart = () => setCart([]);

    // Ops Actions Implementation
    const shipOrder = (orderId: string, trackingNumber: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'shipped', trackingNumber } : o));
    };

    const refundOrder = (orderId: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'refunded' } : o));
    };

    const toggleBannerActive = (bannerId: string) => {
        setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, active: !b.active } : b));
    };

    const addPost = (post: Post) => {
        setPosts(prev => [post, ...prev]);
    };

    const deletePost = (postId: string) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const hideComment = (commentId: string) => {
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, isHidden: !c.isHidden } : c));
    };

    const replyComment = (commentId: string, reply: string) => {
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, reply } : c));
    };

    const getProductsByPersonaAndSpace = (personaId: PersonaId, spaceId: SpaceId) => {
        return products.filter(p =>
            p.personaIds.includes(personaId) && p.spaceIds.includes(spaceId) && p.isOnShelf
        );
    };

    return (
        <MockDataContext.Provider value={{
            personas, spaces, categories, products, cart,
            orders, banners, posts, comments,
            updatePersonaSpaces, addProduct, updateProduct, addToCart, removeFromCart, updateCartQuantity, clearCart,
            shipOrder, refundOrder, toggleProductShelf, toggleBannerActive, addPost, deletePost, hideComment, replyComment,
            getProductsByPersonaAndSpace
        }}>
            {children}
        </MockDataContext.Provider>
    );
};

export const useMockData = () => {
    const context = useContext(MockDataContext);
    if (!context) {
        throw new Error('useMockData must be used within a MockDataProvider');
    }
    return context;
};
