module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '703f426f718cc96108039a5950a8cf8c'),
  },
});
