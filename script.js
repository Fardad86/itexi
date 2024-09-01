document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize Supabase
    const supabaseUrl = 'https://agglftunrhwbmqgupuxr.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ2xmdHVucmh3Ym1xZ3VwdXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyMjM5OTgsImV4cCI6MjA0MDc5OTk5OH0.Spp3SuzpO3oEA6ynJeDDHt-FbLfUKIUYgFH9U6obY2Y';
    window.supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // Elements
    const messagesDiv = document.getElementById('messages');
    const refreshBtn = document.getElementById('refresh');
    const loadMoreBtn = document.getElementById('load-more');
    const sendMessageBtn = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');
    const userNameInput = document.getElementById('user-name');
    
    let lastFetchedMessageId = null;
    
    // Function to fetch messages
    async function fetchMessages(limit = 10) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            displayMessages(data.reverse());
            if (data.length > 0) {
                lastFetchedMessageId = data[0].id;
            }
        }
    }

    // Define a list of darker color themes
    const colorThemes = [
        '#333333', // Very Dark Gray
        '#4f4f4f', // Dark Gray
        '#5c5c5c', // Gray
        '#6e6e6e', // Slightly Lighter Gray
        '#7d7d7d', // Light Gray
        '#8a8a8a', // Pale Gray
        '#999999', // Very Light Gray
        '#a6a6a6', // Lighter Gray
        '#b3b3b3', // Very Light Gray
        '#c0c0c0', // Light Gray
    ];
        
    // Function to get a random color from the list
    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * colorThemes.length);
        return colorThemes[randomIndex];
    }
    
    // Store user colors in localStorage or another method
    function getUserColor(userName) {
        let userColor = localStorage.getItem(`color_${userName}`);
        if (!userColor) {
            userColor = getRandomColor();
            localStorage.setItem(`color_${userName}`, userColor);
        }
        return userColor;
    }

    
    // Function to display messages
    function displayMessages(messages) {
        messagesDiv.innerHTML = '';
        messages.forEach(message => {
            const userColor = getUserColor(message.user_name || 'Anonymous');
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.style.backgroundColor = userColor; // Apply user-specific color
            messageElement.innerHTML = `
                <div class="content">${message.content}</div>
                <div class="details">By ${message.user_name || 'Anonymous'} on ${new Date(message.created_at).toLocaleString()}</div>
            `;
            messagesDiv.appendChild(messageElement);
        });
    }
    
    // Function to load more messages
    async function loadMoreMessages() {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)
            .lt('id', lastFetchedMessageId);

        if (error) {
            console.error('Error loading more messages:', error);
        } else {
            displayMessages(data.reverse());
            if (data.length > 0) {
                lastFetchedMessageId = data[0].id;
            }
        }
    }
    
    // Function to send a message
    async function sendMessage() {
        const content = messageInput.value;
        const userName = userNameInput.value || 'Anonymous';

        if (content) {
            const { data, error } = await supabase
                .from('messages')
                .insert([{ content, user_name: userName }]);

            if (error) {
                console.error('Error sending message:', error);
            } else {
                messageInput.value = '';
                fetchMessages();
            }
        }
    }
    
    // Event listeners
    refreshBtn.addEventListener('click', () => fetchMessages());
    loadMoreBtn.addEventListener('click', () => loadMoreMessages());
    sendMessageBtn.addEventListener('click', () => sendMessage());
    
    // Initial fetch
    fetchMessages();
});


// document.addEventListener('DOMContentLoaded', (event) => {
//     // Initialize Supabase
//     const supabaseUrl = 'https://agglftunrhwbmqgupuxr.supabase.co';
//     const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ2xmdHVucmh3Ym1xZ3VwdXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyMjM5OTgsImV4cCI6MjA0MDc5OTk5OH0.Spp3SuzpO3oEA6ynJeDDHt-FbLfUKIUYgFH9U6obY2Y';
//     window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
//     // Elements
//     const messagesDiv = document.getElementById('messages');
//     const refreshBtn = document.getElementById('refresh');
//     const loadMoreBtn = document.getElementById('load-more');
//     const sendMessageBtn = document.getElementById('send-message');
//     const messageInput = document.getElementById('message-input');
    
//     let lastFetchedMessageId = null;
    
//     // Function to fetch messages
//     async function fetchMessages(limit = 10) {
//         const { data, error } = await supabase
//             .from('messages')
//             .select('*')
//             .order('created_at', { ascending: false })
//             .limit(limit);
    
//         if (error) {
//             console.error('Error fetching messages:', error);
//         } else {
//             displayMessages(data.reverse());
//             if (data.length > 0) {
//                 lastFetchedMessageId = data[0].id;
//             }
//         }
//     }
    
//     // Function to display messages
//     function displayMessages(messages) {
//         messagesDiv.innerHTML = '';
//         messages.forEach(message => {
//             const messageElement = document.createElement('div');
//             messageElement.textContent = `${message.created_at}: ${message.content}`;
//             messagesDiv.appendChild(messageElement);
//         });
//     }
    
//     // Function to load more messages
//     async function loadMoreMessages() {
//         const { data, error } = await supabase
//             .from('messages')
//             .select('*')
//             .order('created_at', { ascending: false })
//             .limit(100)
//             .lt('id', lastFetchedMessageId);
    
//         if (error) {
//             console.error('Error loading more messages:', error);
//         } else {
//             displayMessages(data.reverse());
//             if (data.length > 0) {
//                 lastFetchedMessageId = data[0].id;
//             }
//         }
//     }
    
//     // Function to send a message
//     async function sendMessage() {
//         const content = messageInput.value;
//         if (content) {
//             const { data, error } = await supabase
//                 .from('messages')
//                 .insert([{ content }]);
    
//             if (error) {
//                 console.error('Error sending message:', error);
//             } else {
//                 messageInput.value = '';
//                 fetchMessages();
//             }
//         }
//     }
    
//     // Event listeners
//     refreshBtn.addEventListener('click', () => fetchMessages());
//     loadMoreBtn.addEventListener('click', () => loadMoreMessages());
//     sendMessageBtn.addEventListener('click', () => sendMessage());
    
//     // Initial fetch
//     fetchMessages();
// });

