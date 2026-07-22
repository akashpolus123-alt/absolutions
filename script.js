document.addEventListener("DOMContentLoaded", function () {
  const chatbotWindow = document.getElementById("chatbot-window");
  const closeBtn = document.getElementById("close-chatbot");
  const sendBtn = document.getElementById("chatbot-send-btn");
  const inputField = document.getElementById("chatbot-input");
  const messagesContainer = document.getElementById("chatbot-messages");
  const floatingActions = document.getElementById("floating-actions");

  // Chatbot Open/Close Toggle
  if (floatingActions) {
    floatingActions.addEventListener("click", function () {
      if (!chatbotWindow) return;
      if (chatbotWindow.style.display === "none" || chatbotWindow.style.display === "") {
        chatbotWindow.style.display = "flex";
        chatbotWindow.style.flexDirection = "column";
      } else {
        chatbotWindow.style.display = "none";
      }
    });
  }

  // Close Button
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (chatbotWindow) chatbotWindow.style.display = "none";
    });
  }

  // Send Message Logic
  async function sendMessage() {
    if (!inputField) return;
    const userText = inputField.value.trim();
    if (!userText) return;

    appendMessage(userText, "user-msg");
    inputField.value = "";

    const loadingMsg = appendMessage("سوچ رہا ہوں...", "bot-msg");

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      loadingMsg.innerText = data.reply || "کوئی جواب نہیں ملا۔";
    } catch (error) {
      loadingMsg.innerText = "سرور سے رابطہ نہیں ہو سکا۔";
      console.error(error);
    }
  }

  // Append Message Function
  function appendMessage(text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "msg " + className;
    msgDiv.innerText = text;
    if (messagesContainer) {
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    return msgDiv;
  }

  // Event Listeners
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  if (inputField) {
    inputField.addEventListener("keypress", function (e) {
      if (e.key === "Enter") sendMessage();
    });
  }
});
