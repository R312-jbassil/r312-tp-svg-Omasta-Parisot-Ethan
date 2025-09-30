import PocketBase from "pocketbase";

export async function post({ request }) {
  try {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const updatedData = await request.json();

    if (!updatedData.id) {
      return new Response(JSON.stringify({ success: false, error: "Missing ID" }), { status: 400 });
    }

    const record = await pb.collection("Saved_svgs").update(updatedData.id, {
      code_svg: updatedData.code_svg,
      chat_history: updatedData.chat_history,
      name: updatedData.name,
    });

    return new Response(JSON.stringify({ success: true, record }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
