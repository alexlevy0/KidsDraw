import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import FormData from 'form-data';

/**
 * Generate an enhanced version of the drawing using Stable Diffusion
 * 
 * @param originalImagePath Path to the original image
 * @param prompt Description of the drawing
 * @param negativePrompt What to avoid in the generation
 * @returns Path to the generated image
 */
export async function generateEnhancedImage(
  originalImagePath: string,
  prompt: string,
  negativePrompt: string = ''
): Promise<string> {
  // Load the API key from environment
  const apiKey = process.env.STABILITY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing Stability API key');
  }
  
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(originalImagePath);
    
    // For testing or if you don't have a Stability API key yet, return a mock response
    if (apiKey === 'your_stable_diffusion_api_key') {
      console.warn('Using mock stable diffusion response - add your API key to .env.local');
      
      // Get output path
      const outputDir = path.dirname(originalImagePath);
      const outputPath = path.join(outputDir, 'generated.png');
      
      // For testing, just copy the original image
      await writeFile(outputPath, imageBuffer);
      
      return outputPath;
    }
    
    console.log('Using SD3.5 API for image-to-image...');
    
    // Create FormData according to the documentation
    const formData = new FormData();
    
    // Add the required parameters
    formData.append('prompt', prompt);
    formData.append('mode', 'image-to-image');  // Important for image-to-image
    
    // Add the image file
    formData.append('image', imageBuffer, {
      filename: 'drawing.png',
      contentType: 'image/png'
    });
    
    // Add the strength parameter (how much to preserve the original)
    formData.append('strength', '0.75');
    
    // Add optional parameters
    formData.append('model', 'sd3.5-large-turbo');  // Faster model
    formData.append('output_format', 'png');
    
    if (negativePrompt) {
      formData.append('negative_prompt', negativePrompt);
    }
    
    formData.append('cfg_scale', '4');  // Default for large/medium models
    
    console.log('Sending request to Stability API...');
    
    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/sd3',
      formData,
      {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'image/*',
          ...formData.getHeaders()
        }
      }
    );
    
    console.log('Response received with status:', response.status);
    
    // Get output path
    const outputDir = path.dirname(originalImagePath);
    const outputPath = path.join(outputDir, 'generated.png');
    
    if (response.status === 200) {
      // Save the generated image directly from the binary response
      await writeFile(outputPath, Buffer.from(response.data));
      console.log(`Generated image saved to ${outputPath}`);
      
      return outputPath;
    } else {
      // Try to extract error message from binary response
      const errorMessage = Buffer.from(response.data).toString();
      console.error(`API Error (${response.status}):`, errorMessage);
      
      // For non-200 responses, create a fallback
      console.warn('Using original image as fallback');
      await writeFile(outputPath, imageBuffer);
      
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }
  } catch (error: any) {
    console.error('Error calling Stable Diffusion API:', error);
    
    // Log detailed error information
    if (error.response) {
      try {
        const errorContent = Buffer.from(error.response.data).toString();
        console.error(`Response Status: ${error.response.status}`);
        console.error('Response Error Data:', errorContent);
      } catch (e) {
        console.error('Error parsing error response data');
      }
    } else if (error.request) {
      console.error('No response received from API');
    } else {
      console.error('Error message:', error.message);
    }
    
    throw new Error(`Failed to generate image: ${error.message}`);
  }
} 