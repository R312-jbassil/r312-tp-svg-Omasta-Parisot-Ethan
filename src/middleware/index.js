import pb from "../utils/pb"; // Assure-toi que le chemin est correct

export const onRequest = async (context, next) => {
  // ------------------------------
  // Vérification de l'authentification PocketBase
  // ------------------------------
  const cookie = context.cookies.get("pb_auth")?.value;
  if (cookie) {
    pb.authStore.loadFromCookie(cookie);
    if (pb.authStore.isValid) {
      context.locals.user = pb.authStore.record;
    }
  }

  // ------------------------------
  // Gestion des API : bloquer si non connecté sauf /api/login
  // ------------------------------
  if (context.url.pathname.startsWith("/api/")) {
  const publicAPIs = ["/api/login", "/api/signup"]; // <-- ajouter signup ici
  if (!context.locals.user && !publicAPIs.includes(context.url.pathname)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  return next();
}


  // ------------------------------
  // Pages publiques : login et signup accessibles sans authentification
  // ------------------------------
  const publicPages = ["/login", "/signup", "/"];
  if (!context.locals.user && !publicPages.includes(context.url.pathname)) {
    return Response.redirect(new URL("/login", context.url), 303);
  }

  // ------------------------------
  // Gestion de la langue (ton code existant)
  // ------------------------------
  if (context.request.method === "POST") {
    const form = await context.request.formData().catch(() => null);
    const lang = form?.get("language");
    if (lang === "en" || lang === "fr") {
      context.cookies.set("locale", String(lang), {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
      return Response.redirect(new URL(context.url.pathname + context.url.search, context.url), 303);
    }
  }

  const cookieLocale = context.cookies.get("locale")?.value;
  context.locals.lang = (cookieLocale === "fr" || cookieLocale === "en")
    ? cookieLocale
    : (context.preferredLocale ?? "en");

  return next();
};
