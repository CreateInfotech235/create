export declare const unreadMessages: (userId: string | undefined, sender: string) => Promise<{
    error: string;
    for: string;
    unreadMessages?: undefined;
    totalUnreadMessages?: undefined;
} | {
    unreadMessages: any;
    totalUnreadMessages: any;
    for: string;
    error?: undefined;
} | {
    error: string;
    for?: undefined;
    unreadMessages?: undefined;
    totalUnreadMessages?: undefined;
}>;
