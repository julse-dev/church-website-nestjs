export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
};

export const TOKEN_EXPIRATION = {
    ACCESS_TOKEN: 60 * 60 * 1000, // 1 hour
    REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 days
};
