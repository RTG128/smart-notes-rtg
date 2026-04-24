import { fetchAIResponse } from './utils/api.js';

function typeEffect(element, text, speed = 12) {
    element.innerHTML = "";
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

    inputArea.addEventListener('input', () => {
        charCount.textContent = `${inputArea.value.length} characters`;
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        inputArea.value = '';
        outputSection.classList.add('hidden');
        charCount.textContent = '0 characters';
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
            btn.innerHTML = "✔";
            setTimeout(() => btn.innerHTML = original, 1500);
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
                `<ul>${(data.summary || []).map(item => `<li>${item}</li>`).join('')}</ul>`;

            typeEffect(document.getElementById('out-english'), data.explanation || '');
            typeEffect(document.getElementById('out-hinglish'), data.hinglish || '');
            typeEffect(document.getElementById('out-example'), data.example || '');

            document.getElementById('out-keys').innerHTML =
                `<ul>${(data.keyPoints || []).map(item => `<li>${item}</li>`).join('')}</ul>`;

            loader.classList.add('hidden');
            outputSection.classList.remove('hidden');
            outputSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            alert('Server is not working, please try again!');
            loader.classList.add('hidden');
        } finally {
            processBtn.disabled = false;
            processBtn.innerText = "Summarize & Explain";
        }
    });
});