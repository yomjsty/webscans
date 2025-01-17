import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "@/actions/getServerSession";

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { novelSlug } = await req.json();
    const userId = session.user.id;

    if (!novelSlug) {
        return NextResponse.json({ error: "Missing novelSlug" }, { status: 400 });
    }

    // Cek apakah user sudah memberi like
    const existingLike = await db.like.findFirst({
        where: { 
          userId,
          novel: {
            slug: novelSlug
          },
        },
    });

    if (existingLike) {
        // Jika sudah like, maka unlike
        await db.like.delete({ where: { id: existingLike.id } });
        return NextResponse.json({ liked: false });
    } else {
        // Jika belum like, tambahkan like
        const novel = await db.novel.findUnique({
            where: { slug: novelSlug },
        });

        if (!novel) {
            return NextResponse.json({ error: "Novel not found" }, { status: 404 });
        }

        await db.like.create({
            data: {
              userId,
              novelId: novel.id
            },
        });
        return NextResponse.json({ liked: true });
    }
}



// import { NextResponse } from "next/server";
// import db from "@/lib/db";
// import { getServerSession } from "@/actions/getServerSession";

// // API untuk menambahkan atau menghapus like pada novel
// export async function POST(request: Request, { params }: { params: { slug: string } }) {
//   const { slug } = await params;

//   // Mendapatkan sesi pengguna
//   const session = await getServerSession();

//   // Jika tidak ada sesi (pengguna tidak terautentikasi)
//   if (!session) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const userId = session.user.id;

//   // Mencari novel berdasarkan slug
//   const novel = await db.novel.findUnique({
//     where: { slug },
//   });

//   // Jika novel tidak ditemukan
//   if (!novel) {
//     return NextResponse.json({ message: "Novel not found" }, { status: 404 });
//   }

//   try {
//     // Mencari like yang sudah ada dari pengguna untuk novel ini
//     const existingLike = await db.like.findFirst({
//       where: {
//         userId,
//         novelId: novel.id,
//       },
//     });

//     // Jika like sudah ada, kembalikan pesan error
//     if (existingLike) {
//       return NextResponse.json({ message: "User already liked this novel" }, { status: 400 });
//     }

//     // Menambahkan like
//     await db.like.create({
//       data: {
//         userId,
//         novelId: novel.id,
//       },
//     });

//     return NextResponse.json({ message: "Liked successfully" }, { status: 201 });
//   } catch (error) {
//     console.error("Error processing like:", error);
//     return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
//   }
// }


// export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
//   const { slug } = await params;

//   // Mendapatkan sesi pengguna
//   const session = await getServerSession();

//   // Jika tidak ada sesi (pengguna tidak terautentikasi)
//   if (!session) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const userId = session.user.id;

//   // Mencari novel berdasarkan slug
//   const novel = await db.novel.findUnique({
//     where: { slug },
//   });

//   // Jika novel tidak ditemukan
//   if (!novel) {
//     return NextResponse.json({ message: "Novel not found" }, { status: 404 });
//   }

//   try {
//     // Mencari like yang sudah ada dari pengguna untuk novel ini
//     const existingLike = await db.like.findFirst({
//       where: {
//         userId,
//         novelId: novel.id,
//       },
//     });

//     // Jika like tidak ditemukan
//     if (!existingLike) {
//       return NextResponse.json({ message: "Like not found" }, { status: 400 });
//     }

//     // Menghapus like
//     await db.like.delete({
//       where: {
//         id: existingLike.id,
//       },
//     });

//     return NextResponse.json({ message: "Unliked successfully" }, { status: 200 });

//   } catch (error) {
//     console.error("Error processing unlike:", error);
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ message: "An unexpected error occurred", error: errorMessage }, { status: 500 });
//   }
// }

