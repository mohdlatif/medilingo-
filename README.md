# MediLingo+  

**MediLingo+** is an AI-powered healthcare application designed to revolutionize how users access and understand medication information. By leveraging cutting-edge technologies like OCR, IBM Watson Assistant, Watson Discovery, and OpenAI’s generative AI, MediLingo+ provides actionable insights tailored to individual user needs.  

---

## **Features**  

1. **Multiple Input Options**  
   - **Chat with IBM Watson Assistant**: Get personalized, conversational responses.  
   - **Upload a Picture**: Use OCR to recognize and extract medication details from labels.  
   - **Manual Input**: Type the medication name for instant insights.  

2. **Tailored Medication Insights**  
   - Provides details like ingredients, side effects, and natural alternatives.  
   - Tailors responses based on user-defined settings such as age, sex, medical conditions, and language preferences.  

3. **Reliable Data Validation**  
   - Cross-references medication data with trusted sources, including the FDA API, for accuracy and reliability.  

4. **Persistent User Preferences**  
   - Saves user settings using localStorage for a seamless and personalized experience across sessions.  

5. **Multilingual Support and Voice Output**  
   - Offers information in multiple languages and includes a voice output option for improved accessibility.  

---

## **Technologies Used**

- **Google Vision API**  
   - Provides sophisticated image recognition and processing capabilities.  

- **IBM Watson Assistant**  
   - Handles conversational flow, intent detection, and personalized responses.  

- **Watson Discovery**  
   - Retrieves and indexes medical data from trusted sources.  

- **Llama AI**  
   - Generates detailed and context-aware responses, simplifying technical terms as needed.  

- **FDA API**  
   - Validates medication data to ensure accuracy and compliance.  

- **localStorage**  
   - Stores user settings persistently for a personalized experience.  

---

## **How It Works**  

1. **User Interaction**  
   - Choose one of three options:  
     - Chat with the assistant.  
     - Upload a medication label.  
     - Enter a medication name manually.  

2. **Processing**  
   - Extracts the medication name using OCR or text input.  
   - Sends a request to retrieve medication details and validate them with the FDA API.  

3. **Response Delivery**  
   - Presents tailored insights, including side effects, ingredients, and natural alternatives.  
   - Users can ask follow-up questions or switch to voice output for accessibility.  

---

## **Setup and Installation**  

### **Prerequisites**  
- Bun installed.  
- Access to APIs: IBM Watson Assistant, Watson Discovery, OpenAI, FDA API.  

### **Installation Steps**  
1. Clone the repository:  
   ```bash
   git clone https://github.com/mohdlatif/medilingo-
   cd medilingo-
   ```  
2. Install dependencies:  
   ```bash
   bun install
   ```  
3. Configure API keys in a `.env` file:  
   ```env
   WATSON_ASSISTANT_API_KEY=your_watson_assistant_key
   WATSON_DISCOVERY_API_KEY=your_watson_discovery_key
   OPENAI_API_KEY=your_openai_key
   FDA_API_KEY=your_fda_key
   ```  
4. Start the application:  
   ```bash
   bun run dev
   ```  

---

## **Usage**  

1. Launch the application in your browser.  
2. Select an input option:  
   - **Chat** with the assistant for conversational support.  
   - **Upload** an image of a medication label for instant recognition.  
   - **Type** a medication name for manual input.  
3. View medication insights tailored to your profile.  
4. Ask follow-up questions or explore natural alternatives.  

---

## **Future Enhancements**  

- Add a medication interaction checker for safety.  
- Expand multilingual support to include more languages.  
- Integrate real-time pharmacy and doctor recommendations.  

---

## **Contributing**  

We welcome contributions! Please fork the repository, make changes, and submit a pull request.  

---

## **License**  

This project is licensed under the MIT License.  
