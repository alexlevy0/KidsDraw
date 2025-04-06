// Script pour générer une image de test simple

import fs from 'fs';
import { createCanvas } from 'canvas';

// Créer un petit canvas
const width = 256;
const height = 256;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Dessiner un fond
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height);

// Dessiner un cercle
ctx.fillStyle = 'blue';
ctx.beginPath();
ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
ctx.fill();

// Dessiner un rectangle
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 50, 50);

// Dessiner un triangle
ctx.fillStyle = 'green';
ctx.beginPath();
ctx.moveTo(150, 50);
ctx.lineTo(200, 100);
ctx.lineTo(150, 150);
ctx.closePath();
ctx.fill();

// Convertir en PNG et sauvegarder
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./test-image.png', buffer);

console.log('Image de test générée: test-image.png'); 