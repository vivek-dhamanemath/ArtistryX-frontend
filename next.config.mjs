export default {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:8099/api/:path*",
        },
      ];
    },
  };
  