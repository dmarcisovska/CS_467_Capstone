import * as profilePictureRepository from "../repositories/profilePictureRepository.js";

export const patchProfilePictureService = async (pictureData) => {

    return await profilePictureRepository.patchProfilePictureRepository(pictureData);
};

export const getProfilePictureService = async (userId) => {

    return await profilePictureRepository.getProfilePictureRepository(userId);
};