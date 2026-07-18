// =========================
// Mobile Menu
// =========================
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("toggle-active");
    });
}

// =========================
// Chatbot UI
// =========================
document.body.insertAdjacentHTML("beforeend", `
<div id="ai-chatbot-container">

    <div id="chatbot-window" class="hidden">

        <div id="chatbot-header">
            <h4>🤖 AbSolutions AI</h4>
            <span id="close-chatbot">&times;</span>
        </div>

        <div id="chatbot-messages">
            <div class="message bot-message">
                👋 Hello! Welcome to AbSolutions.<br>
                How can I help you today?
            </div>
        </div>

        <div id="chatbot-input-area">
            <input
                id="chatbot-input"
                type="text"
                placeholder="Type your message..."
            >

            <button id="chatbot-send-btn">
                Send
            </button>
        </div>

    </div>

    <div id="chatbot-bubble">
        💬
    </div>

</div>
`);
const chatbotBubble = document.getElementById("chatbot-bubble");
const chatbotWindow = document.getElementById("chatbot-window");
const closeBtn = document.getElementById("close-chatbot");

chatbotBubble.onclick = () => {
    chatbotWindow.classList.toggle("hidden");
};

closeBtn.onclick = () => {
    chatbotWindow.classList.add("hidden");
};
const API_KEY = "AQ.Ab8RN6JBR_9r7OBefrt2UmC1b67YdX60F5oQdbx_OF7Yrn8OwA";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + AQ.Ab8RN6JBR_9r7OBefrt2UmC1b67YdX60F5oQdbx_OF7Yrn8OwA;
const chatInput = document.getElementById("chatbot-input");
const sendBtn = document.getElementById("chatbot-send-btn");
const messages = document.getElementById("chatbot-messages");

function addMessage(text, cls) {
    const div = document.createElement("div");
    div.className = "message " + cls;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {

    const userText = chatInput.value.trim();

    if (!userText) return;

    addMessage(userText, "user-message");

    chatInput.value = "";

    addMessage("Typing...", "bot-message");

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: userText
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        document.querySelectorAll(".bot-message").forEach(msg => {
            if (msg.textContent === "Typing...") msg.remove();
        });

        if (!response.ok) {
            addMessage(data.error?.message || "API Error", "bot-message");
            return;
        }

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response received.";

        addMessage(reply, "bot-message");

    } catch (e) {

        document.querySelectorAll(".bot-message").forEach(msg => {
            if (msg.textContent === "Typing...") msg.remove();
        });

        addMessage("Connection Error", "bot-message");
        console.error(e);

    }

}

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        sendMessage();
    }
});