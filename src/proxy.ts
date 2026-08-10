import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    // Match all paths starting with /admin except /admin/login
    "/admin((?!/login).*)",
  ],
};
