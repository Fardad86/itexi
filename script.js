document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize Supabase
    const supabaseUrl = 'https://agglftunrhwbmqgupuxr.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ2xmdHVucmh3Ym1xZ3VwdXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyMjM5OTgsImV4cCI6MjA0MDc5OTk5OH0.Spp3SuzpO3oEA6ynJeDDHt-FbLfUKIUYgFH9U6obY2Y';
    window.supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // بازیابی نام کاربر از Local Storage
    const savedUserName = localStorage.getItem('userName');
    if (savedUserName) {
        document.getElementById('user-name').value = savedUserName;
    }

    // Elements
    const messagesDiv = document.getElementById('messages');
    const refreshBtn = document.getElementById('refresh');
    const loadMoreBtn = document.getElementById('load-more');
    const sendMessageBtn = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');
    const userNameInput = document.getElementById('user-name');
    
    let lastFetchedMessageId = null; // شناسه آخرین پیام لود شده
    
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
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.style.backgroundColor = getUserColor(message.user_name); // رنگ پس‌زمینه
    
            messageElement.innerHTML = `
                <div class="content">${message.content}</div>
                <div class="details">${message.user_name} | ${new Date(message.created_at).toLocaleString()}</div>
            `;
            messagesDiv.appendChild(messageElement);
        });
        scrollToBottom();
    }

    function displayMessages2(messages) {
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.style.backgroundColor = getUserColor(message.user_name); // رنگ پس‌زمینه
    
            messageElement.innerHTML = `
                <div class="content">${message.content}</div>
                <div class="details">${message.user_name} | ${new Date(message.created_at).toLocaleString()}</div>
            `;
            messagesDiv.appendChild(messageElement);
        });
    }
    
    // Initial fetch - دریافت اولیه پیام‌ها
    async function fetchMessages() {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            if (data.length > 0) {
                // به‌روز رسانی شناسه آخرین پیام لود شده
                lastFetchedMessageId = data[data.length - 1].id;
                displayMessages(data);
            }
        }
    }

    // Fetch new messages - دریافت پیام‌های جدیدتر از آخرین پیام لود شده
    async function fetchNewMessages() {
        let query = supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });

        // اگر شناسه آخرین پیام لود شده وجود داشته باشد، فقط پیام‌های جدیدتر را دریافت کن
        if (lastFetchedMessageId) {
            query = query.gt('id', lastFetchedMessageId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching new messages:', error);
        } else {
            if (data.length > 0) {
                // به‌روز رسانی شناسه آخرین پیام لود شده
                lastFetchedMessageId = data[data.length - 1].id;
                displayMessages(data); // اضافه کردن پیام‌های جدید به لیست موجود
            }
        }
    }

    // Fetch new messages2 - دریافت پیام‌های جدیدتر از آخرین پیام لود شده
    async function fetchNewMessages2() {
        let query = supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });

        // اگر شناسه آخرین پیام لود شده وجود داشته باشد، فقط پیام‌های جدیدتر را دریافت کن
        if (lastFetchedMessageId) {
            query = query.gt('id', lastFetchedMessageId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching new messages:', error);
        } else {
            if (data.length > 0) {
                // به‌روز رسانی شناسه آخرین پیام لود شده
                lastFetchedMessageId = data[data.length - 1].id;
                displayMessages2(data); // اضافه کردن پیام‌های جدید به لیست موجود
            }
        }
    }
    
    async function sendMessage() {
        const content = messageInput.value;
        const userName = document.getElementById('user-name').value || 'Anonymous';

        // ذخیره کردن نام کاربر در Local Storage
        localStorage.setItem('userName', userName);
    
        if (content) {
            const { data, error } = await supabase
                .from('messages')
                .insert([{ content, user_name: userName }]);
    
            if (error) {
                console.error('Error sending message:', error);
            } else {
                messageInput.value = '';
                fetchNewMessages(); // پس از ارسال پیام، پیام‌های جدید را بگیر
            }
        }
    }

    // Event listeners
    refreshBtn.addEventListener('click', () => fetchMessages());
    loadMoreBtn.addEventListener('click', () => fetchNewMessages());
    sendMessageBtn.addEventListener('click', () => sendMessage());
    
    // Initial fetch
    fetchMessages();

    // Auto fetch new messages every 5 seconds
    setInterval(fetchNewMessages2, 1000);

});



// document.addEventListener('DOMContentLoaded', (event) => {
//     // Initialize Supabase
//     const supabaseUrl = 'https://agglftunrhwbmqgupuxr.supabase.co';
//     const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ2xmdHVucmh3Ym1xZ3VwdXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyMjM5OTgsImV4cCI6MjA0MDc5OTk5OH0.Spp3SuzpO3oEA6ynJeDDHt-FbLfUKIUYgFH9U6obY2Y';
//     window.supabase = supabase.createClient(supabaseUrl, supabaseKey);

//     // بازیابی نام کاربر از Local Storage
//     const savedUserName = localStorage.getItem('userName');
//     if (savedUserName) {
//         document.getElementById('user-name').value = savedUserName;
//     }

//     // Elements
//     const messagesDiv = document.getElementById('messages');
//     const refreshBtn = document.getElementById('refresh');
//     const loadMoreBtn = document.getElementById('load-more');
//     const sendMessageBtn = document.getElementById('send-message');
//     const messageInput = document.getElementById('message-input');
//     const userNameInput = document.getElementById('user-name');
//     const imageInput = document.getElementById('image-input');
    
//     let lastFetchedMessageId = null;
    
//     // Define a list of darker color themes
//     const colorThemes = [
//         '#340c04', // red
//         '#113b05', // green
//         '#053b3b', // light blue
//         '#05073b', // dark blue
//         '#34053b', // purple
//         '#3b3305', // yellow
//         '#292929', // gray
//     ];
        
//     // Function to get a random color from the list
//     function getRandomColor() {
//         const randomIndex = Math.floor(Math.random() * colorThemes.length);
//         return colorThemes[randomIndex];
//     }
    
//     // Store user colors in localStorage or another method
//     function getUserColor(userName) {
//         let userColor = localStorage.getItem(`color_${userName}`);
//         if (!userColor) {
//             userColor = getRandomColor();
//             localStorage.setItem(`color_${userName}`, userColor);
//         }
//         return userColor;
//     }

//     function scrollToBottom() {
//         messagesDiv.scrollTop = messagesDiv.scrollHeight;
//     }
    
//     function displayMessages(messages) {
//         messagesDiv.innerHTML = '';
//         messages.forEach(message => {
//             const messageElement = document.createElement('div');
//             messageElement.classList.add('message');
//             messageElement.style.backgroundColor = getUserColor(message.user_name); // رنگ پس‌زمینه
    
//             messageElement.innerHTML = `
//                 <div class="content">${message.content}</div>
//                 <div class="details">${message.user_name} | ${new Date(message.created_at).toLocaleString()}</div>
//                 ${message.image_url ? `<img src="${message.image_url}" alt="Image">` : ''}
//             `;
//             messagesDiv.appendChild(messageElement);
//         });
//         scrollToBottom();
//     }
    

//     // Function to display messages2
//     function displayMessages2(messages) {
//         messagesDiv.innerHTML = '';
//         messages.forEach(message => {
//             const messageElement = document.createElement('div');
//             messageElement.classList.add('message');
//             messageElement.style.backgroundColor = getUserColor(message.user_name); // رنگ پس‌زمینه
    
//             messageElement.innerHTML = `
//                 <div class="content">${message.content}</div>
//                 <div class="details">${message.user_name} | ${new Date(message.created_at).toLocaleString()}</div>
//                 ${message.image_url ? `<img src="${message.image_url}" alt="Image">` : ''}
//             `;
//             messagesDiv.appendChild(messageElement);
//         });
//     }

    
//     // Function to fetch messages
//     async function fetchMessages(limit = 100) {
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
    
//     // Function to fetch messages2
//     async function fetchMessages2(limit = 100) {
//         const { data, error } = await supabase
//             .from('messages')
//             .select('*')
//             .order('created_at', { ascending: false })
//             .limit(limit);

//         if (error) {
//             console.error('Error fetching messages:', error);
//         } else {
//             displayMessages2(data.reverse());
//             if (data.length > 0) {
//                 lastFetchedMessageId = data[0].id;
//             }
//         }
//     }
    
//     // Function to load more messages
//     async function loadMoreMessages(limit = 500) {
//         const { data, error } = await supabase
//             .from('messages')
//             .select('*')
//             .order('created_at', { ascending: false })
//             .limit(limit);

//         if (error) {
//             console.error('Error fetching messages:', error);
//         } else {
//             displayMessages2(data.reverse());
//             if (data.length > 0) {
//                 lastFetchedMessageId = data[0].id;
//             }
//         }
//     }
    
//     async function sendMessage() {
//         const content = messageInput.value;
//         const userName = document.getElementById('user-name').value || 'Anonymous';

//         // ذخیره کردن نام کاربر در Local Storage
//         localStorage.setItem('userName', userName);
    
//         if (content) {
//             const { data, error } = await supabase
//                 .from('messages')
//                 .insert([{ content, user_name: userName }]);
    
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

//     // Auto refresh every 5 seconds
//     setInterval(fetchMessages2, 5000);

// });

