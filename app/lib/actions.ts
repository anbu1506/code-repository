"use server";

import { Code } from "@/prisma/types";
// import { createUser } from "@/prisma/orm/createUser"
import { createCode } from "@/prisma/orm/createCode";
import { redirect } from "next/navigation";
import getSession from "./getSession";
import prisma from "@/prisma/prisma";
import deleteCodeById from "@/prisma/orm/deleteCode";
import { unstable_noStore as noStore } from "next/cache";

async function validateUser() {
  const session = await getSession();
  console.log(session);
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
}

export async function editCode(formdata: FormData) {
  noStore();
  await validateUser();

  const data = {
    question: formdata.get("question"),
    answer: formdata.get("answer"),
  };
  try {
    await prisma.code.update({
      where: {
        id: parseInt(formdata.get("codeId") as string),
      },
      data: data as Code,
    });
  } catch (error) {
    console.log("Error editing code");
  }

  redirect("/home/myAccount");
}

export async function uploadCode(formdata: FormData) {
  noStore();
  await validateUser();
  const session = await getSession();
  console.log(session.user.id);

  const data = {
    question: formdata.get("question"),
    answer: formdata.get("answer"),
    userId: session.user.id,
  };
  try {
    await createCode(data as Code);
  } catch (error) {
    console.log("Error uploading code");
  }

  redirect("/home/myAccount");
}

export async function deleteCode(id: number) {
  noStore();
  await validateUser();
  try {
    let likeId = await prisma.liked.findMany({
      where: {
        codeId: id,
      },
      select: {
        id: true,
      },
    });
    if (likeId != null) {
      const arr = likeId.map((x: any) => x.id);
      await prisma.liked.deleteMany({
        where: {
          id: {
            in: arr,
          },
        },
      });
    }

    const commentIds = await prisma.comment.findMany({
      where:{
        codeId:id
      },
      select:{
        id:true
      }
    })

    if(commentIds){
      const arr = commentIds.map((x:any)=>x.id);
      await prisma.replies.deleteMany(
        {
          where:{
            commentId:{
              in:arr
            }
          }
        }
      )
    }

    await prisma.comment.deleteMany({
      where:{
        codeId:id,
      },
    })

    await deleteCodeById(id);
  } catch (error) {
    console.log("Error deleting code", error);
  }
  redirect("/home/manageUploads");
}

export async function likeOrDislikeCode(
  codeId: number,
  isAlreadyLiked: boolean,
  userId: string
) {
  noStore();
  console.log("likeOrDislikeCode");
  await validateUser();
  const n = isAlreadyLiked ? -1 : 1;
  try {
    if (n == 1) {
      await prisma.liked.create({
        data: {
          userId: userId,
          codeId: codeId,
        },
      });
      await prisma.code.update({
        where: {
          id: codeId,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
    } else if (n == -1) {
      const likeId = await prisma.liked.findFirst({
        where: {
          codeId: codeId,
          userId: userId,
        },
      });

      await prisma.liked.delete({
        where: {
          id: likeId?.id,
        },
      });
      await prisma.code.update({
        where: {
          id: codeId,
        },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });
    }
  } catch (error) {
    console.log("Error liking code", error);
  }
}

export async function isAlreadyLiked(userId: string, codeId: number) {
  noStore();
  // await validateUser();
  const isLiked = await prisma.liked.findFirst({
    where: {
      userId: userId,
      codeId: codeId,
    },
  });
  return isLiked != null;
}

export async function getLikedCount(codeId: number) {
  noStore();
  const count = await prisma.code.findFirst({
    where: {
      id: codeId,
    },
  });
  return count?.likes;
}

export async function getProfileImage(userId: string) {
  const profileImage = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      image: true,
    },
  });
  return profileImage;
}

export async function getComments(codeId: number) {
  noStore()
  const comments = await prisma.comment.findMany({
    where: {
      codeId: codeId,
    },
    orderBy: {
      id: "desc",
    },
    include: {
      replies: true,
    },
  });


  return comments;
}

export async function addComment(codeId: number, comment: string) {
  noStore()
  const session = await getSession();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  else{
    await prisma.comment.create({
      data:{
        content:comment,
        codeId:codeId,
        time:new Date().toLocaleDateString("en-US",{ 
          month: 'long', // Display full month name
          day: '2-digit', // Display day with leading zero if necessary
          year: 'numeric' // Display full year
      }),
      author:session.user.name
      }
    })
    return true;
  }
  
}
export async function addReply(commentId: number, reply: string) {
  noStore()
  const session = await getSession();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  else{
    await prisma.replies.create({
      data:{
        author:session.user.name,
        time:new Date().toLocaleDateString("en-US",{ 
          month: 'long', // Display full month name
          day: '2-digit', // Display day with leading zero if necessary
          year: 'numeric' // Display full year
      }),
      content:reply,
      commentId:commentId
      }
    })
    return true;
  }
}
