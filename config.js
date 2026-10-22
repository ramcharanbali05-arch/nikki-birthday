/**
 * ============================================================================
 * 🎂 MAGICAL BIRTHDAY PORTAL - CONFIGURATION FILE
 * ============================================================================
 * Mamayya / Uncle: You can customize everything right here in 30 seconds!
 * - Change the Niece's Name and Age
 * - Add your Google Gemini API Key (optional - smart offline story generator built in!)
 * - Swap out photos and captions for the Polaroid Memory Wall
 * - Customize your heartfelt birthday letter
 * ============================================================================
 */

window.BIRTHDAY_CONFIG = {
  // 👧 Birthday Girl Info
  nieceName: "Nikki",          // Replace with your niece's name (e.g. "Nikki", "Aadhya", "Ananya")
  age: 9,                      // Her birthday age
  senderTitle: "Mamayya",      // E.g., "Mamayya", "Uncle", "Chacha", "Mamu"
  subtitle: "A Magical Birthday Adventure Just for You!",

  // 🔑 Google Gemini API Key (Optional!)
  // If you have a Gemini API key, paste it here: "AIzaSy..."
  // If left empty (""), the app automatically uses the built-in smart Pixar-style
  // procedural story generator so it works 100% offline with zero setup!
  geminiApiKey: "",

  // 🎵 Audio Preferences
  backgroundMusicEnabled: true, // Synthesized gentle fairytale music box
  soundEffectsEnabled: true,   // Balloons, candle puff, fanfare, sparkles

  // 📸 Polaroid Memory Wall (8 Custom Photos for the Birthday Girl)
  // Mamayya: Drop your niece's photos into assets/images/ with filenames:
  // niece-1.jpg, niece-2.jpg, ... niece-8.jpg (or edit captions & paths below!)
  photos: [
    {
      id: 1,
      url: "assets/images/niece-1.jpg",
      caption: "Our Little Princess 👑",
      date: "Precious Moment 1",
      tag: "Princess"
    },
    {
      id: 2,
      url: "assets/images/niece-2.jpg",
      caption: "The Million-Dollar Smile ✨",
      date: "Precious Moment 2",
      tag: "Sunshine"
    },
    {
      id: 3,
      url: "assets/images/niece-3.jpg",
      caption: "Cutest Explorer 🚀",
      date: "Precious Moment 3",
      tag: "Adventurer"
    },
    {
      id: 4,
      url: "assets/images/niece-4.jpg",
      caption: "Sweetest Memories 💖",
      date: "Precious Moment 4",
      tag: "Treasured"
    },
    {
      id: 5,
      url: "assets/images/niece-5.jpg",
      caption: "Always Bringing Joy 🌟",
      date: "Precious Moment 5",
      tag: "Joy Spreader"
    },
    {
      id: 6,
      url: "assets/images/niece-6.jpg",
      caption: "Super Star in the Making 🎨",
      date: "Precious Moment 6",
      tag: "Creative Star"
    },
    {
      id: 7,
      url: "assets/images/niece-7.jpg",
      caption: "Mischief & Fun 🎈",
      date: "Precious Moment 7",
      tag: "Playtime"
    },
    {
      id: 8,
      url: "assets/images/niece-8.jpg",
      caption: "Happy 9th Birthday! 🎂",
      date: "The Big Day!",
      tag: "Birthday Queen"
    }
  ],

  // 🎈 Compliments revealed when balloons are popped
  balloonCompliments: [
    "🌟 Smartest & Brightest Girl in the Universe!",
    "💖 Heart of Pure Gold & Kindness!",
    "😄 Cutest, Most Infectious Smile Ever!",
    "🚀 Future World-Changing Superstar!",
    "✨ Incredibly Creative & Talented Artist!",
    "🦄 Brave, Fearless & Wonderfully Unique!",
    "🎉 The Greatest Niece Any Uncle Could Ask For!",
    "🧸 Mamayya's Absolute Pride & Joy!",
    "🧁 Sweet, Loving & Always Making Us Laugh!",
    "💫 Your Laugh Lights Up Every Room!",
    "🌈 You Make Every Day a Fairytale!",
    "🏆 9 Years of Pure Sunshine & Happiness!"
  ],

  // 💌 Mamayya's Secret Heartfelt Letter inside the Surprise Mystery Box
  mamayyaLetter: {
    badge: "A Secret Letter Just For You",
    title: "To My Dearest Niece on Your 9th Birthday 💖",
    paragraphs: [
      "Happy 9th Birthday to my favorite little superstar in the whole universe! 🌟",
      "Watching you grow from a tiny giggling baby into such a brilliant, kind, creative, and brave 9-year-old girl has been one of the greatest privileges and joys of my life. You have a special spark that lights up everyone around you.",
      "Never lose your wonderful curiosity, your silly laugh, and your big dreams. Whether you're building blanket forts, solving big puzzles, painting colorful worlds, or making wishes on shooting stars—always remember that you are capable of doing anything you set your heart to.",
      "No matter how tall you grow or how many birthdays we celebrate, you will always be Mamayya's favorite princess and superhero. I will always be cheering for you in the front row!",
      "I love you infinity and beyond! Have the happiest, most magical 9th birthday ever!"
    ],
    signOff: "With all my love, endless hugs & proudest high-fives,",
    senderName: "Your Loving Mamayya ❤️"
  }
};
