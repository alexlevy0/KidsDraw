#!/bin/bash

# Aller dans le répertoire des scripts
cd "$(dirname "$0")"

# Vérifier que node est installé
if ! command -v node &> /dev/null; then
    echo "Node.js n'est pas installé. Veuillez l'installer pour exécuter ce script."
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances..."
    npm install
fi

# Exécuter le script de test
echo "Exécution du test de l'API Stability..."
node test-stability-api.js

# Vérifier si le test a généré des images
if [ -f "./lighthouse.jpeg" ]; then
    echo "✅ Test de génération texte-image réussi!"
else
    echo "❌ Échec du test de génération texte-image."
fi

if [ -f "./test-edited-image.png" ]; then
    echo "✅ Test d'édition d'image v2beta (ancien format) réussi!"
else
    echo "❌ Échec du test d'édition d'image v2beta (ancien format)."
fi

if [ -f "./test-v1-edited-image.png" ]; then
    echo "✅ Test d'édition d'image v1 réussi!"
else
    echo "❌ Échec du test d'édition d'image v1."
fi

if [ -f "./test-sd35-edited-image.png" ]; then
    echo "✅ Test d'édition d'image SD3.5 réussi!"
else
    echo "❌ Échec du test d'édition d'image SD3.5."
fi

# Afficher des instructions pour la suite
echo ""
echo "Si le test SD3.5 a réussi, votre application devrait maintenant fonctionner avec le nouveau format d'API."
echo "La méthode image-to-image pour SD3/SD3.5 requiert le paramètre 'mode' et utilise le point d'accès /v2beta/stable-image/generate/sd3." 