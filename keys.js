module.exports = {
    DATABASE_URL: "mongodb://localhost/projectDb",
    BASE_URL: "http://localhost:3000",
    GOOGLE_CLIENT_ID: "Google Client ID",
    GOOGLE_CLIENT_SECRET: "Google Client Secret",
    GOOGLE_AUTH_CALLBACK: "http://localhost:3000/utility/login/google/callback",
    CUSTOM_API_ROOT: "lil",
    SESSION_CONFIGURATION: {
        secret: 'your cookie secret',
        resave: false,
        saveUninitialized: false,
        cookie: {                               // cookie settings for development only
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            // httpOnly: true,
            sameSite: 'lax'
        }
    },
    environment: 'DEV'
}