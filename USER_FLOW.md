# The Socratic - User Flow Map

### 1. Onboarding & Authentication
- **Landing Page**: User arrives at the main landing page outlining the platform.
- **Sign Up**: User creates an account using their Email and Password.
- **Login**: Existing users sign in and are redirected to their Dashboard.

### 2. Dashboard & Context Setting
- **The Hub**: User lands on their central study hub.
- **Upload Material**: User uploads a PDF (e.g., lecture notes, textbook chapters).
- **AI Topic Extraction**: The system analyzes the PDF and extracts the main "Topics" covered in the document.
- **Context Selection**: The user clicks on a specific topic they want to study. This topic and the PDF content are now set as the "Active Context".

### 3. Study Modes (Interactive Modules)
Once a topic is selected, the user can navigate to three main tools from the top navigation bar:

#### A. Flashcard Generator (`/flashcards`)
- **Auto-Generation**: Because a topic is active, the system automatically uses the PDF text to generate custom flashcards for that specific topic.
- **Interaction**: The user flips through the cards (using clicks or arrows) to memorize core concepts.

#### B. Exam Simulator (`/exam`)
- **Auto-Generation**: The system instantly generates a 4-question multiple-choice exam based strictly on the active topic.
- **Interaction**: The user selects answers and receives immediate AI feedback on whether they were right or wrong, along with detailed explanations.

#### C. Voice Tutor (`/voice-tutor`)
- **Socratic Guidance**: The user types a question related to their study material.
- **Context-Aware**: The AI tutor knows what document the user is studying and guides them to the answer by asking leading questions, rather than just spoon-feeding the solution.
