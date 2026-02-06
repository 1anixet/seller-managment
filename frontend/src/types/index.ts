export interface User {
    id: string;
    username: string;
    email: string;
    role: 'owner' | 'manager' | 'staff' | 'cashier';
    branchId?: string;
    profile: {
        firstName: string;
        lastName: string;
        phone?: string;
        avatar?: string;
    };
}

export interface Item {
    _id: string;
    name: string;
    sku: string;
    barcode?: string;
    category: Category | string;
    description?: string;
    images: string[];
    pricing: {
        costPrice: number;
        sellingPrice: number;
        margin: number;
        marginPercentage: number;
    };
    stock: {
        quantity: number;
        unit: string;
        lowStockThreshold: number;
        reorderPoint: number;
    };
    tags: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
}

export interface Sale {
    _id: string;
    invoiceNumber: string;
    items: SaleItem[];
    totals: {
        subtotal: number;
        tax: number;
        discount: number;
        total: number;
        profit: number;
    };
    payment: {
        method: 'cash' | 'card' | 'upi' | 'other';
        amountPaid: number;
        change: number;
    };
    customer?: {
        name?: string;
        phone?: string;
        email?: string;
    };
    cashier: User | string;
    status: 'completed' | 'cancelled' | 'refunded';
    createdAt: string;
    updatedAt: string;
}

export interface SaleItem {
    itemId: string | Item;
    name: string;
    quantity: number;
    costPrice: number;
    sellingPrice: number;
    subtotal: number;
    profit: number;
}

export interface StockLog {
    _id: string;
    itemId: Item | string;
    type: 'purchase' | 'sale' | 'adjustment' | 'return';
    quantity: number;
    previousQuantity: number;
    newQuantity: number;
    performedBy: User | string;
    createdAt: string;
}

export interface Alert {
    _id: string;
    type: 'low_stock' | 'out_of_stock' | 'high_value_sale' | 'system';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    itemId?: Item | string;
    isRead: boolean;
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        total: number;
        page: number;
        pages: number;
    };
}
