document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Mobile Hamburger Menu Toggle Logic
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. Chatbot Window Toggle Logic
    // ==========================================
    const chatbotBubble = document.getElementById('chatbot-bubble');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');

    if (chatbotBubble && chatbotWindow && closeChatbot) {
        chatbotBubble.addEventListener('click', () => {
            chatbotWindow.classList.toggle('hidden');
        });

        closeChatbot.addEventListener('click', (e) => {
            e.stopPropagation(); 
            chatbotWindow.classList.add('hidden');
        });
    }

    // ==========================================
    // 3. AI CHATBOT INTEGRATION (Gemini API)
    // ==========================================
    const chatInput = document.getElementById('chatbot-input'); 
    const sendChatBtn = document.getElementById('chatbot-send-btn');   
    const chatbox = document.getElementById('chatbot-messages');

    // APNI ASLI API KEY YAHAN PASTE KAREIN:
    const API_KEY = "AAP_KI_GEMINI_API_KEY_YAHAN_RAKHEIN"; 

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("div");
        chatLi.className = message ${className};
        chatLi.textContent = message;
        return chatLi;
    };

    const generateResponse = async (incomingChatLi, userMessage) => {
        const API_URL = https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY};

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: You are an AI assistant for AbSolutions, a web development & AI automation agency. Reply in short and professional manner: ${userMessage}
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || "API Key or Quota Error");
            }
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                incomingChatLi.textContent = data.candidates[0].content.parts[0].text;
            } else {
                incomingChatLi.textContent = "Sorry, I couldn't process that.";
            }
        } catch (error) {
            console.error("Chatbot Error:", error);
            incomingChatLi.textContent = "API Key Error / Connection Failed. Please check your AI Studio key.";
        }
        
        chatbox.scrollTop = chatbox.scrollHeight;
    };

    const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        
        chatbox.appendChild(createChatLi(userMessage, "user-message"));
        chatbox.scrollTop = chatbox.scrollHeight;
        
        setTimeout(() => {
            const incomingChatLi = createChatLi("Thinking...", "bot-message loading");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTop = chatbox.scrollHeight;
            generateResponse(incomingChatLi, userMessage);
        }, 300);
    };

    if (sendChatBtn) sendChatBtn.addEventListener("click", handleChat);
    if (chatInput) {
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleChat();
            }
        });
    }
});