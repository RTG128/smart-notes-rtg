import { fetchAIResponse } from './utils/api.js';

function typeEffect(element, text, speed = 12) {
    element.innerHTML = "";
    if (!text) {
        element.innerHTML = "Not available";
        return;
    }

    let i = 0;
    const interval = setInterval(() => {
        element.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(interval);
    }, speed);
}

document.addEventListener('DOMContentLoaded', () => {
    const inputArea = document.getElementById('note-input');
    const processBtn = document.getElementById('process-btn');
    const loader = document.getElementById('loader');
    const outputSection = document.getElementById('output-section');
    const charCount = document.getElementById('char-count');

    // ✅ AUTO LOAD SAVED NOTE (NEW)
    const savedNote = localStorage.getItem('rtg_saved_note');
    if (savedNote) {
        inputArea.value = savedNote;
        charCount.textContent = `${savedNote.length} characters`;
    }

    inputArea.addEventListener('input', () => {
        charCount.textContent = `${inputArea.value.length} characters`;
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        inputArea.value = '';
        outputSection.classList.add('hidden');
        charCount.textContent = '0 characters';
        localStorage.removeItem('rtg_saved_note'); // ✅ sync clear
    });

    document.getElementById('save-btn').addEventListener('click', () => {
        localStorage.setItem('rtg_saved_note', inputArea.value);
        alert('Note saved locally!');
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const textToCopy = document.getElementById(targetId).innerText;
            navigator.clipboard.writeText(textToCopy);

            const original = btn.innerHTML;
            btn.innerHTML = "✔ Copied";
            setTimeout(() => btn.innerHTML = original, 1200);
        });
    });

    processBtn.addEventListener('click', async () => {
        const text = inputArea.value.trim();
        if (!text) return alert('Bhai, pehle notes toh paste karo!');

        processBtn.disabled = true;
        processBtn.innerText = "Processing...";
        loader.classList.remove('hidden');
        outputSection.classList.add('hidden');

        try {
            const data = await fetchAIResponse(text);

            document.getElementById('out-summary').innerHTML =
                `<ul>${(data.summary || ["No summary available"])
                    .map(item => `<li>${item}</li>`).join('')}</ul>`;

            typeEffect(
                document.getElementById('out-english'),
                data.explanation || "Explanation not available"
            );

            typeEffect(
                document.getElementById('out-hinglish'),
                data.hinglish || "Hinglish not available"
            );

            typeEffect(
                document.getElementById('out-example'),
                data.example || "No example available"
            );

            document.getElementById('out-keys').innerHTML =
                `<ul>${(data.keyPoints || []).map(item => {
                    if (typeof item === "object") {
                        return `<li><strong>${item.term || ''}:</strong> ${item.def || ''}</li>`;
                    }
                    return `<li>${item}</li>`;
                }).join('') || "<li>No key points</li>"}</ul>`;

            loader.classList.add('hidden');
            outputSection.classList.remove('hidden');
            outputSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error(error);
            alert('Server is not working, please try again!');
            loader.classList.add('hidden');
        } finally {
            processBtn.disabled = false;
            processBtn.innerText = "Summarize & Explain";
        }
    });
});