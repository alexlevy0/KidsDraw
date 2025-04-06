// Script pour tester directement l'API Stability AI

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

// Récupérer la clé API de l'environnement
const apiKey = process.env.STABILITY_API_KEY

if (!apiKey) {
  console.error('Erreur: STABILITY_API_KEY non définie dans .env.local');
  process.exit(1);
}

async function testTextToImage() {
  console.log('Test de la génération texte vers image...');
  
  try {
    // Exactement comme l'exemple de documentation
    const payload = {
      prompt: "Lighthouse on a cliff overlooking the ocean",
      output_format: "jpeg"
    };
    
    console.log('Envoi de la requête à l\'API Stability...');
    
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      payload,
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: { 
          Authorization: `Bearer ${apiKey}`, 
          Accept: "image/*" 
        },
      },
    );
    
    console.log('Statut de réponse:', response.status);
    
    if (response.status === 200) {
      const outputPath = './lighthouse.jpeg';
      fs.writeFileSync(outputPath, Buffer.from(response.data));
      console.log(`Image générée sauvegardée à ${outputPath}`);
    } else {
      throw new Error(`${response.status}: ${Buffer.from(response.data).toString()}`);
    }
  } catch (error) {
    console.error('Erreur lors du test:', error);
    
    if (error.response) {
      try {
        const errorMessage = Buffer.from(error.response.data).toString();
        console.error('Détails de l\'erreur:', errorMessage);
      } catch (e) {
        console.error('Impossible de parser les détails de l\'erreur');
      }
    }
  }
}

async function testImageToImage() {
  console.log('Test de la génération image vers image...');
  
  try {
    // Préparation de l'image source (utilisez une petite image de test)
    const testImagePath = './test-image.png';
    
    // Vérifier si l'image de test existe
    if (!fs.existsSync(testImagePath)) {
      console.error(`Erreur: Fichier de test ${testImagePath} introuvable`);
      console.error('Veuillez créer une petite image PNG pour le test');
      return;
    }
    
    const imageBuffer = fs.readFileSync(testImagePath);
    
    // Création du FormData
    const formData = new FormData();
    formData.append('init_image', imageBuffer, 'test-image.png');
    formData.append('prompt', 'Colorful artistic rendition');
    formData.append('cfg_scale', '7.5');
    formData.append('strength', '0.75');
    
    console.log('Envoi de la requête à l\'API Stability pour l\'édition d\'image...');
    
    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/edit',
      formData,
      {
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'image/*',
          ...formData.getHeaders()
        }
      }
    );
    
    console.log('Statut de réponse:', response.status);
    
    if (response.status === 200) {
      const outputPath = './test-edited-image.png';
      fs.writeFileSync(outputPath, Buffer.from(response.data));
      console.log(`Image modifiée sauvegardée à ${outputPath}`);
    } else {
      throw new Error(`${response.status}: ${Buffer.from(response.data).toString()}`);
    }
  } catch (error) {
    console.error('Erreur lors du test d\'édition d\'image:', error);
    
    if (error.response) {
      try {
        const errorMessage = Buffer.from(error.response.data).toString();
        console.error('Détails de l\'erreur:', errorMessage);
      } catch (e) {
        console.error('Impossible de parser les détails de l\'erreur');
      }
    }
  }
}

async function testV1ImageToImage() {
  console.log('Test de l\'API v1 pour image-to-image...');
  
  try {
    // Préparation de l'image source (utilisez une petite image de test)
    const testImagePath = './test-image.png';
    
    // Vérifier si l'image de test existe
    if (!fs.existsSync(testImagePath)) {
      console.error(`Erreur: Fichier de test ${testImagePath} introuvable`);
      console.error('Veuillez créer une petite image PNG pour le test');
      return;
    }
    
    // Lire l'image et la convertir en base64
    const imageBuffer = fs.readFileSync(testImagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Préparer la requête à l'API v1
    console.log('Envoi de la requête à l\'API Stability v1 pour image-to-image...');
    
    const response = await axios({
      method: 'post',
      url: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        text_prompts: [
          {
            text: 'Colorful artistic rendition',
            weight: 1.0
          },
          {
            text: 'poor quality, blurry',
            weight: -1.0
          }
        ],
        init_image: base64Image,
        init_image_mode: 'IMAGE_STRENGTH',
        image_strength: 0.75,
        cfg_scale: 7.5,
        samples: 1,
        steps: 30,
      }
    });
    
    console.log('Statut de réponse v1:', response.status);
    
    if (response.data && response.data.artifacts && response.data.artifacts.length > 0) {
      const generatedImage = response.data.artifacts[0];
      const outputPath = './test-v1-edited-image.png';
      fs.writeFileSync(outputPath, Buffer.from(generatedImage.base64, 'base64'));
      console.log(`Image modifiée via v1 sauvegardée à ${outputPath}`);
    } else {
      console.error('Pas d\'artefacts retournés dans la réponse:', response.data);
    }
  } catch (error) {
    console.error('Erreur lors du test d\'édition d\'image v1:', error);
    
    if (error.response) {
      console.error('Statut de l\'erreur:', error.response.status);
      console.error('Données de l\'erreur:', error.response.data);
    }
  }
}

// Ajout d'une fonction pour tester l'API SD3.5 image-to-image avec le format correct

async function testSD35ImageToImage() {
  console.log('Test de l\'API SD3.5 pour image-to-image...');
  
  try {
    // Préparation de l'image source
    const testImagePath = './test-image.png';
    
    // Vérifier si l'image de test existe
    if (!fs.existsSync(testImagePath)) {
      console.error(`Erreur: Fichier de test ${testImagePath} introuvable`);
      return;
    }
    
    // Lire l'image
    const imageBuffer = fs.readFileSync(testImagePath);
    
    // Créer FormData selon la documentation officielle
    const formData = new FormData();
    
    // Paramètres requis
    formData.append('prompt', 'Colorful artistic rendition, vibrant colors, professional illustration');
    formData.append('mode', 'image-to-image');
    
    // Ajouter l'image
    formData.append('image', imageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    // Paramètre de force (influence de l'image d'origine)
    formData.append('strength', '0.75');
    
    // Paramètres optionnels
    formData.append('model', 'sd3.5-large-turbo');
    formData.append('output_format', 'png');
    formData.append('negative_prompt', 'poor quality, blurry, distorted');
    formData.append('cfg_scale', '4');
    
    console.log('Envoi de la requête à l\'API SD3.5...');
    
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
    
    console.log('Statut de réponse SD3.5:', response.status);
    
    if (response.status === 200) {
      const outputPath = './test-sd35-edited-image.png';
      fs.writeFileSync(outputPath, Buffer.from(response.data));
      console.log(`Image modifiée via SD3.5 sauvegardée à ${outputPath}`);
    } else {
      const errorMessage = Buffer.from(response.data).toString();
      throw new Error(`${response.status}: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Erreur lors du test SD3.5 image-to-image:', error);
    
    if (error.response) {
      try {
        const errorContent = Buffer.from(error.response.data).toString();
        console.error(`Statut: ${error.response.status}, Message:`, errorContent);
      } catch (e) {
        console.error('Impossible de lire la réponse d\'erreur');
      }
    }
  }
}

// Mise à jour de la fonction runTests pour inclure le nouveau test
async function runTests() {
  await testTextToImage();
  console.log('\n---------------------------------------\n');
  await testImageToImage();
  console.log('\n---------------------------------------\n');
  await testV1ImageToImage();
  console.log('\n---------------------------------------\n');
  await testSD35ImageToImage();
}

runTests(); 