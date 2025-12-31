import User from "../models/user.model";

export const getUserFriends = async (userId: string): Promise<string[]> => {
    const user = await User.findById(userId)
        .select("friends")
        .lean();

    return user?.friends?.map(String) || [];
};