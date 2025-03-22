export declare const sendNotificationinapp: (title: string, body: string, token: string) => Promise<{
    message: string;
    error?: undefined;
    details?: undefined;
} | {
    error: string;
    details: any;
    message?: undefined;
}>;
