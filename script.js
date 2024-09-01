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
    
    // Function to display messages
    function displayMessages(messages) {
        messagesDiv.innerHTML = '';
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${message.created_at}: ${message.content}`;
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
        if (content) {
            const { data, error } = await supabase
                .from('messages')
                .insert([{ content }]);
    
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

// // Initialize Supabase
// const supabaseUrl = 'https://agglftunrhwbmqgupuxr.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ2xmdHVucmh3Ym1xZ3VwdXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyMjM5OTgsImV4cCI6MjA0MDc5OTk5OH0.Spp3SuzpO3oEA6ynJeDDHt-FbLfUKIUYgFH9U6obY2Y';
// const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// // Elements
// const messagesDiv = document.getElementById('messages');
// const refreshBtn = document.getElementById('refresh');
// const loadMoreBtn = document.getElementById('load-more');
// const sendMessageBtn = document.getElementById('send-message');
// const messageInput = document.getElementById('message-input');

// let lastFetchedMessageId = null;

// // Function to fetch messages
// async function fetchMessages(limit = 10) {
//     const { data, error } = await supabase
//         .from('messages')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(limit);

//     if (error) {
//         console.error('Error fetching messages:', error);
//     } else {
//         displayMessages(data.reverse());
//         if (data.length > 0) {
//             lastFetchedMessageId = data[0].id;
//         }
//     }
// }

// // Function to display messages
// function displayMessages(messages) {
//     messagesDiv.innerHTML = '';
//     messages.forEach(message => {
//         const messageElement = document.createElement('div');
//         messageElement.textContent = `${message.created_at}: ${message.content}`;
//         messagesDiv.appendChild(messageElement);
//     });
// }

// // Function to load more messages
// async function loadMoreMessages() {
//     const { data, error } = await supabase
//         .from('messages')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(100)
//         .lt('id', lastFetchedMessageId);

//     if (error) {
//         console.error('Error loading more messages:', error);
//     } else {
//         displayMessages(data.reverse());
//         if (data.length > 0) {
//             lastFetchedMessageId = data[0].id;
//         }
//     }
// }

// // Function to send a message
// async function sendMessage() {
//     const content = messageInput.value;
//     if (content) {
//         const { data, error } = await supabase
//             .from('messages')
//             .insert([{ content }]);

//         if (error) {
//             console.error('Error sending message:', error);
//         } else {
//             messageInput.value = '';
//             fetchMessages();
//         }
//     }
// }

// // Event listeners
// refreshBtn.addEventListener('click', () => fetchMessages());
// loadMoreBtn.addEventListener('click', () => loadMoreMessages());
// sendMessageBtn.addEventListener('click', () => sendMessage());

// // Initial fetch
// fetchMessages();
