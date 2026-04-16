import axios from 'axios';

const API_BASE_URL = "http://localhost:8000";

export const getShirts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/shirts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shirts:", error);
    throw error;
  }
};

export const processTryOnFrame = async (shirtId, imageBase64, targetSize = "L") => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tryon/process`, {
      image_base64: imageBase64,
      target_size: targetSize,
      shirt_id: String(shirtId) // This is the crucial line we added!
    });
    return response.data;
  } catch (error) {
    console.error("Error processing frame:", error);
    throw error;
  }
};