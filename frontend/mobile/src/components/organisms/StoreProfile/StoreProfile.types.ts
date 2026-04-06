import { ReactNode } from "react";

export interface StoreProfileProps {
    storeId: string;
    onClose?: () => void;
}

export interface StoreInfo {
    owner: ReactNode;
    ninea: ReactNode;
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    rating: number;
    reviewCount: number;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
    openingHours?: OpeningHours;
    categories: string[];
    verified: boolean;
    createdAt: string;
}

export interface OpeningHours {
    monday?: TimeRange;
    tuesday?: TimeRange;
    wednesday?: TimeRange;
    thursday?: TimeRange;
    friday?: TimeRange;
    saturday?: TimeRange;
    sunday?: TimeRange;
}

export interface TimeRange {
    open: string;
    close: string;
}

export interface StoreProfileState {
    loading: boolean;
    error: string | null;
    store: StoreInfo | null;
}