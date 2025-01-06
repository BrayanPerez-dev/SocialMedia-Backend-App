import { EventDataType } from "../types/search";

import SearchModel from "../models/searchModel";
import { logger } from "../utils/logger";

export async function handlePostCreated({postData}:EventDataType) {
  try {
    const newSearchPost = await SearchModel.create({
      postId: postData?.postId,
      userId: postData?.userId,
      content: postData?.content,
      createdAt: postData?.createdAt,
    });

   
    logger.info(
      `Search post created: ${postData?.postId}, ${newSearchPost._id}`
    );
  } catch (error:any) {
    logger.error(error, "Error handling post creation event");
  }
}

export async function handlePostDeleted({postId}:EventDataType) {
  try {
    await SearchModel.findOneAndDelete({ postId });
    logger.info(`Search post deleted: ${postId}}`);
  } catch (error:any) {
    logger.error(error, "Error handling post deletion event");
  }
}

