import type { ReactNode } from "react";

export interface AuthUser {
	_id: string;
	name: string;
	email: string;
	mobileNo: string;
	gender: "M" | "F" | "O";
	profilePic?: string | null;
}

export interface AuthContextType {
	authUser: AuthUser | null;
	setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
	loading: boolean;
}

export interface AuthContextProviderProps {
	children: ReactNode;
}