import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    res.status(400).end();
  }

  try {
    const { postId } = req.body;
    const { currentUser } = await serverAuth(req, res);

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    let updateLikeIds = [...(post?.likesIds || [])];

    if (req.method === "POST") {
      updateLikeIds.push(currentUser?.id);

      // notification logic

      try {
        const post = await prisma.post.findUnique({
          where: {
            id: postId,
          },
        });

        if (post?.userId) {
          await prisma.notification.create({
            data: {
              body: "some one liked your Tweet!",
              userId: post.userId,
            },
          });

          await prisma.user.update({
            where: {
              id: post.userId,
            },
            data: {
              hasNotification: true,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (req.method === "DELETE") {
      updateLikeIds = updateLikeIds.filter((likeIds) => {
        likeIds !== currentUser.id;
      });
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likesIds: updateLikeIds,
      },
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
}
