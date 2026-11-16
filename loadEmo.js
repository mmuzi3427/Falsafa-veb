const loop_1 = true;
const emojiMap = {
    ":kitob": "1",
    ":topshiriq": "2",
    ":natija": "3",
    ":clr":"4",
    ":fall":"5",
    ":start": "6",
    "▶":"6",
    "🥇":"7",
    "🏆":"7",
    "🥈":"8",
    "🥉":"9",
    "✓":"10",
};

function processEmojis(rootElement = document.body) {
    function replaceEmojis(element) {
        if (element.nodeType === Node.TEXT_NODE) {
            let text = element.nodeValue;
            let hasEmoji = false;

            for (const emoji in emojiMap) {
                if (text.includes(emoji)) {
                    hasEmoji = true;
                    break;
                }
            }

            if (hasEmoji) {
                const fragment = document.createDocumentFragment();
                const keys = Object.keys(emojiMap).map(e => e.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                const regex = new RegExp(`(${keys.join('|')})`, 'g');
                const parts = text.split(regex);

                parts.forEach(part => {
                    if (emojiMap[part]) {
                        const span = document.createElement("span");
                        span.className = "tg-emoji";
                        span.setAttribute("data-name", emojiMap[part]);
                        span.innerText = part;
                        fragment.appendChild(span);
                    } else if (part) {
                        fragment.appendChild(document.createTextNode(part));
                    }
                });

                element.parentNode.replaceChild(fragment, element);
            }
        } else {
            if (element && element.nodeName !== 'SCRIPT' && element.nodeName !== 'STYLE' && element.nodeName !== 'IMG') {
                Array.from(element.childNodes || []).forEach(child => {
                    replaceEmojis(child);
                });
            }
        }
    }

    replaceEmojis(rootElement);

    const targetElements = rootElement.nodeType === Node.ELEMENT_NODE && rootElement.classList?.contains('tg-emoji') 
        ? [rootElement] 
        : rootElement.querySelectorAll ? rootElement.querySelectorAll('.tg-emoji:not([data-animated])') : [];

    targetElements.forEach(el => {
        const emojiName = el.getAttribute('data-name');
        if (!emojiName) return;
        
        el.setAttribute('data-animated', 'true');
        el.innerHTML = '';
        const container = document.createElement('span');
        container.className = "lottie-emoji";
        container.style.width = "1.2em";
        container.style.height = "1.2em";
        container.style.display = "inline-block";
        container.style.verticalAlign = "-0.3em";
        el.appendChild(container);

        lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: loop_1,
            autoplay: true,
            path: `./emojies/Ani_${emojiName}.json`
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    processEmojis(document.body);

    // Yangilangan kuzatuvchi (Observer)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            let targetElement = mutation.target;
            
            // Agar o'zgarish matn tugunida yuzaga kelgan bo'lsa, uning ota elementini olamiz
            if (targetElement.nodeType === Node.TEXT_NODE) {
                targetElement = targetElement.parentElement;
            }

            if (targetElement && targetElement.nodeType === Node.ELEMENT_NODE) {
                // O'zimiz yaratgan Lottie elementlariga tegib ketmasligi uchun tekshiruv
                if (!targetElement.classList?.contains('lottie-emoji') && 
                    !targetElement.classList?.contains('tg-emoji') &&
                    !targetElement.closest('.lottie-emoji')) {
                    processEmojis(targetElement);
                }
            }
        });
    });

    // characterData: true orqali tugma ichidagi matn o'zgarishlari ham to'g'ri ushlanadi
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true 
    });
});
