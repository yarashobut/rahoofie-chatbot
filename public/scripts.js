document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();
    sendMessageToGPTModel();
});

function sendMessageToGPTModel() {
    var inputField = document.getElementById('chat-input');
    var content = inputField.value.trim();
    inputField.value = '';

    if(content) {
        addMessageToChat('user', content);
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.push({ role: 'user', content: content });

        fetch('http://localhost:3000/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chatHistory: chatHistory })
        })
        .then(response => response.json())
        .then(data => {
            addMessageToChat('assistant', data.response);
            chatHistory.push({ role: 'assistant', content: data.response });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        })
        .catch((error) => {
            console.error('Error:', error);
            addMessageToChat('assistant', 'Sorry, I am having trouble responding right now.');
        });
    }
    else{
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

        fetch('http://localhost:3000/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chatHistory: chatHistory })
        })
        .then(response => response.json())
        .then(data => {
            addMessageToChat('assistant', data.response);
            chatHistory.push({ role: 'assistant', content: data.response });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        })
        .catch((error) => {
            console.error('Error:', error);
            addMessageToChat('assistant', 'Sorry, I am having trouble responding right now.');
        });
    }
}

function addMessageToChat(role, content) {
    var chatBody = document.getElementById('chat-body');
    var messageElement = document.createElement('div');
    messageElement.classList.add('message', role);
    messageElement.textContent = content;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the latest content
}

function loadMessageHistory() {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(msg => {
        addMessageToChat(msg.role, msg.content);
    });
}
document.getElementById('clear-chat').addEventListener('click', function() {
    // Clear the local storage
    localStorage.removeItem('chatHistory');

    // Clear the chat body DOM
    var chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = '';  // This removes all child elements in chat-body

    // Optionally reset any other state or variables you're using
});
// Load chat history when the page is loaded
window.onload = loadMessageHistory;