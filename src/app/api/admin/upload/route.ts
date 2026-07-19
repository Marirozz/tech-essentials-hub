import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Debes seleccionar una imagen." },
        { status: 400 },
      );
    }

    const targetFolder =
      folder === "guides" ? "guides" : "products";

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Formato no permitido. Usa JPG, PNG o WEBP.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "La imagen no puede superar los 3 MB.",
        },
        { status: 400 },
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() ?? "webp";

    const originalName = sanitizeFileName(
      file.name.replace(/\.[^/.]+$/, ""),
    );

    const filePath = `${targetFolder}/${Date.now()}-${originalName}.${extension}`;

    const fileBuffer = await file.arrayBuffer();

    const supabase = getSupabaseAdmin();

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);

      return NextResponse.json(
        {
          error: "No se pudo subir la imagen.",
        },
        { status: 500 },
      );
    }

    const { data } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: data.publicUrl,
      path: filePath,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Ocurrió un error al subir la imagen.",
      },
      { status: 500 },
    );
  }
}