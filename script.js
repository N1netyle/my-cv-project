// 1. Збір та вивід даних у LocalStorage
const info = {
    os: navigator.platform,
    browser: navigator.userAgent,
    lang: navigator.language
};
// Записуємо в пам'ять браузера
Object.keys(info).forEach(key => localStorage.setItem(key, info[key]));

// Виводимо дані у футер
const storageDiv = document.getElementById("storageInfo");
if (storageDiv) {
    for (let i = 0; i < localStorage.length; i++) {
        let k = localStorage.key(i);
        storageDiv.innerHTML += `<p><strong>${k}:</strong> ${localStorage.getItem(k)}</p>`;
    }
}

// === 2. Запит на сервер з заміною тексту на українську (Варіант 12) ===
fetch("https://jsonplaceholder.typicode.com/posts/12/comments")
    .then(response => response.json())
    .then(comments => {
        const container = document.getElementById("commentsContainer");
        if (container) {
            container.innerHTML = ""; 
            
            // Масив з твоїми коментарями
            const ukrTexts = [
                "Роман проявив себе як відповідальний фахівець, швидко вчиться.",
                "Чудова робота з базами даних та системним адмініструванням.",
                "Рекомендую як перспективного спеціаліста в галузі кібербезпеки.",
                "Вміє працювати в команді та вирішувати складні технічні задачі.",
                "Дуже задоволені співпрацею, проект виконано вчасно."
            ];

            comments.forEach((comment, index) => {
                // Беремо текст із масиву вище (якщо коментів більше 5, беремо дефолтний)
                let text = ukrTexts[index] || "Дякуємо за професіоналізм!";
                
                container.innerHTML += `
                    <div class="comment" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                        <p><strong>Від: ${comment.email}</strong></p>
                        <p>${text}</p>
                    </div>`;
            });
        }
    });
// 3. Таймер на 1 хвилину для появи модального вікна
setTimeout(() => {
    const modal = document.getElementById("feedbackModal");
    if (modal) modal.style.display = "block";
}, 60000); // 60000 мілісекунд = 1 хвилина

// Кнопка закриття модалки
const closeBtn = document.getElementById("closeModal");
if (closeBtn) {
    closeBtn.onclick = () => {
        document.getElementById("feedbackModal").style.display = "none";
    };
}

// Закриття модалки при кліку поза вікном
window.onclick = (event) => {
    const modal = document.getElementById("feedbackModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// 4. Перемикач теми (авто + ручний)
const btn = document.getElementById("themeToggle");

function checkTheme() {
    let h = new Date().getHours();
    // Денна тема з 07:00 до 21:00
    if (h >= 7 && h < 21) {
        document.body.className = "light-theme";
    } else {
        document.body.className = "dark-theme";
    }
}
checkTheme(); // Запускаємо перевірку часу

// Клік по кнопці змінює тему вручну
if (btn) {
    btn.onclick = () => {
        document.body.classList.toggle("dark-theme");
        document.body.classList.toggle("light-theme");
    };
}