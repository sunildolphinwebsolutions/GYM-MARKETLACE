export interface Gym {
    id: number;
    owner_id: number;
    name: string;
    description: string;
    location: string;
    price_per_session: number;
    features: string[];
    images: string[];
    status: 'draft' | 'published';
    capacity: number;
    qr_code?: string;
    created_at: string;
    member_count?: number;
}

export interface CreateGymData {
    name: string;
    description: string;
    location: string;
    price_per_session: number;
    features: string[];
    images?: File[];
    status: 'draft' | 'published';
    capacity?: number;
    qr_code?: File;
}

export interface GymFilters {
    min_price?: number;
    max_price?: number;
    location?: string;
    features?: string[];
}

export interface Booking {
    id: number;
    user_id: number;
    gym_id: number;
    booking_date: string; // ISO date string
    status: 'confirmed' | 'cancelled' | 'pending';
    created_at: string;
    gym_name?: string;
    location?: string;
    images?: string[];
    price_per_session?: number;
    payment_status?: 'pending' | 'verified' | 'rejected';
    payment_reference_id?: string;
}
