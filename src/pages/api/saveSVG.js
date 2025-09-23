import pb from "../../utils/pb";

export async function POST({ request }) {
  const data = await request.json();
  console.log("Received data to save:", data);
  try {
    const record = await pb
      .collection("Saved_svgs") 
      .create({
        name: data.name,
        code_svg: data.code_svg,
        chat_history: data.chat_history
      });
    console.log("SVG saved with ID:", record.id);

    return new Response(JSON.stringify({ success: true, id: record.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving SVG:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
