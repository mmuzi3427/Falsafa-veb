const loop_1 = true;
        // 1. Emojilar lug'ati (Matn ichidagilarni avtomatik topish uchun)
        const emojiMap = {
            ":kitob": "1",
            ":topshiriq": "2",
            ":natija": "3",
            ":clr":"4",
            ":fall":"5",
            ":start": "6",
        };

        document.addEventListener("DOMContentLoaded", function() {
            
            // Matn ichidagi oddiy emojilarni .tg-emoji formatiga o'tkazuvchi funksiya
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
                                // Yangi .tg-emoji elementi yaratamiz
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
                    if (element.nodeName !== 'SCRIPT' && element.nodeName !== 'STYLE' && element.nodeName !== 'IMG') {
                        Array.from(element.childNodes).forEach(child => {
                            replaceEmojis(child);
                        });
                    }
                }
            }

            // Body bo'ylab matnlarni qidirib chiqamiz
            replaceEmojis(document.body);

            // 2. Sahifadagi barcha .tg-emoji elementlariga Lottie animatsiyasini ulaymiz
            document.querySelectorAll('.tg-emoji').forEach(el => {
                const emojiName = el.getAttribute('data-name');
                if (!emojiName) return;
                
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
        });
