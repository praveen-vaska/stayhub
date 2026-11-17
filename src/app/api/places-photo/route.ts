export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const photoName = searchParams.get("name");

  if (!photoName || !photoName.startsWith("places/")) {
    return Response.json({ error: "Invalid photo name parameter" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Google Places API key is not configured" }, { status: 500 });
  }

  try {
    const maxHeight = searchParams.get("maxHeight") || "800";
    const maxWidth = searchParams.get("maxWidth") || "1200";
    const googlePhotoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}&key=${apiKey}`;

    const res = await fetch(googlePhotoUrl, {
      redirect: "manual",
    });

    const redirectUrl = res.headers.get("location");
    if (redirectUrl) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl,
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }

    if (res.ok) {
      const blob = await res.blob();
      return new Response(blob, {
        headers: {
          "Content-Type": res.headers.get("content-type") || "image/jpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    return Response.json({ error: "Failed to retrieve photo" }, { status: res.status });
  } catch (err: any) {
    console.error("Photo proxy error:", err);
    return Response.json({ error: "Internal photo proxy error" }, { status: 500 });
  }
}
