document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const mainLogo = document.getElementById("main-logo");
    const heroTitle = document.getElementById("hero-title");
    const userNicknameSpan = document.getElementById("user-nickname");
    
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const aiResponse = document.getElementById("ai-response");
    
    const todoInput = document.getElementById("todo-input");
    const addTodoBtn = document.getElementById("add-todo-btn");
    const todoList = document.getElementById("todo-list");
    const clearAllBtn = document.getElementById("clear-all-btn");

    // Contact US 彈窗控制元件
    const contactBtn = document.getElementById("contact-btn");
    const contactModal = document.getElementById("contact-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modalConfirmBtn = document.getElementById("modal-confirm-btn");
    const modalNickname = document.querySelector(".modal-nickname");

    // 網頁開啟時跳出對話框詢問暱稱
    let nickname = prompt("歡迎來到成果網頁！請輸入您的暱稱：");
    if (nickname && nickname.trim() !== "") {
        userNicknameSpan.textContent = nickname.trim();
        if (modalNickname) modalNickname.textContent = nickname.trim(); // 彈窗內名字同步更新
    } else {
        userNicknameSpan.textContent = "訪客"; 
        if (modalNickname) modalNickname.textContent = "訪客";
    }

    // 點擊 Contact US 按鈕時，跳出馬卡龍資訊視窗
    contactBtn.addEventListener("click", () => {
        contactModal.style.display = "block"; 
    });

    // 點擊右上角 X 關閉彈窗
    closeModalBtn.addEventListener("click", () => {
        contactModal.style.display = "none"; 
    });

    // 點擊底部「我知道了」按鈕關閉彈窗
    modalConfirmBtn.addEventListener("click", () => {
        contactModal.style.display = "none"; 
    });

    // 點擊彈窗以外的灰色毛玻璃背景也可以關閉
    window.addEventListener("click", (event) => {
        if (event.target === contactModal) {
            contactModal.style.display = "none";
        }
    });

    // 載入 LocalStorage 歷史紀錄
    let savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    savedTodos.forEach(todoText => renderTodoItem(todoText));

    // 馬卡龍晝夜模式切換
    themeToggleBtn.addEventListener("click", () => {
        if (body.classList.contains("theme-light")) {
            body.classList.replace("theme-light", "theme-dark");
            themeToggleBtn.textContent = "切換亮色馬卡龍";
        } else {
            body.classList.replace("theme-dark", "theme-light");
            themeToggleBtn.textContent = "切換暗色馬卡龍";
        }
    });

    // 渲染待辦項目的核心函式
    function renderTodoItem(text) {
        const li = document.createElement("li");
        li.className = "todo-item";

        const span = document.createElement("span");
        span.textContent = text;
        
        span.addEventListener("click", () => {
            span.classList.toggle("completed");
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => {
            li.remove();
            updateLocalStorage();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    function updateLocalStorage() {
        const items = [];
        document.querySelectorAll(".todo-item span").forEach(span => {
            items.push(span.textContent);
        });
        localStorage.setItem("todos", JSON.stringify(items));
    }

    addTodoBtn.addEventListener("click", () => {
        const text = todoInput.value.trim();
        if (text) {
            renderTodoItem(text);
            updateLocalStorage();
            todoInput.value = "";
        }
    });

    clearAllBtn.addEventListener("click", () => {
        todoList.innerHTML = "";
        localStorage.removeItem("todos");
        aiResponse.textContent = "AI 助理：已為您成功清空所有待辦事項囉！🌸";
    });

    // 業師 AI 關鍵字指令連動
    sendBtn.addEventListener("click", () => {
        const textValue = userInput.value.trim();
        if (!textValue) return;

        if (textValue.includes("新增待辦") || textValue.includes("提醒我")) {
            const todoContent = textValue.replace("新增待辦", "").replace("提醒我", "").trim();
            
            if (todoContent) {
                renderTodoItem(todoContent);
                updateLocalStorage();
                aiResponse.textContent = `AI 助理：沒問題！已自動將『${todoContent}』加入下方的馬卡龍清單囉！✨`;
            } else {
                aiResponse.textContent = "AI 助理：請輸入具體內容，例如：『新增待辦 吃草莓蛋糕』。";
            }
        } 
        else if (textValue.includes("你好")) {
            aiResponse.textContent = `AI 助理：你好呀 ${userNicknameSpan.textContent}！很高興與你互動，今天心情好嗎？`;
        } else if (textValue.includes("學校")) {
            aiResponse.textContent = "AI 助理：東吳大學是一所教學卓越、環境優美的好學校！";
        } else if (textValue.includes("功能")) {
            aiResponse.textContent = "AI 助理：我可以陪你聊天、換色，還能用語音/文字指令『新增待辦 [事件]』幫你記事情哦！";
        } else if (textValue.includes("改名字")) {
            mainLogo.textContent = "12345 Oliver";
            aiResponse.textContent = "AI 助理：已成功執行神祕密碼！網頁 Logo 已變更為您的學號。";
        } else {
            aiResponse.textContent = `AI 助理：我收到了「${textValue}」指令，這項超讚的功能還在努力孵化中！`;
        }

        userInput.value = ""; 
    });

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendBtn.click();
    });
});