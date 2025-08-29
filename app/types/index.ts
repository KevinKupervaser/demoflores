export interface NewUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface SessionUserProfile {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface NewProductInfo {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: boolean;
  thumbnail?: File;
  images: File[];
}

export interface ProductToUpdate {
  title: string;
  category: string;
  stock: boolean;
  price: number;
  description: string;
  thumbnail?: {
    url: string;
    id: string;
  };
  images?: {
    url: string;
    id: string;
  }[];
}

export interface ProductResponse {
  id: string;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    id: string;
  };
  price: number;
  category: string;
  stock: boolean;
  images?: {
    url: string;
    id: string;
  }[];
}
