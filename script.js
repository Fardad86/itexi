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
    const imageInput = document.getElementById('image-input');
    
    let lastFetchedMessageId = null;
    
    // Define a list of darker color themes
    const colorThemes = [
        '#340c04', // red
        '#113b05', // green
        '#053b3b', // light blue
        '#05073b', // dark blue
        '#34053b', // purple
        '#3b3305', // yellow
        '#292929', // gray
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

    function scrollToBottom() {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    function displayMessages(messages) {
        messagesDiv.innerHTML = '';
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.style.backgroundColor = getUserColor(message.user_name); // رنگ پس‌زمینه
    
            messageElement.innerHTML = `
                <div class="content">${message.content}</div>
                <div class="details">${message.user_name} | ${new Date(message.created_at).toLocaleString()}</div>
                ${message.image_url ? `<img src="${message.image_url}" alt="Image">` : ''}
            `;
            messagesDiv.appendChild(messageElement);
        });
        scrollToBottom();
    }
    

    // Function to display messages2
    function displayMessages2(messages) {
        messagesDiv.innerHTML = '';
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.style.backgroundColor = getUserColor(message.user_name); // رنگ پس‌زمینه
    
            messageElement.innerHTML = `
                <div class="content">${message.content}</div>
                <div class="details">${message.user_name} | ${new Date(message.created_at).toLocaleString()}</div>
                ${message.image_url ? `<img src="${message.image_url}" alt="Image">` : ''}
            `;
            messagesDiv.appendChild(messageElement);
        });
    }

    
    // Function to fetch messages
    async function fetchMessages(limit = 100) {
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
    
    // Function to fetch messages2
    async function fetchMessages2(limit = 100) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            displayMessages2(data.reverse());
            if (data.length > 0) {
                lastFetchedMessageId = data[0].id;
            }
        }
    }
    
    // Function to load more messages
    async function loadMoreMessages(limit = 500) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            displayMessages2(data.reverse());
            if (data.length > 0) {
                lastFetchedMessageId = data[0].id;
            }
        }
    }
    
    async function sendMessage() {
        const content = messageInput.value;
        const userName = document.getElementById('user-name').value || 'Anonymous';
    
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

    // Auto refresh every 5 seconds
    setInterval(fetchMessages2, 5000);

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

