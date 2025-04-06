# KidsDraw AI 🎨✨

A fun web application that lets children draw pictures and transform them into professional illustrations using AI (Stable Diffusion), while preserving their original style and intentions.

## Features

- 🖌️ Interactive drawing canvas with colorful brush options
- 🔄 Easy to use eraser and clear functions
- 🎨 Vibrant color palette designed for children
- 💬 Simple prompt input to describe drawings
- ✨ AI-powered transformation using Stable Diffusion
- 📱 Responsive design for desktop and tablet

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Canvas**: Fabric.js for drawing functionality
- **AI**: Integration with Stable Diffusion API
- **Image Storage**: Local storage in public directory

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Stable Diffusion API key (from Stability AI)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/kidsdraw-ai.git
   cd kidsdraw-ai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API key:
   ```
   STABILITY_API_KEY=your_stable_diffusion_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## How to Use

1. Use the drawing tools on the right to create a drawing
2. Select colors from the palette
3. Adjust brush size as needed
4. Describe your drawing in the text field (or use example prompts)
5. Click "Transform My Drawing!" to see the AI-enhanced version
6. Download both original and enhanced versions

## Notes for Development

- The app uses a 600x600 canvas for drawings
- The Stable Diffusion API is configured with parameters optimized for preserving children's drawings
- When testing without an API key, the app will use mock data

## License

This project is licensed under the MIT License - see the LICENSE file for details. 