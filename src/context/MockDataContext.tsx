import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Types
export type PersonaId = 'single' | 'family' | 'couple' | 'three_gens';
export type SpaceId = 'living' | 'bedroom' | 'kitchen' | 'workspace' | 'kids_room' | 'bathroom' | 'balcony';

// New Ops Types
export type OrderStatus = 'unpaid' | 'pending_shipment' | 'shipped' | 'completed' | 'refunded';
export type TargetPersona = 'all' | 'single' | 'family' | 'couple' | 'three_gens';

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

// Media Types for Posts
export interface MediaItem {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string; // For video thumbnails
}

export interface Post {
    id: string;
    user: string;
    userAvatar: string;
    title: string;
    content: string;
    images: string[]; // Kept for backward compatibility
    media: MediaItem[]; // New media array with video support
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

// --- User Tier & Coupons ---
export type MemberTier = 'resident' | 'manager_l1' | 'manager_l2' | 'god';

export interface UserProfile {
    id: string;
    name: string;
    avatar: string;

    // Ledger
    lifetimeSpend: number;
    annualSpend: number;

    // Membership
    tier: MemberTier;
    expiryDate: string | null;
    points: number;
}

export type CouponType = 'cash_off' | 'percent_off';

export interface Coupon {
    id: string;
    title: string;
    desc: string;
    type: CouponType;
    value: number;
    minSpend: number;

    // Restrictions
    targetTier?: MemberTier[];
    targetCategory?: string[];

    status: 'active' | 'used' | 'expired';
}

export interface CartSummary {
    subtotal: number;
    memberDiscountRate: number;
    savings: {
        member: number;
        coupon: number;
    };
    finalPrice: number;
    appliedCouponId?: string;
}

// Helper Algorithms
export function calculateTier(lifetime: number, annual: number): MemberTier {
    if (lifetime < 500) return 'resident';
    if (annual >= 2000) return 'god';
    if (annual >= 1000) return 'manager_l2';
    return 'manager_l1'; // Default fallback once lifetime requirement met
}

export function calculateCartTotal(
    items: CartItem[],
    userTier: MemberTier,
    coupon?: Coupon
): CartSummary {
    // 1. Subtotal
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // 2. Member Discount
    const tierRates: Record<MemberTier, number> = {
        resident: 1, manager_l1: 0.95, manager_l2: 0.9, god: 0.8
    };
    const rate = tierRates[userTier];
    const priceAfterMember = subtotal * rate;
    const memberSaving = subtotal - priceAfterMember;

    // 3. Coupon
    let couponSaving = 0;
    if (coupon && priceAfterMember >= coupon.minSpend) {
        if (coupon.type === 'cash_off') {
            couponSaving = coupon.value;
        } else if (coupon.type === 'percent_off') {
            couponSaving = priceAfterMember * (1 - coupon.value);
        }
    }

    const finalPrice = Math.max(0, priceAfterMember - couponSaving);

    return {
        subtotal,
        memberDiscountRate: rate,
        savings: { member: memberSaving, coupon: couponSaving },
        finalPrice,
        appliedCouponId: coupon?.id
    };
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

    // V3 New State
    userProfile: UserProfile;
    coupons: Coupon[];
    cartSummary: CartSummary; // Live calculation result

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

    // V3 Actions
    updateUserSpend: (lifetime: number, annual: number) => void;
    simulateYearPass: () => void;
    pushCoupon: (coupon: Coupon) => void;
    claimCoupon: (couponId: string) => void;
    applyCouponToCart: (couponId?: string) => void;

    // Public Actions (New)
    payOrder: (orderId: string) => void;
    confirmReceipt: (orderId: string) => void;

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
    { id: 'single', name: '单身贵族', icon: 'User', linkedSpaces: ['living', 'kitchen', 'bathroom', 'bedroom'] },
    { id: 'couple', name: '幸福爱侣', icon: 'Heart', linkedSpaces: ['living', 'bedroom', 'kitchen', 'bathroom'] },
    { id: 'family', name: '三口之家', icon: 'Users', linkedSpaces: ['living', 'bedroom', 'kids_room', 'kitchen', 'balcony', 'bathroom'] },
    { id: 'three_gens', name: '三代同堂', icon: 'Home', linkedSpaces: ['living', 'bedroom', 'kids_room', 'kitchen', 'balcony', 'bathroom'] },
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

    // New Categories
    { id: 'kitchen_storage', name: '厨房收纳', parentId: 'storage' },
    { id: 'bath_storage', name: '卫浴收纳', parentId: 'storage' },
    { id: 'kids_furniture', name: '儿童家具', parentId: 'tables' },
];

// Mock Products (Updated with stock & status)
const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'p1', name: '电竞工学椅', price: 1299,
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800',
        categoryId: 'desk', personaIds: ['single', 'couple'], spaceIds: ['workspace'],
        stock: 50, isOnShelf: true
    },
    {
        id: 'p2', name: '全家福大餐桌 (6人座)', price: 3599,
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800',
        categoryId: 'dining_table', personaIds: ['family', 'three_gens'], spaceIds: ['kitchen', 'living'],
        stock: 12, isOnShelf: true
    },
    {
        id: 'p3', name: '极简茶几', price: 899,
        image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800',
        categoryId: 'coffee_table', personaIds: ['single', 'family', 'couple', 'three_gens'], spaceIds: ['living'],
        stock: 100, isOnShelf: true
    },
    {
        id: 'p4', name: '人体工学办公桌', price: 2100,
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
        categoryId: 'desk', personaIds: ['single', 'couple'], spaceIds: ['workspace', 'bedroom'],
        stock: 25, isOnShelf: true
    },
    {
        id: 'p5', name: '儿童上下铺', price: 4200,
        image: 'https://placehold.co/800x800/e2e8f0/1e293b?text=Kids+Bunk+Bed',
        categoryId: 'single_bed', personaIds: ['family', 'three_gens'], spaceIds: ['kids_room'],
        stock: 8, isOnShelf: true
    },
    {
        id: 'p6', name: '意式真皮沙发', price: 8999,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
        categoryId: 'leather_sofa', personaIds: ['family', 'three_gens', 'couple'], spaceIds: ['living'],
        stock: 5, isOnShelf: true
    },
    {
        id: 'p7', name: '温馨布艺沙发', price: 3200,
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
        categoryId: 'fabric_sofa', personaIds: ['single', 'couple'], spaceIds: ['living', 'bedroom'],
        stock: 30, isOnShelf: true
    },
    {
        id: 'p8', name: '模块化书柜', price: 1500,
        image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800',
        categoryId: 'bookshelf', personaIds: ['single', 'family', 'couple', 'three_gens'], spaceIds: ['workspace', 'living'],
        stock: 60, isOnShelf: true
    },
    {
        id: 'p9', name: '豪华双人床', price: 5600,
        image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800',
        categoryId: 'double_bed', personaIds: ['family', 'single', 'couple', 'three_gens'], spaceIds: ['bedroom'],
        stock: 15, isOnShelf: true
    },
    {
        id: 'p10', name: '紧凑型衣柜', price: 2200,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
        categoryId: 'wardrobe', personaIds: ['single', 'couple'], spaceIds: ['bedroom'],
        stock: 45, isOnShelf: true
    },
    {
        id: 'p11', name: '户外休闲桌椅', price: 2500,
        image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800',
        categoryId: 'dining_table', personaIds: ['family', 'three_gens'], spaceIds: ['balcony'],
        stock: 20, isOnShelf: true
    },
    // Kitchen (Single/Couple)
    {
        id: 'p12', name: '极简双人餐桌', price: 1599,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
        categoryId: 'dining_table', personaIds: ['single', 'couple'], spaceIds: ['kitchen'],
        stock: 30, isOnShelf: true
    },
    {
        id: 'p13', name: '多功能厨房置物架', price: 499,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        categoryId: 'kitchen_storage', personaIds: ['single', 'couple', 'family', 'three_gens'], spaceIds: ['kitchen'],
        stock: 80, isOnShelf: true
    },
    // Bathroom (All)
    {
        id: 'p14', name: '智能防雾浴室镜', price: 1299,
        image: '/assets/p14_smart_mirror.png',
        categoryId: 'bath_storage', personaIds: ['single', 'couple', 'family', 'three_gens'], spaceIds: ['bathroom'],
        stock: 40, isOnShelf: true
    },
    {
        id: 'p15', name: '高级纯棉浴巾组', price: 299,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800',
        categoryId: 'bath_storage', personaIds: ['single', 'couple', 'family', 'three_gens'], spaceIds: ['bathroom'],
        stock: 200, isOnShelf: true
    },
    // Kids Room (Family/ThreeGens)
    {
        id: 'p16', name: '实木儿童学习桌', price: 2800,
        image: 'https://placehold.co/800x800/e2e8f0/1e293b?text=Kids+Study+Desk',
        categoryId: 'kids_furniture', personaIds: ['family', 'three_gens'], spaceIds: ['kids_room'],
        stock: 15, isOnShelf: true
    },
    {
        id: 'p17', name: '趣味玩具收纳箱', price: 399,
        image: 'https://placehold.co/800x800/e2e8f0/1e293b?text=Toy+Storage+Box',
        categoryId: 'kitchen_storage', personaIds: ['family', 'three_gens'], spaceIds: ['kids_room'],
        stock: 100, isOnShelf: true
    }
];

// Mock Banners
const INITIAL_BANNERS: Banner[] = [
    {
        id: 'b1',
        title: '独居好物节',
        image: '/assets/b1_single_noble.png',
        targetPersona: 'single',
        active: true,
        linkProductId: 'p1'
    },
    {
        id: 'b2',
        title: '家庭焕新季',
        image: '/assets/b2_family_renewal.png',
        targetPersona: 'family',
        active: true,
        linkProductId: 'p2'
    },
    {
        id: 'b3',
        title: '全场通用大促',
        image: '/assets/b3_general_sale.png',
        targetPersona: 'all',
        active: true,
        linkProductId: 'p6'
    }
];

// Mock Orders
const generateMockOrders = (): Order[] => {
    const orders: Order[] = [];
    const now = new Date();
    const statuses: { status: OrderStatus; weight: number }[] = [
        { status: 'completed', weight: 70 },
        { status: 'shipped', weight: 10 },
        { status: 'pending_shipment', weight: 10 },
        { status: 'unpaid', weight: 5 },
        { status: 'refunded', weight: 5 }
    ];

    const users = ['Emson', 'Alice', 'Bob', 'Charlie', 'Diana', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];

    // Generate ~150 orders
    for (let i = 0; i < 150; i++) {
        // Random date within last 30 days
        const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];

        // Random status
        const rand = Math.random() * 100;
        let cumulativeWeight = 0;
        let selectedStatus: OrderStatus = 'completed';
        for (const s of statuses) {
            cumulativeWeight += s.weight;
            if (rand < cumulativeWeight) {
                selectedStatus = s.status;
                break;
            }
        }

        // Random items (1-3)
        const numItems = Math.floor(Math.random() * 3) + 1;
        const items: CartItem[] = [];
        let total = 0;

        for (let j = 0; j < numItems; j++) {
            const product = INITIAL_PRODUCTS[Math.floor(Math.random() * INITIAL_PRODUCTS.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;
            items.push({ product, quantity });
            total += product.price * quantity;
        }

        orders.push({
            id: `ORD-${dateStr.replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`,
            user: users[Math.floor(Math.random() * users.length)],
            status: selectedStatus,
            items,
            total,
            date: dateStr,
            trackingNumber: (selectedStatus === 'shipped' || selectedStatus === 'completed')
                ? `SF${Math.floor(Math.random() * 10000000000)}`
                : undefined
        });
    }

    // Sort by date desc
    return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const INITIAL_ORDERS: Order[] = generateMockOrders();

// Mock Posts
const INITIAL_POSTS: Post[] = [
    {
        id: 'post1',
        user: '爱生活的小张',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        title: '我的极简书房改造',
        content: '终于把书房弄成了理想的样子，工学椅真的太舒服了！\n\n这次改造我选择了极简风格，主要添置了人体工学椅和升降桌。每天工作8小时也不会腰酸背痛了。\n\n推荐给所有居家办公的朋友！',
        images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800'],
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800' }
        ],
        linkedProductIds: ['p1', 'p4'],
        likes: 128,
        date: '2025-06-01'
    },
    {
        id: 'post2',
        user: 'Molly',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Molly',
        title: '周末的家庭聚餐',
        content: '大餐桌即使坐6个人也完全不拥挤，质量超好。\n\n实木材质很有质感，家里老人小孩都很喜欢。周末一家人围坐在一起吃饭的感觉真好！',
        images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800'],
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800' },
            { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=400' }
        ],
        linkedProductIds: ['p2'],
        likes: 85,
        date: '2025-06-02'
    },
    {
        id: 'post3',
        user: 'TechBro',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        title: '避坑指南：这款椅子不行',
        content: '坐久了腰疼，不推荐购买。\n\n我买了两个月，现在腰已经不行了。可能是我使用姿势不对？总之大家谨慎购买。',
        images: ['/assets/office_chair_warning.png'],
        media: [
            { type: 'image', url: '/assets/office_chair_warning.png' }
        ],
        linkedProductIds: ['p5'],
        likes: 2,
        date: '2025-06-03'
    },
    {
        id: 'post4',
        user: '家居达人小王',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
        title: '【视频】客厅改造全记录',
        content: '历时一个月的客厅改造终于完成了！\n\n从设计到选材到施工，全程记录分享给大家。视频里有详细的过程，希望能给想装修的朋友一些灵感。',
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
        media: [
            { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800' }
        ],
        linkedProductIds: ['p6', 'p7'],
        likes: 256,
        date: '2025-06-04'
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

// Initial V3 Data
const INITIAL_USER: UserProfile = {
    id: 'u1',
    name: 'Emson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emson',
    lifetimeSpend: 0,
    annualSpend: 0,
    tier: 'resident',
    expiryDate: null,
    points: 0
};

const INITIAL_COUPONS: Coupon[] = [
    {
        id: 'cp1', title: '新人见面礼', desc: '满100减20', type: 'cash_off', value: 20, minSpend: 100,
        targetTier: ['resident'], status: 'active'
    },
    {
        id: 'cp2', title: '主理人尊享', desc: '全场9折', type: 'percent_off', value: 0.9, minSpend: 0,
        targetTier: ['manager_l1', 'manager_l2', 'god'], status: 'active'
    },
    {
        id: 'cp3', title: '全站通用券', desc: '满500减50', type: 'cash_off', value: 50, minSpend: 500,
        status: 'active'
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

    // V3 State
    const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
    const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
    const [activeCouponId, setActiveCouponId] = useState<string | undefined>(undefined);

    // V3 Derived State
    const activeCoupon = coupons.find(c => c.id === activeCouponId);
    const cartSummary = calculateCartTotal(cart, userProfile.tier, activeCoupon);
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

    // V3 Logic Impl
    const updateUserSpend = (lifetime: number, annual: number) => {
        const newTier = calculateTier(lifetime, annual);
        setUserProfile(prev => ({
            ...prev,
            lifetimeSpend: lifetime,
            annualSpend: annual,
            tier: newTier,
            // If graduated to manager+, set expiry 1 year from now
            expiryDate: (newTier !== 'resident' && prev.tier === 'resident')
                ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                : prev.expiryDate
        }));
    };

    const simulateYearPass = () => {
        setUserProfile(prev => {
            // Downgrade logic
            // Reset to Manager L1 if currently > Resident, Annual -> 0
            const nextTier = prev.tier === 'resident' ? 'resident' : 'manager_l1';
            return {
                ...prev,
                annualSpend: 0,
                tier: nextTier
            };
        });
    };

    const pushCoupon = (coupon: Coupon) => {
        setCoupons(prev => [coupon, ...prev]);
    };

    const claimCoupon = (couponId: string) => {
        // In real app, this might move template -> user coupon list
        // Here we simplify: if status is 'active', just ensure it is available
        console.log('Claimed', couponId);
    };

    const applyCouponToCart = (couponId?: string) => {
        setActiveCouponId(couponId);
    };

    return (
        <MockDataContext.Provider value={{
            personas, spaces, categories, products, cart,
            orders, banners, posts, comments,
            updatePersonaSpaces, addProduct, updateProduct, addToCart, removeFromCart, updateCartQuantity, clearCart,
            shipOrder, refundOrder, toggleProductShelf, toggleBannerActive, addPost, deletePost, hideComment, replyComment,
            getProductsByPersonaAndSpace,

            // V3 Exports
            userProfile, coupons, cartSummary,
            updateUserSpend, simulateYearPass, pushCoupon, claimCoupon, applyCouponToCart,

            // Public Actions
            payOrder: (orderId: string) => {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'pending_shipment' } : o));
            },
            confirmReceipt: (orderId: string) => {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed' } : o));
            },
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
