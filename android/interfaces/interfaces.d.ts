import type { ReactNode } from "react";

export interface UserSignupParams {
    fullName: string;
    username: string;
    password: string;
    mobileNo: string;
    gender: string;
}

export interface LoginParams {
    mobileNo: string;
    password: string;
}

export interface AuthUser {
	_id: string;
    fullName: string;
    username: string;
    password: string;
    mobileNo: string;
    profilePic?: string | null;
    gender: "M" | "F" | "O";
}

export interface AuthContextType {
	authUser: AuthUser | null;
	setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
	loading: boolean;
}

export interface AuthContextProviderProps {
	children: ReactNode;
}

export interface TabIconProps {
    focused: boolean;
    icon: any;
}
