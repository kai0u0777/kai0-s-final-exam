document.addEventListener("DOMContentLoaded", function() {
    // 徹底移除所有 const，全面改用 let 或是 var
    let body = document.body;
    let themeToggleBtn = document.getElementById("theme-toggle-btn");
    let mainLogo = document.getElementById("main-logo");
    let heroTitle = document.getElementById("hero-title");
    let userNicknameSpan = document.getElementById("user-nickname");
    
    let userInput = document.getElementById("user-input");
    let sendBtn = document.getElementById("send-btn");
    let aiResponse = document.getElementById("ai-response");
    
    let todoInput = document.getElementById("todo-input");
    let addTodoBtn = document.getElementById("add-todo-btn");
    let todoList = document.getElementById("todo-list");
    let clearAllBtn = document.getElementById("clear-all-btn");

    // Contact US 彈窗控制元件
    let contactBtn = document.getElementById("contact-btn");
    let contactModal = document.getElementById("contact-modal");
    let closeModalBtn = document.getElementById("close-modal-btn");
    let modalConfirmBtn = document.getElementById("modal-confirm-btn");
    let modalNickname = document.querySelector(".modal-nickname");

    // 網頁開啟時跳出對話框詢問暱稱
    let nickname = prompt("歡迎來到成果網頁！請輸入您的暱稱：");
    if (nickname && nickname.trim() !== "") {
        userNicknameSpan.textContent = nickname.trim();
        if (modalNickname) modalNickname.textContent = nickname.trim(); 
    } else {
        userNicknameSpan.textContent = "訪客"; 
        if (modalNickname) modalNickname.textContent = "訪客";
    }

    // Contact US 彈窗點擊事件
    contactBtn.addEventListener("click", function() {
        contactModal.style.display = "block"; 
    });

    closeModalBtn.addEventListener("click", function() {
        contactModal.style.display = "none"; 
    });

    modalConfirmBtn.addEventListener("click", function() {
        contactModal.style.display = "none"; 
    });

    window.addEventListener("click", function(event) {
        if (event.target === contactModal) {
            contactModal.style.display = "none";
        }
    });

    // 載入 LocalStorage 歷史紀錄
    let savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    savedTodos.forEach(function(todoText) {
        renderTodoItem(todoText);
    });

    // 主題切換函式
    function toggleTheme() {
        if (body.classList.contains("theme-light")) {
            body.classList.replace("theme-light", "theme-dark");
            themeToggleBtn.textContent = "切換亮色馬卡龍";
            return "暗色馬卡龍";
        } else {
            body.classList.replace("theme-dark", "theme-light");
            themeToggleBtn.textContent = "切換暗色馬卡龍";
            return "亮色馬卡龍";
        }
    }

    // 1. 點擊頂部導覽列按鈕換色
    themeToggleBtn.addEventListener("click", function() {
        toggleTheme();
    });

    // 渲染待辦項目的核心函式
    function renderTodoItem(text) {
        let li = document.createElement("li");
        li.className = "todo-item";

        let span = document.createElement("span");
        span.textContent = text;
        
        span.addEventListener("click", function() {
            span.classList.toggle("completed");
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", function() {
            li.remove();
            updateLocalStorage();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    function updateLocalStorage() {
        let items = [];
        document.querySelectorAll(".todo-item span").forEach(function(span) {
            items.push(span.textContent);
        });
        localStorage.setItem("todos", JSON.stringify(items));
    }

    addTodoBtn.addEventListener("click", function() {
        let text = todoInput.value.trim();
        if (text) {
            renderTodoItem(text);
            updateLocalStorage();
            todoInput.value = "";
        }
    });

    clearAllBtn.addEventListener("click", function() {
        todoList.innerHTML = "";
        localStorage.removeItem("todos");
        aiResponse.textContent = "AI 助理：已為您成功清空所有待辦事項囉！🌸";
    });

    // 2. 🤖 業師 AI 關鍵字指令連動（兼具變色與箭頭函式移除）
    sendBtn.addEventListener("click", function() {
        let textValue = userInput.value.trim();
        if (!textValue) return;

        // 換色、切換模式關鍵字觸發
        if (textValue.includes("換色") || textValue.includes("變色") || textValue.includes("切換模式") || textValue.includes("暗色") || textValue.includes("亮色")) {
            let currentMode = toggleTheme(); 
            aiResponse.textContent = "AI 助理：收到指令！已成功幫您切換至【" + currentMode + "】模式囉！✨🎨";
        } 
        // 判斷是否包含「新增待辦」或「提醒我」指令
        else if (textValue.includes("新增待辦") || textValue.includes("提醒我")) {
            let todoContent = textValue.replace("新增待辦", "").replace("提醒我", "").trim();
            
            if (todoContent) {
                renderTodoItem(todoContent);
                updateLocalStorage();
                aiResponse.textContent = "AI 助理：沒問題！已自動將『" + todoContent + "』加入下方的馬卡龍清單囉！✨";
            } else {
                aiResponse.textContent = "AI 助理：請輸入具體內容，例如：『新增待辦 吃草莓蛋糕』。";
            }
        } 
        // 其他常規 AI 對話
        else if (textValue.includes("你好")) {
            aiResponse.textContent = "AI 助理：你好呀 " + userNicknameSpan.textContent + "！很高興與你互動，今天心情好嗎？";
        } else if (textValue.includes("學校")) {
            aiResponse.textContent = "AI 助理：東吳大學是一所教學卓越、環境優美的好學校！";
        } else if (textValue.includes("功能")) {
            aiResponse.textContent = "AI 助理：我可以陪你聊天、換色（輸入『換色』），還能用語音/文字指令『新增待辦 [事件]』幫你記事情哦！";
        } else if (textValue.includes("改名字")) {
            mainLogo.textContent = "12345 Oliver";
            aiResponse.textContent = "AI 助理：已成功執行神祕密碼！網頁 Logo 已變更為您的學號。";
        } else {
            aiResponse.textContent = "AI 助理：我收到了「" + textValue + "」指令，這項超讚的功能還在努力孵化中！";
        }

        userInput.value = ""; 
    });

    userInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") sendBtn.click();
    });
});