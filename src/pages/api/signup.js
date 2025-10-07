import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export const POST = async ({ request, cookies }) => {
  try {
    // Récupère les données du formulaire
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Tous les champs sont requis" }), { status: 400 });
    }

    // Crée un nouvel utilisateur dans la collection Users
    const newUser = await pb.collection(Collections.Users).create({
      name,
      email,
      password,
      passwordConfirm: password, // PocketBase demande confirmation du mot de passe
    });

    // Authentifie immédiatement l'utilisateur pour récupérer le token
    const authData = await pb.collection(Collections.Users).authWithPassword(email, password);

    // Stocke le token dans un cookie sécurisé
    cookies.set("pb_auth", pb.authStore.exportToCookie(), {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
    });

    // Retourne les informations de l'utilisateur
    return new Response(JSON.stringify({ user: authData.record }), { status: 200 });
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur :", err);
    return new Response(JSON.stringify({ error: err.message || "Erreur lors de l'inscription" }), { status: 500 });
  }
};
